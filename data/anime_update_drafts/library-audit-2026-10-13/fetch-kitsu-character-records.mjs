import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(rows.map(row => [Number(row.id), row]))
const profiles = JSON.parse(fs.readFileSync(`${root}/description-live-profiles.json`, 'utf8'))
const ids = Object.keys(profiles).map(Number)
const out = {}
for (const id of ids) {
  const profile = profiles[id]
  const terms = [...new Set([profile?.name?.full, profile?.name?.native, byId.get(id)?.name].filter(Boolean))]
  const candidates = new Map()
  for (const term of terms) {
    try {
      const url = `https://kitsu.io/api/edge/characters?filter%5Bname%5D=${encodeURIComponent(term)}&page%5Blimit%5D=20`
      const response = await fetch(url, { signal: AbortSignal.timeout(12000) })
      const json = await response.json()
      for (const item of json.data || []) candidates.set(item.id, item.attributes)
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  const all = [...candidates.values()].map(item => ({
    name: item.name,
    names: item.names,
    malId: item.malId,
    description: item.description || '',
    kitsuUrl: `https://kitsu.io/characters/${item.slug}`,
  }))
  out[id] = { exactMalIdMatches: all.filter(item => Number(item.malId) === id), candidates: all.slice(0, 12) }
  fs.writeFileSync(`${root}/description-kitsu-profiles.json`, JSON.stringify(out, null, 2))
  console.log(`${Object.keys(out).length}/${ids.length} ${id} ${out[id].exactMalIdMatches.length ? 'exact match' : 'no exact match'}`)
}
