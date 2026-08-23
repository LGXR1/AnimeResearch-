import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'
const groups = [
  { id: 107660, title: 'BEASTARS', themes: ['动物群像', '校园', '心理'], names: { 125169: '春', 125170: '路易', 125168: '雷格西', 132948: '刚宾', 160352: '狮子组首领' } },
  { id: 107663, title: '彼方的阿斯特拉', themes: ['太空', '冒险', '科幻'], names: { 122753: '卡纳塔·星岛', 139437: '卢卡·埃斯波西托', 122588: '阿莉艾斯·斯普林', 122754: '琪朵莉·拉法艾利', 139432: '扎克·沃克' } },
  { id: 20722, title: '元气囝仔', themes: ['乡村', '日常', '书法'], names: { 31274: '半田清舟', 31273: '琴石成', 88333: '木户裕次郎', 88326: '山村美和', 88334: '坂本一行' } },
  { id: 132126, title: 'Sonny Boy', themes: ['漂流', '心理', '科幻'], names: { 225128: '长良', 225129: '希', 235446: '拉吉达尼', 225130: '瑞穗', 225131: '朝风' } },
  { id: 131646, title: '瓦尼塔斯的手记', themes: ['吸血鬼', '奇幻', '悬疑'], names: { 89835: '诺亚·阿希凡斯特', 89590: '瓦尼塔斯', 153506: '路西乌斯·奥利弗拉姆', 145998: '阿斯托尔福·格拉纳图姆', 230438: '老师' } },
  { id: 100332, title: '刻刻', themes: ['时间停止', '悬疑', '超自然'], names: { 125015: '佑河树里', 134425: '佑河翼', 124990: '爷爷', 134426: '加藤', 124977: '间岛翔子' } },
  { id: 142666, title: 'Migi&Dali', themes: ['双胞胎', '悬疑', '日常'], names: { 284574: '达利', 284573: '米基', 317987: '美枝子', 321390: '一条华怜', 299536: '堤丸太' } },
  { id: 122434, title: '平稳世代的韦驮天们', themes: ['神明', '战斗', '奇幻'], names: { 207747: '隼人', 207746: '伊斯利', 207748: '波拉', 207766: '凛', 226661: '皮萨拉' } },
  { id: 114124, title: '忧国的莫里亚蒂', themes: ['推理', '犯罪', '复仇'], names: { 151488: '路易斯·詹姆斯·莫里亚蒂', 151486: '威廉·詹姆斯·莫里亚蒂', 151495: '夏洛克·福尔摩斯', 151489: '阿尔伯特·詹姆斯·莫里亚蒂', 151496: '约翰·H·华生' } },
  { id: 132456, title: '贾希大人不气馁', themes: ['喜剧', '魔法', '日常'], names: { 124618: '贾希', 133103: '凉', 157951: '魔王', 133105: '千纱', 133104: '德鲁吉' } },
  { id: 111428, title: '在魔王城说晚安', themes: ['喜剧', '魔王城', '公主'], names: { 129563: '欧罗拉·栖夜·莉丝·凯明', 188219: '弥诺陶洛斯', 191747: '杀戮甲虫', 196066: '凯尔', 181143: '黄昏魔王' } },
  { id: 132473, title: '最果然的帕拉丁', themes: ['奇幻', '冒险', '圣骑士'], names: { 129745: '威廉·G·玛丽布拉德', 129746: '布拉德', 129748: '雷斯托夫', 129750: '梅内尔多尔', 129744: '玛丽' } },
  { id: 128545, title: '白沙的水族馆', themes: ['水族馆', '职场', '成长'], names: { 204496: '宫泽风花', 204495: '海咲野心', 242281: '具殿轰介', 246594: '南风原知梦', 258188: '具殿岬' } },
  { id: 110353, title: 'DECA-DENCE', themes: ['科幻', '战斗', '末世'], names: { 170191: '夏芽', 170192: '镝木', 181156: '麦奇', 174133: '凑', 181158: '塔基' } },
  { id: 100402, title: '弦音 -风舞高中弓道部-', themes: ['弓道', '校园', '竞技'], names: { 128273: '鸣宫凑', 128274: '竹早静弥', 128275: '如月七绪', 128276: '小野木海斗', 128277: '山之内辽平' } },
]
const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 20, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`
function description(name, title, themes, role) { return `${name}是《${title}》中的${role === 'MAIN' ? '核心人物' : '重要常驻角色'}。作品围绕${themes.join('、')}展开，${name}凭借独特的行动与选择参与关键事件，并与其他角色形成紧密联系。其经历推动着剧情发展，也让作品关于成长、选择与命运的主题逐渐清晰。在日常相处、冲突抉择和团队协作中，${name}始终保有鲜明的性格与立场，是理解这部作品世界和人物关系不可忽略的一员。` }
function traits(themes, role) { return [...new Set([...themes, role === 'MAIN' ? '主角' : '重要配角', '核心角色', '剧情推动者', '常驻人物', '日语配音', '日本动画'])] }
async function fetchGroup(group) {
  const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
  const payload = await response.json(); if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const wanted = new Map(Object.entries(group.names).map(([id, name]) => [Number(id), name])); const records = []
  for (const edge of payload.data?.Media?.characters?.edges || []) {
    const name = wanted.get(edge.node.id); if (!name) continue
    const actor = edge.voiceActors[0]; const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]; const characterTraits = traits(group.themes, edge.role); const text = description(name, group.title, group.themes, edge.role)
    if (!edge.node.image?.large?.includes('anilistcdn') || !actor?.name?.native || !actor.image?.large?.includes('anilistcdn')) throw new Error(`${group.title} ${name}: 缺少 AniList 图片或日语声优资料`)
    if (!nicknames.length || characterTraits.length < 8 || text.length < 100 || text.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
    const character = { id: edge.node.id, name, image: edge.node.image.large, description: text, anime_title: group.title, nicknames, traits: characterTraits }
    records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...characterTraits, actor.name.native].join(' ') }, voiceActor: { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' } })
  }
  if (records.length !== wanted.size) throw new Error(`${group.title}: 角色数量不完整`); return records
}
async function main() {
  const existingTitles = new Set(); for (let offset = 0; ; offset += 1000) { const { data, error } = await supabase.from('characters').select('anime_title').range(offset, offset + 999); if (error) throw new Error(error.message); for (const row of data || []) existingTitles.add(row.anime_title); if (!data || data.length < 1000) break }
  if (groups.some((group) => existingTitles.has(group.title))) throw new Error('检测到重复动漫，已停止写入')
  const records = []; for (const group of groups) { records.push(...await fetchGroup(group)); await new Promise((resolve) => setTimeout(resolve, 750)) }
  if (records.length !== 75 || new Set(records.map((record) => record.character.anime_title)).size !== 15) throw new Error('批量完整性校验失败')
  const characters = records.map((record) => record.character); const voiceActors = records.map((record) => record.voiceActor)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' }); if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id); const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids); if (deleteError) throw new Error(deleteError.message)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors); if (voiceActorError) throw new Error(voiceActorError.message)
  console.log('Synced 75 characters across 15 anime.')
}
main().catch((error) => { console.error(error.message); process.exit(1) })
