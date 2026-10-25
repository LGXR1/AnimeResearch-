import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const data = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const existingIds = new Set(data.map(x => x.id))
const norm = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
const knownTitles = new Set(data.map(x => norm(x.anime_title)))
const candidates = JSON.parse(fs.readFileSync(`${root}/batch19-candidates.json`, 'utf8')).candidatePool.slice(0, 250)
const selectionPath = `${root}/batch19-selection.json`
const current = fs.existsSync(selectionPath) ? JSON.parse(fs.readFileSync(selectionPath, 'utf8')).anime : []
const currentIds = new Set(current.map(x => x.mediaId))
const currentChars = new Set()
for (const item of current) {
  const snap = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  for (const edge of snap.characters || []) currentChars.add(edge.node.id)
}
const request = async query => {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
    if (response.status === 429) {
      const delay = Math.min(60000, 15000 * (attempt + 1))
      console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`)
      await new Promise(resolve => setTimeout(resolve, delay))
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 240)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data
  }
  throw new Error('AniList 限流重试超过上限')
}
const chunks = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size))
const target = Number(process.argv.find(x => x.startsWith('--count='))?.slice(8) || 15)
const batches = chunks(candidates, 50)
const eligible = []
const candidateCharacters = new Map()
for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
  const batch = batches[batchIndex].filter(m => !currentIds.has(m.id) && !m.synonyms?.some(t => knownTitles.has(norm(t))))
  if (!batch.length) continue
  const result = await request(`query{Page(page:1,perPage:50){media(id_in:[${batch.map(m => m.id).join(',')}],type:ANIME){id characters(sort:FAVOURITES_DESC,page:1,perPage:15){edges{node{id}}}}}}`)
  const byId = new Map((result.Page?.media || []).map(m => [m.id, m]))
  for (const media of batch) {
    const ids = (byId.get(media.id)?.characters?.edges || []).map(x => x.node.id)
    candidateCharacters.set(media.id, ids)
    const overlapsKnown = ids.filter(id => existingIds.has(id) || currentChars.has(id)).length
    if (overlapsKnown >= 2) continue
    eligible.push(media)
  }
  if ((batchIndex + 1) % 2 === 0) console.log(`排查续作和角色重复 ${Math.min((batchIndex + 1) * 50, candidates.length)} / ${candidates.length}，可用 ${eligible.length}`)
  await new Promise(resolve => setTimeout(resolve, 1200))
  if (eligible.length >= 120) break
}

const distinct = []
for (const media of eligible) {
  const ids = candidateCharacters.get(media.id) || []
  if (distinct.some(x => ids.filter(id => candidateCharacters.get(x.id)?.includes(id)).length >= 2)) continue
  distinct.push(media)
}
const picked = []
const genres = new Set()
for (const m of distinct) {
  if (picked.length === target) break
  if (m.genres?.some(g => !genres.has(g))) {
    picked.push(m)
    for (const g of m.genres || []) genres.add(g)
  }
}
for (const m of distinct) if (picked.length < target && !picked.some(x => x.id === m.id)) picked.push(m)
const output = { eligibleCount: eligible.length, distinctCount: distinct.length, picked }
fs.writeFileSync(`${root}/batch19-refined-candidates.json`, JSON.stringify(output, null, 2))
console.log(`筛后可用 ${eligible.length} 部，角色重叠去重后 ${distinct.length} 部，选中 ${picked.length}/${target} 部`)
for (const m of picked) console.log(`${m.id}\t${m.title.english || m.title.romaji}\t${(m.synonyms || []).filter(x => /\p{Script=Han}/u.test(x)).slice(0, 2).join(' / ')}`)


