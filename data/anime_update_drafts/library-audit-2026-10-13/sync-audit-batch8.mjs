import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const report = JSON.parse(fs.readFileSync(`${root}/batch8-audit-report.json`, 'utf8'))
const batchIds = [...new Set(report.modifiedIds.map(Number))]
const localById = new Map(local.map((row) => [Number(row.id), row]))
const rows = batchIds.map((id) => localById.get(id))
if (rows.some((row) => !row)) throw new Error('本地导出缺少待同步角色')
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
  const remote = remoteById.get(Number(row.id))
  if (remote.name !== row.name || remote.anime_title !== row.anime_title) throw new Error(`角色 ${row.id} 的数据库原值与本地导出不符，停止写入`)
}

const actorsByCharacter = new Map()
for (const actor of voiceActorsResult.data || []) {
  const id = Number(actor.character_id)
  const list = actorsByCharacter.get(id) || []
  list.push(actor.name)
  actorsByCharacter.set(id, list)
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
const readback = new Map((readbackResult.data || []).map((row) => [Number(row.id), row]))
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
fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
report.databaseSync = { syncedAt: new Date().toISOString(), syncedCount: batchIds.length, readbackVerified: true, searchTextExcludesDescription: true }
report.note = '本批100位均逐项审阅，37位已按缓存资料或可确认的作品信息修正，并同步至Supabase回读验证；83位有本地AniList快照，17位及12位含发色/瞳色的记录仍待外部或目视复核。'
fs.writeFileSync(`${root}/batch8-audit-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ syncedCount: batchIds.length, readbackVerified: true, modifiedIds: report.modifiedIds, reportPath: `${root}/batch8-audit-report.json` }, null, 2))
