import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const ids = [222104, 222105, 222106, 222107, 253609, 253611, 306616, 306618]
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const searchText = row => [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')

const { data: rows, error } = await supabase.from('characters')
  .select('id,name,anime_title,description,nicknames,traits,search_text').in('id', ids)
if (error) throw new Error(`读取角色失败：${error.message}`)
const remoteById = new Map((rows || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`返回 ${remoteById.size}/${ids.length} 条角色`)

const searchChecks = []
for (const id of ids) {
  const local = byId.get(id)
  const slimRow = slimById.get(id)
  const remote = remoteById.get(id)
  if (!local || !slimRow) throw new Error(`导出缺少角色 ${id}`)
  if (remote.name !== local.name || remote.anime_title !== local.anime_title
    || remote.description !== local.description
    || JSON.stringify(remote.nicknames || []) !== JSON.stringify(local.nicknames || [])
    || JSON.stringify(remote.traits || []) !== JSON.stringify(local.traits || [])
    || remote.search_text !== searchText(local) || remote.search_text.includes(local.description)) {
    throw new Error(`角色详情或 search_text 不一致：${id}`)
  }
  if (slimRow.name !== local.name || slimRow.description !== local.description
    || JSON.stringify(slimRow.nicknames || []) !== JSON.stringify(local.nicknames || [])
    || JSON.stringify(slimRow.traits || []) !== JSON.stringify(local.traits || [])
    || slimRow.search_text !== local.search_text) throw new Error(`精简导出不一致：${id}`)
  if (id !== 222105 && (local.description.length < 100 || local.description.length > 200 || local.traits.length < 8)) {
    throw new Error(`角色 ${id} 的简介或特征长度不合规`)
  }
  if (id === 222105 && (local.description.length >= 100 || local.traits.length >= 8)) throw new Error('222105 应保留在资料不足待核状态')
  for (const [kind, term] of [['name', local.name], ['alias', local.nicknames[0]], ['trait', local.traits[0]]]) {
    if (!remote.search_text.includes(term)) throw new Error(`角色 ${id} 的${kind}不在搜索索引`)
    const result = await supabase.from('characters').select('id').eq('id', id).ilike('search_text', `%${term}%`)
    if (result.error) throw new Error(`搜索 ${id}/${kind} 失败：${result.error.message}`)
    if (!(result.data || []).some(row => Number(row.id) === id)) throw new Error(`搜索 ${id}/${kind} 未命中`)
    searchChecks.push({ id, kind, term })
  }
}

const actors = ids.flatMap(id => (byId.get(id).voice_actors || []).map(actor => ({ id: Number(actor.id), name: actor.name, characterId: id })))
const { data: voiceRows, error: voiceError } = await supabase.from('voice_actors')
  .select('id,name,character_id').in('id', actors.map(actor => actor.id))
if (voiceError) throw new Error(`读取声优失败：${voiceError.message}`)
const voiceById = new Map((voiceRows || []).map(row => [Number(row.id), row]))
for (const actor of actors) {
  const row = voiceById.get(actor.id)
  if (!row || row.name !== actor.name || Number(row.character_id) !== actor.characterId) throw new Error(`声优关系不一致：${actor.id}`)
}

const report = JSON.parse(fs.readFileSync(`${root}/batch100-audit-report.json`, 'utf8'))
if (!(report.pendingShortDescriptionIds || []).map(Number).includes(222105)
  || !(report.pendingExactGenericTraitIds || []).map(Number).includes(222105)) throw new Error('222105 的未核状态没有保留')
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
const sitemapCount = [...sitemap.matchAll(/<loc>/g)].length
if (sitemapCount !== 12666) throw new Error(`站点地图 URL 数量异常：${sitemapCount}`)
console.log(JSON.stringify({
  verifiedCharacters: ids.length,
  verifiedVoiceActorRelations: actors.length,
  searchQueriesPassed: searchChecks.length,
  pendingThinSource: [222105],
  sitemapUrls: sitemapCount,
}, null, 2))
