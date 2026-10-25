import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const reportIds = new Set()
for (let batch = 25; batch <= 34; batch++) {
  const report = JSON.parse(fs.readFileSync(`${root}/batch${batch}-audit-report.json`, 'utf8'))
  for (const id of [...(report.pendingDescriptionQualityIds || []), ...(report.pendingShortDescriptionIds || []), ...(report.pendingVoiceActorIds || [])]) reportIds.add(Number(id))
}
const ids = [...reportIds].sort((a, b) => a - b)
const fields = 'id name { full native alternative } description(asHtml: false) image { large } media(type: ANIME, perPage: 10) { edges { node { id title { romaji english native } countryOfOrigin } characterRole voiceActors(language: JAPANESE) { id name { full native } image { large } } } }'
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const batches = Array.from({ length: Math.ceil(ids.length / 15) }, (_, index) => ids.slice(index * 15, (index + 1) * 15))
const records = []
for (let index = 0; index < batches.length; index++) {
  const batch = batches[index]
  const selections = batch.map((id) => `c${id}: Character(id: ${id}) { ${fields} }`).join('\n')
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ query: `query { ${selections} }` }),
  })
  if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 1200)}`)
  const payload = await response.json()
  if (payload.errors?.length) throw new Error(JSON.stringify(payload.errors))
  records.push(...batch.map((id) => payload.data?.[`c${id}`]).filter(Boolean))
  if (index + 1 < batches.length) await wait(800)
}
if (records.length !== ids.length) throw new Error(`AniList 返回 ${records.length}/${ids.length} 条角色资料`)
const output = {
  fetchedAt: new Date().toISOString(),
  source: 'AniList GraphQL API',
  ids,
  records,
}
fs.writeFileSync(`${root}/pending-anilist-profiles-round20.json`, JSON.stringify(output, null, 2))
console.log(JSON.stringify({ fetchedAt: output.fetchedAt, count: records.length, withDescriptions: records.filter((row) => row.description?.trim()).length, withJapaneseVoiceActors: records.filter((row) => row.media?.edges?.some((edge) => (edge.voiceActors || []).length)).length, ids }, null, 2))
