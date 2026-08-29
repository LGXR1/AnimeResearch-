import fs from 'fs'
const ANI_LIST_API = 'https://graphql.anilist.co'
const ANIME = [
  { cn: '棋魂', search: 'Hikaru no Go' },
  { cn: '中华小当家', search: 'Chuuka Ichiban' },
  { cn: '日式面包王', search: 'Yakitate Japan' },
  { cn: '城市猎人', search: 'City Hunter' },
  { cn: '乱马1/2', search: 'Ranma' },
  { cn: '福星小子', search: 'Urusei Yatsura' },
  { cn: '银河铁道999', search: 'Ginga Tetsudou 999' },
  { cn: '鲁邦三世', search: 'Lupin III' },
  { cn: '冰上的尤里', search: 'Yuri!!! on Ice' },
  { cn: 'Free! 男子游泳部', search: 'Free!' },
  { cn: '飙速宅男', search: 'Yowamushi Pedal' },
  { cn: '歌牌情缘', search: 'Chihayafuru' },
  { cn: '魔法少女奈叶', search: 'Mahou Shoujo Lyrical Nanoha' },
  { cn: '机动战士高达SEED', search: 'Mobile Suit Gundam SEED' },
  { cn: '机动战士高达00', search: 'Mobile Suit Gundam 00' },
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
fs.writeFileSync('scripts/r15_data.json', JSON.stringify(results, null, 2))
console.log('\n✅ 完成 ' + results.length + ' 部')
