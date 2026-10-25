import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const proof = JSON.parse(fs.readFileSync(`${dir}/chinese-voice-portrait-verified-2026-10-23.json`, 'utf8'))
const selected = proof.verified
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY || selected.length !== 12 || proof.held.length) throw new Error('环境或核对清单不符')
const local = new Map(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).flatMap(character => character.voice_actors.map(actor => [actor.id, { ...actor, characterId: character.id }])))
for (const item of selected) {
  const old = local.get(item.actorId)
  if (!old || old.name !== item.name || Number(old.characterId) !== Number(item.characterId) || old.image ||
      item.sourceStaff !== `https://anilist.co/staff/${item.staffId}` ||
      item.sourceCharacter !== `https://anilist.co/character/${item.characterId}` ||
      !new RegExp(`^https://s4\\.anilist\\.co/file/anilistcdn/staff/large/n${item.staffId}-[A-Za-z0-9]+\\.(png|jpg|jpeg)$`).test(item.url)) {
    throw new Error(`声优头像身份或来源不符：${item.actorId}`)
  }
}

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const { data: rows, error } = await client.from('voice_actors').select('*').in('id', selected.map(item => item.actorId))
if (error || rows?.length !== selected.length) throw new Error(`无法核对线上声优：${error?.message || ''}`)
const current = new Map(rows.map(row => [Number(row.id), row]))
for (const item of selected) {
  const row = current.get(Number(item.actorId))
  if (!row || row.name !== item.name || Number(row.character_id) !== Number(item.characterId) || row.image) throw new Error(`线上声优已变化：${item.actorId}`)
}
const backupPath = `${dir}/chinese-voice-portraits-before-2026-10-23.json`
const reportPath = `${dir}/chinese-voice-portraits-apply-2026-10-23.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), voice_actors: rows }, null, 2))
const report = { startedAt: new Date().toISOString(), proofFile: 'chinese-voice-portrait-verified-2026-10-23.json', backupPath, updated: [] }
const save = () => fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
save()
for (const item of selected) {
  const old = current.get(Number(item.actorId))
  let query = client.from('voice_actors').update({ image: item.url })
    .eq('id', item.actorId).eq('name', item.name).eq('character_id', item.characterId)
  query = old.image === null ? query.is('image', null) : query.eq('image', '')
  const { data, error: writeError } = await query.select('id,name,image,character_id').single()
  if (writeError || !data || data.image !== item.url || data.name !== item.name) throw new Error(`写入或回读失败：${item.actorId} ${writeError?.message || ''}`)
  report.updated.push(item.actorId)
  save()
}
report.completedAt = new Date().toISOString()
save()
console.log(JSON.stringify({ updated: report.updated.length, reportPath, backupPath }))
