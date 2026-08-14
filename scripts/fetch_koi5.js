import fs from 'fs'
const ANI_LIST_API = 'https://graphql.anilist.co'
const ANIME = [
  { cn: '我心里危险的东西', search: 'Boku no Kokoro no Yabai Yatsu', year: 2023 },
  { cn: '我的幸福婚姻', search: 'Watashi no Shiawase na Kekkon', year: 2023 },
  { cn: '萤火之森', search: 'Hotarubi no Mori e', year: 2011 },
]
async function gql(q, v) {
  const r = await fetch(ANI_LIST_API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ query: q, variables: v }) })
  if (!r.ok) throw new Error('AniList ' + r.status)
  return r.json()
}
async function searchMedia(t) {
  const q = 'query ($s: String) { Page(page: 1, perPage: 8) { media(search: $s, type: ANIME, sort: SEARCH_MATCH) { id title { romaji english native } format seasonYear } } }'
  return (await gql(q, { s: t })).data.Page.media || []
}
async function fetchChars(id) {
  const q = 'query ($id: Int) { Media(id: $id, type: ANIME) { characters(sort: ROLE, perPage: 30) { edges { node { id name { full native } image { large } } voiceActors(language: JAPANESE, sort: ROLE) { name { full native } image { large } } } } } }'
  return (await gql(q, { id })).data.Media
}
const results = []
for (const a of ANIME) {
  const ml = await searchMedia(a.search)
  if (!ml.length) { console.log('⚠️ 未找到: ' + a.cn); continue }
  const exact = ml.filter(m => (m.title.romaji||'').toLowerCase() === a.search.toLowerCase() || (m.title.english||'').toLowerCase() === a.search.toLowerCase())
  const pool = exact.length ? exact : ml
  const best = pool[0]
  console.log('✅ ' + a.cn + ' → Media ' + best.id + ' (' + (best.title.romaji||best.title.english) + ' | ' + best.format + ' | ' + best.seasonYear + ')')
  const media = await fetchChars(best.id)
  results.push({ cn: a.cn, characters: media.characters.edges.map(e => ({ id: e.node.id, name: e.node.name.full, native: e.node.name.native, image: e.node.image && e.node.image.large, voiceActors: (e.voiceActors||[]).map(v => ({ name: v.name.full, native: v.name.native, image: v.image && v.image.large })) })) })
  await new Promise(r => setTimeout(r, 900))
}
fs.writeFileSync('scripts/koi5_data.json', JSON.stringify(results, null, 2))
console.log('\n✅ 完成 ' + results.length + ' 部')
