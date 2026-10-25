import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(rows.map(row => [Number(row.id), row]))
const profiles = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles.json`, 'utf8')).profiles
const ids = [...new Set(Array.from({ length: 10 }, (_, index) => {
  const report = JSON.parse(fs.readFileSync(`${root}/batch${index + 25}-audit-report.json`, 'utf8'))
  return report.pendingTraitVerificationIds
}).flat())]
const out = {}
for (const id of ids) {
  const row = byId.get(id)
  const english = row.nicknames?.find(name => /^[\x00-\x7F]+$/.test(name) && name.length > 3)
  const term = profiles[id]?.name?.full || english || row.name
  try {
    const url = `https://kitsu.io/api/edge/characters?filter%5Bname%5D=${encodeURIComponent(term)}&page%5Blimit%5D=20`
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) })
    const json = await response.json()
    const exact = (json.data || []).filter(item => Number(item.attributes.malId) === id).map(item => ({
      id: item.id,
      name: item.attributes.name,
      names: item.attributes.names,
      description: item.attributes.description || '',
      url: `https://kitsu.io/characters/${item.attributes.slug}`,
    }))
    out[id] = { term, exact }
  } catch (error) {
    out[id] = { term, error: error.message, exact: [] }
  }
  fs.writeFileSync(`${root}/trait-kitsu-sources.json`, JSON.stringify(out, null, 2))
  if (Object.keys(out).length % 25 === 0 || Object.keys(out).length === ids.length) console.log(`${Object.keys(out).length}/${ids.length} Kitsu profiles`)
  await new Promise(resolve => setTimeout(resolve, 350))
}
