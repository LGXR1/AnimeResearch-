import fs from 'node:fs'
import path from 'node:path'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const outDir = `${root}/visual-audit-round23`
const colorRegex = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/
const reports = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
const ids = [...new Set(reports.flatMap(file => JSON.parse(fs.readFileSync(file, 'utf8')).pendingVisualVerificationIds || []))].map(Number).sort((a, b) => a - b)
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(rows.map(row => [Number(row.id), row]))
const items = ids.map(id => {
  const row = byId.get(id)
  if (!row) throw new Error(`本地角色不存在：${id}`)
  return { id, name: row.name, anime: row.anime_title, image: row.image, colorTraits: (row.traits || []).filter(value => colorRegex.test(value)) }
})
if (items.length !== 424) throw new Error(`待目视核验角色数量变化：预期 424，实际 ${items.length}`)
fs.mkdirSync(outDir, { recursive: true })

let next = 0
let completed = 0
const workers = Array.from({ length: 8 }, async () => {
  while (true) {
    const index = next++
    if (index >= items.length) return
    const item = items[index]
    const file = path.join(outDir, `${item.id}.img`)
    try {
      if (!/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/character\//.test(item.image || '')) throw new Error('非 AniList 角色 CDN 图片地址')
      let response
      for (let attempt = 0; attempt < 3; attempt++) {
        response = await fetch(item.image, { signal: AbortSignal.timeout(30_000) })
        if (response.ok) break
        if (response.status !== 429 || attempt === 2) throw new Error(`HTTP ${response.status}`)
        await new Promise(resolve => setTimeout(resolve, 2_000 * (attempt + 1)))
      }
      fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()))
      item.localFile = file
      item.status = 'downloaded'
    } catch (error) {
      item.status = `failed: ${error.message}`
    }
    completed++
    if (completed % 50 === 0 || completed === items.length) {
      fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(items, null, 2))
      console.log(`${completed}/${items.length} images fetched`)
    }
  }
})
await Promise.all(workers)
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(items, null, 2))
console.log(JSON.stringify({ requested: items.length, fetched: items.filter(item => item.status === 'downloaded').length, failed: items.filter(item => item.status !== 'downloaded').length, colorTraitRows: items.filter(item => item.colorTraits.length).length }))
