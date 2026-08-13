// 第二批异世界（13 部），从 AniList 拉取角色 + 声优
import fs from 'fs'

const ANIME = [
  ['骸骨骑士大人异世界冒险中', 'Gaikotsu Kishi-sama, Tadaima Isekai e Odekake-chuu'],
  ['回复术士的重来人生', 'Kaifuku Jutsushi no Yarinaoshi'],
  ['异世界悠闲农家', 'Isekai Nonbiri Nouka'],
  ['拥有超常技能的异世界流浪美食家', 'Tondemo Skill de Isekai Hourou Meshi'],
  ['爆肝工程师的异世界狂想曲', 'Death March kara Hajimaru Isekai Kyousoukyoku'],
  ['异世界四重奏', 'Isekai Quartet'],
  ['月光下的异世界之旅', 'Tsuki ga Michibiku Isekai Douchuu'],
  ['异世界失格', 'Isekai Shikkaku'],
  ['独自一人的异世界攻略', 'Hitoribocchi no Isekai Kouryaku'],
  ['秒杀外挂太强了', 'Sokushi Cheat ga Saikyou sugite'],
  ['身为暗杀者的我明显比勇者还强', 'Ansatsu Kizoku'],
  ['素材采集家的异世界旅行记', 'Sozai Saishuka no Isekai Ryokouki'],
  ['中年男的异世界网购买生活', 'Arafou Otoko no Isekai Tsuuhan Seikatsu'],
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

fs.writeFileSync('scripts/batch6_data.json', JSON.stringify(result, null, 2))
const withVA = result.flatMap(r => r.characters).filter(c => c.voice_actor).length
console.log(`\n✅ 完成！角色 ${allCharIds.length} 个，有声优 ${withVA} 个`)
console.log('已保存到 scripts/batch6_data.json')
