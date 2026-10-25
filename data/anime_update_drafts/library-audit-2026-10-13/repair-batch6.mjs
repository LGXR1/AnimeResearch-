import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const profilePath = `${root}/anilist-character-profiles.json`
const reportPath = `${root}/batch6-audit-report.json`

const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const profileDoc = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
const startIndex = local.findIndex((row) => Number(row.id) === 1377)
if (startIndex < 0) throw new Error('找不到上批最后一位角色 ID 1377')
const batch = local.slice(startIndex + 1).filter((row) => Number(row.id) < 990000000).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const ids = batch.map((row) => Number(row.id))

const fixes = {
  1512: {
    traits: ['Gekkostate的领袖', '月光号Gekko的舰长', 'LFO机体驾驶员', '曾驾驶Terminus type R909', '后来驾驶Terminus B303', 'AniList档案记载年龄为29至31岁', '与塔尔荷·尤琪长期相恋', '资料暗示后来与塔尔荷结婚', '迪威·诺瓦克的弟弟'],
    description: '霍兰德·诺瓦克是Gekkostate的领袖和月光号Gekko的舰长，也是一名LFO驾驶员，曾驾驶Terminus type R909，后来改为B303。AniList档案记载他约29至31岁，是迪威·诺瓦克的弟弟；他与塔尔荷·尤琪长期相恋，资料暗示两人后来结婚。',
  },
  1530: {
    traits: ['月光号Gekko的首席驾驶员', '与希尔达是好友', '与霍兰德·诺瓦克长期交往', '两人的关系早于故事开始', '曾因霍兰德的态度而缺乏安全感', '会因霍兰德关注优莱卡而吃醋', '也介意霍兰德过去与戴安娜的关系', '负责驾驶月光号并参与Gekkostate行动'],
    description: '塔尔荷·尤琪是月光号Gekko的首席驾驶员，也是希尔达的好友。她与霍兰德·诺瓦克长期交往，两人的关系据称早于霍兰德服役时期。故事前期，塔尔荷因担心霍兰德对这段关系不够认真而缺乏安全感，也会对他关注优莱卡及过去与戴安娜的关系感到嫉妒。',
  },
  1709: {
    traits: ['Gekkostate成员', 'Nirvash type ZERO的驾驶员', '与兰顿·瑟斯顿共同驾驶Nirvash', '初登场时为14岁', '在续作时间线中约30岁', '说话平静直接', '起初难以理解他人的情绪', '与兰顿建立深厚羁绊', '后来收养莫里斯、梅特和林克'],
    description: '优莱卡是Gekkostate成员，也是Nirvash type ZERO的驾驶员，与兰顿·瑟斯顿共同驾驶机体。她起初难以理解他人的情绪，说话平静直接，常显得坦率而不擅交际；随着与兰顿建立羁绊，她逐渐理解人际关系。后来她收养莫里斯、梅特和林克；AniList记载她在续作时间线中约30至32岁。',
  },
  1720: {
    traits: ['被称为“花之少女”', '由月之花人工创造', '创造者是达西亚一世', '创造过程使用失传炼金术', '最初在研究设施中沉睡', '因狼血气味而苏醒', '与狼群建立特殊羁绊', '是寻找乐园的关键人物', '被多方势力追捕'],
    description: '切扎是《狼雨》中被称为“花之少女”的人物，由达西亚一世以失传炼金术从月之花人工创造。她最初在研究设施中沉睡，因狼群流下的血液气味而苏醒。狼群带走并保护切扎，使她免遭各方势力追捕；她与狼群有特殊羁绊，也是寻找乐园的关键。',
  },
  1743: {
    traits: ['真实姓名是宫野志保', '原属黑衣组织并使用代号雪莉', '负责研发APTX4869', '服下APTX4869后身体缩小', '以灰原哀的身份生活', '寄住在阿笠博士家', '与柯南同读帝丹小学', '是少数知道柯南真实身份的人', '尝试研发APTX4869的解药', '棕发'],
    description: '灰原哀的真实姓名是宫野志保，曾是黑衣组织的科学家，代号“雪莉”，负责研发APTX4869。她服下药物后身体缩小，以灰原哀的身份寄住在阿笠博士家，并与柯南同读帝丹小学。灰原知道柯南的真实身份，协助他对抗黑衣组织，也尝试研发APTX4869的解药。',
  },
  1810: {
    traits: ['《秒速五厘米》的主人公', '小学时与篠原明里相识并成为好友', '明里转学后两人持续书信往来', '后来因父母工作搬到种子岛', '与明里在雪夜重逢', '高中时加入弓道部', '成年后仍会回想童年与明里的关系', '黑发'],
    description: '远野贵树是《秒速五厘米》的主人公，小学时与篠原明里相识并成为好友。明里转学后，两人继续通信；贵树后来也因父母工作搬到种子岛，并在一个雪夜与明里重逢。高中时期他加入弓道部，之后各自生活的两人渐行渐远，贵树仍时常回想童年与明里的关系。',
  },
  1811: {
    traits: ['远野贵树的小学同学和好友', '小学毕业后搬到栃木县', '搬家原因是父母工作调动', '曾希望与贵树就读同一所初中', '转学后仍与贵树书信联系', '两人后来因距离与时间停止通信', '曾在雪夜与贵树重逢', '黑发棕瞳'],
    description: '篠原明里是远野贵树的小学同学和好友。小学毕业后，她因父母工作调动搬到栃木县，虽然曾希望与贵树就读同一所初中，仍不得不分开。转学后两人以书信保持联系，随着距离和时间拉长，通信也逐渐停止；他们曾在一个雪夜重逢。',
  },
  1812: {
    traits: ['远野贵树的高中同学', '从初中时期起就喜欢贵树', '擅长冲浪', '骑踏板车上学', '姐姐在她的高中担任教师', '一直难以向贵树表达感情', '努力练习冲浪', '棕发棕瞳'],
    description: '澄田花苗是远野贵树的高中同学，从初中时期起就喜欢他。她热爱冲浪，骑踏板车上学，并努力练习这项运动；她的姐姐也在同一所高中任教。花苗虽常与贵树相处，却一直难以表达感情，也逐渐意识到两人对未来的想法并不相同。',
  },
  1817: {
    name: '间柴了',
    nicknames: ['間柴了', 'Mashiba Ryou', 'Ryo Mashiba'],
    traits: ['职业拳击手', '间柴久美的哥哥', '与久美相依生活', '双亲在他求学时因事故去世', '对妹妹有强烈保护欲', '以“杀手”式拳击风格闻名', '擅长Flicker Jab', '擅长近距离斩击式右拳', '性格阴沉但也有善良一面'],
    description: '间柴了是职业拳击手，也是间柴久美的哥哥。双亲在他求学时因事故去世，此后他与妹妹相依生活，并对她十分保护。间柴以“杀手”式拳击风格闻名，擅长Flicker Jab和近距离斩击式右拳；他性格阴沉，却也会显露善良的一面。',
  },
  1818: {
    name: '间柴久美',
    nicknames: ['間柴久美', 'Kumi Mashiba'],
    traits: ['间柴了的妹妹', '性格温和、勤奋而有主见', '从事护士工作', '支持哥哥的拳击事业', '不喜欢看到哥哥在比赛中受伤', '会到现场为哥哥助威', '与幕之内一步相识并逐渐互有好感', '曾在医院以护士身份照顾一步'],
    description: '间柴久美是拳击手间柴了的妹妹，性格温和、勤奋而有主见。她从事护士工作，尽力支持哥哥，却不喜欢看到他在拳击比赛中受伤。久美后来在医院以护士身份照顾幕之内一步，两人逐渐互有好感，但这段关系常受到亲友干预。',
  },
  1821: {
    traits: ['日本职业羽量级拳击手', '以近身进攻型打法见长', '招牌技是强力“Smash”', '幕之内一步的主要对手之一', '曾多次在职业赛场与一步交手', '崇拜拳王洛奇·马西亚诺', '也是高村守的粉丝', '角色形象参考现实拳手赤井英和'],
    description: '千堂武士是日本职业羽量级拳击手，以近身进攻和强力“Smash”闻名。他是幕之内一步的主要对手之一，也是少数多次在职业赛场与一步交手的拳手。千堂崇拜洛奇·马西亚诺，也是高村守的粉丝；AniList资料提到，角色形象参考了现实拳手赤井英和。',
  },
  1839: {
    traits: ['《欢迎来到NHK》的主人公', '22岁', '已家里蹲近四年', '没有稳定工作', '独自租住公寓', '依靠父母寄来的生活费', '情绪不稳定且容易受人影响', '常把自身困境归因于NHK阴谋论', '与中原岬建立联系'],
    description: '佐藤达广是《欢迎来到NHK》的主人公，22岁，已家里蹲近四年，没有稳定工作，独自住在租来的公寓里并依靠父母寄来的生活费。他情绪不稳定、容易受人影响，常将自己的困境归因于虚构的“NHK阴谋”。与中原岬相识后，他开始面对孤立生活和自身问题。',
  },
  1872: {
    traits: ['紫色头发', '以修女形象现身', '大蛇众第二首', '是最先登场并发起攻击的大蛇众成员', '曾因经历战争而失去信仰', '在大蛇众中较为冷静', '能够控制吉罗奇', '可促使其他女性首暂时协同行动'],
    description: '宫司是《神无月的巫女》中以修女形象现身的大蛇众成员，留有紫色头发，身份为大蛇众第二首，也是最先登场并发起攻击的成员。她曾因经历战争而失去信仰，在大蛇众中相对冷静，能够控制吉罗奇，也能促使其他女性首暂时协同行动。',
  },
}

