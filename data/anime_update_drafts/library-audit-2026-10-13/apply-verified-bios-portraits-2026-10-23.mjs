import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const bios = JSON.parse(fs.readFileSync(`${dir}/short-bio-candidates-batch1.json`, 'utf8'))
const portraits = JSON.parse(fs.readFileSync(`${dir}/voice-portrait-verified-candidates-2026-10-22.json`, 'utf8')).verified
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const profiles = JSON.parse(fs.readFileSync(`${dir}/anilist-character-profiles.json`, 'utf8')).profiles
const voiceCache = JSON.parse(fs.readFileSync(`${dir}/anilist-voice-media.json`, 'utf8')).characters
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 写入环境变量')
if (bios.length !== 20 || portraits.length !== 70) throw new Error('审核清单数量改变，停止写入')

const localById = new Map(local.map(row => [Number(row.id), row]))
const chars = new Map()
const actors = new Map()
for (const item of bios) {
  const old = localById.get(Number(item.id))
  if (!old || !profiles[item.id]?.description || item.source !== `https://anilist.co/character/${item.id}`) throw new Error(`简介来源或身份不符：${item.id}`)
  if (old.description.length >= 100 || item.description.length < 100 || item.description.length > 200) throw new Error(`简介长度不符：${item.id}`)
  if (old.description === item.description) throw new Error(`简介无变化：${item.id}`)
}
for (const item of portraits) {
  const old = localById.get(Number(item.character_id))
  const actor = old?.voice_actors?.find(row => Number(row.id) === Number(item.actor_id))
  const matched = voiceCache[item.character_id]?.media?.edges?.some(edge =>
    Number(edge.node?.id) === Number(item.anime_id) &&
    edge.node?.countryOfOrigin === 'JP' &&
    edge.voiceActors?.some(staff => Number(staff.id) === Number(item.staff_id) && staff.image?.large === item.url)
  )
  if (!old || !actor || actor.name !== item.name || actor.image || !matched ||
      !new RegExp(`/n${item.staff_id}-[A-Za-z0-9]+\\.(png|jpg|jpeg)$`).test(item.url)) {
    throw new Error(`声优头像来源或身份不符：${item.actor_id}`)
  }
}

async function readByIds(table, ids, fields) {
  const rows = []
  for (let i = 0; i < ids.length; i += 100) {
    const { data, error } = await client.from(table).select(fields).in('id', ids.slice(i, i + 100))
    if (error) throw error
    rows.push(...data)
  }
  return new Map(rows.map(row => [Number(row.id), row]))
}

const currentChars = await readByIds('characters', bios.map(item => item.id), 'id,name,description,anime_title,nicknames,traits,search_text')
const currentActors = await readByIds('voice_actors', portraits.map(item => item.actor_id), 'id,name,image,character_id')
for (const item of bios) {
  const old = localById.get(Number(item.id))
  const current = currentChars.get(Number(item.id))
  if (!current || current.name !== old.name || current.anime_title !== old.anime_title ||
      current.description !== old.description || JSON.stringify(current.nicknames || []) !== JSON.stringify(old.nicknames || []) ||
      JSON.stringify(current.traits || []) !== JSON.stringify(old.traits || [])) throw new Error(`线上简介已变化：${item.id}`)
}
for (const item of portraits) {
  const current = currentActors.get(Number(item.actor_id))
  if (!current || current.name !== item.name || Number(current.character_id) !== Number(item.character_id) || current.image) {
    throw new Error(`线上声优记录已变化：${item.actor_id}`)
  }
}

const backupPath = `${dir}/bio-portrait-before-2026-10-23.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), characters: [...currentChars.values()], voice_actors: [...currentActors.values()] }, null, 2))

const result = { startedAt: new Date().toISOString(), backupPath, bios: [], portraits: [] }
const reportPath = `${dir}/bio-portrait-apply-2026-10-23.json`
function save() { fs.writeFileSync(reportPath, JSON.stringify(result, null, 2)) }
save()

for (const item of bios) {
  const old = currentChars.get(Number(item.id))
  const actorNames = (localById.get(Number(item.id)).voice_actors || []).map(v => v.name)
  const searchText = [old.name, old.anime_title, ...(old.nicknames || []), ...(old.traits || []), ...actorNames].join(' ')
  const { data, error } = await client.from('characters')
    .update({ description: item.description, search_text: searchText })
    .eq('id', item.id).eq('description', old.description)
    .select('id,name,description,search_text').single()
  if (error || !data || data.description !== item.description || data.search_text !== searchText) throw new Error(`简介写入或回读失败：${item.id} ${error?.message || ''}`)
  result.bios.push({ id: item.id, name: data.name, oldLength: old.description.length, newLength: data.description.length })
  save()
}

for (const item of portraits) {
  const { data, error } = await client.from('voice_actors')
    .update({ image: item.url })
    .eq('id', item.actor_id).eq('name', item.name).eq('character_id', item.character_id).eq('image', '')
    .select('id,name,image,character_id').single()
  if (error || !data || data.image !== item.url || Number(data.character_id) !== Number(item.character_id)) {
    throw new Error(`声优头像写入或回读失败：${item.actor_id} ${error?.message || ''}`)
  }
  result.portraits.push({ actor_id: item.actor_id, character_id: item.character_id, staff_id: item.staff_id })
  save()
}
result.completedAt = new Date().toISOString()
save()
console.log(JSON.stringify({ bios: result.bios.length, portraits: result.portraits.length, reportPath, backupPath }))
