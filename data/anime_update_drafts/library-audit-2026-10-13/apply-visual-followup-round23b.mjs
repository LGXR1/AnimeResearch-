import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const previous = JSON.parse(fs.readFileSync(`${root}/visual-audit-round23-results.json`, 'utf8'))
const originalPending = new Set(previous.retainedForFollowup.map(Number))
const visualIds = new Set([157882, 174778, 182729, 210921, 234805, 262536, 287144, 320607])
for (const id of visualIds) if (!originalPending.has(id)) throw new Error(`角色 ${id} 不在上一轮待核列表`)

const corrections = [
  { id: 157882, remove: ['银发', '蓝瞳'], add: ['白色皮毛', '黄瞳'], reason: 'AniList 官方彩色头像显示其为白色毛皮的狼形魔兽，没有人类头发；眼睛呈黄色。' },
  { id: 174778, replace: [['银发', '蓝发']], add: [], reason: 'AniList 官方彩色头像显示头发为浅蓝色，保留可见蓝眼。' },
  { id: 182729, remove: ['灰瞳'], add: [], reason: 'AniList 官方头像中博士的脸部由兜帽与面罩遮挡，无法确认瞳色；移除无依据的灰瞳标签。' },
  { id: 210921, remove: ['蓝色眼瞳'], add: [], reason: 'AniList 官方彩色头像确认金发，但太阳镜遮挡双眼；移除无法核实的蓝眼标签。' },
  { id: 234805, remove: ['棕色眼瞳'], add: [], reason: 'AniList 官方彩色头像中角色闭眼；移除无法从头像确认的棕色眼瞳标签。' },
  { id: 320607, remove: ['黑发', '黑瞳'], add: [], reason: 'AniList 官方头像为黑白漫画中的非人形黑色生物，无法确认头发或瞳色；移除不适用的颜色标签。' },
]

const changed = []
for (const item of corrections) {
  const row = byId.get(item.id)
  if (!row) throw new Error(`本地导出缺少角色 ${item.id}`)
  const before = [...(row.traits || [])]
  let traits = before.filter(trait => !(item.remove || []).includes(trait))
  for (const [oldTrait, newTrait] of item.replace || []) traits = traits.map(trait => trait === oldTrait ? newTrait : trait)
  traits.push(...(item.add || []))
  row.traits = [...new Set(traits)]
  if (JSON.stringify(before) !== JSON.stringify(row.traits)) {
    row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
    const slimRow = slimById.get(item.id)
    if (!slimRow) throw new Error(`精简导出缺少角色 ${item.id}`)
    slimRow.traits = row.traits
    slimRow.search_text = row.search_text
    changed.push({ ...item, name: row.name, anime: row.anime_title, before: before.filter(trait => /(?:发|头发|瞳|眼)/.test(trait)), after: row.traits.filter(trait => /(?:发|头发|瞳|眼|毛皮)/.test(trait)) })
  }
}

const resolvedNotes = [
  { id: 157882, name: byId.get(157882).name, decision: '头像可见白色皮毛和黄色眼睛；修正把动物误写成人类发色的特征。' },
  { id: 174778, name: byId.get(174778).name, decision: '彩色头像确认浅蓝发、蓝眼；银发改为蓝发。' },
  { id: 182729, name: byId.get(182729).name, decision: '头像遮脸；删除无依据瞳色，现有记录不再声称未知颜色。' },
  { id: 210921, name: byId.get(210921).name, decision: '头像确认金发；太阳镜遮眼，删除无法核实的瞳色。' },
  { id: 234805, name: byId.get(234805).name, decision: '头像确认发色；角色闭眼，删除无法核实的瞳色。' },
  { id: 262536, name: byId.get(262536).name, decision: '彩色 AniList 头像可辨认黑发和深色眼睛，原特征与图像一致。' },
  { id: 287144, name: byId.get(287144).name, decision: '彩色 AniList 头像可辨认深色头发和眼睛，原特征与图像一致。' },
  { id: 320607, name: byId.get(320607).name, decision: '头像为黑白漫画中的非人形生物；移除不适用的头发和瞳色特征。' },
]
const remaining = [...originalPending].filter(id => !visualIds.has(id)).sort((a, b) => a - b)
const timestamp = new Date().toISOString()

for (const [id, row] of byId) {
  if (!changed.some(item => item.id === id)) continue
  if (row.search_text.includes(row.description || '\u0000')) throw new Error(`角色 ${id} 的简介进入 search_text`)
}
fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const allVerified = [...new Set([...(previous.verifiedIds || []).map(Number), ...resolvedNotes.map(item => item.id)])].sort((a, b) => a - b)
const allCorrections = [...previous.corrections, ...changed.map(item => ({
  id: item.id, name: item.name, anime: item.anime,
  beforeColorTraits: item.before, afterColorTraits: item.after,
  image: byId.get(item.id).image,
}))]
previous.auditedAt = timestamp
previous.visuallyVerified = allVerified.length
previous.retainedForFollowup = remaining
previous.corrected = allCorrections.length
previous.corrections = allCorrections
previous.verifiedIds = allVerified
previous.followupRound23B = { checkedAt: timestamp, source: 'AniList 官方角色头像；按可见部分确认并删除无依据颜色标签', resolved: resolvedNotes, remainingIds: remaining }
fs.writeFileSync(`${root}/visual-audit-round23-results.json`, JSON.stringify(previous, null, 2))

const reports = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
for (const path of reports) {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const checked = new Set((report.checkedIds || []).map(Number))
  report.pendingVisualVerificationIds = (report.pendingVisualVerificationIds || []).filter(id => !visualIds.has(Number(id)))
  report.pendingColorTraitKeywordIds = report.pendingVisualVerificationIds.filter(id => (byId.get(Number(id))?.traits || []).some(trait => /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/.test(trait)))
  const notes = resolvedNotes.filter(item => checked.has(item.id))
  if (notes.length) {
    report.localFollowup ||= {}
    report.localFollowup.visualImageFollowupRound23B = { checkedAt: timestamp, resolved: notes, remainingIds: report.pendingVisualVerificationIds }
    report.note = 'AniList 官方头像进一步复核了颜色；修正错误颜色或删除头像无法证实的颜色标签，剩余不清晰记录继续待核。'
  }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const summaryPath = `${root}/batch85-128-audit-summary.md`
const summaryText = fs.readFileSync(summaryPath, 'utf8')
if (!summaryText.includes('## 颜色待核补充复查（Round 23B）')) {
  fs.writeFileSync(summaryPath, `${summaryText}\n\n## 颜色待核补充复查（Round 23B）\n\n- 对上一轮保留的 20 张头像再核 8 位角色：修正 2 位颜色/物种标签，删除 4 位头像遮挡或不适用的颜色声明，并确认 2 位原标签与彩色头像一致。\n- 剩余 ${remaining.length} 位仍缺少可辨颜色的头像证据（黑白图、背影或默认头像），保留待核；不以猜测填色。\n- 每条结论和前后特征记录在 visual-audit-round23-results.json 与相应批次报告中。\n`)
}
console.log(JSON.stringify({ corrected: changed.length, resolved: resolvedNotes.length, remaining, finalVisualCount: allVerified.length, totalCorrections: allCorrections.length }, null, 2))
