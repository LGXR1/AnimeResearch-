// 第一批百合（15 部），从 AniList 拉取角色 + 声优
import fs from 'fs'

const ANIME = [
  ['神无月的巫女', 'Kannazuki no Miko'],
  ['轻声密语', 'Sasameki Koto'],
  ['青之花', 'Aoi Hana'],
  ['我推是反派大小姐', 'Watashi no Oshi wa Akuyaku Reijou'],
  ['憧憬成为魔法少女', 'Mahou Shoujo ni Akogarete'],
  ['恋语轻唱', 'Sasayaku You ni Koi wo Utau'],
  ['百合是我的工作', 'Watashi no Yuri wa Oshigoto desu'],
  ['恶魔的谜语', 'Akuma no Riddle'],
  ['处刑少女的生存之道', 'Shokei Shoujo no Virgin Road'],
  ['天使降临到我身边', 'Wataten'],
  ['街角魔族', 'Machikado Mazoku'],
  ['此花绮谭', 'Konohana Kitan'],
  ['恋爱小行星', 'Koisuru Asteroid'],
  ['结城友奈是勇者', 'Yuuki Yuuna wa Yuusha de Aru'],
  ['里世界郊游', 'Urasekai Picnic'],
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

fs.writeFileSync('scripts/batch7_data.json', JSON.stringify(result, null, 2))
const withVA = result.flatMap(r => r.characters).filter(c => c.voice_actor).length
console.log(`\n✅ 完成！角色 ${allCharIds.length} 个，有声优 ${withVA} 个`)
console.log('已保存到 scripts/batch7_data.json')
