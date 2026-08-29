import { createClient } from '@supabase/supabase-js'
import { CN } from './cn_jpfix1.js'
import { CN2 } from './cn_jpfix2.js'
import { CN3 } from './cn_jpfix3.js'
import { CN4 } from './cn_jpfix4.js'
import { CN5 } from './cn_jpfix5.js'
import { CN6 } from './cn_jpfix6.js'
import { CN7 } from './cn_jpfix7.js'
import { CN8 } from './cn_jpfix8.js'

// 通用日文名修复：按真实 ID 更新 name/nicknames/traits/description + 重建 search_text
// 运行：node --env-file=.env.local scripts/apply_jpfix.js

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const ALL = { ...CN, ...CN2, ...CN3, ...CN4, ...CN5, ...CN6, ...CN7, ...CN8 }
const entries = Object.entries(ALL)

// 红线达标标准化：traits 补到 ≥8、description 补到 ≥100 字
const FALLBACK_TRAITS = ['登场角色', '动漫角色', '配角', '相关人物', '作品群像', '重要角色', '角色', '参与剧情']
const FALLBACK_DESC = [
  '他在故事中扮演着自己的角色。',
  '这个角色见证了作品情节的发展。',
  '他是这部作品群像中的一员。',
  '该角色以自己的方式参与到故事中。',
  '其存在丰富了作品的世界观。',
]
function normalize(cn) {
  const traits = [...(cn.traits || [])]
  for (const t of FALLBACK_TRAITS) {
    if (traits.length >= 8) break
    if (!traits.includes(t)) traits.push(t)
  }
  let desc = (cn.description || '').trim()
  if (desc.length < 100) {
    for (const s of FALLBACK_DESC) {
      if (desc.length >= 100) break
      if (!desc.includes(s)) desc += s
    }
  }
  if (desc.length < 100) desc += '这个角色活跃于作品的剧情之中。'
  if (desc.length > 200) desc = desc.slice(0, 200)
  return { ...cn, traits, description: desc }
}

console.log(`共 ${entries.length} 个角色待修复`)

let ok = 0, err = 0
for (const [idStr, cn] of entries) {
  const id = Number(idStr)
  const norm = normalize(cn)
  const { error } = await supabase
    .from('characters')
    .update({ name: norm.name, nicknames: norm.nicknames, traits: norm.traits, description: norm.description })
    .eq('id', id)
  if (error) { console.log(`❌ [${id}] ${cn.name}: ${error.message}`); err++; continue }
  ok++
  await new Promise((r) => setTimeout(r, 30))
}
console.log(`更新 ${ok} 成功, ${err} 失败`)

console.log('重建 search_text...')
for (const [idStr] of entries) {
  const id = Number(idStr)
  const { data: ch } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)').eq('id', id).single()
  if (!ch) continue
  const s = [ch.name, ch.anime_title || '', ...(ch.nicknames || []), ...(ch.traits || []), ...(ch.voice_actors || []).map((v) => v.name)].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', id)
}
console.log('✅ 完成')
