import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const actorId = 505
const characterId = 1555
const staffId = 95081
const query = 'query($id:Int){Staff(id:$id){id name{full native} image{large} characters(page:1,perPage:50){edges{node{id}}}}}'
const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, variables: { id: staffId } }) })
const payload = await response.json()
const staff = payload.data?.Staff
if (!response.ok || staff?.name?.native !== '水樹奈々' || !staff.image?.large?.includes(`/n${staffId}-`) ||
    !staff.characters?.edges?.some(edge => edge.node.id === characterId)) throw new Error('AniList 身份、头像或角色配音关系未核实')
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const { data: actor, error } = await client.from('voice_actors').select('*').eq('id', actorId).single()
if (error || !actor || actor.name !== '水树奈奈' || Number(actor.character_id) !== characterId || actor.image) throw new Error('线上声优记录已变化')
const backupPath = `${dir}/voice-actor-505-before-2026-10-23.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), actor, source: `https://anilist.co/staff/${staffId}`, characterSource: `https://anilist.co/character/${characterId}` }, null, 2))
const { data: updated, error: writeError } = await client.from('voice_actors').update({ image: staff.image.large })
  .eq('id', actorId).eq('character_id', characterId).eq('name', actor.name).eq('image', '')
  .select('*').single()
if (writeError || updated?.image !== staff.image.large) throw new Error(`写入或回读失败：${writeError?.message || ''}`)
console.log(JSON.stringify({ actorId, characterId, staffId, image: updated.image, backupPath }))
