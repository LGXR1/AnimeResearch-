import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 10259, title: '大鱼海棠', themes: ['神话', '奇幻', '爱情'], chars: [[138843, '椿'], [154581, '湫'], [154583, '鲲'], [154582, '灵婆'], [162290, '凤凰']] },
  { id: 107371, title: '白蛇：缘起', themes: ['神话', '爱情', '冒险'], chars: [[154575, '小白'], [154579, '阿宣'], [154574, '蛇母'], [154576, '小青'], [154577, '宝青坊主']] },
  { id: 116982, title: '新神榜：哪吒重生', themes: ['神话', '赛博朋克', '动作'], chars: [[239438, '李云祥'], [239435, '面具人'], [249361, '敖广'], [249362, '敖丙'], [249364, '苏君竹']] },
  { id: 103353, title: '大护法', themes: ['奇幻', '冒险', '讽喻'], chars: [[155277, '大护法'], [155278, '太子'], [155275, '隐婆'], [155283, '彩'], [155276, '小姜']] },
  { id: 102973, title: '昨日青空', themes: ['青春', '校园', '成长'], chars: [[140021, '姚哲恬'], [140022, '齐景轩'], [140023, '屠小意'], [226605, '花生'], [226606, '陈老师']] },
  { id: 114333, title: '妙先生', themes: ['奇幻', '旅途', '抉择'], chars: [[230564, '丁果'], [230565, '殷凤'], [230573, '无生'], [230566, '赶鸭人'], [230567, '孝文']] },
  { id: 110459, title: '灵笼', themes: ['末世', '科幻', '生存'], chars: [[205035, '马克'], [205036, '冉冰'], [205046, '镜南'], [205047, '查尔斯'], [205044, '摩根']] },
  { id: 103360, title: '十万个冷笑话', themes: ['神话', '恶搞', '喜剧'], chars: [[229724, '无名男主角'], [229734, '李靖'], [229729, '白雪公主'], [229732, '哪吒'], [229746, '女王大人']] },
  { id: 107070, title: '喜羊羊与灰太狼', themes: ['儿童', '喜剧', '日常'], chars: [[198862, '喜羊羊'], [198863, '美羊羊'], [198864, '沸羊羊'], [198865, '懒羊羊'], [316854, '红太狼']] },
  { id: 108715, title: '少年歌行', themes: ['武侠', '冒险', '友情'], chars: [[137257, '雷无桀'], [221330, '萧瑟'], [221340, '白发仙'], [221331, '冥侯'], [221872, '司空千落']] },
  { id: 122508, title: '镖人', themes: ['武侠', '历史', '动作'], chars: [[245844, '知世郎'], [245845, '刀马'], [313487, '小七'], [314391, '裴行俨'], [316881, '阿罗汉']] },
  { id: 156092, title: '凸变英雄X', themes: ['超级英雄', '悬疑', '动作'], chars: [[349528, '默杀'], [349522, '林凌'], [349530, '杨澄'], [349521, '梁龙'], [349529, '小强']] },
  { id: 129230, title: '秦时明月', themes: ['历史', '武侠', '冒险'], chars: [[81053, '荆天明'], [307549, '高月'], [307551, '项少羽'], [307548, '石兰'], [273796, '盖聂']] },
  { id: 315, title: '小倩', themes: ['志怪', '爱情', '冒险'], chars: [[30728, '小倩'], [30738, '白云'], [30731, '红胡子'], [30727, '宁采臣'], [30734, '小蝶']] },
  { id: 102153, title: '武庚纪', themes: ['神话', '战斗', '超自然'], chars: [[80677, '武庚'], [169191, '李靖'], [150869, '天'], [169190, '鬼木'], [169192, '疤面']] },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 50, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function makeDescription(name, title, themes, role) {
  const position = role === 'MAIN' ? '核心角色' : '重要配角'
  const text = `${name}是《${title}》中的${position}。作品围绕${themes.join('、')}展开，${name}参与关键事件并推动人物关系变化，在压力和选择中表现出鲜明立场。角色与伙伴、对手保持联系，经历冲突后逐步理解责任与成长，也让作品的世界观和主题更加具体。`
  return text.length > 200 ? text.slice(0, 200) : text
}

function makeTraits(group, role, index) {
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
    if (!edge || !edge.node.image?.large?.includes('anilistcdn') || edge.node.image.large.includes('/default.')) throw new Error(`${group.title} ${name}: 角色图无效`)
    const usableActor = actor?.name?.full && actor.image?.large?.includes('anilistcdn') && !actor.image.large.includes('/large/41.') ? actor : null
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const characterTraits = makeTraits(group, edge.role, index)
    const description = makeDescription(name, group.title, group.themes, edge.role)
    if (nicknames.length === 0 || characterTraits.length < 8 || description.length < 100 || description.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
    const character = { id, name, image: edge.node.image.large, description, anime_title: group.title, nicknames, traits: characterTraits }
    const voiceActor = usableActor ? { character_id: id, name: usableActor.name.full, image: usableActor.image.large, language: '日语' } : null
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
  const existingIds = await supabase.from('characters').select('id,anime_title').in('id', characters.map((character) => character.id))
  if (existingIds.error) throw new Error(existingIds.error.message)
  if (existingIds.data?.length) throw new Error(`发现重复角色 ID：${existingIds.data.map((row) => `${row.id}(${row.anime_title})`).join(', ')}`)
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
