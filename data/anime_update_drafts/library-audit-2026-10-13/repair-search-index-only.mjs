import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const ids = [23766, 32447, 33933, 33934, 35362, 35503, 35504, 35505, 43511]
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byId = new Map(local.map((row) => [Number(row.id), row]))
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw charactersResult.error
if (actorsResult.error) throw actorsResult.error
const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 条，停止写入`)
const actorNames = new Map()
for (const actor of actorsResult.data || []) {
  const names = actorNames.get(Number(actor.character_id)) || []
  names.push(actor.name)
  actorNames.set(Number(actor.character_id), names)
}

const repairs = []
for (const id of ids) {
  const localRow = byId.get(id)
  const remote = remoteById.get(id)
  if (!localRow || ['name', 'anime_title', 'nicknames', 'traits', 'description'].some((key) => JSON.stringify(localRow[key] ?? null) !== JSON.stringify(remote[key] ?? null))) {
    throw new Error(`角色 ${id} 的角色资料不一致，停止索引修复`)
  }
  const expected = [remote.name, remote.anime_title, ...(remote.nicknames || []), ...(remote.traits || []), ...(actorNames.get(id) || [])].join(' ')
  if (localRow.search_text !== expected) throw new Error(`角色 ${id} 的本地 search_text 与标准索引不符，停止写入`)
  if (remote.search_text !== expected) repairs.push({ id, search_text: expected })
}

for (const repair of repairs) {
  const { error } = await db.from('characters').update({ search_text: repair.search_text }).eq('id', repair.id)
  if (error) throw new Error(`角色 ${repair.id} 索引写入失败：${error.message}`)
}

const readback = await db.from('characters').select('id,search_text,description').in('id', ids)
if (readback.error) throw readback.error
const savedById = new Map((readback.data || []).map((row) => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const id of ids) {
  const row = byId.get(id)
  const saved = savedById.get(id)
  const expected = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorNames.get(id) || [])].join(' ')
  if (saved.search_text !== expected || saved.search_text.includes(saved.description)) throw new Error(`角色 ${id} 索引回读校验失败`)
  row.search_text = saved.search_text
}
fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))

for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = ids.filter((id) => (report.checkedIds || []).map(Number).includes(id))
  if (!batchIds.length) continue
  report.localFollowup ||= {}
  report.localFollowup.indexOnlyCorrections ||= {}
  for (const id of batchIds) report.localFollowup.indexOnlyCorrections[id] = { formulaVerified: true, descriptionExcluded: true, readbackVerified: true }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const result = {
  repairedCount: repairs.length,
  repairedIds: repairs.map(({ id }) => id),
  searchedFields: ['name', 'anime_title', 'nicknames', 'traits', 'voice_actors'],
  descriptionExcluded: true,
  readbackVerified: true,
}
fs.writeFileSync(`${root}/followup-search-index-repair.json`, JSON.stringify(result, null, 2))
console.log(JSON.stringify(result, null, 2))
