import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const local = new Map(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => [Number(row.id), row]))
const sources = [
  { id: 222105, url: 'https://healer-girl.jp/character/', required: ['矢薙ソニア', '海外の飛び級制度', 'C級ヒーラー', '理彩をライバル視', 'ソニアとは幼馴染'] },
  { id: 320607, url: 'https://isekaishikkaku.com/', required: ['変身能力を持つアネットの使い魔', 'センセーによって「メロス」と名付けられる', 'メロスはセンセーのことが大好き', 'キーッという鳴き声', 'メロスが色んな表情'] },
]
const updates = [
  {
    id: 222105,
    description: '矢薙索尼娅与藤井佳奈同为高中一年级学生，两人也在同一所学校就读。她借助海外的跳级制度，已经取得C级歌愈师资格，展现出出色的歌愈能力。索尼娅不知为何把被称为天才歌愈师的乌丸理彩视作竞争对手，总想与她较量。她与穗之坂忍从小相识；在学校之外，歌愈师身份与对理彩的执着也影响着她和佳奈一行人的关系。',
    traits: ['女性', '高中一年级生', '与藤井佳奈同校', '白发', '蓝瞳', 'C级歌愈师', '借助海外跳级制度取得资格', '将乌丸理彩视为竞争对手', '与穗之坂忍是青梅竹马'],
  },
  {
    id: 320607,
    description: '梅洛斯是安妮特的使魔，拥有变换形态的能力；“梅洛斯”这个名字由老师为它取下。它以非人类的使魔身份在《异世界失格》中登场，非常喜欢老师。动画官网上，配音者木野日菜介绍它会发出“キーッ”的叫声，用声音传达自己的心情，同时展现出丰富的表情。它的行动与叫声，是这位使魔在旅程中表达情绪的重要方式。',
    traits: ['安妮特的使魔', '非人类生物', '拥有变换形态的能力', '由老师命名为梅洛斯', '喜欢老师', '发出“キーッ”的叫声', '以叫声表达情绪', '表情丰富'],
  },
]
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 写入环境变量')
for (const source of sources) {
  const response = await fetch(source.url)
  const html = await response.text()
  if (!response.ok || !source.required.every(fragment => html.includes(fragment))) throw new Error(`官方网站核对失败：${source.url}`)
}
for (const item of updates) {
  const old = local.get(item.id)
  if (!old || old.traits.length >= 8 || item.traits.length < 8 || item.description.length < 100 || item.description.length > 200) throw new Error(`新资料预检不通过：${item.id}`)
}
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const current = []
for (const item of updates) {
  const old = local.get(item.id)
  const { data, error } = await client.from('characters').select('*').eq('id', item.id).single()
  if (error || !data || data.name !== old.name || data.description !== old.description || JSON.stringify(data.traits || []) !== JSON.stringify(old.traits || [])) throw new Error(`线上记录已变化：${item.id}`)
  current.push(data)
}
const backupPath = `${dir}/two-sparse-traits-before-2026-10-23.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), characters: current, sources }, null, 2))
for (let i = 0; i < updates.length; i++) {
  const item = updates[i]
  const old = current[i]
  const searchText = [old.name, old.anime_title, ...(old.nicknames || []), ...item.traits, ...local.get(item.id).voice_actors.map(actor => actor.name)].join(' ')
  const { data, error } = await client.from('characters').update({ description: item.description, traits: item.traits, search_text: searchText })
    .eq('id', item.id).eq('description', old.description).select('id,name,description,traits,search_text').single()
  if (error || !data || data.description !== item.description || JSON.stringify(data.traits) !== JSON.stringify(item.traits) || data.search_text !== searchText) throw new Error(`写入或回读失败：${item.id} ${error?.message || ''}`)
}
const reportPath = `${dir}/two-sparse-traits-apply-2026-10-23.json`
fs.writeFileSync(reportPath, JSON.stringify({ completedAt: new Date().toISOString(), ids: updates.map(item => item.id), sources: sources.map(item => item.url), backupPath }, null, 2))
console.log(JSON.stringify({ updated: updates.map(item => ({ id: item.id, descriptionLength: item.description.length, traitCount: item.traits.length })), reportPath }))
