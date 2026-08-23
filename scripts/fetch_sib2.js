import fs from 'fs'
const ANI_LIST_API = 'https://graphql.anilist.co'
const ANIME = [
  { cn: '干物妹小埋', search: 'Himouto! Umaru-chan', year: 2015 },
  { cn: '妹妹公主', search: 'Sister Princess', year: 2001 },
  { cn: '别当欧尼酱了', search: 'Onimai', year: 2023 },
  { cn: '青春期猪头少年不会梦到娇怜外出妹', search: 'Seishun Buta Yarou wa Odekake Siscon', year: 2023 },
  { cn: '快把我哥带走', search: 'Take My Brother Away', year: 2018 },
  { cn: '魔法科高校的劣等生', search: 'Mahouka Koukou no Rettousei', year: 2014 },
  { cn: '东京地震8.0', search: 'Tokyo Magnitude 8.0', year: 2009 },
  { cn: '我的妹妹小桃子', search: 'Momoko, Kaeru no Uta ga Kikoeru yo.', year: 2003 },
  { cn: '紫云寺家的兄弟姐妹', search: 'Shiunji-ke no Kodomo-tachi', year: 2025 },
  { cn: '鬼人幻燈抄', search: 'Kijin Gentoushou', year: 2025 },
]
async function gql(q, v) {
  const r = await fetch(ANI_LIST_API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ query: q, variables: v }) })
  if (!r.ok) throw new Error('AniList ' + r.status + ' ' + await r.text())
  return r.json()
}
async function searchMedia(t) {
  const q = 'query ($s: String) { Page(page: 1, perPage: 10) { media(search: $s, type: ANIME, sort: SEARCH_MATCH) { id title { romaji english native } format seasonYear } } }'
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
  const best = pool.find(m => m.format === 'TV') || pool[0]
  console.log('✅ ' + a.cn + ' → Media ' + best.id + ' (' + (best.title.romaji||best.title.english||best.title.native) + ' | ' + best.seasonYear + ')')
  const media = await fetchChars(best.id)
  results.push({ cn: a.cn, characters: media.characters.edges.map(e => ({ id: e.node.id, name: e.node.name.full, native: e.node.name.native, image: e.node.image && e.node.image.large, voiceActors: (e.voiceActors||[]).map(v => ({ name: v.name.full, native: v.name.native, image: v.image && v.image.large })) })) })
  await new Promise(r => setTimeout(r, 900))
}
fs.writeFileSync('scripts/sib2_data.json', JSON.stringify(results, null, 2))
console.log('\n✅ 完成 ' + results.length + ' 部')
