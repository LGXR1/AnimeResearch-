import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const reportBatches = [100, 104, 114]
const ids = [222104, 222105, 222106, 222107, 253609, 253611, 306616, 306618]
const oldNames = new Map([
  [222104, '藤井佳奈'], [222105, '五城玲美'], [222106, '森岛響'], [222107, '矢薙索尼娅'],
  [253609, '圣舞理王'], [253611, '青天国春'], [306616, '安和すばる'], [306618, '河原木桃香'],
])
const localById = new Map(full.map(row => [Number(row.id), row]))
const searchText = row => [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
for (const id of ids) {
  const row = localById.get(id)
  if (!row || row.search_text !== searchText(row) || row.search_text.includes(row.description)) throw new Error(`本地资料或搜索索引校验失败：${id}`)
}

const { data: remoteRows, error: readError } = await supabase.from('characters')
  .select('id,name,anime_title,description,nicknames,traits,search_text').in('id', ids)
if (readError) throw new Error(`读取 Supabase 角色失败：${readError.message}`)
const remoteById = new Map((remoteRows || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 条角色记录`)

const actorPairs = ids.flatMap(id => (localById.get(id).voice_actors || []).map(actor => ({
  id: Number(actor.id), characterId: id, name: actor.name,
})))
const { data: actorRows, error: actorReadError } = await supabase.from('voice_actors')
  .select('id,name,character_id').in('id', actorPairs.map(actor => actor.id))
if (actorReadError) throw new Error(`读取 Supabase 声优关系失败：${actorReadError.message}`)
const actorById = new Map((actorRows || []).map(row => [Number(row.id), row]))
for (const actor of actorPairs) {
  const remote = actorById.get(actor.id)
  if (!remote || remote.name !== actor.name || Number(remote.character_id) !== actor.characterId) {
    throw new Error(`声优关系与本地 AniList 结果不一致：${actor.id}/${actor.name}`)
  }
}

const updated = []
for (const id of ids) {
  const local = localById.get(id)
  const remote = remoteById.get(id)
  if (remote.anime_title !== local.anime_title) throw new Error(`角色 ${id} 的作品与云端不一致`)
  if (remote.name !== oldNames.get(id) && remote.name !== local.name) throw new Error(`角色 ${id} 云端名称已变化：${remote.name}`)
  const same = remote.name === local.name
    && remote.description === local.description
    && JSON.stringify(remote.nicknames || []) === JSON.stringify(local.nicknames || [])
    && JSON.stringify(remote.traits || []) === JSON.stringify(local.traits || [])
    && remote.search_text === local.search_text
  if (same) continue
  const { error } = await supabase.from('characters').update({
    name: local.name,
    description: local.description,
    nicknames: local.nicknames,
    traits: local.traits,
    search_text: local.search_text,
  }).eq('id', id)
  if (error) throw new Error(`写入 Supabase 角色 ${id} 失败：${error.message}`)
  updated.push(id)
}

const { data: verified, error: verifyError } = await supabase.from('characters')
  .select('id,name,anime_title,description,nicknames,traits,search_text').in('id', ids)
if (verifyError) throw new Error(`回读 Supabase 角色失败：${verifyError.message}`)
const verifiedById = new Map((verified || []).map(row => [Number(row.id), row]))
for (const id of ids) {
  const local = localById.get(id)
  const remote = verifiedById.get(id)
  if (!remote || remote.name !== local.name || remote.description !== local.description
    || JSON.stringify(remote.nicknames || []) !== JSON.stringify(local.nicknames || [])
    || JSON.stringify(remote.traits || []) !== JSON.stringify(local.traits || [])
    || remote.search_text !== local.search_text) throw new Error(`Supabase 回读校验未通过：${id}`)
}
const syncedAt = new Date().toISOString()
for (const batch of reportBatches) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  report.localFollowup ||= {}
  report.localFollowup.profileIdentityRound24 = {
    ...(report.localFollowup.profileIdentityRound24 || {}),
    syncedAt,
    externalWritePending: false,
    verifiedCharacterIds: ids.filter(id => report.checkedIds.map(Number).includes(id)),
    voiceActorRelationsVerified: actorPairs.filter(actor => report.checkedIds.map(Number).includes(actor.characterId)),
  }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
summary = summary.replace('- Supabase 写入待完成；未提交或推送 Git。', `- Supabase 已同步并回读核对 ${ids.length} 条角色记录；声优关系核对通过。${syncedAt}。未提交或推送 Git。`)
fs.writeFileSync(summaryPath, summary)
fs.writeFileSync(`${root}/profile-identity-round24-sync.json`, JSON.stringify({ syncedAt, updatedCharacterIds: updated, verifiedCharacterIds: ids, verifiedVoiceActorIds: actorPairs.map(actor => actor.id) }, null, 2))
console.log(JSON.stringify({ syncedAt, updatedCharacterIds: updated, verifiedCharacterIds: ids, voiceActorRelationsVerified: actorPairs.length }, null, 2))
