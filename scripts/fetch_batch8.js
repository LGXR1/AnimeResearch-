// 第二批百合（29 部），从 AniList 拉取角色 + 声优
import fs from 'fs'

const ANIME = [
  ['暗与帽子与书之旅人', 'Yami to Boushi to Hon no Tabibito'],
  ['Candy Boy', 'Candy Boy'],
  ['紧扣的星星', 'Kuttsukiboshi'],
  ['我们不可能成为恋人', 'Watashi-tachi ga Koibito ni Narenai Nante'],
  ['对我垂涎欲滴的非人少女', 'Watashi wo Tabetai, Hitodenashi'],
  ['与你相恋到生命尽头', 'Kimi to Shinu made Koi wo Shitai'],
  ['女武神驱动', 'Valkyrie Drive: Mermaid'],
  ['红壳的潘多拉', 'Koukaku no Pandora'],
  ['女恶魔人', 'Devilman Lady'],
  ['星灵感应', 'Hoshikuzu Telepath'],
  ['隔壁的吸血鬼美眉', 'Tonari no Kyuuketsuki-san'],
  ['我家的女仆有够烦', 'Uchi no Maid ga Uzasugiru'],
  ['声优广播的幕前幕后', 'Seiyuu Radio no Uraomote'],
  ['机动战士高达 水星的魔女', 'Kidou Senshi Gundam: Suisei no Majo'],
  ['突击莉莉', 'Assault Lily: Bouquet'],
  ['家里蹲吸血姬的郁闷', 'Hikikomari Kyuuketsuki no Monmon'],
  ['魔女猎人', 'El Cazador de la Bruja'],
  ['赛马娘 Pretty Derby', 'Uma Musume: Pretty Derby'],
  ['球咏', 'Tamayomi'],
  ['遥的接球', 'Harukana Receive'],
  ['天使们的戏曲', 'Blue Drop'],
  ['加奈日记', 'Kanamemo'],
  ['犬神同学与猫山同学', 'Inugami-san to Nekoyama-san'],
  ['立花馆恋爱三角关系', 'Tachibanakan Triangle'],
  ['感谢对战', 'Kansha Taisen'],
  ['夜晚的水母不会游泳', 'Yoru no Kurage wa Oyogenai'],
  ['淡岛百景', 'Awashima Hyakkei'],
  ['上伊那牡丹', 'Kamiina Botan'],
  ['超时空辉夜姬', 'Choujikuu Kaguya-hime'],
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

fs.writeFileSync('scripts/batch8_data.json', JSON.stringify(result, null, 2))
const withVA = result.flatMap(r => r.characters).filter(c => c.voice_actor).length
console.log(`\n✅ 完成！角色 ${allCharIds.length} 个，有声优 ${withVA} 个`)
console.log('已保存到 scripts/batch8_data.json')
