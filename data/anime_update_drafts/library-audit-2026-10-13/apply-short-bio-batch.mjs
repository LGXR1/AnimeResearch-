import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const batch = process.argv[2]
if (!/^short-bio-candidates-batch\d+\.json$/.test(batch || '')) throw new Error('仅接受已审核的简介批次文件名')
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 写入环境变量')
const updates = JSON.parse(fs.readFileSync(`${dir}/${batch}`, 'utf8'))
const local = new Map(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => [Number(row.id), row]))
const profiles = JSON.parse(fs.readFileSync(`${dir}/anilist-character-profiles.json`, 'utf8')).profiles
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const current = []
for (const item of updates) {
  const row = local.get(Number(item.id))
  if (!row || !profiles[item.id]?.description || item.source !== `https://anilist.co/character/${item.id}` ||
      row.description.length >= 100 || item.description.length < 100 || item.description.length > 200) {
    throw new Error(`简介预检不通过：${item.id}`)
  }
  const { data, error } = await client.from('characters').select('id,name,anime_title,description,nicknames,traits,search_text').eq('id', item.id).single()
  if (error || !data || data.name !== row.name || data.anime_title !== row.anime_title || data.description !== row.description ||
      JSON.stringify(data.nicknames || []) !== JSON.stringify(row.nicknames || []) ||
      JSON.stringify(data.traits || []) !== JSON.stringify(row.traits || [])) throw new Error(`线上记录已变化：${item.id}`)
  current.push(data)
}

const label = batch.replace('.json', '')
const backupPath = `${dir}/${label}-before.json`
const reportPath = `${dir}/${label}-apply.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), rows: current }, null, 2))
const report = { startedAt: new Date().toISOString(), source: batch, backupPath, updated: [] }
const save = () => fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
save()
for (let i = 0; i < updates.length; i++) {
  const item = updates[i]
  const row = current[i]
  const actorNames = local.get(Number(item.id)).voice_actors.map(actor => actor.name)
  const searchText = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...actorNames].join(' ')
  const { data, error } = await client.from('characters')
    .update({ description: item.description, search_text: searchText })
    .eq('id', item.id).eq('description', row.description)
    .select('id,name,description,search_text').single()
  if (error || !data || data.description !== item.description || data.search_text !== searchText) throw new Error(`写入或回读失败：${item.id} ${error?.message || ''}`)
  report.updated.push({ id: item.id, oldLength: row.description.length, newLength: data.description.length })
  save()
}
report.completedAt = new Date().toISOString()
save()
console.log(JSON.stringify({ updated: report.updated.length, reportPath, backupPath }))
