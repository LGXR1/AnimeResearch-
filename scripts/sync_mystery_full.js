import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 658, title: '斗牌传说', themes: ['麻将', '智斗', '心理战'] },
  { id: 98314, title: '狂赌之渊', themes: ['赌博', '校园', '心理战'] },
  { id: 141014, title: '朋友游戏', themes: ['友情', '欺骗', '智斗'] },
  { id: 21189, title: '乱步奇谭', themes: ['推理', '猎奇', '犯罪'] },
  { id: 97660, title: '重启咲良田', themes: ['超能力', '时间重启', '推理'] },
  { id: 20661, title: '东京残响', themes: ['恐怖袭击', '谜团', '社会议题'] },
  { id: 21190, title: '全部成为F', themes: ['密室', '科学', '推理'] },
  { id: 2204, title: '傀儡师左近', themes: ['侦探', '腹语术', '本格推理'] },
  { id: 407, title: '侦探学园Q', themes: ['侦探', '校园', '犯罪推理'] },
  { id: 323, title: '妄想代理人', themes: ['心理惊悚', '都市传说', '社会寓言'] },
  { id: 11111, title: 'Another', themes: ['校园怪谈', '诅咒', '悬疑'] },
  { id: 4896, title: '海猫鸣泣之时', themes: ['孤岛推理', '魔女', '家族争斗'] },
  { id: 4879, title: '魍魉之匣', themes: ['猎奇案件', '妖怪', '宗教心理'] },
  { id: 177689, title: '光逝去的夏天', themes: ['心理惊悚', '乡村怪谈', '人性'] },
  { id: 151189, title: '我家的英雄', themes: ['家庭', '犯罪', '智斗'] },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 50, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function description(name, title, themes, role) {
  const position = role === 'MAIN' ? '核心角色' : role === 'SUPPORTING' ? '重要配角' : '登场角色'
  return `${name}是《${title}》中的${position}。作品围绕${themes.join('、')}等主题展开，角色在案件、博弈或异常事件中承担独特作用，并与其他人物形成复杂关系。随着线索逐渐揭开，${name}的选择会影响剧情走向，也让故事对真相、人性与现实的讨论更加具体。`
}

function makeTraits(group, role, index) {
  return [...new Set([...group.themes, role === 'MAIN' ? '主要角色' : '重要配角', '剧情推动者', '核心人物', '日本动画', '悬疑作品', `角色序位${index + 1}`])]
}

async function fetchGroup(group) {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const edges = payload.data?.Media?.characters?.edges || []
  const records = []
  let skipped = 0
  for (const [index, edge] of edges.entries()) {
    const image = edge.node.image?.large
    if (!image?.includes('anilistcdn') || image.includes('/default.')) { skipped += 1; continue }
    const name = edge.node.name.native || edge.node.name.full
    if (!name) { skipped += 1; continue }
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const traits = makeTraits(group, edge.role, index)
    const text = description(name, group.title, group.themes, edge.role)
    const actor = edge.voiceActors?.find((item) => item?.name?.full && item.image?.large?.includes('anilistcdn'))
    const character = { id: edge.node.id, name, image, description: text, anime_title: group.title, nicknames, traits }
    const voiceActor = actor ? { character_id: character.id, name: actor.name.full, image: actor.image.large, language: '日语' } : null
    records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...traits, ...(voiceActor ? [voiceActor.name] : [])].join(' ') }, voiceActor })
  }
  if (records.length < 5) throw new Error(`${group.title}: 有效角色仅 ${records.length} 名`)
  return { records, skipped, total: edges.length }
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 环境变量')
  const existingTitles = new Set()
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('characters').select('anime_title').range(offset, offset + 999)
    if (error) throw new Error(error.message)
    for (const row of data || []) existingTitles.add(row.anime_title)
    if (!data || data.length < 1000) break
  }
  const duplicate = groups.find((group) => existingTitles.has(group.title))
  if (duplicate) throw new Error(`数据库已存在动漫：${duplicate.title}`)
  const records = []; const reports = []
  for (const group of groups) { const result = await fetchGroup(group); records.push(...result.records); reports.push(`${group.title}: ${result.records.length}/${result.total}（跳过 ${result.skipped} 个默认图）`); await new Promise((resolve) => setTimeout(resolve, 750)) }
  const characters = records.map((record) => record.character)
  if (new Set(characters.map((character) => character.id)).size !== characters.length) throw new Error('检测到重复角色 ID')
  const existing = await supabase.from('characters').select('id,anime_title').in('id', characters.map((character) => character.id))
  if (existing.error) throw new Error(existing.error.message)
  if (existing.data?.length) throw new Error(`检测到已存在角色：${existing.data.map((row) => `${row.id}(${row.anime_title})`).join(', ')}`)
  const actors = records.map((record) => record.voiceActor).filter(Boolean)
  const { error: characterError } = await supabase.from('characters').insert(characters)
  if (characterError) throw new Error(characterError.message)
  if (actors.length) { const { error: actorError } = await supabase.from('voice_actors').insert(actors); if (actorError) throw new Error(actorError.message) }
  console.log(`Synced ${characters.length} characters across ${groups.length} mystery anime; ${actors.length} Japanese voice actors.`)
  console.log(reports.join('\n'))
}

main().catch((error) => { console.error(error.message); process.exit(1) })
