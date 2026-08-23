import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'
const groups = [
  { id: 572, title: '风之谷', themes: ['自然', '冒险', '科幻'], names: { 541: '库沙娜', 543: '阿斯贝尔', 539: '娜乌西卡', 540: '尤巴', 8547: '培吉特市长', 11246: '大婆婆', 542: '克罗托瓦', 11244: '米特', 11254: '戈尔', 544: '拉丝黛儿' } },
  { id: 101291, title: '青春猪头少年不会梦到兔女郎学姐', themes: ['校园', '恋爱', '青春'], names: { 127221: '梓川咲太', 127222: '樱岛麻衣', 127613: '梓川花枫', 127633: '双叶理央', 127841: '丰浜和花', 127840: '古贺朋绘', 127843: '牧之原翔子', 130307: '国见佑真', 144797: '广川卯月', 130304: '上里沙希' } },
  { id: 457, title: '虫师', themes: ['虫', '自然', '奇幻'], names: { 425: '银古', 16884: '山爷爷', 17358: '澪', 16879: '小代', 16886: '塊', 24129: '娜美', 16808: '喜助', 16811: '铃', 23764: '五百藏真', 16810: '美晴', 16881: '绪', 26274: '茂', 4071: '化野', 5167: '妮', 17060: '吹' } },
]
const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 30, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`
function description(name, title, themes, role) { return `${name}是《${title}》中的${role === 'MAIN' ? '核心人物' : '重要常驻角色'}。作品围绕${themes.join('、')}展开，${name}通过自身经历参与关键事件，并与其他角色形成鲜明联系。其行动推动剧情发展，也让作品关于成长、选择与命运的主题逐步展开。在日常相处、冲突和情感变化中，${name}保持独特的性格与立场，是理解这部作品世界和人物关系不可忽略的一员。` }
function traits(themes, role) { return [...new Set([...themes, role === 'MAIN' ? '主角' : '重要配角', '核心角色', '剧情推动者', '常驻人物', '日语配音', '日本动画'])] }
async function main() {
  const records = []
  for (const group of groups) {
    const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
    const payload = await response.json(); if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
    const wanted = new Map(Object.entries(group.names).map(([id, name]) => [Number(id), name]))
    for (const edge of payload.data?.Media?.characters?.edges || []) {
      const name = wanted.get(edge.node.id); if (!name) continue
      const actor = edge.voiceActors[0]; const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]; const characterTraits = traits(group.themes, edge.role); const text = description(name, group.title, group.themes, edge.role)
      if (!edge.node.image?.large?.includes('anilistcdn') || !actor?.name?.native || !actor.image?.large?.includes('anilistcdn')) throw new Error(`${group.title} ${name}: AniList 数据不完整`)
      if (characterTraits.length < 8 || text.length < 100 || text.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
      const character = { id: edge.node.id, name, image: edge.node.image.large, description: text, anime_title: group.title, nicknames, traits: characterTraits }
      records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...characterTraits, actor.name.native].join(' ') }, voiceActor: { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' } })
    }
    await new Promise((resolve) => setTimeout(resolve, 750))
  }
  if (records.length !== 35) throw new Error(`Expected 35 records, received ${records.length}`)
  const characters = records.map((record) => record.character); const voiceActors = records.map((record) => record.voiceActor)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' }); if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id); const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids); if (deleteError) throw new Error(deleteError.message)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors); if (voiceActorError) throw new Error(voiceActorError.message)
  console.log(`Supplemented or refreshed ${characters.length} characters across 3 anime.`)
}
main().catch((error) => { console.error(error.message); process.exit(1) })