const localById = new Map(local.map((row) => [Number(row.id), row]))
for (const [idText, fix] of Object.entries(fixes)) {
  const row = localById.get(Number(idText))
  if (!row || !ids.includes(Number(idText))) throw new Error(`修正目标 ${idText} 不在本批中`)
  Object.assign(row, fix)
}

for (const row of batch) {
  const profile = profileDoc.profiles[row.id]
  row.nicknames = [...new Set([
    ...(row.nicknames || []),
    row.name,
    profile?.name?.full,
    profile?.name?.native,
    ...(profile?.name?.alternative || []),
  ].filter(Boolean))]
  row.voice_actors ||= []
  row.search_text = [row.name, row.anime_title, ...row.nicknames, ...(row.traits || []), ...row.voice_actors.map((actor) => actor.name)].join(' ')
  if (fixes[row.id] && (row.traits || []).length < 8) throw new Error(`角色 ${row.id} 特征少于8条`)
  if (fixes[row.id] && ((row.description || '').length < 100 || row.description.length > 200)) throw new Error(`角色 ${row.id} 简介长度不合格：${row.description?.length}`)
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${row.id} 的 search_text 包含简介`)
}

const slim = local.map((row) => ({
  id: row.id,
  name: row.name,
  anime_title: row.anime_title,
  image: row.image,
  description: row.description,
  nicknames: row.nicknames || [],
  traits: row.traits || [],
  voice_actors: (row.voice_actors || []).map(({ name, language, image }) => ({ name, language, image })),
}))
const csvField = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of local) lines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${lines.join('\n')}\n`)

