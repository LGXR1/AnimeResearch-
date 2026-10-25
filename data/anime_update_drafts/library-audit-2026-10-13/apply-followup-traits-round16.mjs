import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  39909: {
    traits: ['是津奈木拓人的亲密朋友', '被诊断患有疾病', '得知自己只剩约一年寿命', '选择积极而耀眼地度过剩余时间', '生活方式显得鲁莽而热烈', '鼓舞拓人前往南十字岛', '促使拓人面对抛弃自己的父亲', '他的经历影响拓人对人生目标的思考'],
    source: 'https://kitsu.io/characters/natsuo-komori',
  },
  38904: {
    traits: ['高中一年级学生', '身材娇小', '常穿袖子过长的衣服', '非常保护百木伦', '会惩罚试图接近伦的人', '常主动找伦的同学西由宇子说话', '与由宇子的初次见面曾造成误会', '珍惜与伦的友谊', '平时与伦、由宇子和渚一起度过校园生活'],
    source: 'https://kitsu.io/characters/tooru-ichii',
  },
  41560: {
    traits: ['优越木星男性军司令官', '机甲驾驶员', '外貌与大豪寺凯相似', '性格与大豪寺凯相似', '是白鸟雪菜的哥哥', '在抚子号上遇见遥ミナト', '遇见遥ミナト后爱上她', '个人感情与军方职责发生冲突', '在木星蜥蜴与地球军的战争中作出选择'],
    description: '白鸟九十九是优越木星男性军的司令官与机甲驾驶员，也是白鸟雪菜的哥哥。他的外貌和性格都与大豪寺凯相似。在抚子号上遇见遥ミナト后，九十九爱上了她，个人感情与军方职责因此发生冲突；他最终需要在木星蜥蜴与地球军的战争中作出选择。',
    source: 'https://kitsu.io/characters/tsukumo-shiratori',
  },
  40962: {
    traits: ['黄色的宠物狐狸', '通常待在戏剧社社长萨莉娜身边', '是“夜间航班”戏剧社的重要成员', '会出现在戏剧社排练中', '在第22话的演出中与萨莉娜自称“我们”', '剧中暗示它和萨莉娜可能并非来自地球', '不会使用人类语言', '以神秘举动参与南十字岛的事件'],
    source: 'https://kitsu.io/characters/fukubuchou',
  },
  41727: {
    traits: ['瑞典战斗机驾驶员', '是容·弗洛伊德的僚机', '参与人类对抗宇宙怪兽的战争', '自己的战机曾发生故障', '出发迎战敌人前驾驶过法子高屋的RX-7', '2032年在Exelion号返回地球途中阵亡', '死于外星无人机袭击', '是一名女性战斗飞行员'],
    source: 'https://kitsu.io/characters/linda-yamamoto',
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
