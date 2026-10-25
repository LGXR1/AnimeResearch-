import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const batch = process.argv[2]
if (!/^voice-portrait-curated-batch\d+\.json$/.test(batch || '')) throw new Error('仅接受人工核对的声优头像清单')
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 写入环境变量')
const selected = JSON.parse(fs.readFileSync(`${dir}/${batch}`, 'utf8'))
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const media = JSON.parse(fs.readFileSync(`${dir}/anilist-voice-media.json`, 'utf8')).characters
const actorById = new Map(local.flatMap(character => character.voice_actors.map(actor => [Number(actor.id), { ...actor, character }])))
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const prepared = []
const seen = new Set()
for (const [actorId, staffId, name] of selected) {
  if (seen.has(actorId)) throw new Error(`重复声优记录：${actorId}`)
  seen.add(actorId)
  const old = actorById.get(Number(actorId))
  if (!old || old.image || old.name !== name) throw new Error(`本地声优记录不符：${actorId}`)
  const edges = media[old.character.id]?.media?.edges || []
  const matches = edges.filter(edge => edge.node?.countryOfOrigin === 'JP').flatMap(edge =>
    (edge.voiceActors || []).filter(staff => Number(staff.id) === Number(staffId))
      .map(staff => ({ staff, animeId: edge.node.id }))
  )
  const urls = [...new Set(matches.map(item => item.staff.image?.large).filter(Boolean))]
  const officialHash = new RegExp(`^https://s4\\.anilist\\.co/file/anilistcdn/staff/large/n?${staffId}-[A-Za-z0-9]+\\.(png|jpg|jpeg)$`)
  const officialLegacy = /^https:\/\/s4\.anilist\.co\/file\/anilistcdn\/staff\/large\/\d+\.(png|jpg|jpeg)$/
  if (!matches.length || urls.length !== 1 || !(officialHash.test(urls[0]) || officialLegacy.test(urls[0]))) {
    throw new Error(`AniList 日配关系或官方头像不符：${actorId}`)
  }
  prepared.push({ actorId, characterId: old.character.id, name, staffId, url: urls[0], animeIds: [...new Set(matches.map(item => item.animeId))], staffNative: matches[0].staff.name?.native, staffFull: matches[0].staff.name?.full })
}

const current = []
for (const item of prepared) {
  const { data, error } = await client.from('voice_actors').select('id,name,image,character_id').eq('id', item.actorId).single()
  if (error || !data || data.name !== item.name || Number(data.character_id) !== Number(item.characterId) || data.image) throw new Error(`线上声优记录不符：${item.actorId}`)
  current.push(data)
}
const label = batch.replace('.json', '')
const backupPath = `${dir}/${label}-before.json`
const reportPath = `${dir}/${label}-apply.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), voice_actors: current }, null, 2))
const report = { startedAt: new Date().toISOString(), source: batch, prepared, backupPath, updated: [] }
const save = () => fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
save()
for (const item of prepared) {
  const { data, error } = await client.from('voice_actors').update({ image: item.url })
    .eq('id', item.actorId).eq('name', item.name).eq('character_id', item.characterId).eq('image', '')
    .select('id,name,image,character_id').single()
  if (error || !data || data.image !== item.url) throw new Error(`声优头像写入或回读失败：${item.actorId} ${error?.message || ''}`)
  report.updated.push(item.actorId)
  save()
}
report.completedAt = new Date().toISOString()
save()
console.log(JSON.stringify({ updated: report.updated.length, reportPath, backupPath }))
