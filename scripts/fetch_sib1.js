import fs from 'fs'
const ANI_LIST_API = 'https://graphql.anilist.co'
const ANIME = [
  { cn: '缘之空', search: 'Yosuga no Sora', year: 2010 },
  { cn: '染红的街道', search: 'Akane-iro ni Somaru Saka', year: 2008 },
  { cn: '就算是哥哥有爱就没问题了吧', search: 'OniAi', year: 2012 },
  { cn: '最近妹妹的样子有点怪', search: 'Saikin, Imouto no Yousu ga Chotto Okashiinda ga', year: 2014 },
  { cn: '腹黑妹妹控兄记', search: 'Oniichan no Koto nanka Zenzen Suki ja Nai n da kara ne!!', year: 2011 },
  { cn: '恋风', search: 'Koi Kaze', year: 2004 },
  { cn: '妹妹恋人', search: 'Boku wa Imouto ni Koi wo Suru', year: 2005 },
  { cn: '三人行必有我妹', search: 'Kono Naka ni Hitori, Imouto ga Iru!', year: 2012 },
  { cn: '初音岛', search: 'Da Capo', year: 2003 },
  { cn: '双恋', search: 'Futakoi', year: 2004 },
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
  const exact = ml.filter(m => (m.title.romaji||'').toLowerCase() === a.search.toLowerCase() || (m.title.english||'').toLowerCase() === a.search.toLowerCase() || (m.title.native||'').toLowerCase() === a.search.toLowerCase())
  const pool = exact.length ? exact : ml
  const best = pool.find(m => m.format === 'TV') || pool[0]
  console.log('✅ ' + a.cn + ' → Media ' + best.id + ' (' + (best.title.romaji||best.title.english||best.title.native) + ' | ' + best.seasonYear + ')')
  const media = await fetchChars(best.id)
  results.push({ cn: a.cn, characters: media.characters.edges.map(e => ({ id: e.node.id, name: e.node.name.full, native: e.node.name.native, image: e.node.image && e.node.image.large, voiceActors: (e.voiceActors||[]).map(v => ({ name: v.name.full, native: v.name.native, image: v.image && v.image.large })) })) })
  await new Promise(r => setTimeout(r, 900))
}
fs.writeFileSync('scripts/sib1_data.json', JSON.stringify(results, null, 2))
console.log('\n✅ 完成 ' + results.length + ' 部')
