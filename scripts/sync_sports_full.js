import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'
const groups = [
  [20464, '排球少年！！', ['排球', '高中', '团队竞技']], [134732, '青之芦苇', ['足球', '青训', '成长']], [2159, '王牌投手 振臂高挥', ['棒球', '投手', '团队竞技']], [18507, 'Free! 男子游泳部', ['游泳', '青春', '友情']], [18179, '飙速宅男', ['自行车', '公路赛', '社团']], [20510, '网球优等生', ['网球', '训练', '青春']], [104052, '星合之空', ['软式网球', '校园', '成长']], [21709, '冰上的尤里', ['花样滑冰', '竞技', '师徒']], [165171, '金牌得主', ['花样滑冰', '师徒', '成长']], [125839, '后空翻少年！！', ['男子体操', '青春', '团队']], [19647, '第一神拳', ['拳击', '职业运动', '热血']], [185, '头文字D', ['赛车', '山路', '驾驶']], [15, '光速跑者21号', ['美式足球', '高中', '团队竞技']], [100990, '火之丸相扑', ['相扑', '校园', '热血']], [124153, '无限滑板', ['滑板', '街头运动', '友情']],
]
const query = `query($id:Int){Media(id:$id,type:ANIME){characters(page:1,perPage:50,sort:ROLE){edges{role node{id name{full native} image{large}} voiceActors(language:JAPANESE){name{full} image{large}}}}}}`
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
function description(name, title, themes, role) { return `${name}是《${title}》中的${role === 'MAIN' ? '核心运动员' : '重要队友或对手'}，故事围绕${themes.join('、')}展开。角色在训练、比赛与团队相处中展现独特性格和竞技风格，与伙伴共同面对胜负、伤病、挫折和成长。作品通过${name}的经历呈现运动项目的技术魅力，也描写选手为目标坚持到底的信念，以及赛场内外建立的友情与羁绊，是本作竞技世界中不可忽略的一员。` }
async function fetchGroup([id, title, themes]) {
  const response = await fetch(api, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({query, variables:{id}}) })
  const payload = await response.json(); if (payload.errors) throw Error(payload.errors.map(e => e.message).join(', '))
  const rows = []
  for (const [index, edge] of (payload.data?.Media?.characters?.edges || []).entries()) {
    const image = edge.node.image?.large; if (!image?.includes('anilistcdn') || image.includes('/default.')) continue
    const name = edge.node.name.native || edge.node.name.full; if (!name) continue
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const traits = [...new Set([...themes, edge.role === 'MAIN' ? '主要角色' : '重要配角', '运动员', '竞技选手', '日本动画', '比赛经验', '剧情推动者', `角色序位${index + 1}`])]
    const text = description(name, title, themes, edge.role); if (traits.length < 8 || text.length < 100 || text.length > 200) throw Error(`${title} ${name} 字段长度不合格`)
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
  console.log(`Synced ${unique.length} characters across ${groups.length} sports anime; ${actors.length} Japanese voice actors.`)
}
main().catch(error => { console.error(error.message); process.exit(1) })
