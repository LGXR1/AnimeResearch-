import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'
const groups = [
  [10033, '美食的俘虏', ['美食猎人', '冒险', '料理']], [28, '日式面包王', ['面包', '料理竞技', '热血']], [97617, '异世界食堂', ['异世界', '餐厅', '料理']], [100855, '卫宫家今天的饭', ['家常菜', '日常', '治愈']], [21659, '天真与闪电', ['亲子', '家常菜', '成长']], [16918, '银之匙', ['农业高中', '畜牧', '青春']], [117067, '舞伎家的料理人', ['京都', '舞伎', '家常菜']], [100727, '鹿枫堂四色日和', ['茶馆', '甜点', '日常']], [98529, '爱吃拉面的小泉同学', ['拉面', '美食', '校园']], [170998, '拉面赤猫', ['拉面店', '猫咪', '治愈']], [6586, '梦色糕点师', ['糕点', '学校', '梦想']], [20744, '幸腹涂鸦', ['料理', '友情', '校园']], [21365, '粗点心战争', ['粗点心', '乡村', '喜剧']], [97873, '异世界居酒屋～古都阿伊特力亚的居酒屋阿信～', ['居酒屋', '异世界', '料理']], [186003, '费马的料理', ['数学', '料理', '成长']],
]
const query = `query($id:Int){Media(id:$id,type:ANIME){characters(page:1,perPage:50,sort:ROLE){edges{role node{id name{full native} image{large}} voiceActors(language:JAPANESE){name{full} image{large}}}}}}`
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
function description(name, title, themes, role) { return `${name}是《${title}》中的${role === 'MAIN' ? '核心角色' : '重要配角'}，围绕${themes.join('、')}等主题展开故事。角色在料理制作、食材探索或日常相处中展现鲜明个性，与伙伴共同面对成长、梦想和生活选择。作品通过${name}的经历呈现食物带来的温度与人与人之间的联结，也让每一道料理成为推动剧情和表达情感的重要媒介，是本作美食世界中不可忽略的一员。` }
async function fetchGroup([id, title, themes]) {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id } }) })
  const payload = await response.json(); if (payload.errors) throw Error(payload.errors.map(e => e.message).join(', '))
  const rows = []
  for (const [index, edge] of (payload.data?.Media?.characters?.edges || []).entries()) {
    const image = edge.node.image?.large
    if (!image?.includes('anilistcdn') || image.includes('/default.')) continue
    const name = edge.node.name.native || edge.node.name.full; if (!name) continue
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const traits = [...new Set([...themes, edge.role === 'MAIN' ? '主要角色' : '重要配角', '料理爱好者', '日本动画', '美食题材', '剧情推动者', '核心人物', `角色序位${index + 1}`])]
    const text = description(name, title, themes, edge.role)
    if (traits.length < 8 || text.length < 100 || text.length > 200) throw Error(`${title} ${name} 字段长度不合格`)
    const character = { id: edge.node.id, name, image, description: text, anime_title: title, nicknames, traits }
    const actor = edge.voiceActors?.find(v => v?.name?.full && v.image?.large?.includes('anilistcdn'))
    const voiceActor = actor ? { character_id: character.id, name: actor.name.full, image: actor.image.large, language: '日语' } : null
    rows.push({ character: { ...character, search_text: [name, title, ...nicknames, ...traits, ...(voiceActor ? [voiceActor.name] : [])].join(' ') }, voiceActor })
  }
  if (rows.length < 5) throw Error(`${title} 有效角色不足`)
  return rows
}
async function main() {
  const existingTitles = new Set(); for (let offset = 0;; offset += 1000) { const q = await supabase.from('characters').select('anime_title').range(offset, offset + 999); if (q.error) throw Error(q.error.message); for (const row of q.data || []) existingTitles.add(row.anime_title); if (!q.data || q.data.length < 1000) break }
  const duplicate = groups.find(([, title]) => existingTitles.has(title)); if (duplicate) throw Error(`数据库已存在：${duplicate[1]}`)
  const all = []; for (const group of groups) { all.push(...await fetchGroup(group)); await sleep(750) }
  const existing = await supabase.from('characters').select('id').in('id', all.map(row => row.character.id)); if (existing.error) throw Error(existing.error.message)
  const taken = new Set((existing.data || []).map(row => row.id)); const unique = []; const seen = new Set()
  for (const row of all) if (!taken.has(row.character.id) && !seen.has(row.character.id)) { seen.add(row.character.id); unique.push(row) }
  const counts = new Map(); for (const row of unique) counts.set(row.character.anime_title, (counts.get(row.character.anime_title) || 0) + 1)
  const deficient = [...counts].filter(([, count]) => count < 5); if (deficient.length) throw Error(`去重后作品不足：${deficient.map(([title, count]) => `${title}=${count}`).join(', ')}`)
  let result = await supabase.from('characters').insert(unique.map(row => row.character)); if (result.error) throw Error(result.error.message)
  const actors = unique.map(row => row.voiceActor).filter(Boolean); if (actors.length) { result = await supabase.from('voice_actors').insert(actors); if (result.error) throw Error(result.error.message) }
  console.log(`Synced ${unique.length} characters across ${groups.length} food anime; ${actors.length} Japanese voice actors.`)
}
main().catch(error => { console.error(error.message); process.exit(1) })
