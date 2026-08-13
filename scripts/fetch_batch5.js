// 第一批异世界（15 部），从 AniList 拉取角色 + 声优
import fs from 'fs'

const ANIME = [
  ['幼女战记', 'Youjo Senki'],
  ['转生成蜘蛛又怎样', 'Kumo desu ga, Nani ka?'],
  ['异世界归来的舅舅', 'Isekai Ojisan'],
  ['转生恶役大小姐', 'Otome Game no Hametsu Flag'],
  ['小书痴的下克上', 'Honzuki no Gekokujou'],
  ['游戏人生', 'No Game No Life'],
  ['记录的地平线', 'Log Horizon'],
  ['问题儿童都来自异世界', 'Mondaiji-tachi ga Isekai kara Kuru Sou desu yo?'],
  ['GATE 奇幻自卫队', 'Gate: Jieitai Kanochi nite'],
  ['现实主义勇者的王国再建记', 'Genjitsu Shugi Yuusha no Oukoku Saikenki'],
  ['世界顶尖的暗杀者转生为异世界贵族', 'Sekai Saikou no Ansatsusha'],
  ['最强阴阳师的异世界转生记', 'Saikyou Onmyouji no Isekai Tenseiki'],
  ['转生王女与天才千金的魔法革命', 'Tensei Oujo to Tensai Reijou no Mahou Kakumei'],
  ['异世界迷宫黑心企业', 'Meikyuu Black Company'],
  ['十二国记', 'Juuni Kokuki'],
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

fs.writeFileSync('scripts/batch5_data.json', JSON.stringify(result, null, 2))
const withVA = result.flatMap(r => r.characters).filter(c => c.voice_actor).length
console.log(`\n✅ 完成！角色 ${allCharIds.length} 个，有声优 ${withVA} 个`)
console.log('已保存到 scripts/batch5_data.json')
