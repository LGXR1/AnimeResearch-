import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 437, title: '未麻的部屋', themes: ['偶像', '心理', '悬疑'], names: { 4866: '雾越未麻', 6111: '留美', 72187: '土居正', 72181: '村野', 72191: '涉谷贵雄', 40478: '玲', 72193: '雪子', 72183: '手岛', 14123: '内田' } },
  { id: 512, title: '魔女宅急便', themes: ['魔法', '成长', '飞行'], names: { 6866: '琪琪', 11286: '老夫人', 11280: '乌露丝拉', 11282: '蜻蜓', 11290: '可琪莉', 3133: '吉吉', 11284: '索娜', 11288: '贝莎' } },
  { id: 416, title: '红猪', themes: ['飞行', '冒险', '战争'], names: { 7747: '波鲁克', 8044: '菲奥·比克罗', 3812: '唐纳德·柯蒂斯', 8045: '吉娜', 11300: '曼马尤特老大', 8046: '比克罗爷爷', 269797: '费拉林' } },
  { id: 16664, title: '辉夜姬物语', themes: ['民间传说', '成长', '爱情'], names: { 182713: '舍丸', 241235: '翁', 241236: '斋部秋田', 241235: '翁', 241234: '相模', 241237: '女童', 341867: '御门', 89885: '辉夜姬' } },
]

const query = `query ($id: Int) { Media(id: $id, type: ANIME) { characters(page: 1, perPage: 30, sort: ROLE) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { full native } image { large } } } } } }`

function description(name, title, themes, role) {
  return `${name}是《${title}》中的${role === 'MAIN' ? '核心人物' : '重要常驻角色'}。作品以${themes.join('、')}为背景，${name}通过自身经历参与关键事件，并与其他角色形成鲜明联系。其行动推动剧情发展，也让作品关于成长、选择与命运的主题逐步展开。在日常相处、冲突和情感变化中，${name}保持独特的性格与立场，是理解这部作品世界和人物关系不可忽略的一员。`
}

function traits(themes, role) {
  return [...new Set([...themes, role === 'MAIN' ? '主角' : '重要配角', '核心角色', '剧情推动者', '常驻人物', '日语配音', '日本动画'])]
}

async function main() {
  const records = []
  for (const group of groups) {
    const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { id: group.id } }) })
    const payload = await response.json()
    if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
    const wanted = new Map(Object.entries(group.names).map(([id, name]) => [Number(id), name]))
    for (const edge of payload.data?.Media?.characters?.edges || []) {
      const name = wanted.get(edge.node.id); if (!name) continue
      const actor = edge.voiceActors[0]
      const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
      const characterTraits = traits(group.themes, edge.role)
      const text = description(name, group.title, group.themes, edge.role)
      if (!edge.node.image?.large?.includes('anilistcdn') || !actor?.name?.native || !actor.image?.large?.includes('anilistcdn')) throw new Error(`${group.title} ${name}: 缺少 AniList 图片或日语声优资料`)
      if (characterTraits.length < 8 || text.length < 100 || text.length > 200) throw new Error(`${group.title} ${name}: 字段校验失败`)
      const character = { id: edge.node.id, name, image: edge.node.image.large, description: text, anime_title: group.title, nicknames, traits: characterTraits }
      records.push({ character: { ...character, search_text: [name, group.title, ...nicknames, ...characterTraits, actor.name.native].join(' ') }, voiceActor: { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' } })
    }
    await new Promise((resolve) => setTimeout(resolve, 750))
  }
  const characters = records.map((record) => record.character)
  const voiceActors = records.map((record) => record.voiceActor)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' }); if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids); if (deleteError) throw new Error(deleteError.message)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors); if (voiceActorError) throw new Error(voiceActorError.message)
  console.log(`Supplemented or refreshed ${characters.length} characters across ${new Set(characters.map((character) => character.anime_title)).size} anime.`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
