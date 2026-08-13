// 第一批音乐番（15 部），从 AniList 拉取角色 + 声优
import fs from 'fs'

const ANIME = [
  ['NANA', 'Nana'],
  ['Given', 'Given'],
  ['坂道上的阿波罗', 'Sakamichi no Apollon'],
  ['卡罗尔与星期二', 'Carole & Tuesday'],
  ['一弦定音', 'Kono Oto Tomare'],
  ['派对浪客诸葛孔明', 'Paripi Koumei'],
  ['TARI TARI', 'Tari Tari'],
  ['覆面系NOISE', 'Fukumenkei Noise'],
  ['白色相簿2', 'White Album 2'],
  ['战姬绝唱', 'Senki Zesshou Symphogear'],
  ['底特律金属城', 'Detroit Metal City'],
  ['侧耳倾听', 'Mimi wo Sumaseba'],
  ['金色琴弦', 'Kiniro no Corda'],
  ['钢琴之森', 'Piano no Mori'],
  ['Love Live', 'Love Live School Idol Project'],
]

const SEARCH_QUERY = `
query($search: String) {
  Media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
    id
    title { romaji english native }
    characters(sort: FAVOURITES_DESC, perPage: 7) {
      nodes { id name { full } image { large } }
    }
  }
}
`

async function searchAnime(search) {
  const resp = await fetch('https://graphql.anilist.co', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
  const chars = (media.characters?.nodes || []).map(c => ({ id: c.id, name: c.name?.full || '', image: c.image?.large || '' }))
  console.log(`  ✅ [${cn}] → ${media.title?.romaji || media.title?.english || '?'} (${chars.length} 角色)`)
  result.push({ anime: cn, anime_en: media.title?.romaji || media.title?.english || '', characters: chars })
  if (i < ANIME.length - 1) await sleep(800)
}

const allCharIds = result.flatMap(r => r.characters.map(c => c.id))
console.log(`\n共 ${allCharIds.length} 个角色，批量查询声优...\n`)

function buildVAQuery(ids) {
  const fields = ids.map((id, i) => `c${i}: Character(id: ${id}) { media(sort: POPULARITY_DESC, page: 1, perPage: 2) { edges { voiceActorRoles(sort: ROLE, language: JAPANESE) { voiceActor { name { full } image { large } } } node { id } } } }`).join('')
  return `query { ${fields} }`
}

const vaMap = {}
const BATCH = 10
for (let i = 0; i < allCharIds.length; i += BATCH) {
  const ids = allCharIds.slice(i, i + BATCH)
  const query = buildVAQuery(ids)
  const resp = await fetch('https://graphql.anilist.co', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
  })
  const json = await resp.json()
  for (let j = 0; j < ids.length; j++) {
    const char = json.data?.['c' + j]
    let va = null
    for (const edge of char?.media?.edges || []) {
      const role = edge.voiceActorRoles?.[0]
      if (role?.voiceActor?.name?.full) { va = { name: role.voiceActor.name.full, image: role.voiceActor.image?.large || '' }; break }
    }
    vaMap[ids[j]] = va
  }
  const done = Math.min(i + BATCH, allCharIds.length)
  console.log(`  声优 ${done}/${allCharIds.length}`)
  if (i + BATCH < allCharIds.length) await sleep(1200)
}

for (const r of result) for (const c of r.characters) c.voice_actor = vaMap[c.id] || null

fs.writeFileSync('scripts/batch3_data.json', JSON.stringify(result, null, 2))
const withVA = result.flatMap(r => r.characters).filter(c => c.voice_actor).length
console.log(`\n✅ 完成！角色 ${allCharIds.length} 个，有声优 ${withVA} 个，无 ${allCharIds.length - withVA} 个`)
console.log('已保存到 scripts/batch3_data.json')
