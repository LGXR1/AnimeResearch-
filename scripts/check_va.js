import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

const { data, error } = await supabase
  .from('characters')
  .select('id, name, anime_title, voice_actors(id)')

if (error) { console.log('Error:', error.message); process.exit(1) }

const noVA = (data || []).filter(c => !c.voice_actors || c.voice_actors.length === 0)
console.log('Total:', data.length, '| Missing VA:', noVA.length)
noVA.forEach(c => console.log(' ', c.id, c.name, '—', c.anime_title))
