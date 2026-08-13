// 第二批 18 部动漫，从 AniList 拉取角色 + 声优数据
import fs from 'fs'

const ANIME = [
  ['我的妹妹哪有这么可爱', 'Ore no Imouto ga Konnani Kawaii Wake ga Nai'],
  ['未来日记', 'Mirai Nikki'],
  ['学园默示录', 'Highschool of the Dead'],
  ['灼眼的夏娜', 'Shakugan no Shana'],
  ['零之使魔', 'Zero no Tsukaima'],
  ['龙珠', 'Dragon Ball'],
  ['幽游白书', 'Yu Yu Hakusho'],
  ['圣斗士星矢', 'Saint Seiya'],
  ['游戏王', 'Yu-Gi-Oh'],
  ['数码宝贝', 'Digimon Adventure'],
  ['天空之城', 'Tenkuu no Shiro Laputa'],
  ['幸运星', 'Lucky Star'],
  ['摇曳百合', 'Yuru Yuri'],
  ['甘城光辉游乐园', 'Amagi Brilliant Park'],
  ['恋爱随意链接', 'Kokoro Connect'],
  ['学园孤岛', 'Gakkou Gurashi'],
  ['天降之物', 'Sora no Otoshimono'],
  ['电波女与青春男', 'Denpa Onna to Seishun Otoko'],
]

const SEARCH_QUERY = `
query($search: String) {
  Media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
    id
    title { romaji english native }
    characters(sort: FAVOURITES_DESC, perPage: 7) {
      nodes {
        id
        name { full }
        image { large }
      }
    }
  }
}
`

async function searchAnime(search) {
  const resp = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: SEARCH_QUERY, variables: { search } }),
  })
  const json = await resp.json()
  return json.data?.Media || null
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

const result = []
console.log('搜索动漫并收集角色...\n')

for (let i = 0; i < ANIME.length; i++) {
  const [cn, search] = ANIME[i]
  const media = await searchAnime(search)
  if (!media) { console.log(`  ❌ [${cn}] 搜索无结果`); result.push({ anime: cn, characters: [] }); continue }

  const chars = (media.characters?.nodes || []).map(c => ({
    id: c.id,
    name: c.name?.full || '',
    image: c.image?.large || '',
  }))
  console.log(`  ✅ [${cn}] → ${media.title?.romaji || media.title?.english || '?'} (${chars.length} 角色)`)
  result.push({ anime: cn, anime_en: media.title?.romaji || media.title?.english || '', anime_id: media.id, characters: chars })

  if (i < ANIME.length - 1) await sleep(800)
}

const allCharIds = result.flatMap(r => r.characters.map(c => c.id))
console.log(`\n共 ${allCharIds.length} 个角色，批量查询声优...\n`)

function buildVAQuery(ids) {
  const fields = ids.map((id, i) => `
    c${i}: Character(id: ${id}) {
      media(sort: POPULARITY_DESC, page: 1, perPage: 2) {
        edges {
          voiceActorRoles(sort: ROLE, language: JAPANESE) {
            voiceActor { name { full } image { large } }
          }
          node { id }
        }
      }
    }`).join('')
  return `query { ${fields} }`
}

const vaMap = {}
const BATCH = 10
for (let i = 0; i < allCharIds.length; i += BATCH) {
  const ids = allCharIds.slice(i, i + BATCH)
  const query = buildVAQuery(ids)
  const resp = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
  })
  const json = await resp.json()
  for (let j = 0; j < ids.length; j++) {
    const char = json.data?.['c' + j]
    let va = null
    for (const edge of char?.media?.edges || []) {
      const role = edge.voiceActorRoles?.[0]
      if (role?.voiceActor?.name?.full) {
        va = { name: role.voiceActor.name.full, image: role.voiceActor.image?.large || '' }
        break
      }
    }
    vaMap[ids[j]] = va
  }
  const done = Math.min(i + BATCH, allCharIds.length)
  console.log(`  声优 ${done}/${allCharIds.length}`)
  if (i + BATCH < allCharIds.length) await sleep(1200)
}

for (const r of result) {
  for (const c of r.characters) {
    c.voice_actor = vaMap[c.id] || null
  }
}

fs.writeFileSync('scripts/batch2_data.json', JSON.stringify(result, null, 2))
const withVA = result.flatMap(r => r.characters).filter(c => c.voice_actor).length
console.log(`\n✅ 完成！角色 ${allCharIds.length} 个，有声优 ${withVA} 个，无 ${allCharIds.length - withVA} 个`)
console.log('已保存到 scripts/batch2_data.json')
