import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const id = 251839
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).find(row => Number(row.id) === id)
const buildSearch = row => [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
if (!local || local.search_text !== buildSearch(local) || local.search_text.includes(local.description)) throw new Error('本地角色或搜索索引校验失败')
const { data: actorRows, error: actorError } = await db.from('voice_actors').select('id,name,character_id').in('id', local.voice_actors.map(actor => Number(actor.id)))
if (actorError) throw new Error(`读取声优关系失败：${actorError.message}`)
for (const actor of local.voice_actors) {
  const remoteActor = (actorRows || []).find(row => Number(row.id) === Number(actor.id))
  if (!remoteActor || remoteActor.name !== actor.name || Number(remoteActor.character_id) !== id) throw new Error(`声优关系不一致：${actor.id}`)
}
const cols = 'id,name,anime_title,description,nicknames,traits,search_text'
const { data: oldRows, error: readError } = await db.from('characters').select(cols).eq('id', id)
if (readError) throw new Error(`读取角色失败：${readError.message}`)
const old = oldRows?.[0]
if (!old || old.name !== local.name || old.anime_title !== local.anime_title) throw new Error('Supabase 角色身份与本地不符')
const { error: writeError } = await db.from('characters').update({ description: local.description, nicknames: local.nicknames, traits: local.traits, search_text: local.search_text }).eq('id', id)
if (writeError) throw new Error(`写入角色失败：${writeError.message}`)
const { data: verifiedRows, error: verifyError } = await db.from('characters').select(cols).eq('id', id)
if (verifyError) throw new Error(`回读角色失败：${verifyError.message}`)
const verified = verifiedRows?.[0]
if (!verified || verified.description !== local.description || verified.search_text !== local.search_text
  || JSON.stringify(verified.nicknames || []) !== JSON.stringify(local.nicknames || [])
  || JSON.stringify(verified.traits || []) !== JSON.stringify(local.traits || [])) throw new Error('Supabase 回读校验失败')
const searchable = [verified.name, verified.anime_title, ...(verified.nicknames || []), ...(verified.traits || []), ...local.voice_actors.map(actor => actor.name)]
if (searchable.some(term => term && !verified.search_text.includes(term))) throw new Error('搜索索引缺少名称、别名、特征或声优')
if (verified.search_text.includes(verified.description)) throw new Error('简介进入搜索索引')

const syncedAt = new Date().toISOString()
const reportPath = `${root}/batch104-audit-report.json`
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
report.localFollowup ||= {}
report.localFollowup.profileFactsRound29 = { ...(report.localFollowup.profileFactsRound29 || {}), syncedAt, externalWritePending: false, verifiedCharacterIds: [id], voiceActorRelationsVerified: local.voice_actors.map(actor => ({ id: Number(actor.id), name: actor.name, characterId: id })) }
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
summary = summary.replace('- Supabase 写入待完成；未提交或推送 Git。', `- Supabase 已同步并回读核对角色详情、别名、特征和声优关系；搜索词条匹配，简介未入索引。${syncedAt}。未提交或推送 Git。`)
fs.writeFileSync(summaryPath, summary)
fs.writeFileSync(`${root}/profile-facts-round29-sync.json`, JSON.stringify({ syncedAt, updatedCharacterIds: [id], verifiedCharacterIds: [id], verifiedVoiceActorIds: local.voice_actors.map(actor => Number(actor.id)) }, null, 2))
console.log(JSON.stringify({ syncedAt, updatedCharacterIds: [id], verifiedCharacterIds: [id], verifiedVoiceActorRelations: local.voice_actors.length }, null, 2))
