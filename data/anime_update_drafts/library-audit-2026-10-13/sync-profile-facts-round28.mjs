import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const ids = [253608, 253612, 253614]
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const localById = new Map(full.map(row => [Number(row.id), row]))
const searchText = row => [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
for (const id of ids) {
  const row = localById.get(id)
  if (!row || row.search_text !== searchText(row) || row.search_text.includes(row.description)) throw new Error(`本地资料或索引校验失败：${id}`)
}

const columns = 'id,name,anime_title,description,nicknames,traits,search_text'
const { data: remoteRows, error: readError } = await supabase.from('characters').select(columns).in('id', ids)
if (readError) throw new Error(`读取角色失败：${readError.message}`)
const remoteById = new Map((remoteRows || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 条角色`)
const actorPairs = ids.flatMap(id => (localById.get(id).voice_actors || []).map(actor => ({ id: Number(actor.id), name: actor.name, characterId: id })))
const { data: actorRows, error: actorError } = await supabase.from('voice_actors').select('id,name,character_id').in('id', actorPairs.map(actor => actor.id))
if (actorError) throw new Error(`读取声优关系失败：${actorError.message}`)
const actorById = new Map((actorRows || []).map(row => [Number(row.id), row]))
for (const actor of actorPairs) {
  const remote = actorById.get(actor.id)
  if (!remote || remote.name !== actor.name || Number(remote.character_id) !== actor.characterId) throw new Error(`声优关系不一致：${actor.id}`)
}

const updated = []
for (const id of ids) {
  const local = localById.get(id)
  const remote = remoteById.get(id)
  if (remote.name !== local.name || remote.anime_title !== local.anime_title) throw new Error(`云端角色身份变化：${id}`)
  const same = remote.description === local.description
    && JSON.stringify(remote.nicknames || []) === JSON.stringify(local.nicknames || [])
    && JSON.stringify(remote.traits || []) === JSON.stringify(local.traits || [])
    && remote.search_text === local.search_text
  if (same) continue
  const { error } = await supabase.from('characters').update({ description: local.description, nicknames: local.nicknames, traits: local.traits, search_text: local.search_text }).eq('id', id)
  if (error) throw new Error(`写入角色 ${id} 失败：${error.message}`)
  updated.push(id)
}

const { data: verified, error: verifyError } = await supabase.from('characters').select(columns).in('id', ids)
if (verifyError) throw new Error(`回读角色失败：${verifyError.message}`)
const verifiedById = new Map((verified || []).map(row => [Number(row.id), row]))
for (const id of ids) {
  const local = localById.get(id)
  const remote = verifiedById.get(id)
  if (!remote || remote.name !== local.name || remote.description !== local.description
    || JSON.stringify(remote.nicknames || []) !== JSON.stringify(local.nicknames || [])
    || JSON.stringify(remote.traits || []) !== JSON.stringify(local.traits || [])
    || remote.search_text !== local.search_text) throw new Error(`回读校验失败：${id}`)
  const terms = [remote.name, remote.anime_title, ...(remote.nicknames || []), ...(remote.traits || []), ...(local.voice_actors || []).map(actor => actor.name)]
  if (terms.some(term => term && !remote.search_text.includes(term))) throw new Error(`搜索索引缺词：${id}`)
  if (remote.search_text.includes(remote.description)) throw new Error(`简介进入搜索索引：${id}`)
}

const syncedAt = new Date().toISOString()
const reportPath = `${root}/batch104-audit-report.json`
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
report.localFollowup ||= {}
report.localFollowup.profileFactsRound28 = { ...(report.localFollowup.profileFactsRound28 || {}), syncedAt, externalWritePending: false, verifiedCharacterIds: ids, voiceActorRelationsVerified: actorPairs }
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
summary = summary.replace('- Supabase 写入待完成；未提交或推送 Git。', `- Supabase 已同步并回读核对 ${ids.length} 条角色记录、${actorPairs.length} 条声优关系；搜索词条匹配，简介未进入索引。${syncedAt}。未提交或推送 Git。`)
fs.writeFileSync(summaryPath, summary)
fs.writeFileSync(`${root}/profile-facts-round28-sync.json`, JSON.stringify({ syncedAt, updatedCharacterIds: updated, verifiedCharacterIds: ids, verifiedVoiceActorIds: actorPairs.map(actor => actor.id) }, null, 2))
console.log(JSON.stringify({ syncedAt, updatedCharacterIds: updated, verifiedCharacterIds: ids, voiceActorRelationsVerified: actorPairs.length }, null, 2))
