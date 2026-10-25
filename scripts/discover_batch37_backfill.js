import fs from 'node:fs'

const existing = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const ids = new Set(existing.map(x => x.id))
const titles = new Set(existing.map(x => String(x.anime_title || '').toLowerCase()))
const selected = new Set(JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-selection.json', 'utf8')).anime.map(x => x.mediaId))
let last = 0
async function query(source) {
  await new Promise(resolve => setTimeout(resolve, Math.max(0, 1100 - (Date.now() - last))))
  last = Date.now()
  const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: source }) })
  if (!response.ok) throw new Error(`AniList HTTP ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(JSON.stringify(payload.errors))
  return payload.data
}
const media = []
for (const year of [2023, 2022, 2021]) {
  for (let page = 1; page <= 2; page++) {
    const data = await query(`query{Page(page:${page},perPage:50){media(type:ANIME,status:FINISHED,seasonYear:${year},isAdult:false,sort:POPULARITY_DESC){id title{english romaji native}synonyms format countryOfOrigin}}}`)
    media.push(...data.Page.media.filter(x => x.countryOfOrigin === 'JP' && ['TV', 'ONA', 'OVA'].includes(x.format) && !selected.has(x.id) && ![x.title.english, x.title.romaji, x.title.native, ...(x.synonyms || [])].filter(Boolean).some(t => titles.has(t.toLowerCase()))))
  }
}
for (let offset = 0; offset < media.length; offset += 4) {
  const batch = media.slice(offset, offset + 4)
  const data = await query(`query{${batch.map((m, i) => `m${i}:Media(id:${m.id}){id title{english romaji native}characters(page:1,perPage:25){edges{node{id description image{large}}voiceActors(language:JAPANESE){image{large}}}}}`).join(' ')}}`)
  for (let i = 0; i < batch.length; i++) {
    const m = data[`m${i}`]
    if (!m) continue
    const usable = m.characters.edges.filter(x => !ids.has(x.node.id) && x.node.image?.large?.includes('anilistcdn') && x.voiceActors.some(v => v.image?.large?.includes('anilistcdn')))
    const bio = usable.filter(x => (x.node.description || '').replace(/<[^>]+>/g, '').length >= 40)
    if (bio.length >= 6) console.log(`${m.id}\tnew=${usable.length}\tbio=${bio.length}\t${m.title.english || m.title.romaji}`)
  }
}
