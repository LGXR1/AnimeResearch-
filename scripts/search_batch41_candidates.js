import fs from 'node:fs'

const norm = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownIds = new Set(rows.map(row => row.id))
const knownTitles = new Set(rows.map(row => norm(row.anime_title)))
const usedMedia = new Set()
for (const file of fs.readdirSync('data/anime_update_drafts')) {
  if (!/^batch\d+-selection\.json$/.test(file)) continue
  for (const item of JSON.parse(fs.readFileSync(`data/anime_update_drafts/${file}`, 'utf8')).anime) usedMedia.add(item.mediaId)
}
const probed = new Set(JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-search-candidates.json', 'utf8')).map(item => item.id))
const catalog = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-catalog.json', 'utf8')).fresh
const candidates = catalog.filter(item => !usedMedia.has(item.id) && !probed.has(item.id) && ['TV', 'ONA'].includes(item.format))
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function request(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
    if (response.status === 429) { const delay = Math.min(60000, 20000 * (attempt + 1)); console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`); await wait(delay); continue }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 240)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data
  }
  throw new Error('AniList 限流重试超过上限')
}

const accepted = []
const batchSize = 4
const fields = `edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
for (let offset = 0; offset < candidates.length && accepted.length < 25; offset += batchSize) {
  const batch = candidates.slice(offset, offset + batchSize)
  const query = `query{${batch.map((item, i) => `m${i}:Media(id:${item.id},type:ANIME){id title{romaji english native}synonyms format status startDate{year month day}countryOfOrigin genres characters(sort:FAVOURITES_DESC,page:1,perPage:25){${fields}}}`).join('\n')}}`
  const data = await request(query)
  for (let i = 0; i < batch.length; i++) {
    const media = data[`m${i}`]
    if (!media || media.countryOfOrigin !== 'JP' || media.status !== 'FINISHED') continue
    const aliases = [media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean)
    if (aliases.some(alias => knownTitles.has(norm(alias)))) continue
    const edges = media.characters.edges || []
    const eligible = edges.filter(edge => !knownIds.has(edge.node.id) && edge.node.image?.large && edge.voiceActors.some(actor => actor.image?.large)
      && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
    const main = eligible.filter(edge => edge.role === 'MAIN')
    if (eligible.length < 5 || !main.length) continue
    accepted.push({ ...media, eligibleCount: eligible.length, mainCount: main.length,
      sampleCharacters: eligible.map(edge => ({ id: edge.node.id, name: edge.node.name.full, role: edge.role,
        description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        voiceActors: edge.voiceActors.map(actor => actor.name.native || actor.name.full) })) })
    console.log([media.id, media.startDate?.year || '', media.popularity, media.format,
      media.title.english || media.title.romaji, media.title.native, eligible.length, main.length, media.genres.join(',')].join('\t'))
    if (accepted.length === 25) break
  }
  if (offset % 20 === 0) console.log(`已核对 ${Math.min(offset + batchSize, candidates.length)}/${candidates.length} 部候选，找到 ${accepted.length}/25 部`)
  await wait(1500)
}
if (accepted.length !== 25) throw new Error(`仅找到 ${accepted.length} 部合格候选作品`)
fs.writeFileSync('data/anime_update_drafts/batch41-search-candidates.json', JSON.stringify(accepted, null, 2))
