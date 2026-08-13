import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import { CN_A } from './cn_batch1_a.js'
import { CN_B } from './cn_batch1_b.js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const CN = { ...CN_A, ...CN_B }

// 需要跳过的 ID：Narrator(36309)、Baccano角色(3796/3662)、重复(13701/17017)、狗Nira(128420)
const SKIP = new Set([36309, 3796, 3662, 13701, 17017, 128420])

// K 的 3 个缺失声优手动补充
const EXTRA_VA = {
  64599: { name: 'Daisuke Ono', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95212-wX1M4LJN96q2.png' },
  64621: { name: 'Mamoru Miyano', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95065-eyynywrhombR.png' },
  64627: { name: 'Yui Horie', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95028-MHT1m3E5wGZx.png' },
}

const raw = JSON.parse(fs.readFileSync('scripts/batch1_data.json', 'utf-8'))

// 收集要插入的角色
const toInsert = []
for (const r of raw) {
  const animeCn = r.anime
  for (const c of r.characters) {
    if (SKIP.has(c.id)) continue
    if (!CN[c.id]) { console.log(`  ⚠️ 缺中文数据: ${c.id} ${c.name}`); continue }
    const cn = CN[c.id]
    const va = c.voice_actor || EXTRA_VA[c.id] || null
    toInsert.push({ id: c.id, animeCn, image: c.image, cn, va })
  }
}

console.log(`准备插入 ${toInsert.length} 个角色...\n`)

let charOk = 0, charErr = 0, vaOk = 0, vaSkip = 0

for (const item of toInsert) {
  const { id, animeCn, image, cn, va } = item

  // 插入角色
  const { error: charError } = await supabase
    .from('characters')
    .upsert({
      id,
      name: cn.name,
      anime_title: animeCn,
      image,
      description: cn.description,
      traits: cn.traits,
      nicknames: cn.nicknames,
    }, { onConflict: 'id' })

  if (charError) {
    console.log(`  ❌ [${id}] ${cn.name} 角色插入失败: ${charError.message}`)
    charErr++
    continue
  }
  charOk++

  // 插入声优
  if (va && va.name) {
    const { data: existing } = await supabase
      .from('voice_actors')
      .select('id')
      .eq('character_id', id)
      .eq('name', va.name)
      .limit(1)

    if (existing?.length === 0) {
      const { error: vaError } = await supabase
        .from('voice_actors')
        .insert({ character_id: id, name: va.name, image: va.image, language: 'Japanese' })
      if (vaError) { console.log(`  ⚠️ [${id}] ${cn.name} 声优插入失败: ${vaError.message}`) }
      else vaOk++
    } else {
      vaSkip++
    }
  } else {
    console.log(`  ⚠️ [${id}] ${cn.name} 无声优`)
  }
}

console.log(`\n角色: ${charOk} 成功, ${charErr} 失败`)
console.log(`声优: ${vaOk} 新增, ${vaSkip} 已存在`)

// 重建 search_text
console.log('\n重建 search_text...')
const ids = toInsert.map(t => t.id)
for (const id of ids) {
  const { data: ch } = await supabase
    .from('characters')
    .select('id, name, anime_title, nicknames, traits, voice_actors(name)')
    .eq('id', id)
    .single()

  if (!ch) continue
  const s = [
    ch.name, ch.anime_title || '',
    ...(ch.nicknames || []), ...(ch.traits || []),
    ...(ch.voice_actors || []).map(v => v.name),
  ].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', ch.id)
}

console.log('✅ 完成！')
