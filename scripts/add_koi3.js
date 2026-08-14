import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import { CN } from './cn_koi3.js'

// 校园恋爱番第 1 批入库
// 运行：node --env-file=.env.local scripts/add_koi3.js

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const raw = JSON.parse(fs.readFileSync('scripts/koi3_data.json', 'utf-8'))

const byId = {}
for (const anime of raw) {
  for (const c of anime.characters) {
    byId[c.id] = { image: c.image, va: (c.voiceActors || [])[0] }
  }
}

const entries = Object.entries(CN)
let ok = 0, err = 0, vaOk = 0

for (const [idStr, cn] of entries) {
  const id = Number(idStr)
  const fetched = byId[id]
  if (!fetched) { console.log(`⚠️ 无抓取数据: ${id} ${cn.name}`); continue }
  const { image, va } = fetched
  const { error: charErr } = await supabase
    .from('characters')
    .upsert({ id, name: cn.name, anime_title: cn.anime_title, image, description: cn.description, traits: cn.traits, nicknames: cn.nicknames }, { onConflict: 'id' })
  if (charErr) { console.log(`❌ [${id}] ${cn.name}: ${charErr.message}`); err++; continue }
  ok++
  if (va && va.name) {
    const vaName = va.native || va.name
    const vaImg = va.image || null
    const { data: existing } = await supabase.from('voice_actors').select('id').eq('character_id', id).eq('name', vaName).limit(1)
    if (!existing || existing.length === 0) {
      const { error: vaErr } = await supabase.from('voice_actors').insert({ character_id: id, name: vaName, image: vaImg, language: '日语' })
      if (vaErr) console.log(`⚠️ [${id}] ${cn.name} 声优 ${vaName}: ${vaErr.message}`)
      else vaOk++
    }
  }
  await new Promise((r) => setTimeout(r, 30))
}

console.log(`\n角色: ${ok} 成功, ${err} 失败 | 声优: ${vaOk} 新增`)

console.log('\n重建 search_text...')
for (const [idStr] of entries) {
  const id = Number(idStr)
  const { data: ch } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)').eq('id', id).single()
  if (!ch) continue
  const s = [ch.name, ch.anime_title || '', ...(ch.nicknames || []), ...(ch.traits || []), ...(ch.voice_actors || []).map((v) => v.name)].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', id)
}
console.log('✅ 完成')
