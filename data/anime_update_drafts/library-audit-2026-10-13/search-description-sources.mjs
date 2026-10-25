import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(rows.map(row => [Number(row.id), row]))
const profiles = JSON.parse(fs.readFileSync(`${root}/description-live-profiles.json`, 'utf8'))
const ids = [...new Set(Array.from({ length: 10 }, (_, index) => {
  const report = JSON.parse(fs.readFileSync(`${root}/batch${index + 25}-audit-report.json`, 'utf8'))
  return report.pendingDescriptionQualityIds
}).flat())]
const decode = value => value.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const plain = value => decode(value.replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ').trim())
const out = []
for (const id of ids) {
  const row = byId.get(id)
  const profile = profiles[id]
  const searchName = profile?.name?.full || row.name
  const media = profile?.media?.nodes?.[0]?.title?.romaji || row.anime_title
  const query = `"${searchName}" "${media}" anime character`
  try {
    const response = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(12000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const html = await response.text()
    const results = [...html.matchAll(/<li class="b_algo"[\s\S]*?<\/li>/g)].slice(0, 5).map(match => {
      const block = match[0]
      const titleLink = block.match(/<h2[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
      return { url: titleLink?.[1] || '', title: plain(titleLink?.[2] || ''), excerpt: plain(block).slice(0, 650) }
    })
    out.push({ id, name: row.name, anime: row.anime_title, query, results })
  } catch (error) {
    out.push({ id, name: row.name, anime: row.anime_title, query, error: error.message })
  }
  fs.writeFileSync(`${root}/description-source-search.json`, JSON.stringify(out, null, 2))
  console.log(`${out.length}/${ids.length} ${id} ${row.name}`)
  await new Promise(resolve => setTimeout(resolve, 800))
}
