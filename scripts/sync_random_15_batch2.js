import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 10800, title: '花牌情缘', themes: ['竞技', '校园', '青春'], names: { 47163: '绫濑千早', 47167: '真岛太一', 51283: '绫濑千惠子', 50339: '木梨浩', 60201: '山本由美' } },
  { id: 12431, title: '宇宙兄弟', themes: ['科幻', '航天', '励志'], names: { 55169: '南波日向人', 55171: '南波六太', 60097: '南波真弓', 67001: '古谷康', 56047: '金子夏伦' } },
  { id: 21234, title: '只有我不存在的城市', themes: ['悬疑', '时间回溯', '心理'], names: { 89275: '藤沼悟', 89276: '雏月加代', 89365: '八代学', 89326: '藤沼佐知子', 89360: '杉田广美' } },
  { id: 10271, title: '赌博默示录', themes: ['心理', '赌博', '生存'], names: { 5578: '伊藤开司', 44419: '三好智广', 14057: '兵藤和尊', 32415: '一条圣也', 46617: '村上保' } },
  { id: 2251, title: '永生之酒', themes: ['犯罪', '群像', '超自然'], names: { 3796: '米莉亚·哈文特', 3873: '拉克·甘道尔', 3662: '艾萨克·迪安', 3500: '雅各齐·斯普罗特', 3065: '拉德·鲁索' } },
  { id: 237, title: '交响诗篇', themes: ['机甲', '科幻', '恋爱'], names: { 477: '兰顿·萨斯顿', 1512: '霍兰德·诺瓦克', 1709: '优莱卡', 1530: '塔尔荷·尤琪', 6718: '雷·比姆斯' } },
  { id: 21196, title: '甲铁城的卡巴内利', themes: ['战斗', '蒸汽朋克', '丧尸'], names: { 89472: '生驹', 89464: '无名', 89471: '吉备土', 260408: '修藏', 260402: '樵人' } },
  { id: 5671, title: '天才麻将少女', themes: ['竞技', '校园', '麻将'], names: { 17276: '片冈优希', 17277: '须贺京太郎', 17279: '染谷真子', 17278: '竹井久', 17274: '宫永咲' } },
  { id: 7785, title: '四叠半神话大系', themes: ['校园', '心理', '恋爱'], names: { 31522: '明石', 30579: '我', 32556: '小津', 32647: '樋口清太郎', 33023: '羽贯凉子' } },
  { id: 10721, title: '回转企鹅罐', themes: ['家庭', '悬疑', '超自然'], names: { 43335: '高仓晶马', 43009: '高仓阳毬', 43334: '高仓冠叶', 43385: '荻野目苹果', 44312: '多蕗桂树' } },
  { id: 26, title: 'TEXHNOLYZE', themes: ['科幻', '心理', '赛博朋克'], names: { 2743: '兰', 834: '壹世', 6338: '慎司', 7686: '大西京吴', 19237: '木俣元治' } },
  { id: 329, title: '星空清理者', themes: ['科幻', '太空', '职场'], names: { 5263: '田名部爱', 5105: '星野八郎太', 7593: '艾德尔加德·里维拉', 56989: '莎莉·西尔弗斯通', 144636: '露西·阿斯卡姆' } },
  { id: 1210, title: '欢迎来到NHK', themes: ['心理', '社会', '恋爱'], names: { 2552: '中原岬', 1839: '佐藤达广', 2866: '山崎薰', 10580: '佐藤静江', 5953: '柏瞳' } },
  { id: 721, title: '彩梦芭蕾', themes: ['芭蕾', '童话', '魔法'], names: { 1050: '法奇尔', 1052: '露', 1051: '米多', 1049: '阿希鲁', 1283: '莉莉叶' } },
  { id: 1827, title: '精灵守护者', themes: ['冒险', '奇幻', '武术'], names: { 2645: '巴尔萨', 2683: '恰克姆', 2685: '塔达', 2684: '托洛盖', 13363: '萨格姆' } },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 20, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function makeDescription(name, title, themes, role) {
  const position = role === 'MAIN' ? '核心人物' : '重要的常驻角色'
  return `${name}是《${title}》中的${position}。作品围绕${themes.join('、')}展开，${name}通过自己的行动参与关键事件，并与其他人物形成鲜明而紧密的关系。其经历既推动了剧情，也让作品关于成长、选择与命运的主题逐渐清晰。在日常相处、冲突抉择和团队协作中，${name}保持独特的性格与立场，是理解故事世界和人物网络不可忽略的一员。`
}

function makeTraits(themes, role) {
  return [...new Set([...themes, role === 'MAIN' ? '主角' : '重要配角', '核心角色', '剧情推动者', '常驻人物', '日语配音', '日本动画'])]
}

async function fetchGroup(group) {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const wanted = new Map(Object.entries(group.names).map(([id, name]) => [Number(id), name]))
  const edges = payload.data?.Media?.characters?.edges || []
  const records = []
  for (const edge of edges) {
    const name = wanted.get(edge.node.id)
    if (!name) continue
    const actor = edge.voiceActors[0]
    const aliases = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const traits = makeTraits(group.themes, edge.role)
    const description = makeDescription(name, group.title, group.themes, edge.role)
    if (!edge.node.image?.large?.includes('anilistcdn') || !actor?.name?.native || !actor.image?.large?.includes('anilistcdn')) throw new Error(`${group.title} ${name}: 缺少 AniList 图片或日语声优`)
    if (!aliases.length || traits.length < 8 || description.length < 100 || description.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
    const character = { id: edge.node.id, name, image: edge.node.image.large, description, anime_title: group.title, nicknames: aliases, traits }
    records.push({ character: { ...character, search_text: [name, group.title, ...aliases, ...traits, actor.name.native].join(' ') }, voiceActor: { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' } })
  }
  if (records.length !== wanted.size) throw new Error(`${group.title}: 角色数量不完整`)
  return records
}

async function main() {
  const existingTitles = new Set()
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('characters').select('anime_title').range(offset, offset + 999)
    if (error) throw new Error(error.message)
    for (const row of data || []) existingTitles.add(row.anime_title)
    if (!data || data.length < 1000) break
  }
  if (groups.some((group) => existingTitles.has(group.title))) throw new Error('检测到重复动漫，已停止写入')
  const records = []
  for (const group of groups) { records.push(...await fetchGroup(group)); await new Promise((resolve) => setTimeout(resolve, 750)) }
  if (records.length !== 75 || new Set(records.map((record) => record.character.anime_title)).size !== 15) throw new Error('批量完整性校验失败')
  const characters = records.map((record) => record.character)
  const voiceActors = records.map((record) => record.voiceActor)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(deleteError.message)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (voiceActorError) throw new Error(voiceActorError.message)
  console.log('Synced 75 characters across 15 anime.')
}

main().catch((error) => { console.error(error.message); process.exit(1) })
