import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  28357: {
    traits: ['“魔女狩猎”组织在日本的主要成员', '在组织中被称作大月教授', '“魔女狩猎”是国际性的神秘学研究组织', '组织成员热衷研究神秘现象', '组织从魔法角度调查六轩岛惨案', '负责组织在日本的活动', '组织行动不受六轩岛幸存者欢迎', '相关活动曾引发不利的报刊报道', '组织名称借用了同名英文游戏翻译团队的名称'],
    source: 'https://kitsu.io/characters/professor-ootsuki',
  },
  42129: {
    traits: ['在索维尔帝国失窃珍宝案结束后登场', '帮助孤儿路易吉重返学校', '为路易吉支付学费', '后来到访圣玛格丽特学园', '曾向学园图书馆捐赠书籍', '是格雷维尔·德·布洛瓦爱慕的对象', '卷入一起谋杀案件', '格雷维尔为她洗清嫌疑时答应舍弃标志性的钻头发型', '案件解决后与西涅莱结婚'],
    source: 'https://kitsu.io/characters/jacqueline-de-signore',
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
  db.from('characters').select('id,name,anime_title,nicknames,traits').in('id', ids),
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
  return { id, traits, search_text: [row.name, row.anime_title, ...(row.nicknames || []), ...traits, ...(actorsById.get(id) || [])].join(' ') }
})
for (const payload of payloads) {
  const { error } = await db.from('characters').update({ traits: payload.traits, search_text: payload.search_text }).eq('id', payload.id)
  if (error) throw new Error(`角色 ${payload.id} 写入失败：${error.message}`)
}

const readback = await db.from('characters').select('id,traits,search_text').in('id', ids)
if (readback.error) throw readback.error
const savedById = new Map((readback.data || []).map((row) => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const payload of payloads) {
  const saved = savedById.get(payload.id)
  if (JSON.stringify(saved.traits) !== JSON.stringify(payload.traits) || saved.search_text !== payload.search_text || saved.search_text.includes(fullById.get(payload.id).description)) throw new Error(`角色 ${payload.id} 回读校验失败`)
  fullById.get(payload.id).traits = saved.traits
  fullById.get(payload.id).search_text = saved.search_text
  slimById.get(payload.id).traits = saved.traits
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
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const evidence = {
  correctedAt: new Date().toISOString(),
  count: ids.length,
  ids,
  sources: Object.fromEntries(ids.map((id) => [id, updates[id].source])),
  supabaseReadbackVerified: true,
  searchIndexVerifiedForAllIds: true,
  introExcludedFromSearch: true,
}
fs.writeFileSync(`${root}/followup-traits-round8.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
