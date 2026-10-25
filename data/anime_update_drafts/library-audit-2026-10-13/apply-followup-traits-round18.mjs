import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  32415: {
    traits: ['帝爱集团旗下地下赌场的年轻经理', '负责经营赌场的弹珠机“沼泽”', '可以从远程位置控制“沼泽”', '通过远程控制阻止玩家取得最高奖金', '机器被设计成难以赢得最高奖金', '每颗弹珠价值四千日元', '最高奖金超过五亿日元', '利用“沼泽”吸引赌徒并维护赌场利益', '是开司在漫画后半段的对手'],
    source: 'https://kitsu.io/characters/seiya-ichijou',
  },
  35608: {
    traits: ['学校戏剧社“夜间航班”的社长', '三年前搬到南十字岛', '搬到岛上后便知道Cybody的存在', '知道闪亮十字团的存在', '是一名很有才华的演员', '比普通学生更了解南十字岛的秘密', '通过戏剧活动与拓人和和子等人相识', '会参与学校演出和戏剧社活动'],
    source: 'https://kitsu.io/characters/sarina-endou',
  },
  40073: {
    traits: ['女性', '曾是Adult Bank成员', '属于闪亮十字团', '组织进入第三阶段后加入Vanishing Age', '在团内的代号是“针之星”', '会参与Cybody相关秘密行动', '从Adult Bank转入Vanishing Age', '转入后继续为闪亮十字团执行任务'],
    source: 'https://kitsu.io/characters/kou-atari',
  },
  38905: {
    traits: ['高中二年级学生', '拥有金发', '发型像鹦鹉的羽冠', '性格非常迷糊', '迷糊到朋友常需阻止她受伤', '与透、由宇子和渚关系亲密', '经常成为校园意外的中心', '十分信任身边的伙伴'],
    source: 'https://kitsu.io/characters/run-momoki',
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
