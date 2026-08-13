import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import { CN5_A } from './cn_batch5_a.js'
import { CN5_B } from './cn_batch5_b.js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const CN = { ...CN5_A, ...CN5_B }
const SKIP = new Set([36309]) // Narrator

const raw = JSON.parse(fs.readFileSync('scripts/batch5_data.json', 'utf-8'))
const toInsert = []
for (const r of raw) {
  for (const c of r.characters) {
    if (SKIP.has(c.id)) continue
    if (!CN[c.id]) { console.log(`  ⚠️ 缺中文数据: ${c.id} ${c.name}`); continue }
    toInsert.push({ id: c.id, animeCn: r.anime, image: c.image, cn: CN[c.id], va: c.voice_actor })
  }
}

console.log(`准备插入 ${toInsert.length} 个角色...\n`)
let charOk = 0, charErr = 0, vaOk = 0

for (const item of toInsert) {
  const { id, animeCn, image, cn, va } = item
  const { error: charError } = await supabase
    .from('characters')
    .upsert({ id, name: cn.name, anime_title: animeCn, image, description: cn.description, traits: cn.traits, nicknames: cn.nicknames }, { onConflict: 'id' })
  if (charError) { console.log(`  ❌ [${id}] ${cn.name}: ${charError.message}`); charErr++; continue }
  charOk++

  if (va && va.name) {
    const { data: existing } = await supabase.from('voice_actors').select('id').eq('character_id', id).eq('name', va.name).limit(1)
    if (existing?.length === 0) {
      const { error: vaError } = await supabase.from('voice_actors').insert({ character_id: id, name: va.name, image: va.image || null, language: 'Japanese' })
      if (vaError) console.log(`  ⚠️ [${id}] ${cn.name} 声优: ${vaError.message}`)
      else vaOk++
    }
  }
}
console.log(`\n角色: ${charOk} 成功, ${charErr} 失败 | 声优: ${vaOk} 新增`)

console.log('\n重建 search_text...')
for (const item of toInsert) {
  const { data: ch } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)').eq('id', item.id).single()
  if (!ch) continue
  const s = [ch.name, ch.anime_title || '', ...(ch.nicknames || []), ...(ch.traits || []), ...(ch.voice_actors || []).map(v => v.name)].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', ch.id)
}
console.log('✅ 完成')
