import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const reports = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
const outputPath = `${root}/anilist-voice-media-round23.json`
const batchSize = 25
const delayMs = 800
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const ids = [...new Set(reports.flatMap(path => {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  return [...(report.pendingVoiceActorIds || []), ...(report.pendingVoiceActorImageIds || [])].map(Number)
}))].sort((a, b) => a - b)

async function request(batch) {
  const query = `query{Page(page:1,perPage:${batchSize}){characters(id_in:[${batch.join(',')}],sort:ID){id name{full native} media(type:ANIME,perPage:50){edges{node{id title{romaji english native} countryOfOrigin} characterRole voiceActors(language:JAPANESE){id name{full native} image{large}}}}}}}`
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

const characters = {}
const batches = Array.from({ length: Math.ceil(ids.length / batchSize) }, (_, index) => ids.slice(index * batchSize, (index + 1) * batchSize))
console.log(`开始串行核查 ${ids.length} 位待补声优/头像角色`)
for (let index = 0; index < batches.length; index++) {
  const results = await request(batches[index])
  for (const character of results) characters[Number(character.id)] = character
  if ((index + 1) % 3 === 0 || index === batches.length - 1) console.log(`完成 ${Math.min((index + 1) * batchSize, ids.length)}/${ids.length}`)
  if (index + 1 < batches.length) await wait(delayMs)
}

const payload = { fetchedAt: new Date().toISOString(), source: 'AniList GraphQL API', requestedIds: ids, returnedCount: Object.keys(characters).length, missingIds: ids.filter(id => !characters[id]), characters }
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2))
const withJapaneseVoice = Object.values(characters).filter(character => (character.media?.edges || []).some(edge => edge.node?.countryOfOrigin === 'JP' && (edge.voiceActors || []).length)).length
console.log(JSON.stringify({ requested: ids.length, returned: payload.returnedCount, missing: payload.missingIds.length, withJapaneseVoice }))
