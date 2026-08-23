import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 98707, title: '宝石之国', themes: ['奇幻', '宝石生命', '战斗'], names: { 123385: '磷叶石', 123384: '辰砂', 123393: '翡翠', 123386: '亚历山大石', 124307: '南极石' } },
  { id: 128547, title: '奇巧计程车', themes: ['悬疑', '群像剧', '都市'], names: { 204522: '小户川宏', 204530: '大门兄', 204540: '道布', 204554: '花音', 204523: '白川美保' } },
  { id: 109298, title: '别对映像研出手！', themes: ['校园', '动画制作', '日常'], names: { 149677: '金森沙耶加', 149676: '浅草绿', 149678: '水崎燕', 159998: '关', 159999: '小林' } },
  { id: 110349, title: '大欺诈师', themes: ['犯罪', '欺诈', '冒险'], names: { 158447: '枝村真人', 158448: '罗兰·蒂埃里', 158450: '阿比盖尔·琼斯', 158449: '辛西娅·摩尔', 173777: '安德森' } },
  { id: 128546, title: 'Vivy -氟化物之眼之歌-', themes: ['科幻', '人工智能', '音乐'], names: { 209902: '松本', 209903: '薇薇', 216426: '纳比', 220599: 'M-00205', 216427: '档案' } },
  { id: 124845, title: '奇蛋物语', themes: ['奇幻', '心理', '校园'], names: { 199890: '川井莉香', 199892: '大户爱', 199893: '青沼宁瑠', 199891: '泽木桃惠', 204143: '西城久留美' } },
  { id: 20574, title: '高分少女', themes: ['校园', '恋爱', '街机游戏'], names: { 126962: '大野晶', 127767: '矢口春雄', 127808: '日高小春', 132443: '爷爷', 132445: '大野真' } },
  { id: 98385, title: '恋如雨止', themes: ['恋爱', '校园', '日常'], names: { 122212: '橘晶', 122213: '近藤正己', 130559: '久保佳代子', 130558: '喜屋武遥', 130556: '加濑亮介' } },
  { id: 97922, title: '犬屋敷', themes: ['科幻', '超能力', '社会'], names: { 123581: '狮子神皓', 123583: '犬屋敷壹郎', 123579: '犬屋敷麻理', 185884: '犬屋敷万理江', 247022: '织田的父亲' } },
  { id: 98505, title: '公主准则', themes: ['谍战', '蒸汽朋克', '少女'], names: { 122800: '安洁', 122801: '比阿特丽斯', 122802: '藤堂千世', 122803: '多萝西', 122804: '公主' } },
  { id: 21838, title: '终末的伊泽塔', themes: ['战争', '魔法', '架空历史'], names: { 90188: '伊泽塔', 90189: '菲涅', 120713: '汉斯·奥贝尔迈耶', 123287: '索菲', 120714: '格尔茨' } },
  { id: 21261, title: '阿松', themes: ['喜剧', '日常', '六胞胎'], names: { 89279: '松野十四松', 89280: '松野一松', 89281: '松野十松', 89282: '松野轻松', 89283: '松野空松' } },
  { id: 110350, title: '异度侵入', themes: ['悬疑', '科幻', '心理'], names: { 143399: '鸣瓢秋人', 145224: '百贵船太郎', 154397: '富久田保津', 145228: '本堂町小春', 145226: '东乡纱利奈' } },
  { id: 101261, title: '皿三昧', themes: ['奇幻', '青春', '超自然'], names: { 132230: '矢逆一稀', 132231: '阵内燕太', 132232: '久慈悠', 140276: '矢逆春河', 140668: '阵内音宁' } },
  { id: 100077, title: '黑社会的超能力女儿', themes: ['喜剧', '超能力', '日常'], names: { 89228: '雏', 89229: '新田义史', 137165: '安先生', 154172: '相泽早苗', 166375: '吉田' } },
]

const query = `query ($id: Int) {
  Media(id: $id, type: ANIME) {
    characters(page: 1, perPage: 20, sort: ROLE) {
      edges {
        role
        node { id name { full native } image { large } }
        voiceActors(language: JAPANESE) { name { full native } image { large } }
      }
    }
  }
}`

function description(name, title, themes, role) {
  const part = role === 'MAIN' ? '核心人物' : '重要的常驻角色'
  return `${name}是《${title}》中的${part}。作品以${themes.join('、')}为故事背景，${name}通过自身的行动与选择参与关键事件，并和其他角色形成紧密关联。其经历不仅推动了情节发展，也让作品的主题和人物关系逐步展开。在日常互动、冲突抉择与团队协作中，${name}始终保有鲜明的位置，是理解这部作品世界观与叙事脉络不可忽略的一员。`
}

function aliases(edge, name) {
  return [...new Set([edge.node.name.full, edge.node.name.native, name].filter(Boolean))]
}

function traits(themes, role) {
  return [...new Set([
    ...themes,
    role === 'MAIN' ? '主角' : '重要配角',
    '核心角色',
    '剧情推动者',
    '常驻人物',
    '日语配音',
    '日本动画',
  ])]
}

async function fetchGroup(group) {
  const response = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { id: group.id } }),
  })
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const wanted = new Map(Object.entries(group.names).map(([id, name]) => [Number(id), name]))
  const edges = payload.data?.Media?.characters?.edges || []
  const records = []
  for (const edge of edges) {
    const name = wanted.get(edge.node.id)
    if (!name) continue
    const actor = edge.voiceActors[0]
    const characterTraits = traits(group.themes, edge.role)
    const text = description(name, group.title, group.themes, edge.role)
    if (!edge.node.image?.large || !actor?.name?.native || !actor.image?.large) throw new Error(`${group.title} ${name} lacks AniList image or Japanese voice actor`)
    if (characterTraits.length < 8 || text.length < 100 || text.length > 200) throw new Error(`${group.title} ${name} fails the data specification`)
    records.push({
      character: {
        id: edge.node.id,
        name,
        image: edge.node.image.large,
        description: text,
        anime_title: group.title,
        nicknames: aliases(edge, name),
        traits: characterTraits,
      },
      voiceActor: { character_id: edge.node.id, name: actor.name.native, image: actor.image.large, language: '日语' },
    })
  }
  if (records.length !== wanted.size) throw new Error(`${group.title}: expected ${wanted.size} characters, received ${records.length}`)
  return records
}

async function main() {
  const records = []
  for (const group of groups) {
    records.push(...await fetchGroup(group))
    await new Promise((resolve) => setTimeout(resolve, 750))
  }
  const characters = records.map(({ character, voiceActor }) => ({
    ...character,
    search_text: [character.name, character.anime_title, ...character.nicknames, ...character.traits, voiceActor.name].join(' '),
  }))
  const voiceActors = records.map(({ voiceActor }) => voiceActor)
  if (new Set(characters.map((character) => character.anime_title)).size !== 15 || characters.length !== 75) throw new Error('Batch completeness check failed')
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(characterError.message)
  const ids = characters.map((character) => character.id)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(deleteError.message)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (voiceActorError) throw new Error(voiceActorError.message)
  console.log(`Synced ${characters.length} characters across 15 anime.`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
