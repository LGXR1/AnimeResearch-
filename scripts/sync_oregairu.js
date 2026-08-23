import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const ANI_LIST_API = 'https://graphql.anilist.co'
const ANIME_TITLE = '我的青春恋爱物语果然有问题'

const records = {
  '雪ノ下陽乃': {
    name: '雪之下阳乃', nicknames: ['Haruno Yukinoshita', '雪之下', '阳乃', 'Haruno', '雪之下阳乃'],
    traits: ['黑发', '红色眼瞳', '长发', '雪乃的姐姐', '大学生', '成熟', '洞察力强', '笑面腹黑', '社交能力强'],
    description: '雪之下阳乃是雪之下雪乃的姐姐，也是侍奉部关系中最擅长旁观与试探的人。她外表亲切随和，谈吐从容，常带着轻松的笑容接近八幡等人；但她对人际关系的洞察十分敏锐，尤其在意雪乃能否摆脱家族期待并建立真正独立的自我。阳乃并不直接替妹妹作决定，而是用近乎苛刻的提问逼迫众人面对自己的真实想法。',
  },
  '川崎沙希': {
    name: '川崎沙希', nicknames: ['Saki Kawasaki', '川崎', '沙希', 'Saki', '川崎沙希'],
    traits: ['黑发', '紫色眼瞳', '长发', '不良风格', '打工', '姐姐', '外冷内热', '重视家人', '直率'],
    description: '川崎沙希是八幡的同班同学，外表带着不良少女的疏离感，实际上性格直接而且很有责任心。她为了照顾弟弟大志、减轻家里的负担而偷偷打工，因而与侍奉部产生交集。沙希不擅长用柔和的方式表达关心，却会把家人的需要放在第一位；在熟人面前，她也会显露出意外坦率和可靠的一面。',
  },
  '海老名姫菜': {
    name: '海老名姬菜', nicknames: ['Hina Ebina', '海老名', '姬菜', 'Hina', '海老名姬菜'],
    traits: ['棕发', '棕色眼瞳', '眼镜', '腐女', '御宅族', '开朗', '观察力强', '优美子的朋友', '喜欢妄想'],
    description: '海老名姬菜是由比滨结衣和三浦优美子身边的好友，平日看起来开朗随和，实际上是一名热衷于同人创作与妄想的腐女。她常把班上男生之间的互动解读成浪漫情节，并以夸张的热情表达自己的兴趣。姬菜虽然喜欢开玩笑，却很会观察周围的气氛；她在结衣所属的小团体里，常以轻松的方式缓和尴尬场面。',
  },
  '鶴見留美': {
    name: '鹤见留美', nicknames: ['Rumi Tsurumi', '鹤见', '留美', 'Rumi', '鹤见留美'],
    traits: ['黑发', '棕色眼瞳', '小学生', '安静', '孤立', '成熟早慧', '夏令营', '内向', '敏感'],
    description: '鹤见留美是在侍奉部协助夏令营活动时遇到的小学生。她因为沉默寡言又不擅长迎合群体，被同龄人有意疏远，早早体会到人际关系的残酷。留美并不软弱，她清楚地观察着周围人的排斥，也拒绝用虚假的和解掩饰问题。她的经历让八幡、雪乃和结衣对帮助他人的方式产生了截然不同的思考。',
  },
  '平塚静': {
    name: '平塚静', nicknames: ['Shizuka Hiratsuka', '平塚', '静', 'Shizuka', '静老师', '平塚静'],
    traits: ['黑发', '蓝色眼瞳', '教师', '生活指导老师', '侍奉部顾问', '成熟', '武力值高', '直率', '单身'],
    description: '平塚静是总武高中的国文教师、生活指导老师，也是侍奉部的顾问。她看出八幡和雪乃身上各自的孤独与偏执，因此推动两人成立侍奉部并不断给予课题。静老师说话强硬、行动果断，必要时会直接用拳头教育学生，但她始终认真关心学生的成长。她既是促成故事开始的引路人，也是八幡最信任的成年咨询对象之一。',
  },
  '川崎大志': {
    name: '川崎大志', nicknames: ['Taishi Kawasaki', '川崎', '大志', 'Taishi', '沙希的弟弟', '川崎大志'],
    traits: ['棕发', '棕色眼瞳', '小学生', '川崎沙希的弟弟', '开朗', '姐姐控', '足球', '天真', '活泼'],
    description: '川崎大志是川崎沙希的弟弟，性格开朗直率，非常崇拜并依赖姐姐。他和同学们一起出现在夏令营篇，天真的言行与姐姐刻意保持的冷淡形象形成鲜明对比。大志并不知道沙希为了家庭所做的许多努力，却能从日常相处中感受到姐姐的关心。他的存在也让八幡等人更理解沙希打工背后的家庭责任。',
  },
  '三浦優美子': {
    name: '三浦优美子', nicknames: ['Yumiko Miura', '三浦', '优美子', 'Yumiko', '优美子', '三浦优美子'],
    traits: ['金发', '蓝色眼瞳', '辣妹', '班级中心', '叶山隼人的青梅竹马', '强势', '傲娇', '重视朋友', '时尚'],
    description: '三浦优美子是班级里最受瞩目的女生之一，也是叶山隼人青梅竹马和结衣的小团体核心。她外表强势、说话直接，对不熟悉的人经常显得挑剔，却非常重视自己认可的朋友。优美子对叶山抱有复杂的好感，也会因为结衣的处境主动或间接寻求侍奉部帮助。她的强硬并非单纯任性，而是维护小团体关系的一种方式。',
  },
  '城廻めぐり': {
    name: '城廻惠', nicknames: ['Meguri Shiromeguri', '城廻', '惠', 'Meguri', '城廻惠'],
    traits: ['棕发', '棕色眼瞳', '学生会长', '温柔', '天然', '学姐', '善良', '亲和力', '可靠'],
    description: '城廻惠是总武高中的学生会长，也是八幡等人的学姐。她性格温和，待人没有距离感，工作上却能认真承担学生会长的职责。惠在准备卸任时拜托侍奉部协助寻找继任者，由此引出一色彩羽加入学生会的契机。她看似有些天然和迟钝，却能以不施压的方式照顾身边的人，是学校里让人安心的前辈。',
  },
  '葉山隼人': {
    name: '叶山隼人', nicknames: ['Hayato Hayama', '叶山', '隼人', 'Hayato', '叶山隼人'],
    traits: ['金发', '绿色眼瞳', '高人气', '足球部', '优等生', '温柔', '责任感强', '完美主义', '八幡的同学'],
    description: '叶山隼人是总武高中公认的风云人物，成绩优秀、擅长足球、待人温和，身边总是聚集着同学。他愿意帮助每个人，也努力维持团体表面的和谐，但这种选择常让他回避真正尖锐的矛盾。叶山与八幡在解决问题的方式上形成鲜明对照：前者追求所有人都能接受的结果，后者则常独自承担被误解的代价。',
  },
  '相模南': {
    name: '相模南', nicknames: ['Minami Sagami', '相模', '南', 'Minami', '相模南'],
    traits: ['棕发', '棕色眼瞳', '文化祭', '执行委员长', '自尊心强', '缺乏自信', '在意评价', '同班同学', '成长'],
    description: '相模南是文化祭执行委员会的委员长，渴望在众人面前证明自己的能力，却难以承受实际工作带来的压力。她很在意同学的评价，也会因为害怕失败而把责任推给别人，最终使文化祭筹备陷入僵局。相模的故事并非单纯的对错判断，而是描绘一个普通学生在自尊、焦虑与期待之间的摇摆，并促使侍奉部成员重新审视解决问题的代价。',
  },
  '材木座義輝': {
    name: '材木座义辉', nicknames: ['Yoshiteru Zaimokuza', '材木座', '义辉', 'Yoshiteru', '中二病', '材木座义辉'],
    traits: ['黑发', '棕色眼瞳', '中二病', '轻小说作家', '御宅族', '八幡的朋友', '夸张', '武士', '热血'],
    description: '材木座义辉是八幡的同班同学，也是自称拥有武士灵魂的重度中二病患者。他热衷写轻小说和幻想故事，总以夸张的台词与姿势包装自己，却常因作品内容和现实社交而苦恼。材木座的言行很滑稽，但他对创作的热情十分真诚。八幡虽然经常吐槽他，仍会在他遇到困难时提供帮助，两人的相处保留着难得的直接与轻松。',
  },
  '比企谷小町': {
    name: '比企谷小町', nicknames: ['Komachi Hikigaya', '比企谷', '小町', 'Komachi', '八幡的妹妹', '比企谷小町'],
    traits: ['棕发', '棕色眼瞳', '妹妹', '初中生', '聪明', '善于察言观色', '兄控', '家务', '可爱'],
    description: '比企谷小町是八幡的妹妹，聪明伶俐，极擅长观察他人的情绪和关系变化。她会照顾生活上有些散漫的哥哥，也常以轻松的玩笑点出八幡不愿承认的心思。小町并不只是依赖哥哥的妹妹，她有自己的升学烦恼和成长目标；随着故事推进，她逐渐从被八幡保护的家人，成长为能够反过来支持哥哥的人。',
  },
  '戸部翔': {
    name: '户部翔', nicknames: ['Kakeru Tobe', '户部', '翔', 'Kakeru', '户部翔'],
    traits: ['棕发', '棕色眼瞳', '足球部', '叶山的朋友', '开朗', '轻浮风格', '直率', '同班同学', '恋爱烦恼'],
    description: '户部翔是叶山隼人身边的朋友，属于足球部成员，性格开朗健谈，常以轻松随意的方式与人相处。他对海老名姬菜抱有好感，希望侍奉部帮助自己告白，却因此让小团体原本微妙的平衡面临改变。户部并没有恶意，只是不够擅长理解复杂的人际暗示。他的恋爱烦恼成为八幡、叶山和结衣对友情与关系维持产生分歧的重要契机。',
  },
  '戸塚彩加': {
    name: '户塚彩加', nicknames: ['Saika Totsuka', '户塚', '彩加', 'Saika', '网球部', '户塚彩加'],
    traits: ['银发', '蓝色眼瞳', '男生', '网球部', '可爱', '温柔', '内向', '八幡的朋友', '认真'],
    description: '户塚彩加是八幡的同班同学和网球部成员，性格温柔、待人真诚，拥有容易被误认为女生的可爱外表。他希望提升网球部的实力，因此委托侍奉部协助训练。彩加毫无心机的善意常让八幡手足无措，也成为八幡少数能放下防备、自然相处的朋友之一。无论在社团活动还是日常对话中，他都以认真和体贴给周围人留下深刻印象。',
  },
  '大岡': {
    name: '大冈', nicknames: ['Oooka', '大冈', '叶山的朋友'],
    traits: ['棕发', '棕色眼瞳', '足球部', '叶山的朋友', '同班同学', '开朗', '团体成员', '男生'],
    description: '大冈是叶山隼人身边的朋友，也是足球部成员之一。他通常与户部翔、大和一同行动，构成班级里围绕叶山的男生小团体。大冈在故事中的戏份不如侍奉部成员突出，却是观察班级社交结构的重要角色：他认可叶山的领导力，也会在集体活动和文化祭等场合参与维持团队的氛围。他的存在让叶山身边的人际网络更具真实感。',
  },
}

