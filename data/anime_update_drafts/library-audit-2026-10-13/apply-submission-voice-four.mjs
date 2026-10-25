import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const media = JSON.parse(fs.readFileSync(`${root}/anilist-voice-media.json`, 'utf8')).characters
const cases = [
  { actorId: 85, characterId: 35258, staffId: 95001, name: '关智一' },
  { actorId: 318, characterId: 68315, staffId: 95001, name: '关智一' },
  { actorId: 120, characterId: 137774, staffId: 95001, name: '关智一' },
  { actorId: 154, characterId: 125884, staffId: 95792, name: '立花慎之介' },
]

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('Missing write credentials')
const { data: oldActors, error: actorError } = await db.from('voice_actors').select('id,name,image,character_id').in('id', cases.map(item => item.actorId))
const { data: oldChars, error: charError } = await db.from('characters').select('id,name,anime_title,nicknames,traits,search_text').in('id', cases.map(item => item.characterId))
if (actorError || charError || oldActors.length !== 4 || oldChars.length !== 4) throw new Error('Preflight read failed')
const updates = []
for (const item of cases) {
  const row = local.find(value => value.id === item.characterId)
  const localActor = row?.voice_actors.find(value => value.id === item.actorId)
  const oldActor = oldActors.find(value => value.id === item.actorId)
  const oldChar = oldChars.find(value => value.id === item.characterId)
  if (!row || !localActor || !oldActor || !oldChar || oldActor.name !== localActor.name
    || oldActor.image !== localActor.image || oldActor.character_id !== item.characterId
    || oldChar.search_text !== row.search_text) throw new Error(`Preflight mismatch: ${item.actorId}`)
  const staff = new Map()
  for (const edge of media[String(item.characterId)]?.media?.edges || []) {
    if (edge.node?.countryOfOrigin !== 'JP') continue
    for (const voiceActor of edge.voiceActors || []) staff.set(voiceActor.id, voiceActor)
  }
  const official = staff.get(item.staffId)
  if (staff.size !== 1 || !official?.image?.large?.includes(`/n${item.staffId}-`)) throw new Error(`Ambiguous AniList staff relation: ${item.actorId}`)
  updates.push({ ...item, image: official.image.large, source: `https://anilist.co/character/${item.characterId}` })
}
fs.writeFileSync(`${root}/submission-voice-four-backup.json`, JSON.stringify({ capturedAt: new Date().toISOString(), voice_actors: oldActors, characters: oldChars }, null, 2))
for (const item of updates) {
  const { error } = await db.from('voice_actors').update({ name: item.name, image: item.image }).eq('id', item.actorId)
  if (error) throw new Error(`Actor write failed: ${item.actorId}: ${error.message}`)
}
const takizawa = local.find(row => row.id === 125884)
const search_text = [takizawa.name, takizawa.anime_title, ...takizawa.nicknames, ...takizawa.traits, '立花慎之介'].join(' ')
if (search_text.includes(takizawa.description)) throw new Error('Description entered search')
const { error: searchError } = await db.from('characters').update({ search_text }).eq('id', 125884)
if (searchError) throw new Error(`Search update failed: ${searchError.message}`)
const { data: actorsAfter, error: verifyActorError } = await db.from('voice_actors').select('id,name,image').in('id', cases.map(item => item.actorId))
const { data: charsAfter, error: verifyCharError } = await db.from('characters').select('id,search_text').eq('id', 125884)
if (verifyActorError || verifyCharError || charsAfter?.[0]?.search_text !== search_text) throw new Error('Readback failed')
for (const item of updates) {
  const actual = actorsAfter.find(row => row.id === item.actorId)
  if (!actual || actual.name !== item.name || actual.image !== item.image) throw new Error(`Actor readback mismatch: ${item.actorId}`)
}
fs.writeFileSync(`${root}/submission-voice-four-report.json`, JSON.stringify({ syncedAt: new Date().toISOString(), verified: updates.map(({ actorId, characterId, staffId, source }) => ({ actorId, characterId, staffId, source })) }, null, 2))
console.log(JSON.stringify({ verifiedVoiceActors: 4, correctedVoiceName: 1, correctedWrongPortrait: 1, addedPortraits: 2 }))
