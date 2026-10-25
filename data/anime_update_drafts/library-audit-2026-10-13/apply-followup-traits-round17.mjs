import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  35469: {
    traits: ['是泽渡枫最早也最亲近的朋友', '是少数能理解枫古怪一面的朋友', '枫转学时第一个主动与她交谈', '帮助枫稍微克服害羞', '性格直爽', '喜欢制作有特殊气味的“臭臭弹”', '会关心朋友的心情', '与枫、乃莉和麻音共同度过校园生活', '是玉响小团体的联系纽带'],
    source: 'https://kitsu.io/characters/kaoru-hanawa',
  },
  31522: {
    traits: ['京都大学工学部学生', '大学一年级新生', '性格冷淡', '不容易接近', '对主角的态度稍微温和一些', '对飞蛾有强烈且近乎麻痹性的恐惧', '面对主角时不像对其他人那么严厉', '在不同故事分支中成为主角的恋爱对象', '做事理性直接'],
    source: 'https://kitsu.io/characters/akashi',
  },
  32270: {
    traits: ['真庭忍军十二头领之一', '在《刀语》第3话登场', '名字中含有“鲛”字', '穿着打扮带有鲨鱼特征', '自称杀人的唯一动机是金钱', '奉命夺取变体刀', '与鑢七花和咎梅的旅程发生交集', '表示杀人并非出于忠诚或私人仇恨'],
    source: 'https://kitsu.io/characters/kuizame-maniwa',
  },
  40665: {
    traits: ['16岁', '身高167厘米', '血型O型', '从冲绳转入圣玛丽学园', '与三位冲绳童年好友一同转学', '擅长使用热带水果', '专长是以热带水果进行装饰创作', '与知念美果等伙伴组成队伍参加糕点活动', '性格爽朗'],
    source: 'https://kitsu.io/characters/natsuki-aragaki',
  },
  39200: {
    traits: ['42岁', '喜翠庄的主厨', '担任厨房总厨', '是年轻厨师宫岸彻的导师', '擅长料理与厨房管理', '平时冷静严肃', '面对压力时会紧张', '有独特的服装品味', '要求厨房员工认真工作', '会在关键时刻承担责任'],
    source: 'https://kitsu.io/characters/renji-togashi',
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
