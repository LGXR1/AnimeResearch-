import fs from 'node:fs'
import path from 'node:path'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const outDir = path.join(root, 'visual-audit-tmp')
const rows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(rows.map(row => [Number(row.id), row]))
const ids = [...new Set(Array.from({ length: 10 }, (_, index) => {
  const report = JSON.parse(fs.readFileSync(`${root}/batch${index + 25}-audit-report.json`, 'utf8'))
  return report.pendingVisualVerificationIds
}).flat())]
fs.mkdirSync(outDir, { recursive: true })
const manifest = []
for (let index = 0; index < ids.length; index++) {
  const id = ids[index]
  const row = byId.get(id)
  if (!row?.image) throw new Error(`角色 ${id} 缺少图片`)
  const file = path.join(outDir, `${id}.img`)
  let status = 'cached'
  if (!fs.existsSync(file)) {
    try {
      const response = await fetch(row.image, { signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()))
      status = 'downloaded'
    } catch (error) {
      status = `failed: ${error.message}`
    }
  }
  manifest.push({ id, name: row.name, anime: row.anime_title, image: row.image, file, colorTraits: row.traits.filter(value => /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/.test(value)), status })
  if (index % 25 === 24 || index === ids.length - 1) {
    fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
    console.log(`${index + 1}/${ids.length} photos processed`)
  }
  await new Promise(resolve => setTimeout(resolve, 700))
}
