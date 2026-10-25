import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  43444: {
    traits: ['是丸尾荣一郎和鷹崎奈津的前辈', '南部网球俱乐部成员', '已完成高中学业', '成为职业网球选手', '比后辈拥有更多比赛经验', '熟悉职业比赛对体能的要求', '熟悉职业赛场对技术的要求', '会在俱乐部与后辈交流', '让荣一郎看到从业余训练走向职业比赛的道路'],
    source: 'https://kitsu.io/characters/takuma-egawa',
  },
  38486: {
    traits: ['男性', '南十字学园高中部三年级学生', '真实身份是绮罗星十字团第二部队成员', '所属部队名为Vanishing Age', '团内代号是“棍之星”', '在学校以普通学生身份生活', '执行任务时驾驶Cybody', '与组织成员共同守护绮罗星十字团的秘密', '在拓人挑战组织时成为其对手'],
    source: 'https://kitsu.io/characters/tsukihiko-bou',
  },
  40475: {
    traits: ['是津名志拓人的祖父', '曾是“银河美少年”', '教拓人使用双剑战斗', '教拓人成为Star Driver', '把自己曾使用过的印记交给拓人', '参与过南十字岛的秘密活动', '了解Cybody与印记规则', '把战斗经验传给拓人', '家族记忆影响拓人后来作出的选择'],
    source: 'https://kitsu.io/characters/ikurou-tsunashi',
  },
  43082: {
    traits: ['在《花开物语》第11话登场', '与种村孝一在书店一起工作', '似乎喜欢孝一', '曾告诉绪花自己向孝一告白', '在东京的书店工作', '通过书店工作与孝一相识', '她的经历让绪花了解到孝一的近况', '她的出现使孝一与绪花之间未说清的感情再次浮现'],
    source: 'https://kitsu.io/characters/namiko-igarashi',
  },
}

const ids = Object.keys(updates).map(Number)
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const fullById = new Map(full.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
for (const id of ids) if (!fullById.has(id) || !slimById.has(id) || updates[id].traits.length < 8 || new Set(updates[id].traits).size !== updates[id].traits.length) throw new Error(`角色 ${id} 的本地记录或特征不合格`)

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title,nicknames,traits,description').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw charactersResult.error
if (actorsResult.error) throw actorsResult.error
const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位角色，停止写入`)
for (const id of ids) {
  const local = fullById.get(id)
  const remote = remoteById.get(id)
  for (const key of ['name', 'anime_title', 'nicknames', 'traits']) if (JSON.stringify(local[key] ?? null) !== JSON.stringify(remote[key] ?? null)) throw new Error(`角色 ${id} 的本地与 Supabase ${key} 不一致，停止写入`)
  if (updates[id].description && local.description !== remote.description) throw new Error(`角色 ${id} 的本地与 Supabase 简介不一致，停止写入`)
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const names = actorsById.get(Number(actor.character_id)) || []
  names.push(actor.name)
  actorsById.set(Number(actor.character_id), names)
}
const payloads = ids.map((id) => {
  const row = fullById.get(id)
  const traits = updates[id].traits
  return { id, traits, ...(updates[id].description ? { description: updates[id].description } : {}), search_text: [row.name, row.anime_title, ...(row.nicknames || []), ...traits, ...(actorsById.get(id) || [])].join(' ') }
})
for (const payload of payloads) {
  const { error } = await db.from('characters').update({ traits: payload.traits, ...(payload.description ? { description: payload.description } : {}), search_text: payload.search_text }).eq('id', payload.id)
  if (error) throw new Error(`角色 ${payload.id} 写入失败：${error.message}`)
}

const readback = await db.from('characters').select('id,traits,description,search_text').in('id', ids)
if (readback.error) throw readback.error
const savedById = new Map((readback.data || []).map((row) => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const payload of payloads) {
  const saved = savedById.get(payload.id)
  if (JSON.stringify(saved.traits) !== JSON.stringify(payload.traits) || (payload.description && saved.description !== payload.description) || saved.search_text !== payload.search_text || saved.search_text.includes(payload.description || fullById.get(payload.id).description)) throw new Error(`角色 ${payload.id} 回读校验失败`)
  fullById.get(payload.id).traits = saved.traits
  fullById.get(payload.id).description = saved.description
  fullById.get(payload.id).search_text = saved.search_text
  slimById.get(payload.id).traits = saved.traits
  slimById.get(payload.id).description = saved.description
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(full, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) lines.push([
  row.id, row.name, row.anime_title, row.image, row.description,
  (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(','),
].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${lines.join('\n')}\n`)

for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = ids.filter((id) => (report.checkedIds || []).map(Number).includes(id))
  if (!batchIds.length) continue
  report.pendingTraitVerificationIds = (report.pendingTraitVerificationIds || []).filter((id) => !batchIds.includes(Number(id)))
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...batchIds])]
  report.localFollowup ||= {}
  report.localFollowup.traitCorrections ||= {}
  for (const id of batchIds) report.localFollowup.traitCorrections[id] = { source: updates[id].source, correctedAt: new Date().toISOString(), readbackVerified: true }
  const descriptionIds = batchIds.filter((id) => updates[id].description)
  if (descriptionIds.length) {
    report.localFollowup.descriptionCorrections ||= {}
    for (const id of descriptionIds) report.localFollowup.descriptionCorrections[id] = { source: updates[id].source, correctedAt: new Date().toISOString(), readbackVerified: true }
    for (const key of ['pendingDescriptionQualityIds', 'pendingShortDescriptionIds']) report[key] = (report[key] || []).filter((id) => !descriptionIds.includes(Number(id)))
  }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const evidence = {
  correctedAt: new Date().toISOString(),
  count: ids.length,
  ids,
  descriptionCorrectedIds: ids.filter((id) => Boolean(updates[id].description)),
  sources: Object.fromEntries(ids.map((id) => [id, updates[id].source])),
  supabaseReadbackVerified: true,
  searchIndexVerifiedForAllIds: true,
  introExcludedFromSearch: true,
}
fs.writeFileSync(`${root}/followup-traits-round8.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
