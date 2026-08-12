import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const vaData = JSON.parse(fs.readFileSync('scripts/va_data.json', 'utf-8'))

const entries = Object.entries(vaData).filter(([, va]) => va !== null)
console.log(`Inserting ${entries.length} voice actors...\n`)

let inserted = 0
let skipped = 0

for (const [charId, va] of entries) {
  // Check if already exists
  const { data: existing } = await supabase
    .from('voice_actors')
    .select('id')
    .eq('character_id', charId)
    .eq('name', va.name)
    .limit(1)

  if (existing?.length > 0) {
    console.log(`  SKIP [${charId}] ${va.name} (already exists)`)
    skipped++
    continue
  }

  const { error } = await supabase
    .from('voice_actors')
    .insert({
      character_id: parseInt(charId),
      name: va.name,
      image: va.image,
      language: 'Japanese',
    })

  if (error) {
    console.log(`  ❌ [${charId}] ${va.name} — ${error.message}`)
  } else {
    console.log(`  ✅ [${charId}] ${va.name}`)
    inserted++
  }
}

console.log(`\nInserted: ${inserted}, Skipped: ${skipped}`)

// Rebuild search_text
console.log('\nRebuilding search_text...')
for (const [charId] of entries) {
  const { data: ch } = await supabase
    .from('characters')
    .select('id, name, anime_title, nicknames, traits, voice_actors(name)')
    .eq('id', charId)
    .single()

  if (!ch) continue
  const s = [
    ch.name, ch.anime_title || '',
    ...(ch.nicknames || []), ...(ch.traits || []),
    ...(ch.voice_actors || []).map(v => v.name),
  ].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', ch.id)
}

console.log('✅ Done!')

// Report missing
const missing = Object.entries(vaData).filter(([, va]) => va === null).map(([id]) => id)
if (missing.length > 0) {
  console.log(`\nStill missing (${missing.length}): ${missing.join(', ')}`)
  console.log('(Chinese donghua/films — no Japanese VAs on AniList)')
}
