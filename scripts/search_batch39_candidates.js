import fs from 'node:fs'

const catalog = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-catalog.json', 'utf8')).fresh
const knownIds = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(x => x.id))
const usedIds = new Set()
for (const file of fs.readdirSync('data/anime_update_drafts')) {
  const match = file.match(/^batch(\d+)-selection\.json$/)
  if (match) for (const item of JSON.parse(fs.readFileSync(`data/anime_update_drafts/${file}`, 'utf8')).anime) usedIds.add(item.mediaId)
}
const candidates = catalog.filter(x => !usedIds.has(x.id) && ['TV', 'ONA'].includes(x.format) && [2023, 2024, 2025, 2026].includes(x.startDate?.year))
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

const accepted = []
const batchSize = 4
const fields = `edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
for (let offset = 0; offset < candidates.length && accepted.length < 55; offset += batchSize) {
  const batch = candidates.slice(offset, offset + batchSize)
  const query = `query{${batch.map((m, i) => `m${i}:Media(id:${m.id},type:ANIME){id characters(sort:FAVOURITES_DESC,page:1,perPage:25){${fields}}}`).join('\n')}}`
  const data = await request(query)
  for (let i = 0; i < batch.length; i++) {
    const media = batch[i]
    const edges = data[`m${i}`]?.characters.edges || []
    const overlap = edges.filter(edge => knownIds.has(edge.node.id)).length
    if (overlap) continue
    const eligible = edges.filter(edge => edge.node.image?.large && edge.voiceActors.some(va => va.image?.large) && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
    const main = eligible.filter(edge => edge.role === 'MAIN')
    if (eligible.length < 5) continue
    accepted.push({ ...media, overlap, eligibleCount: eligible.length, mainCount: main.length, sampleCharacters: eligible.map(edge => ({ id: edge.node.id, name: edge.node.name.full, role: edge.role, description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(), voiceActors: edge.voiceActors.map(va => va.name.native || va.name.full) })) })
  }
  if ((offset / batchSize) % 5 === 0) console.log(`已核对 ${Math.min(offset + batchSize, candidates.length)}/${candidates.length} 部候选，找到 ${accepted.length} 部零重叠作品`)
  await wait(800)
}
fs.writeFileSync('data/anime_update_drafts/batch39-search-candidates.json', JSON.stringify(accepted, null, 2))
console.log(`零人物重叠且至少有 5 位可核实角色：${accepted.length} 部`)
for (const m of accepted) console.log([m.id, m.startDate?.year || '', m.popularity, m.format, m.title.english || m.title.romaji, m.title.native, m.eligibleCount, m.mainCount, m.genres.join(',')].join('\t'))
