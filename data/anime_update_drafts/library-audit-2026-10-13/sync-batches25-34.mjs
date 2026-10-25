import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const reports = Array.from({ length: 10 }, (_, index) => {
  const batch = index + 25
  const path = `${root}/batch${batch}-audit-report.json`
  return { batch, path, data: JSON.parse(fs.readFileSync(path, 'utf8')) }
})
const ids = [...new Set(reports.flatMap(({ data }) => data.modifiedIds.map(Number)))].sort((a, b) => a - b)
if (ids.length !== 244) throw new Error(`待同步人数应为244，实际${ids.length}`)
const byId = new Map(local.map(row => [Number(row.id), row]))
const rows = ids.map(id => byId.get(id))
if (rows.some(row => !row)) throw new Error('本地导出缺少待同步角色')
const imageIds = new Set([26192, 29124])
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title,image').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
if (actorsResult.error) throw new Error(`读取声优失败：${actorsResult.error.message}`)
const remoteById = new Map((charactersResult.data || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位待同步角色，停止写入`)
for (const row of rows) {
  const remote = remoteById.get(Number(row.id))
  if (remote.name !== row.name || remote.anime_title !== row.anime_title) throw new Error(`角色 ${row.id} 的远端姓名或动漫名与本地不符，停止写入`)
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const characterId = Number(actor.character_id)
  const names = actorsById.get(characterId) || []
  names.push(actor.name)
  actorsById.set(characterId, names)
}
const payloads = rows.map(row => ({
  row,
  payload: {
    nicknames: row.nicknames || [],
    traits: row.traits || [],
    description: row.description,
    search_text: [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorsById.get(Number(row.id)) || [])].join(' '),
    ...(imageIds.has(Number(row.id)) ? { image: row.image } : {}),
  },
}))

const failures = []
let cursor = 0
const workers = Array.from({ length: 8 }, async () => {
  while (cursor < payloads.length) {
    const current = payloads[cursor++]
    const { error } = await db.from('characters').update(current.payload).eq('id', current.row.id)
    if (error) failures.push({ id: current.row.id, message: error.message })
  }
})
await Promise.all(workers)
if (failures.length) throw new Error(`Supabase 有 ${failures.length} 条写入失败：${JSON.stringify(failures.slice(0, 10))}`)

const readbackResult = await db.from('characters')
  .select('id,name,anime_title,image,nicknames,traits,description,search_text')
  .in('id', ids)
if (readbackResult.error) throw new Error(`回读角色失败：${readbackResult.error.message}`)
const savedById = new Map((readbackResult.data || []).map(row => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const { row, payload } of payloads) {
  const saved = savedById.get(Number(row.id))
  for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) {
    if (JSON.stringify(saved[key]) !== JSON.stringify(row[key])) throw new Error(`角色 ${row.id} 的 ${key} 回读不一致`)
  }
  if (imageIds.has(Number(row.id)) && saved.image !== row.image) throw new Error(`角色 ${row.id} 的头像回读不一致`)
  const expectedSearch = [saved.name, saved.anime_title, ...(saved.nicknames || []), ...(saved.traits || []), ...(actorsById.get(Number(row.id)) || [])].join(' ')
  if (saved.search_text !== expectedSearch || saved.search_text.includes(saved.description)) throw new Error(`角色 ${row.id} 的 search_text 回读校验失败`)
  row.search_text = saved.search_text
}

const syncedAt = new Date().toISOString()
for (const { path, data } of reports) {
  data.databaseSync = {
    syncedAt,
    syncedCount: data.modifiedIds.length,
    readbackVerified: true,
    searchTextExcludesDescription: true,
  }
  data.syncAttempt = { success: true }
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}
fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
const summaryPath = `${root}/batch25-34-audit-summary.md`
const summary = fs.readFileSync(summaryPath, 'utf8').replace(
  '- 当前网络连接中 Node fetch 访问 AniList 与 Supabase 均失败；没有写入或回读 Supabase，网站数据库尚未同步。',
  `- 已将 ${ids.length} 位本轮修改同步到 Supabase，并逐条回读核验；search_text 不含简介。同步时间：${syncedAt}。`,
)
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ syncedCount: ids.length, imageCount: imageIds.size, readbackVerified: true, batches: reports.map(({ batch, data }) => ({ batch, modified: data.modifiedIds.length })) }, null, 2))
