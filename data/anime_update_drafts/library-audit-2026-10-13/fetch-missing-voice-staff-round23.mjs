import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const reports = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const targetIds = [...new Set(reports.flatMap(path => JSON.parse(fs.readFileSync(path, 'utf8')).pendingVoiceActorImageIds || []))].map(Number)
const targetActors = new Map()
for (const id of targetIds) {
  for (const actor of byId.get(id)?.voice_actors || []) {
    if (actor.image || !actor.name) continue
    if (!targetActors.has(actor.name)) targetActors.set(actor.name, new Set())
    targetActors.get(actor.name).add(id)
  }
}
const names = [...targetActors.keys()].sort((a, b) => a.localeCompare(b, 'zh-CN'))
const batchSize = 6
const delayMs = 800
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const records = {}

async function request(batch) {
  const fields = batch.map((name, index) => `s${index}:Page(page:1,perPage:10){staff(search:${JSON.stringify(name)},sort:SEARCH_MATCH){id name{full native alternative} image{large}}}`).join(' ')
  const query = `query{${fields}}`
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
    return body.data
  }
  throw new Error('AniList 重试次数已用完')
}

const batches = Array.from({ length: Math.ceil(names.length / batchSize) }, (_, index) => names.slice(index * batchSize, (index + 1) * batchSize))
console.log(`查询 ${names.length} 个缺图声优姓名，分 ${batches.length} 次串行请求`)
for (let index = 0; index < batches.length; index++) {
  const batch = batches[index]
  const data = await request(batch)
  batch.forEach((name, position) => { records[name] = data?.[`s${position}`]?.staff || [] })
  if ((index + 1) % 5 === 0 || index === batches.length - 1) console.log(`完成 ${Math.min((index + 1) * batchSize, names.length)}/${names.length}`)
  if (index + 1 < batches.length) await wait(delayMs)
}

const payload = { fetchedAt: new Date().toISOString(), source: 'AniList GraphQL Staff search', requestedNames: names, staffByName: records }
fs.writeFileSync(`${root}/anilist-missing-voice-staff-round23.json`, JSON.stringify(payload, null, 2))
const exactMatches = Object.entries(records).filter(([localName, staff]) => staff.some(item => [item.name?.full, item.name?.native, ...(item.name?.alternative || [])].some(name => name && String(name).normalize('NFKC').trim().toLocaleLowerCase('en') === localName.normalize('NFKC').trim().toLocaleLowerCase('en'))))
console.log(JSON.stringify({ names: names.length, exactStaffMatches: exactMatches.length, matches: exactMatches.map(([localName, staff]) => ({ localName, staff: staff.filter(item => [item.name?.full, item.name?.native, ...(item.name?.alternative || [])].some(name => name && String(name).normalize('NFKC').trim().toLocaleLowerCase('en') === localName.normalize('NFKC').trim().toLocaleLowerCase('en'))).map(({ id, name, image }) => ({ id, name, image })) })) }, null, 2))
