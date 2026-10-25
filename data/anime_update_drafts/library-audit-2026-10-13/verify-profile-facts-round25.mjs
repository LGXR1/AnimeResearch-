import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const ids = [239687, 231851, 231853, 244317]
const byId = new Map(full.map(row => [Number(row.id), row]))
const searchText = row => [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
const { data: rows, error } = await supabase.from('characters').select('id,name,anime_title,description,nicknames,traits,search_text').in('id', ids)
if (error) throw new Error(`读取角色失败：${error.message}`)
const remoteById = new Map((rows || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`返回 ${remoteById.size}/${ids.length} 条角色`)
const searchChecks = []
for (const id of ids) {
  const local = byId.get(id)
  const remote = remoteById.get(id)
  if (!local || local.description.length < 100 || local.description.length > 200 || local.traits.length < 8) throw new Error(`本地字段长度不合格：${id}`)
  if (remote.name !== local.name || remote.anime_title !== local.anime_title || remote.description !== local.description
    || JSON.stringify(remote.nicknames || []) !== JSON.stringify(local.nicknames || [])
    || JSON.stringify(remote.traits || []) !== JSON.stringify(local.traits || [])
    || remote.search_text !== searchText(local) || remote.search_text.includes(local.description)) throw new Error(`本地与云端不一致：${id}`)
  for (const [kind, term] of [['name', local.name], ['alias', local.nicknames[0]], ['trait', local.traits[0]]]) {
    const result = await supabase.from('characters').select('id').eq('id', id).ilike('search_text', `%${term}%`)
    if (result.error) throw new Error(`搜索 ${id}/${kind} 失败：${result.error.message}`)
    if (!(result.data || []).some(row => Number(row.id) === id)) throw new Error(`搜索 ${id}/${kind} 未命中`)
    searchChecks.push({ id, kind })
  }
}
const actors = ids.flatMap(id => (byId.get(id).voice_actors || []).map(actor => ({ id: Number(actor.id), name: actor.name, characterId: id })))
const { data: voiceRows, error: voiceError } = await supabase.from('voice_actors').select('id,name,character_id').in('id', actors.map(actor => actor.id))
if (voiceError) throw new Error(`读取声优失败：${voiceError.message}`)
const voiceById = new Map((voiceRows || []).map(row => [Number(row.id), row]))
for (const actor of actors) {
  const row = voiceById.get(actor.id)
  if (!row || row.name !== actor.name || Number(row.character_id) !== actor.characterId) throw new Error(`声优关联不一致：${actor.id}`)
}
for (const batch of [101, 102]) {
  const report = JSON.parse(fs.readFileSync(`${root}/batch${batch}-audit-report.json`, 'utf8'))
  for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds']) {
    if ((report[key] || []).map(Number).some(id => ids.includes(id))) throw new Error(`第${batch}批仍残留待核项：${key}`)
  }
}
const sitemapCount = [...fs.readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>/g)].length
if (sitemapCount !== 12666) throw new Error(`站点地图数量异常：${sitemapCount}`)
console.log(JSON.stringify({ verifiedCharacters: ids.length, verifiedVoiceActorRelations: actors.length, searchQueriesPassed: searchChecks.length, sitemapUrls: sitemapCount }, null, 2))
