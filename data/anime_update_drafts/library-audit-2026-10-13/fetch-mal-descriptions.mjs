import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const ids = Object.keys(JSON.parse(fs.readFileSync(`${root}/description-live-profiles.json`, 'utf8'))).map(Number)
const decode = value => value.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const plain = value => decode(value.replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/<[^>]*>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim())
const out = {}
for (const id of ids) {
  try {
    const response = await fetch(`https://myanimelist.net/character/${id}`, { signal: AbortSignal.timeout(15000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const html = await response.text()
    const match = html.match(/<h2 class="normal_header"[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?:<div style="padding:|<div class="normal_header">Voice Actors)/)
    if (!match) throw new Error('Biography block missing')
    out[id] = { url: `https://myanimelist.net/character/${id}`, name: plain(match[1]), biography: plain(match[2]).slice(0, 2500) }
  } catch (error) {
    out[id] = { error: error.message }
  }
  fs.writeFileSync(`${root}/description-mal-profiles.json`, JSON.stringify(out, null, 2))
  console.log(`${Object.keys(out).length}/${ids.length} ${id} ${out[id].biography?.includes('No biography written.') ? 'no biography' : out[id].error || 'biography available'}`)
  await new Promise(resolve => setTimeout(resolve, 700))
}
