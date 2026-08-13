import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import { CN4_A } from './cn_batch4_a.js'
import { CN4_B } from './cn_batch4_b.js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const CN = { ...CN4_A, ...CN4_B }
const SKIP = new Set([36309]) // Narrator

// MyGO/Ave Mujica 无 VA 角色手动补声优（AniList 无新声优图片，暂留空）
const EXTRA_VA = {
  302095: { name: 'Hina Youmiya', image: '' },    // 高松灯 → 羊宫妃那
  302094: { name: 'Rin Tateishi', image: '' },    // 千早爱音 → 立石凛
  302093: { name: 'Mika Kohinata', image: '' },   // 长崎爽世 → 小日向美香
  302092: { name: 'Hina Aoki', image: '' },       // 要乐奈 → 青木阳菜
  312796: { name: 'Kanon Takao', image: '' },     // 丰川祥子 → 高尾奏音
  312798: { name: 'Yuzuki Watase', image: '' },   // 若叶睦 → 渡濑结月
  312797: { name: 'Riko Sasaki', image: '' },     // 三角初华 → 佐佐木李子
}

// Ave Mujica 合并进 BanG Dream! It's MyGO!!!!!
const ANIME_MAP = { 'Ave Mujica': "BanG Dream! It's MyGO!!!!!" }

const raw = JSON.parse(fs.readFileSync('scripts/batch4_data.json', 'utf-8'))
const seen = new Set()
const toInsert = []
for (const r of raw) {
  const animeCn = ANIME_MAP[r.anime] || r.anime
  for (const c of r.characters) {
    if (SKIP.has(c.id) || seen.has(c.id)) continue
    if (!CN[c.id]) { console.log(`  ⚠️ 缺中文数据: ${c.id} ${c.name}`); continue }
    seen.add(c.id)
    toInsert.push({ id: c.id, animeCn, image: c.image, cn: CN[c.id], va: c.voice_actor || EXTRA_VA[c.id] || null })
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
  } else {
    console.log(`  ⚠️ [${id}] ${cn.name} 无声优`)
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
