import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error('Missing Supabase write credentials')
}

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
})
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const characterFields = ['id', 'name', 'image', 'description', 'anime_title', 'nicknames', 'traits', 'search_text']
const actorFields = ['id', 'name', 'image', 'language', 'character_id']
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const chunks = (rows, size) => Array.from({ length: Math.ceil(rows.length / size) }, (_, i) => rows.slice(i * size, (i + 1) * size))

async function fetchAll(table, fields) {
  const rows = []
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.from(table).select(fields.join(',')).order('id').range(offset, offset + 999)
    if (error) throw new Error(`${table} fetch at ${offset}: ${error.message}`)
    rows.push(...data)
    if (data.length < 1000) return rows
  }
}

const [remoteCharacters, remoteActors] = await Promise.all([
  fetchAll('characters', characterFields),
  fetchAll('voice_actors', actorFields),
])
if (remoteCharacters.length !== local.length) throw new Error('Character count changed; aborting')
const remoteCharacterById = new Map(remoteCharacters.map(row => [row.id, row]))
const remoteActorById = new Map(remoteActors.map(row => [row.id, row]))
const remoteActorsByCharacter = new Map()
for (const actor of remoteActors) {
  const list = remoteActorsByCharacter.get(actor.character_id) || []
  list.push(actor)
  remoteActorsByCharacter.set(actor.character_id, list)
}

for (const row of local) {
  const remote = remoteCharacterById.get(row.id)
  if (!remote || remote.anime_title !== row.anime_title) throw new Error(`Character identity mismatch: ${row.id}`)
  if (remote.name !== row.name && row.id !== 86031) throw new Error(`Unexpected character name change: ${row.id}`)
  for (const actor of row.voice_actors || []) {
    if (actor.id == null) {
      const candidates = remoteActorsByCharacter.get(row.id) || []
      if (row.id !== 86031 || candidates.length !== 1 || candidates[0].id !== 149) {
        throw new Error(`Ambiguous actor identity: ${row.id}`)
      }
      actor.id = candidates[0].id
    }
    const current = remoteActorById.get(actor.id)
    if (!current || current.character_id !== row.id) throw new Error(`Actor identity mismatch: ${actor.id}`)
    if (current.name !== actor.name && current.name !== actor.name.trim() && row.id !== 86031) {
      throw new Error(`Unexpected actor name change: ${actor.id}`)
    }
    actor.name = actor.name.trim()
  }
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.description && row.search_text.includes(row.description)) throw new Error(`Description in search: ${row.id}`)
}

const changedCharacters = local
  .map(row => Object.fromEntries(characterFields.map(field => [field, row[field]])))
  .filter(row => characterFields.some(field => !same(row[field], remoteCharacterById.get(row.id)[field])))
const changedActors = local.flatMap(row => row.voice_actors || [])
  .map(row => Object.fromEntries(actorFields.map(field => [field, row[field]])))
  .filter(row => actorFields.some(field => !same(row[field], remoteActorById.get(row.id)[field])))

const backup = {
  capturedAt: new Date().toISOString(),
  characters: changedCharacters.map(row => remoteCharacterById.get(row.id)),
  voice_actors: changedActors.map(row => remoteActorById.get(row.id)),
}
fs.writeFileSync(`${root}/submission-pre-sync-backup.json`, JSON.stringify(backup, null, 2))
console.log(JSON.stringify({ phase: 'preflight', changedCharacters: changedCharacters.length, changedActors: changedActors.length, backupSaved: true }))

async function upsertAndVerify(table, rows, fields) {
  for (const [index, part] of chunks(rows, 50).entries()) {
    const { error } = await db.from(table).upsert(part, { onConflict: 'id' })
    if (error) throw new Error(`${table} write batch ${index + 1}: ${error.message}`)
    const { data, error: readError } = await db.from(table).select(fields.join(',')).in('id', part.map(row => row.id))
    if (readError) throw new Error(`${table} readback batch ${index + 1}: ${readError.message}`)
    const byId = new Map(data.map(row => [row.id, row]))
    for (const expected of part) {
      const actual = byId.get(expected.id)
      if (!actual || fields.some(field => !same(actual[field], expected[field]))) {
        throw new Error(`${table} readback mismatch: ${expected.id}`)
      }
    }
    console.log(JSON.stringify({ phase: 'verified', table, batch: index + 1, rows: part.length }))
  }
}

await upsertAndVerify('voice_actors', changedActors, actorFields)
await upsertAndVerify('characters', changedCharacters, characterFields)

const report = {
  syncedAt: new Date().toISOString(),
  changedCharacterIds: changedCharacters.map(row => row.id),
  changedVoiceActorIds: changedActors.map(row => row.id),
  verifiedCharacterCount: changedCharacters.length,
  verifiedVoiceActorCount: changedActors.length,
}
fs.writeFileSync(`${root}/submission-sync-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ phase: 'complete', changedCharacters: changedCharacters.length, changedActors: changedActors.length }))
