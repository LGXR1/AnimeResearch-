import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 99088, title: 'PLUTO', themes: ['科幻', '悬疑', '机器人'], chars: [[9791, '盖西奇'], [18913, '阿童木'], [44469, '布兰多'], [318137, '亚历山大总统'], [318600, '莱因哈特']] },
  { id: 162896, title: '擅长逃跑的少主', themes: ['历史', '冒险', '战争'], chars: [[215499, '北条时行'], [300898, '诹访赖重'], [339809, '洁子'], [339819, '盐田次郎'], [341167, '荣']] },
  { id: 155657, title: '终末列车去哪里？', themes: ['末日', '公路', '友情'], chars: [[309908, '千仓静留'], [311335, '星凪初'], [311336, '久贺玲实'], [311337, '东云晶'], [335743, '猫哥哥']] },
  { id: 153930, title: '浪漫杀手', themes: ['恋爱', '喜剧', '校园'], chars: [[285560, '星野杏子'], [285561, '里里'], [287816, '香月司'], [287817, '小金井圣'], [287821, '早濑绊']] },
  { id: 164312, title: '柚木家的四兄弟。', themes: ['家庭', '日常', '成长'], chars: [[158296, '柚木尊'], [158295, '柚木隼'], [158294, '柚木湊'], [158293, '柚木岳'], [312001, '二阶堂悠真']] },
  { id: 149883, title: '能干猫今天也忧郁', themes: ['日常', '职场', '治愈'], chars: [[265486, '福泽幸来'], [265485, '福泽萨库'], [309554, '幸来的父亲'], [309556, '梦的母亲'], [309539, '柴崎由里']] },
  { id: 156891, title: '最弱驯兽师开启的捡垃圾之旅', themes: ['奇幻', '冒险', '旅行'], chars: [[294130, '空'], [294131, '艾薇'], [323657, '希法尔'], [323666, '玛尔玛'], [329628, '塔布罗']] },
  { id: 166910, title: 'The Fable', themes: ['黑帮', '动作', '犯罪'], chars: [[173771, '佐藤明'], [292106, '黑潮凉'], [347588, '宇津保礼'], [188618, '佐藤洋子'], [328459, '高桥胜也']] },
  { id: 151514, title: '地。关于地球的运动', themes: ['历史', '科学', '信念'], chars: [[279996, '诺瓦克'], [280003, '德拉卡'], [280005, '施密特'], [280002, '奥齐'], [279999, '巴德尼']] },
  { id: 162983, title: '不死少女的谋杀闹剧', themes: ['推理', '怪异', '冒险'], chars: [[301052, '轮堂鸦夜'], [301053, '真打津轻'], [301054, '馳井静句'], [309183, '卡蜜拉'], [311573, '克劳德·戈达尔']] },
  { id: 165070, title: '新上司是天然呆', themes: ['职场', '喜剧', '治愈'], chars: [[305653, '白崎优清'], [305654, '桃濑健太郎'], [305655, '青山光男'], [305656, '金城爱悟'], [305657, '白桃']] },
  { id: 153818, title: '魔女与野兽', themes: ['黑暗奇幻', '战斗', '魔法'], chars: [[204807, '盖多'], [204808, '阿夏夫'], [319535, '舒尔克'], [325561, '法姆斯'], [285315, '伊欧内']] },
  { id: 155389, title: 'SHY', themes: ['超级英雄', '成长', '战斗'], chars: [[143297, '红叶山辉'], [231590, '斯蒂格玛'], [151306, '小石川惟子'], [271113, '拉娜·安德烈亚诺夫'], [151307, '佩佩莎·安德烈亚诺夫']] },
  { id: 156040, title: '悲剧的元凶成为最强异端 Last Boss 女王', themes: ['异世界', '王国', '命运'], chars: [[186214, '普莱德·罗伊亚尔·艾维'], [260729, '蒂娅拉·罗伊亚尔·艾维'], [315140, '塞费克'], [327597, '克拉克·达尔文'], [260734, '亚瑟·贝雷斯福德']] },
  { id: 146493, title: 'Ragna Crimson', themes: ['龙族', '战斗', '奇幻'], chars: [[168967, '克里姆森'], [204860, '拉格纳'], [312057, '奇美拉'], [269077, '涅比林'], [319435, '艾萨克·斯特恩']] },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 20, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function makeTraits(group, role, index) {
  return [...new Set([...group.themes, role === 'MAIN' ? '主要角色' : '重要配角', '剧情推动者', '核心人物', '日本动画', '日语配音', '团队成员', `角色序位${index + 1}`])]
}

function makeDescription(name, title, themes, role) {
  const position = role === 'MAIN' ? '核心角色' : '重要配角'
  const text = `${name}是《${title}》中的${position}。故事围绕${themes.join('、')}展开，${name}参与关键事件并推动关系变化，在压力和选择中表现出鲜明立场。角色与伙伴、对手保持联系，经历冲突后逐步理解责任与成长，也让作品的世界观和主题更加具体。`
  return text.length > 200 ? text.slice(0, 200) : text
}

function buildSearchText(character, actor) {
  return [character.name, character.anime_title, ...character.nicknames, ...character.traits, actor.name].join(' ')
}

async function fetchGroup(group) {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const byId = new Map((payload.data?.Media?.characters?.edges || []).map((edge) => [edge.node.id, edge]))
  const records = []
  for (const [index, [id, name]] of group.chars.entries()) {
    const edge = byId.get(id)
    const actor = edge?.voiceActors?.[0]
    if (!edge || !actor?.name?.full || !actor.image?.large?.includes('anilistcdn') || !edge.node.image?.large?.includes('anilistcdn')) throw new Error(`${group.title} ${name}: 缺少 AniList 角色图或日配头像`)
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const traits = makeTraits(group, edge.role, index)
    const description = makeDescription(name, group.title, group.themes, edge.role)
    if (nicknames.length === 0 || traits.length < 8 || description.length < 100 || description.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
    const character = { id, name, image: edge.node.image.large, description, anime_title: group.title, nicknames, traits }
    const voiceActor = { character_id: id, name: actor.name.full, image: actor.image.large, language: '日语' }
    records.push({ character: { ...character, search_text: buildSearchText(character, voiceActor) }, voiceActor })
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
  const actors = records.map((record) => record.voiceActor)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(deleteError.message)
  const { error: actorError } = await supabase.from('voice_actors').insert(actors)
  if (actorError) throw new Error(actorError.message)
  console.log(`Synced ${characters.length} characters across ${groups.length} anime.`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
