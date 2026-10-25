import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const characterId = 306847
const voiceActorId = 518
const row = full.find(character => Number(character.id) === characterId)
const slimRow = slim.find(character => Number(character.id) === characterId)
if (!row || !slimRow) throw new Error('找不到铁心导出记录')
const placeholder = (row.voice_actors || []).find(actor => Number(actor.id) === voiceActorId)
if (placeholder && placeholder.name !== '暂未收录') throw new Error('声优记录已改变，拒绝移除非占位名称')
row.voice_actors = (row.voice_actors || []).filter(actor => Number(actor.id) !== voiceActorId)
row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
slimRow.voice_actors = (slimRow.voice_actors || []).filter(actor => actor.name !== '暂未收录')
slimRow.search_text = row.search_text
if (row.search_text.includes('暂未收录')) throw new Error('占位名称仍残留在 search_text')
fs.writeFileSync('data/characters_full.json', JSON.stringify(full, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const character of full) csvLines.push([character.id, character.name, character.anime_title, character.image, character.description, (character.nicknames || []).join('|'), (character.traits || []).join('|'), (character.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const reportPath = `${root}/batch114-audit-report.json`
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
report.pendingVoiceActorImageIds = (report.pendingVoiceActorImageIds || []).filter(id => Number(id) !== characterId)
report.localFollowup ||= {}
report.localFollowup.voiceActorPlaceholderRemovedRound23B = {
  voiceActorId,
  oldName: '暂未收录',
  reason: '之前的声优核查报告未找到 AniList 或官方已播动画配音记录；占位文字不是声优姓名，已移除。角色仍保留在待查声优名单。',
  sourceReport: 'voice-actor-repair.report.json',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

const repairPath = `${root}/voice-actor-repair.report.json`
const repair = JSON.parse(fs.readFileSync(repairPath, 'utf8'))
repair.removedPlaceholderRows ||= []
if (!repair.removedPlaceholderRows.some(item => item.id === voiceActorId)) repair.removedPlaceholderRows.push({ id: voiceActorId, characterId, character: row.name, oldName: '暂未收录', reason: '没有可确认的日语动画配音来源；清除非姓名占位记录，仍待核实是否存在正式配音。' })
fs.writeFileSync(repairPath, JSON.stringify(repair, null, 2))
console.log(JSON.stringify({ characterId, voiceActorId, placeholderRemoved: Boolean(placeholder), voiceActorsRemaining: row.voice_actors.length, pendingVoiceActorIds: report.pendingVoiceActorIds.length, pendingVoiceActorImageIds: report.pendingVoiceActorImageIds.length }, null, 2))
