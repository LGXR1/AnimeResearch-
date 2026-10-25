import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const reports = Array.from({ length: 10 }, (_, index) => {
  const batch = index + 15
  const path = `${root}/batch${batch}-audit-report.json`
  return { batch, path, data: JSON.parse(fs.readFileSync(path, 'utf8')) }
})
const batchIds = [...new Set(reports.flatMap(({ data }) => data.modifiedIds.map(Number)))].sort((a, b) => a - b)
if (batchIds.length !== 255) throw new Error(`待同步人数应为255，实际${batchIds.length}`)
const localById = new Map(local.map(row => [Number(row.id), row]))
const rows = batchIds.map(id => localById.get(id))
if (rows.some(row => !row)) throw new Error('本地导出缺少待同步角色')
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const [charactersResult, voiceActorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title').in('id', batchIds),
  db.from('voice_actors').select('character_id,name').in('character_id', batchIds),
])
if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
if (voiceActorsResult.error) throw new Error(`读取声优失败：${voiceActorsResult.error.message}`)
const remoteById = new Map((charactersResult.data || []).map(row => [Number(row.id), row]))
if (remoteById.size !== batchIds.length) throw new Error(`Supabase 返回 ${remoteById.size}/${batchIds.length} 位角色，停止写入`)
for (const row of rows) {
  const remote = remoteById.get(Number(row.id))
  if (remote.name !== row.name || remote.anime_title !== row.anime_title) throw new Error(`角色 ${row.id} 的数据库原值与本地导出不符，停止写入`)
}

const actorsByCharacter = new Map()
for (const actor of voiceActorsResult.data || []) {
  const id = Number(actor.character_id)
  const actors = actorsByCharacter.get(id) || []
  actors.push(actor.name)
  actorsByCharacter.set(id, actors)
}
for (const row of rows) {
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorsByCharacter.get(Number(row.id)) || [])].join(' ')
  const { error } = await db.from('characters').update({
    nicknames: row.nicknames || [],
    traits: row.traits || [],
    description: row.description,
    search_text: row.search_text,
  }).eq('id', row.id)
  if (error) throw new Error(`写入角色 ${row.id} 失败：${error.message}`)
}

const readbackResult = await db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', batchIds)
if (readbackResult.error) throw new Error(`回读角色失败：${readbackResult.error.message}`)
const readback = new Map((readbackResult.data || []).map(row => [Number(row.id), row]))
if (readback.size !== batchIds.length) throw new Error(`Supabase 回读 ${readback.size}/${batchIds.length} 位角色`)
for (const row of rows) {
  const saved = readback.get(Number(row.id))
  for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) {
    if (JSON.stringify(saved[key]) !== JSON.stringify(row[key])) throw new Error(`角色 ${row.id} 的 ${key} 回读不一致`)
  }
  const expectedSearch = [saved.name, saved.anime_title, ...(saved.nicknames || []), ...(saved.traits || []), ...(actorsByCharacter.get(Number(row.id)) || [])].join(' ')
  if (saved.search_text !== expectedSearch || saved.search_text.includes(saved.description)) throw new Error(`角色 ${row.id} 的 search_text 回读校验失败`)
  row.search_text = saved.search_text
}

fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
for (const { path, data } of reports) {
  data.databaseSync = { syncedAt: new Date().toISOString(), syncedCount: data.modifiedIds.length, readbackVerified: true, searchTextExcludesDescription: true }
  data.syncAttempt = { success: true }
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}
const summaryPath = `${root}/batch15-24-audit-summary.md`
const summary = fs.readFileSync(summaryPath, 'utf8').replace('- 未提交 Git，也未同步 Supabase。', '- 已将 253 位修改同步至 Supabase 并逐条回读核验；未提交 Git。')
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ syncedCount: batchIds.length, readbackVerified: true, batches: reports.map(({ batch, data }) => ({ batch, count: data.modifiedIds.length })) }, null, 2))
