import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 13125, title: '来自新世界', themes: ['心理', '悬疑', '超自然'], names: { 57575: '青沼瞬', 57571: '朝比奈觉', 57569: '渡边早季', 57573: '秋月真理亚', 57589: '伊东守' } },
  { id: 8425, title: 'GOSICK', themes: ['推理', '校园', '恋爱'], names: { 20170: '维多利加·德·布洛瓦', 22724: '久城一弥', 42129: '杰奎琳·德·西涅莱', 41968: '可可·萝丝', 42219: '索菲' } },
  { id: 239, title: '巌窟王', themes: ['复仇', '悬疑', '科幻'], names: { 418: '阿尔贝·德·莫尔塞夫', 421: '弗朗兹·德·埃皮奈', 2293: '尤金妮·唐格拉尔', 419: '基督山伯爵', 2301: '安德烈亚·卡瓦尔坎蒂' } },
  { id: 202, title: '狼雨', themes: ['冒险', '末世', '奇幻'], names: { 241: '牙', 1720: '花之少女切扎', 242: '爪', 244: '啸', 243: '啃' } },
  { id: 3701, title: '海马', themes: ['科幻', '记忆', '恋爱'], names: { 11208: '奈伊罗', 11206: '凯巴', 11210: '波波', 184271: '摩卡', 184647: '竹彦' } },
  { id: 6594, title: '刀语', themes: ['武士', '冒险', '恋爱'], names: { 28523: '咎梅', 28522: '鑢七花', 28558: '真庭蝙蝠', 32270: '真庭食鲛', 37466: '彼我木轮回' } },
  { id: 2164, title: '电脑线圈', themes: ['科幻', '校园', '冒险'], names: { 3199: '天泽勇子', 3716: '原川研一', 3711: '小此木优子', 3718: '泽口大地', 3713: '桥本文惠' } },
  { id: 387, title: '灰羽联盟', themes: ['奇幻', '心理', '日常'], names: { 1995: '拉卡', 1996: '礼祈', 2002: '暗森', 2001: '话郎', 28074: '翔太' } },
  { id: 7588, title: '五叶', themes: ['江户', '群像', '悬疑'], names: { 32130: '弥一', 32135: '秋津政之助', 32137: '阿竹', 32617: '松吉', 32412: '梅造' } },
  { id: 2246, title: '物怪', themes: ['妖怪', '悬疑', '民俗'], names: { 2865: '卖药郎', 3661: '柳幻殃斋', 83363: '野本千代', 17256: '阿蝶', 21750: '市川节子' } },
  { id: 8129, title: '海月姬', themes: ['恋爱', '喜剧', '时尚'], names: { 34973: '仓下月海', 35476: '鲤渊藏之介', 35168: '吉吉', 38052: '根岸三郎太', 35474: '玛雅雅' } },
  { id: 17909, title: '有顶天家族', themes: ['家庭', '奇幻', '京都'], names: { 80951: '下鸭矢四郎', 80945: '下鸭矢三郎', 80947: '下鸭矢一郎', 80949: '下鸭矢二郎', 87821: '夷川金阁' } },
  { id: 21823, title: 'ACCA 13区监察课', themes: ['政治', '悬疑', '职场'], names: { 120801: '吉恩·奥塔斯', 120803: '莫芙', 120808: '尼诺', 120809: '利利乌姆', 121236: '饼干' } },
  { id: 131083, title: '看得见的女孩', themes: ['灵异', '校园', '喜剧'], names: { 139631: '四谷见子', 156860: '二暮堂尤莉亚', 139632: '百合川华', 250705: '蜡烛淳二', 257577: '谜之怪物' } },
  { id: 20431, title: '鬼灯的冷彻', themes: ['地狱', '喜剧', '妖怪'], names: { 79669: '鬼灯', 87652: '阎魔大王', 124071: '小判', 376744: '撒旦', 79671: '白泽' } },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 20, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function description(name, title, themes, role) {
  const position = role === 'MAIN' ? '核心人物' : '重要的常驻角色'
  return `${name}是《${title}》中的${position}。故事围绕${themes.join('、')}展开，${name}以自己的行动参与关键事件，并与其他角色形成鲜明而紧密的联系。其经历推动了剧情，也使作品关于成长、选择与命运的主题逐渐清晰。在日常相处、冲突抉择和团队协作中，${name}始终保有独特的性格与立场，是理解这部作品世界和人物关系不可忽略的一员。`
}

function traits(themes, role) {
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
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
    const characterTraits = traits(group.themes, edge.role)
    const text = description(name, group.title, group.themes, edge.role)
    if (!edge.node.image?.large?.includes('anilistcdn') || !actor?.name?.native || !actor.image?.large?.includes('anilistcdn')) throw new Error(`${group.title} ${name}: 缺少 AniList 图片或日语声优资料`)
    if (!nicknames.length || characterTraits.length < 8 || text.length < 100 || text.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
    const character = { id: edge.node.id, name, image: edge.node.image.large, description: text, anime_title: group.title, nicknames, traits: characterTraits }
    records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...characterTraits, actor.name.native].join(' ') }, voiceActor: { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' } })
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
