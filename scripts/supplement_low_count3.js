import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'
const groups = [
  { id: 578, title: '萤火虫之墓', themes: ['战争', '亲情', '成长'], names: { 495: '节子', 494: '清太', 133870: '清太和节子的母亲', 319245: '医生' } },
  { id: 431, title: '哈尔的移动城堡', themes: ['魔法', '冒险', '爱情'], names: { 507: '哈尔', 508: '苏菲·哈特', 4987: '卡布', 168136: '玛姬', 168138: '莱蒂·哈特', 509: '马鲁克', 212868: '莎莉曼', 6752: '卡西法', 279025: '汉妮', 510: '荒野女巫', 12188: '希恩', 168135: '国王' } },
  { id: 2236, title: '穿越时空的少女', themes: ['时间旅行', '校园', '恋爱'], names: { 2532: '津田功介', 2531: '间宫千昭', 2530: '绀野真琴', 22928: '福岛老师', 24227: '芳山和子', 16631: '绀野美雪', 28922: '高濑宋次郎', 16604: '早川友梨', 16605: '藤谷果穗' } },
  { id: 47, title: '阿基拉', themes: ['超能力', '科幻', '末世'], names: { 2588: '金田正太郎', 9875: '惠', 2589: '岛铁雄', 88237: '高志', 88238: '雅', 16289: '香织', 142838: '根津', 28166: '甲斐', 142840: '宫城', 142837: '龙作', 16288: '敷岛大佐', 20463: '山形' } },
  { id: 164, title: '幽灵公主', themes: ['自然', '神灵', '冒险'], names: { 2727: '珊', 2802: '阿席达卡', 11360: '阿时', 11362: '乙事主', 11364: '刚', 11368: '小凯', 6801: '地侍 Jiko', 158573: '日野大人', 4781: '黑帽大人', 12728: '麒麟兽', 11366: '甲六', 9174: '莫罗' } },
  { id: 3667, title: '强袭魔女', themes: ['魔女', '战斗', '飞行'], names: { 14135: '米娜·迪特琳德·维尔克', 7632: '弗兰切斯卡·鲁奇尼', 14137: '艾莉卡·哈特曼', 7630: '夏洛特·E·叶格', 7626: '宫藤芳佳', 7629: '莉涅特·毕晓普', 7628: '佩琳·克洛斯特曼', 14139: '萨妮娅·V·利特维亚克', 7631: '艾拉·伊尔玛塔尔·尤蒂莱南', 7627: '坂本美绪', 14138: '格特鲁特·巴克霍恩', 24802: '诹访天姬' } },
]
const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 30, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`
function description(name, title, themes, role) { return `${name}是《${title}》中的${role === 'MAIN' ? '核心人物' : '重要常驻角色'}。作品围绕${themes.join('、')}展开，${name}通过自身经历参与关键事件，并与其他角色形成鲜明联系。其行动推动剧情发展，也让作品关于成长、选择与命运的主题逐步展开。在日常相处、冲突和情感变化中，${name}保持独特的性格与立场，是理解这部作品世界和人物关系不可忽略的一员。` }
function traits(themes, role) { return [...new Set([...themes, role === 'MAIN' ? '主角' : '重要配角', '核心角色', '剧情推动者', '常驻人物', '日语配音', '日本动画'])] }
async function main() {
  const records = []
  for (const group of groups) {
    const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) }); const payload = await response.json(); if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
    const wanted = new Map(Object.entries(group.names).map(([id, name]) => [Number(id), name]))
    for (const edge of payload.data?.Media?.characters?.edges || []) { const name = wanted.get(edge.node.id); if (!name) continue; const actor = edge.voiceActors[0]; if (!edge.node.image?.large?.includes('anilistcdn') || !actor?.name?.native || !actor.image?.large?.includes('anilistcdn')) continue; const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]; const characterTraits = traits(group.themes, edge.role); const text = description(name, group.title, group.themes, edge.role); const character = { id: edge.node.id, name, image: edge.node.image.large, description: text, anime_title: group.title, nicknames, traits: characterTraits }; records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...characterTraits, actor.name.native].join(' ') }, voiceActor: { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' } }) }
    await new Promise((resolve) => setTimeout(resolve, 750))
  }
  const characters = records.map((record) => record.character); const voiceActors = records.map((record) => record.voiceActor); if (!characters.length) throw new Error('没有可补充的完整角色')
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' }); if (characterError) throw new Error(characterError.message); const ids = characters.map((character) => character.id); const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids); if (deleteError) throw new Error(deleteError.message); const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors); if (voiceActorError) throw new Error(voiceActorError.message); console.log(`Supplemented or refreshed ${characters.length} characters across ${new Set(characters.map((character) => character.anime_title)).size} anime.`)
}
main().catch((error) => { console.error(error.message); process.exit(1) })
