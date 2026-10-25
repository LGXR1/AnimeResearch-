import fs from 'node:fs'

const norm = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const characters = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownTitles = new Set(characters.map(row => norm(row.anime_title)))
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function request(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
    if (response.status === 429) { const delay = Math.min(60000, 15000 * (attempt + 1)); console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`); await wait(delay); continue }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 240)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data
  }
  throw new Error('AniList 限流重试超过上限')
}

const results = new Map()
for (const year of [2026, 2025, 2024, 2023]) {
  for (let page = 1; page <= 4; page++) {
    const query = `query{Page(page:${page},perPage:50){media(type:ANIME,countryOfOrigin:JP,status:FINISHED,seasonYear:${year},sort:POPULARITY_DESC){id title{romaji english native}synonyms format status startDate{year month day}countryOfOrigin genres popularity siteUrl}}}`
    const data = await request(query)
    for (const media of data.Page.media) results.set(media.id, media)
    console.log(`${year} 年第 ${page} 页：${data.Page.media.length} 部`)
    await wait(800)
  }
}
const fresh = [...results.values()].filter(media => {
  const aliases = [media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean)
  return !aliases.some(title => knownTitles.has(norm(title)))
}).sort((a, b) => b.popularity - a.popularity)
fs.writeFileSync('data/anime_update_drafts/batch39-catalog.json', JSON.stringify({ fetchedAt: new Date().toISOString(), fresh }, null, 2))
console.log(`本地标题别名尚未命中的作品：${fresh.length}`)
for (const media of fresh.slice(0, 180)) console.log([media.id, media.startDate?.year || '', media.popularity, media.format, media.title.english || media.title.romaji, media.title.native, media.genres.join(',')].join('\t'))
