import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// id → 要追加的特征标签
const TAGS = {
  88753: '白丝',    // 艾拉
  43280: '白丝',    // 楪祈
  88575: '白丝',    // 蕾姆
  498: '黑丝',      // 远坂凛
  127222: '黑丝',   // 樱岛麻衣
  1743: '黑丝',     // 灰原哀
  65865: '绝对领域', // 小鸟游六花
  2671: '绝对领域',  // 木之本樱
  61: '长腿',       // 妮可·罗宾
  1259: '长腿',     // 葛城美里
  83799: '长腿',    // 鬼龙院皐月
  122443: '裸足',   // 莉可
  425: '裸足',      // 银古
  723: '巨乳',      // 娜美
  6046: '巨乳',     // 鞠川静香
  136: '贫乳',      // 露易丝
  86: '贫乳',       // 绫波丽
  70069: '时停',    // 时崎狂三
  1375: '颜艺',     // 暗游戏
  121103: '颜艺',   // 藤原千花
  145342: '哭包',   // 花垣武道
  673: '吐槽役',    // 志村新八
  1748: '青梅竹马', // 毛利兰
}

let added = 0, skipped = 0
for (const [id, tag] of Object.entries(TAGS)) {
  const { data } = await supabase.from('characters').select('name, traits').eq('id', id).single()
  if (!data) { console.log(`  ⚠️ [${id}] 未找到`); continue }
  if ((data.traits || []).includes(tag)) { skipped++; continue }
  const traits = [...(data.traits || []), tag]
  await supabase.from('characters').update({ traits }).eq('id', id)
  console.log(`  ✅ ${data.name} +「${tag}」`)
  added++
}
console.log(`\n添加 ${added} 个标签，跳过 ${skipped} 个（已存在）`)

// 重建 search_text
console.log('\n重建 search_text...')
for (const id of Object.keys(TAGS)) {
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
