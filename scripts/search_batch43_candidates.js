import fs from 'node:fs'

const norm = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownIds = new Set(rows.map(row => row.id))
const knownTitles = new Set(rows.map(row => norm(row.anime_title)))
const usedMedia = new Set()
for (const file of fs.readdirSync('data/anime_update_drafts')) {
  if (!/^batch\d+-selection\.json$/.test(file)) continue
  for (const item of JSON.parse(fs.readFileSync(`data/anime_update_drafts/${file}`, 'utf8')).anime || []) usedMedia.add(item.mediaId)
}
const catalog = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-catalog.json', 'utf8')).fresh
const candidates = catalog.filter(item => !usedMedia.has(item.id) && ['TV', 'ONA'].includes(item.format)
  && ![item.title?.english, item.title?.romaji, item.title?.native, ...(item.synonyms || [])].filter(Boolean).some(title => knownTitles.has(norm(title))))
  .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function request(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }),
    })
    if (response.status === 429) {
      const delay = Math.min(60000, 20000 * (attempt + 1))
      console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`)
      await wait(delay)
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 240)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data
  }
  throw new Error('AniList 限流重试超过上限')
}

const accepted = []
const candidateIds = new Set()
const pageSize = 4
const fields = `edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
for (let offset = 204; offset < candidates.length && accepted.length < 50; offset += pageSize) {
  const batch = candidates.slice(offset, offset + pageSize)
  const query = `query{${batch.map((item, index) => `m${index}:Media(id:${item.id},type:ANIME){id title{romaji english native}synonyms format status startDate{year month day}countryOfOrigin genres popularity characters(sort:FAVOURITES_DESC,page:1,perPage:25){${fields}}}`).join('\n')}}`
  const data = await request(query)
  for (let index = 0; index < batch.length; index++) {
    const media = data[`m${index}`]
    if (!media || media.countryOfOrigin !== 'JP' || media.status !== 'FINISHED') continue
    const aliases = [media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean)
    if (aliases.some(alias => knownTitles.has(norm(alias)))) continue
    const edges = media.characters.edges || []
    const eligible = edges.filter(edge => !knownIds.has(edge.node.id) && !candidateIds.has(edge.node.id)
      && edge.node.image?.large && edge.voiceActors.some(actor => actor.image?.large)
      && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
    const main = eligible.filter(edge => edge.role === 'MAIN')
    if (eligible.length < 5 || !main.length) continue
    accepted.push({ ...media, eligibleCount: eligible.length, mainCount: main.length,
      sampleCharacters: eligible.map(edge => ({ id: edge.node.id, name: edge.node.name.full, native: edge.node.name.native, role: edge.role,
        description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        voiceActors: edge.voiceActors.map(actor => actor.name.native || actor.name.full) })) })
    for (const edge of eligible) candidateIds.add(edge.node.id)
    console.log([media.id, media.startDate?.year || '', media.popularity, media.format,
      media.title.english || media.title.romaji, media.title.native, eligible.length, main.length, media.genres.join(',')].join('\t'))
    if (accepted.length === 50) break
  }
  if (offset % 40 === 0) console.log(`已核对 ${Math.min(offset + pageSize, candidates.length)}/${candidates.length} 部候选，找到 ${accepted.length}/50 部`)
  await wait(750)
}
if (accepted.length !== 50) throw new Error(`仅找到 ${accepted.length} 部合格候选作品`)
fs.writeFileSync('data/anime_update_drafts/batch43-search-candidates.json', JSON.stringify(accepted, null, 2))
console.log(`已选出 ${accepted.length} 部符合条件的新作品`)
