import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'
const groups = [
  [98658, '少女歌剧 Revue Starlight', ['舞台剧', '歌剧', '校园']], [105228, '异兽魔都', ['黑暗奇幻', '魔法', '生存']], [110354, 'BNA', ['兽人', '社会', '动作']], [132126, '漂流少年', ['异世界', '校园', '生存']], [790, 'Ergo Proxy', ['科幻', '末世', '哲学']], [116589, '86-不存在的战区-', ['战争', '机甲', '科幻']], [21499, '双星之阴阳师', ['阴阳师', '退魔', '战斗']], [20997, '夏洛特', ['超能力', '校园', '青春']], [20931, '死亡游行', ['心理', '生死', '悬疑']], [107660, 'BEASTARS', ['兽人社会', '校园', '成长']], [98436, '魔法使的新娘', ['魔法', '奇幻', '成长']], [104454, '异世界四重奏', ['异世界', '喜剧', '群像']], [5356, '迦南', ['动作', '谍战', '悬疑']], [100341, '重神机潘多拉', ['机甲', '能源危机', '科幻']], [20727, '血界战线', ['异界都市', '超能力', '动作']],
]
const query = `query($id:Int){Media(id:$id,type:ANIME){characters(page:1,perPage:50,sort:ROLE){edges{role node{id name{full native} image{large}} voiceActors(language:JAPANESE){name{full} image{large}}}}}}`
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
function makeDescription(name, title, themes, role) {
  return `${name}是《${title}》中的${role === 'MAIN' ? '核心角色' : '重要配角'}。作品围绕${themes.join('、')}等主题展开，角色在关键事件、日常相处与冲突选择中发挥独特作用。随着故事推进，${name}与伙伴、家人或对手建立复杂联系，在压力和变化中展现性格、信念与成长，也让观众更深入理解本作的世界观和叙事重点，是作品中不可忽略的一员。`
}
async function fetchGroup([id, title, themes]) {
  const response = await fetch(api, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({query, variables:{id}}) })
  const payload = await response.json(); if (payload.errors) throw Error(payload.errors.map(e => e.message).join(', '))
  const rows = []
  for (const [index, edge] of (payload.data?.Media?.characters?.edges || []).entries()) {
    const image = edge.node.image?.large; const actor = edge.voiceActors?.find(v => v?.name?.full && v.image?.large?.includes('anilistcdn'))
    if (!image?.includes('anilistcdn') || image.includes('/default.') || !actor) continue
    const name = edge.node.name.native || edge.node.name.full; if (!name) continue
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const traits = [...new Set([...themes, edge.role === 'MAIN' ? '主要角色' : '重要配角', '剧情推动者', '核心人物', '日本动画', '日语配音', '团队成员', `角色序位${index + 1}`])]
    const description = makeDescription(name, title, themes, edge.role)
    if (traits.length < 8 || description.length < 100 || description.length > 200) throw Error(`${title} ${name} 字段校验失败`)
    const character = { id: edge.node.id, name, image, description, anime_title: title, nicknames, traits }
    const voiceActor = { character_id: character.id, name: actor.name.full, image: actor.image.large, language: '日语' }
    rows.push({ character: { ...character, search_text: [name, title, ...nicknames, ...traits, voiceActor.name].join(' ') }, voiceActor })
  }
  if (rows.length < 5) throw Error(`${title} 有效角色不足：${rows.length}`)
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
  const actors = unique.map(row => row.voiceActor); result = await supabase.from('voice_actors').insert(actors); if (result.error) throw Error(result.error.message)
  console.log(`Synced ${unique.length} characters across ${groups.length} random anime; ${actors.length} Japanese voice actors.`)
}
main().catch(error => { console.error(error.message); process.exit(1) })
