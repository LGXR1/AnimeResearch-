import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const reports = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
const outputPath = `${root}/anilist-character-profiles-round23.json`
const checkpointPath = `${root}/anilist-character-profiles-round23.checkpoint.json`
const batchSize = 50
const delayMs = 750
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const ids = [...new Set(reports.flatMap(path => {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  return (report.pendingExternalVerificationIds || []).map(Number)
}))].sort((a, b) => a - b)
if (ids.length !== 1652) throw new Error(`待补查 AniList ID 数量变化：预期 1652，实际 ${ids.length}`)

const base = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles.json`, 'utf8'))
const checkpoint = fs.existsSync(checkpointPath) ? JSON.parse(fs.readFileSync(checkpointPath, 'utf8')) : {}
const records = { ...checkpoint }
const pending = ids.filter(id => !records[id])
const batches = Array.from({ length: Math.ceil(pending.length / batchSize) }, (_, index) => pending.slice(index * batchSize, (index + 1) * batchSize))

async function request(batch) {
  const query = `query{Page(page:1,perPage:${batchSize}){characters(id_in:[${batch.join(',')}],sort:ID){id name{full native alternative} image{large} description(asHtml:false) gender age}}}`
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(30_000),
    })
    if (response.status === 429 && attempt < 4) {
      const seconds = Number(response.headers.get('retry-after'))
      await wait(Math.max(60_000, Number.isFinite(seconds) ? seconds * 1000 : 0))
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data?.Page?.characters || []
  }
  throw new Error('AniList 重试次数已用完')
}

console.log(`开始串行核查 ${pending.length} 个 AniList 角色 ID，批量 ${batchSize}，间隔 ${delayMs}ms`)
for (let index = 0; index < batches.length; index++) {
  const batch = batches[index]
  const results = await request(batch)
  for (const profile of results) records[Number(profile.id)] = profile
  const returned = new Set(results.map(profile => Number(profile.id)))
  const absent = batch.filter(id => !returned.has(id))
  if (absent.length) console.log(`AniList 未返回 ${absent.length} 个 ID：${absent.join(',')}`)
  if ((index + 1) % 5 === 0 || index === batches.length - 1) {
    fs.writeFileSync(checkpointPath, JSON.stringify(records))
    console.log(`完成 ${Math.min((index + 1) * batchSize, pending.length)}/${pending.length}`)
  }
  if (index + 1 < batches.length) await wait(delayMs)
}

const requestedRecords = Object.fromEntries(ids.filter(id => records[id]).map(id => [id, records[id]]))
const missingIds = ids.filter(id => !records[id])
const payload = {
  fetchedAt: new Date().toISOString(),
  source: 'AniList GraphQL API',
  requestedIds: ids,
  returnedCount: Object.keys(requestedRecords).length,
  missingIds,
  profiles: requestedRecords,
}
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2))
fs.rmSync(checkpointPath, { force: true })
console.log(JSON.stringify({ requested: ids.length, returned: payload.returnedCount, missing: missingIds.length, withDescription: Object.values(requestedRecords).filter(profile => String(profile.description || '').trim()).length, withImage: Object.values(requestedRecords).filter(profile => profile.image?.large).length }))