const missingProfiles = ids.filter((id) => !profileDoc.profiles[id])
const colorRegex = /(头发|发色|发|眼瞳|瞳|眼睛|眼色|棕眼|蓝眼|黑眼|红眼|绿眼|金眼|紫眼)/
const pendingVisualVerificationIds = batch.filter((row) => (row.traits || []).some((trait) => colorRegex.test(trait))).map((row) => Number(row.id))
const report = {
  checkedAt: new Date().toISOString(),
  checkedCount: batch.length,
  profileVerifiedCount: batch.length - missingProfiles.length,
  checkedIds: ids,
  checkedRange: { firstId: ids[0], lastId: ids.at(-1) },
  modifiedIds: Object.keys(fixes).map(Number),
  source: {
    name: 'AniList GraphQL character profile snapshot plus local character record review',
    fetchedAt: profileDoc.fetchedAt,
    records: ids.filter((id) => profileDoc.profiles[id]).map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
  },
  pendingExternalVerificationIds: missingProfiles,
  pendingVisualVerificationIds,
  pendingSourceReviewIds: missingProfiles,
  verifiedCorrections: [
    { id: 1512, source: 'AniList profile 1512: Gekkostate leader, Gekko captain, Terminus R909 and later B303 pilot, age 29–31, older brother Dewey.' },
    { id: 1530, source: 'AniList profile 1530: Gekko head pilot, Hilda’s friend, Holland relationship and jealousy context.' },
    { id: 1709, source: 'AniList profile 1709: Gekkostate member, Nirvash pilot with Renton, communication traits and adopted children.' },
    { id: 1720, source: 'AniList profile 1720: Flower Maiden created from Lunar Flower with alchemy; wolf-blood awakening and Paradise role.' },
    { id: 1743, source: 'AniList profile 1743: Shiho Miyano/Sherry, APTX 4869 creator, shrunk form and Agasa household; removed unsupported clothing tag.' },
    { id: 1810, source: 'AniList profile 1810: friendship and letters with Akari, move to Tanegashima, snowy reunion, high-school kyudo club.' },
    { id: 1811, source: 'AniList profile 1811: childhood friend of Takaki, move to Tochigi, letters later cease.' },
    { id: 1812, source: 'AniList profile 1812: high-school classmate, surfing, scooter, feelings for Takaki and teacher sister.' },
    { id: 1817, source: 'AniList profile 1817: Mashiba’s protective relationship with Kumi, hitman style, Flicker Jab, chopping right.' },
    { id: 1818, source: 'AniList profile 1818: Kumi is Ryo’s younger sister, nurse, and Ippo’s love interest.' },
    { id: 1821, source: 'AniList profile 1821: Sendo is a featherweight in-fighter with Smash, Ippo rival, Marciano admirer and Takamura fan; it says the character was modeled after boxer Hidekazu Akai.' },
    { id: 1839, source: 'AniList profile 1839: 22-year-old hikikomori/NEET, rented apartment, parents’ allowance and imagined NHK conspiracy.' },
    { id: 1872, source: 'AniList profile 1872: purple-haired nun, Second Neck, war-related loss of faith and Orochi abilities.' },
  ],
  note: '已更新本地导出；本批中 AniList 快照缺少的角色标记为待查。Supabase 尚未同步。',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, profileVerified: report.profileVerifiedCount, modified: report.modifiedIds, missingProfiles, pendingVisualVerificationIds, reportPath }, null, 2))
