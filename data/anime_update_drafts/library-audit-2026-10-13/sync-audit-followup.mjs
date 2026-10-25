import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const ids = JSON.parse(fs.readFileSync(`${root}/followup-changed-ids.json`, 'utf8')).map(Number)
const byId = new Map(local.map(row => [Number(row.id), row]))
const rows = ids.map(id => byId.get(id))
if (rows.some(row => !row)) throw new Error('本地导出缺少待同步角色')

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
if (actorsResult.error) throw new Error(`读取声优失败：${actorsResult.error.message}`)
const remoteById = new Map((charactersResult.data || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位待同步角色，停止写入`)
for (const row of rows) {
  const remote = remoteById.get(Number(row.id))
  if (remote.anime_title !== row.anime_title) throw new Error(`角色 ${row.id} 的作品名与 Supabase 不符，停止写入`)
  if (row.id !== 27923 && remote.name !== row.name) throw new Error(`角色 ${row.id} 的姓名与 Supabase 不符，停止写入`)
}

const actorNames = new Map()
for (const actor of actorsResult.data || []) {
  const names = actorNames.get(Number(actor.character_id)) || []
  names.push(actor.name)
  actorNames.set(Number(actor.character_id), names)
}
const payloads = rows.map(row => ({
  row,
  payload: {
    name: row.name,
    nicknames: row.nicknames || [],
    traits: row.traits || [],
    description: row.description,
    search_text: [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorNames.get(Number(row.id)) || [])].join(' '),
  },
}))

const failures = []
let cursor = 0
const workers = Array.from({ length: 6 }, async () => {
  while (cursor < payloads.length) {
    const item = payloads[cursor++]
    const { error } = await db.from('characters').update(item.payload).eq('id', item.row.id)
    if (error) failures.push({ id: item.row.id, message: error.message })
  }
})
await Promise.all(workers)
if (failures.length) throw new Error(`Supabase 有 ${failures.length} 条写入失败：${JSON.stringify(failures.slice(0, 10))}`)

const readbackResult = await db.from('characters')
  .select('id,name,anime_title,nicknames,traits,description,search_text')
  .in('id', ids)
if (readbackResult.error) throw new Error(`回读角色失败：${readbackResult.error.message}`)
const savedById = new Map((readbackResult.data || []).map(row => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const { row, payload } of payloads) {
  const saved = savedById.get(Number(row.id))
  for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) {
    if (JSON.stringify(saved[key]) !== JSON.stringify(payload[key] ?? row[key])) throw new Error(`角色 ${row.id} 的 ${key} 回读不一致`)
  }
  const expectedSearch = [saved.name, saved.anime_title, ...(saved.nicknames || []), ...(saved.traits || []), ...(actorNames.get(Number(row.id)) || [])].join(' ')
  if (saved.search_text !== expectedSearch || saved.search_text.includes(saved.description)) throw new Error(`角色 ${row.id} 的 search_text 回读校验失败`)
  row.search_text = saved.search_text
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
const syncedAt = new Date().toISOString()
const reports = Array.from({ length: 10 }, (_, index) => {
  const batch = index + 25
  const path = `${root}/batch${batch}-audit-report.json`
  return { path, data: JSON.parse(fs.readFileSync(path, 'utf8')) }
})
for (const { path, data } of reports) {
  const batchIds = new Set(data.checkedIds.map(Number))
  const syncedCount = ids.filter(id => batchIds.has(id)).length
  if (syncedCount) {
    data.localFollowup.externalWritePending = false
    data.localFollowup.syncedAt = syncedAt
    data.localFollowup.syncedCount = syncedCount
    data.localFollowup.readbackVerified = true
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}
const summaryPath = `${root}/batch25-34-audit-summary.md`
const summary = fs.readFileSync(summaryPath, 'utf8').replace(
  '- 本次改动尚待同步 Supabase 并逐条回读验证。',
  `- 已将本轮 ${ids.length} 位人物更正同步 Supabase，并逐条回读核验；简介未进入 search_text。同步时间：${syncedAt}。`,
)
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ syncedCount: ids.length, readbackVerified: true, syncedAt }, null, 2))