function buildSearchText(character, voiceActors) {
  return [character.name, character.anime_title, ...character.nicknames, ...character.traits, ...voiceActors.map((actor) => actor.name)].join(' ')
}

async function fetchAnimeCharacters() {
  const query = `query { Media(id: 14813, type: ANIME) { characters(page: 1, perPage: 50, sort: ROLE) { edges { node { id name { native } image { large } } voiceActors(language: JAPANESE) { name { native } image { large } } } } } }`
  const response = await fetch(ANI_LIST_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  return payload.data.Media.characters.edges
}

async function main() {
  const source = await fetchAnimeCharacters()
  const sourceByName = new Map(source.map((edge) => [edge.node.name.native, edge]))
  const characters = []
  const voiceActors = []

  for (const [nativeName, details] of Object.entries(records)) {
    const edge = sourceByName.get(nativeName)
    if (!edge) throw new Error(`AniList did not return ${nativeName}`)
    const actor = edge.voiceActors[0]
    if (!edge.node.image?.large || !actor?.name?.native || !actor.image?.large) throw new Error(`${details.name} has incomplete AniList media data`)

    const character = { id: edge.node.id, name: details.name, image: edge.node.image.large, description: details.description, anime_title: ANIME_TITLE, nicknames: details.nicknames, traits: [...new Set(details.traits)] }
    if (character.description.length < 100 || character.description.length > 200 || character.traits.length < 8 || character.nicknames.length === 0) throw new Error(`${character.name} does not meet the data specification`)
    const voiceActor = { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' }
    characters.push({ ...character, search_text: buildSearchText(character, [voiceActor]) })
    voiceActors.push(voiceActor)
  }

  const ids = characters.map((character) => character.id)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(`Character sync failed: ${characterError.message}`)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(`Voice actor cleanup failed: ${deleteError.message}`)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (voiceActorError) throw new Error(`Voice actor sync failed: ${voiceActorError.message}`)
  console.log(`Synced ${characters.length} ${ANIME_TITLE} characters and ${voiceActors.length} Japanese voice actors.`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
