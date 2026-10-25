import fs from 'node:fs'

const ids = [149, 1542, 1543, 1544, 1545, 1628, 1636]
const local = new Map(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => [Number(row.id), row]))
const query = `query { Page(page: 1, perPage: 10) { characters(id_in: [${ids.join(',')}], sort: ID) { id name { full native alternative } description(asHtml: false) gender age image { large } } } }`
await new Promise(resolve => setTimeout(resolve, 700))
const response = await fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ query }),
})
if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
const body = await response.json()
if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
const characters = body.data?.Page?.characters || []
const found = new Set(characters.map(row => Number(row.id)))
for (const id of ids) {
  const character = characters.find(row => Number(row.id) === id)
  const localRow = local.get(id)
  if (!character || !localRow || ![character.name.full, character.name.native, ...(character.name.alternative || [])].some(name => [localRow.name, ...(localRow.nicknames || [])].includes(name))) {
    throw new Error(`AniList 人物匹配失败：${id}`)
  }
}
fs.writeFileSync('data/anime_update_drafts/library-audit-2026-10-13/short-bio-candidates-batch7-live-sources.json', JSON.stringify({
  fetchedAt: new Date().toISOString(),
  source: 'AniList GraphQL character profiles',
  requestedIds: ids,
  missingIds: ids.filter(id => !found.has(id)),
  characters,
}, null, 2))
console.log(JSON.stringify({ fetched: characters.length, missing: ids.filter(id => !found.has(id)).length }))
