import { createClient } from '@supabase/supabase-js'
import { FIX_A } from './cn_fix_a.js'
import { FIX_B } from './cn_fix_b.js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const FIX = { ...FIX_A, ...FIX_B }

let updated = 0, skipped = 0
for (const [id, d] of Object.entries(FIX)) {
  const { data } = await supabase.from('characters').select('traits, nicknames, description').eq('id', id).single()
  if (!data) { console.log(`  ⚠️ [${id}] 未找到`); continue }

  const patch = {}
  if (!data.traits || data.traits.length === 0) patch.traits = d.traits
  if (!data.nicknames || data.nicknames.length === 0) patch.nicknames = d.nicknames
  if ((!data.description || data.description.length === 0) && d.description) patch.description = d.description

  if (Object.keys(patch).length === 0) { skipped++; continue }

  const { error } = await supabase.from('characters').update(patch).eq('id', id)
  if (error) { console.log(`  ❌ [${id}] ${d.name}: ${error.message}`); continue }
  updated++
}
console.log(`更新 ${updated} 个角色，跳过 ${skipped} 个（字段已存在）`)

// 重建 search_text
console.log('\n重建 search_text...')
for (const id of Object.keys(FIX)) {
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
