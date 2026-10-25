import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const ids = [...new Set(Array.from({ length: 10 }, (_, index) => {
  const report = JSON.parse(fs.readFileSync(`${root}/batch${index + 25}-audit-report.json`, 'utf8'))
  return report.pendingDescriptionQualityIds
}).flat())]
const query = `query ($id: Int) {
  Character(id: $id) {
    id name { full native alternative } description(asHtml: false)
    media(perPage: 5) { nodes { type title { romaji english native } } }
  }
}`
const out = {}
for (const id of ids) {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
      signal: AbortSignal.timeout(15000),
    })
    const json = await response.json()
    if (!response.ok || json.errors) throw new Error(JSON.stringify(json.errors || response.status))
    out[id] = json.data.Character
  } catch (error) {
    out[id] = { error: error.message }
  }
  fs.writeFileSync(`${root}/description-live-profiles.json`, JSON.stringify(out, null, 2))
  console.log(`${Object.keys(out).length}/${ids.length} ${id} ${out[id]?.description ? 'description available' : 'no description'}`)
  await new Promise(resolve => setTimeout(resolve, 700))
}
