import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 115844, title: '凡人修仙传', themes: ['修仙', '冒险', '奇幻'], chars: [[230157, '韩立'], [230173, '张铁'], [230159, '南宫婉'], [230162, '厉飞雨'], [230164, '菡云芝']] },
  { id: 137653, title: '仙逆', themes: ['修仙', '战斗', '成长'], chars: [[348856, '王林'], [376058, '托森'], [376059, '柳眉'], [376060, '藤化元'], [376061, '许立国']] },
  { id: 117012, title: '吞噬星空', themes: ['科幻', '末世', '战斗'], chars: [[242550, '罗峰'], [206327, '徐欣'], [245262, '邬通'], [245290, '张泽虎'], [245244, '罗华']] },
  { id: 146409, title: '神印王座', themes: ['奇幻', '骑士', '冒险'], chars: [[186511, '龙皓晨'], [186508, '圣采儿'], [281197, '王原原'], [281203, '三水'], [281196, '蒋虎']] },
  { id: 137671, title: '遮天', themes: ['玄幻', '星空', '冒险'], chars: [[373486, '叶凡'], [373487, '姬紫月'], [373500, '土匪'], [373501, '庞博'], [373502, '秦瑶']] },
  { id: 107912, title: '刺客伍六七', themes: ['动作', '喜剧', '悬疑'], chars: [[147093, '伍六七'], [147092, '梅花十三'], [147089, '鸡大保'], [147099, '小飞鸡'], [147094, '猫小咪']] },
  { id: 126403, title: '时光代理人', themes: ['悬疑', '超自然', '友情'], chars: [[218266, '程小时'], [218267, '陆光'], [218265, '乔苓'], [218592, '予夏'], [226064, 'EMMA母亲']] },
  { id: 102663, title: '罗小黑战记', themes: ['奇幻', '日常', '治愈'], chars: [[154584, '罗小黑'], [214515, '罗小白'], [214516, '阿根'], [214542, '皇受'], [181350, '老君']] },
  { id: 114136, title: '百妖谱', themes: ['志怪', '治愈', '冒险'], chars: [[222096, '桃夭'], [222100, '磨牙'], [222101, '柳公子'], [222222, '蜉蝣少女'], [222237, '春花']] },
  { id: 99707, title: '镇魂街', themes: ['热血', '灵异', '战斗'], chars: [[225386, '曹焱兵'], [225379, '夏铃'], [225389, '曹玄亮'], [225398, '于禁'], [225399, '小柔']] },
  { id: 103350, title: '非人哉', themes: ['神话', '日常', '喜剧'], chars: [[140393, '九月'], [140401, '精卫'], [140394, '敖烈'], [140395, '刑天'], [308662, '十一月']] },
  { id: 101132, title: '迷域行者', themes: ['悬疑', '生存', '心理'], chars: [[226153, '宁远'], [226154, '何志扬'], [226161, '罗密欧·艾贝尔'], [226162, '丁鹤春'], [226155, '苏瑾']] },
  { id: 99708, title: '端脑', themes: ['科幻', '推理', '智斗'], chars: [[228988, '夏驰'], [228989, '晴知'], [228990, '孟秦'], [228991, '春絮香'], [228992, '博卞']] },
  { id: 186861, title: '哪吒之魔童闹海', themes: ['神话', '亲情', '战斗'], chars: [[156371, '哪吒'], [156374, '敖丙'], [156372, '申公豹'], [156375, '李靖'], [156373, '殷夫人']] },
  { id: 131994, title: '雄狮少年', themes: ['现实', '青春', '舞狮'], chars: [[307582, '阿娟'], [307583, '阿狗'], [307586, '咸鱼强'], [307587, '阿猫'], [307588, '阿珍']] },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 50, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function makeDescription(name, title, themes, role) {
  const position = role === 'MAIN' ? '核心角色' : '重要配角'
  const text = `${name}是《${title}》中的${position}。作品围绕${themes.join('、')}展开，${name}参与关键事件并推动人物关系变化，在压力和选择中表现出鲜明立场。角色与伙伴、对手保持联系，经历冲突后逐步理解责任与成长，也让作品的世界观和主题更加具体。`
  return text.length > 200 ? text.slice(0, 200) : text
}

function traits(group, role, index) {
  return [...new Set([...group.themes, role === 'MAIN' ? '主要角色' : '重要配角', '剧情推动者', '核心人物', '国产动画', '团队成员', `角色序位${index + 1}`])]
}

async function fetchGroup(group) {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const byId = new Map((payload.data?.Media?.characters?.edges || []).map((edge) => [edge.node.id, edge]))
  const records = []
  for (const [index, [id, name]] of group.chars.entries()) {
    const edge = byId.get(id); const actor = edge?.voiceActors?.[0]
    if (!edge || !edge.node.image?.large?.includes('/large/b') || edge.node.image.large.includes('/default.') || !edge.node.image.large.includes('anilistcdn')) throw new Error(`${group.title} ${name}: 角色图不是有效 AniList CDN 图片`)
    if (actor && (!actor.name?.full || !actor.image?.large?.includes('anilistcdn'))) throw new Error(`${group.title} ${name}: 日配头像无效`)
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const characterTraits = traits(group, edge.role, index)
    const description = makeDescription(name, group.title, group.themes, edge.role)
    if (nicknames.length === 0 || characterTraits.length < 8 || description.length < 100 || description.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
    const character = { id, name, image: edge.node.image.large, description, anime_title: group.title, nicknames, traits: characterTraits }
    const voiceActor = actor ? { character_id: id, name: actor.name.full, image: actor.image.large, language: '日语' } : null
    records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...characterTraits, ...(voiceActor ? [voiceActor.name] : [])].join(' ') }, voiceActor })
  }
  return records
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
  const records = []
  for (const group of groups) { records.push(...await fetchGroup(group)); await new Promise((resolve) => setTimeout(resolve, 750)) }
  if (records.length !== 75) throw new Error(`角色数量校验失败：${records.length}`)
  const characters = records.map((record) => record.character)
  const actors = records.map((record) => record.voiceActor).filter(Boolean)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(deleteError.message)
  if (actors.length) { const { error: actorError } = await supabase.from('voice_actors').insert(actors); if (actorError) throw new Error(actorError.message) }
  console.log(`Synced ${characters.length} characters across ${groups.length} Chinese anime; ${actors.length} Japanese voice actors.`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
