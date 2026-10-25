import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const candidates = JSON.parse(fs.readFileSync(`${dir}/short-bio-height-candidates-2026-10-23.json`, 'utf8'))
const local = new Map(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => [Number(row.id), row]))
const profiles = JSON.parse(fs.readFileSync(`${dir}/anilist-character-profiles.json`, 'utf8')).profiles
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY || candidates.length !== 91) throw new Error('环境或清单数量不符')
const ids = new Set()
for (const item of candidates) {
  const old = local.get(Number(item.id))
  const source = profiles[item.id]
  const match = source?.description?.match(/(?:__)?Height(?:__)?\s*:?\s*(?:__)?\s*(\d{2,3}(?:\.\d)?)\s*cm/i)
  const sentence = `人物资料记载其身高为${item.height}厘米。`
  if (ids.has(item.id) || !old || !match || Number(match[1]) !== Number(item.height) ||
      ![old.name, ...(old.nicknames || [])].some(name => name === source.name.full || name === source.name.native) ||
      item.source !== `https://anilist.co/character/${item.id}` || old.description !== item.oldDescription ||
      item.description !== `${item.oldDescription}${sentence}` || item.description.length < 100 || item.description.length > 200) {
    throw new Error(`身高资料预检失败：${item.id}`)
  }
  ids.add(item.id)
}

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const { data: rows, error } = await client.from('characters').select('id,name,anime_title,description,nicknames,traits,search_text').in('id', [...ids])
if (error || rows?.length !== candidates.length) throw new Error(`无法核对线上原记录：${error?.message || ''}`)
const online = new Map(rows.map(row => [Number(row.id), row]))
const pending = []
for (const item of candidates) {
  const row = online.get(Number(item.id))
  const old = local.get(Number(item.id))
  if (!row || row.name !== old.name || row.anime_title !== old.anime_title ||
      JSON.stringify(row.nicknames || []) !== JSON.stringify(old.nicknames || []) ||
      JSON.stringify(row.traits || []) !== JSON.stringify(old.traits || [])) throw new Error(`线上人物身份已变化：${item.id}`)
  if (row.description === item.oldDescription) pending.push(item)
  else if (row.description !== item.description) throw new Error(`线上简介已变化：${item.id}`)
}
const backupPath = `${dir}/short-bio-heights-before-2026-10-23.json`
const reportPath = `${dir}/short-bio-heights-apply-2026-10-23.json`
if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), characters: rows }, null, 2))
const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : { startedAt: new Date().toISOString(), source: 'AniList character profiles', backupPath, updated: [] }
const save = () => fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
save()
for (const item of pending) {
  const row = online.get(Number(item.id))
  const voiceNames = local.get(Number(item.id)).voice_actors.map(actor => actor.name)
  const searchText = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...voiceNames].join(' ')
  const { data, error: writeError } = await client.from('characters')
    .update({ description: item.description, search_text: searchText })
    .eq('id', item.id).eq('description', item.oldDescription)
    .select('id,description,search_text').single()
  if (writeError || !data || data.description !== item.description || data.search_text !== searchText) throw new Error(`写入或回读失败：${item.id} ${writeError?.message || ''}`)
  report.updated.push({ id: item.id, height: item.height, newLength: data.description.length })
  save()
}
report.completedAt = new Date().toISOString()
save()
console.log(JSON.stringify({ total: candidates.length, newlyUpdated: pending.length, reportPath, backupPath }))
