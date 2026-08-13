import { createClient } from '@supabase/supabase-js'
import { T1 } from './fill_traits_1.js'
import { T2 } from './fill_traits_2.js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const ALL = { ...T1, ...T2 }
console.log(`待补充 ${Object.keys(ALL).length} 个角色...\n`)

let updated = 0
for (const [id, tag] of Object.entries(ALL)) {
  const { data } = await supabase.from('characters').select('name, traits').eq('id', id).single()
  if (!data) { console.log(`  ⚠️ [${id}] 未找到`); continue }
  if ((data.traits || []).includes(tag)) { continue }
  const traits = [...(data.traits || []), tag]
  await supabase.from('characters').update({ traits }).eq('id', id)
  updated++
}
console.log(`补充 ${updated} 个标签\n`)

// 重建 search_text
console.log('重建 search_text...')
for (const id of Object.keys(ALL)) {
  const { data: ch } = await supabase
    .from('characters')
    .select('id, name, anime_title, nicknames, traits, voice_actors(name)')
    .eq('id', id)
    .single()
  if (!ch) continue
  const s = [ch.name, ch.anime_title || '', ...(ch.nicknames || []), ...(ch.traits || []), ...(ch.voice_actors || []).map(v => v.name)].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', ch.id)
}
console.log('✅ 完成')
