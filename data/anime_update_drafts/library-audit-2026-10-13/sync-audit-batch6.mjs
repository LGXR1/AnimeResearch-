import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const report = JSON.parse(fs.readFileSync(`${root}/batch6-audit-report.json`, 'utf8'))
const batchIds = [...new Set([1355, ...report.checkedIds])]
const localById = new Map(local.map((row) => [Number(row.id), row]))
const rows = batchIds.map((id) => localById.get(id))
if (rows.some((row) => !row)) throw new Error('本地导出缺少待同步角色')
const oldNames = new Map([[1817, '間柴了'], [1818, '間柴久美']])
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const [charactersResult, voiceActorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title').in('id', batchIds),
  db.from('voice_actors').select('character_id,name').in('character_id', batchIds),
])
if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
if (voiceActorsResult.error) throw new Error(`读取声优失败：${voiceActorsResult.error.message}`)
const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
if (remoteById.size !== batchIds.length) throw new Error(`Supabase 返回 ${remoteById.size}/${batchIds.length} 位角色，停止写入`)
for (const row of rows) {
  const id = Number(row.id)
  const remote = remoteById.get(id)
  const allowedName = oldNames.get(id)
  if (remote.anime_title !== row.anime_title || (remote.name !== row.name && remote.name !== allowedName)) {
    throw new Error(`角色 ${id} 的数据库原值与本地导出不符，停止写入`)
  }
}

const actorsByCharacter = new Map()
for (const actor of voiceActorsResult.data || []) {
  const id = Number(actor.character_id)
  const list = actorsByCharacter.get(id) || []
  list.push(actor.name)
  actorsByCharacter.set(id, list)
}
for (const row of rows) {
  const id = Number(row.id)
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorsByCharacter.get(id) || [])].join(' ')
  const payload = {
    name: row.name,
    nicknames: row.nicknames || [],
    traits: row.traits || [],
    description: row.description,
    search_text: row.search_text,
  }
  const { error } = await db.from('characters').update(payload).eq('id', id)
  if (error) throw new Error(`写入角色 ${id} 失败：${error.message}`)
}

const readbackResult = await db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', batchIds)
if (readbackResult.error) throw new Error(`回读角色失败：${readbackResult.error.message}`)
const readback = new Map((readbackResult.data || []).map((row) => [Number(row.id), row]))
if (readback.size !== batchIds.length) throw new Error(`Supabase 回读 ${readback.size}/${batchIds.length} 位角色`)
for (const row of rows) {
  const id = Number(row.id)
  const saved = readback.get(id)
  for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) {
    if (JSON.stringify(saved[key]) !== JSON.stringify(row[key])) throw new Error(`角色 ${id} 的 ${key} 回读不一致`)
  }
  const expectedSearch = [saved.name, saved.anime_title, ...(saved.nicknames || []), ...(saved.traits || []), ...(actorsByCharacter.get(id) || [])].join(' ')
  if (saved.search_text !== expectedSearch || saved.search_text.includes(saved.description)) throw new Error(`角色 ${id} 的 search_text 回读校验失败`)
  row.search_text = saved.search_text
}
fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
report.databaseSync = { syncedAt: new Date().toISOString(), syncedCount: batchIds.length, readbackVerified: true, searchTextExcludesDescription: true }
report.note = '本地导出及 Supabase 均已更新并回读；31 位缺少 AniList 快照的角色仍待来源核对。'
fs.writeFileSync(`${root}/batch6-audit-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ syncedCount: batchIds.length, readbackVerified: true, modifiedIds: report.modifiedIds, reportPath: `${root}/batch6-audit-report.json` }, null, 2))
