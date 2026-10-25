import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const profiles = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles.json`, 'utf8')).profiles

const patches = {
  249256: {
    native: 'ソフィア・ブルガ', voice: 'Miyuki Sawashiro',
    nicknames: ['Sofia Bulga', '索菲亚', 'ソフィア・ブルガ', 'Dragon Slayer'],
    description: '索菲亚·布尔加是公会登记在册的著名冒险者。在巴与澪加入之前，她曾是公会最强的冒险者。她以讨伐巨龙兰萨闻名：兰萨以龙形态被她击败后，索菲亚获授“龙杀手”称号，并被评为SSS级。她的冒险者经历与讨伐龙种的战绩构成了她在异世界中的名声。',
    traits: ['著名冒险者', '公会登记的冒险者', '曾是公会最强冒险者', '龙杀手', 'SSS级评价', '击败龙形态的兰萨', '有讨伐巨龙的战绩', '银发', '金瞳'],
  },
  250490: {
    native: '八百歳比名子', voice: 'Reina Ueda',
    nicknames: ['Hinako Yaotose', '雏子', '八百谷雏子', '八百歳比名子'],
    description: '八百谷雏子是居住在海边小镇的高中生，原本过着平静的生活。她六岁时在一次旅行中失去了家人，此后性格冷静、内向且富于逻辑。夏季来临时，她常感到自己与朋友之间有些疏离。她偶尔会吸引包括海岸附近海怪在内的凶暴怪物；资料也提到她身上显现出创伤后应激的迹象。',
    traits: ['高中生', '生活在海边小镇', '六岁旅行时失去家人', '冷静', '逻辑性强', '内向', '夏季会感到与朋友疏离', '偶尔吸引凶暴怪物', '会吸引海岸附近的海怪', '有创伤后应激迹象', '棕发', '金瞳'],
  },
  250641: {
    native: '女神', voice: 'Yukari Tamura',
    nicknames: ['Megami', '女神', 'Goddess', 'Venus', 'Great Chalk Goddess'],
    description: '女神是令职业杀手卢格·图阿哈德转生到异世界的存在，并交给他杀死该世界勇者的使命。她还操纵命运，让卢格与玛哈、塔儿朵和迪亚相遇。AniList角色资料指出，如果卢格没有转生，后三人原本都注定会死。她安排转生并发布任务，由此推动故事的关键事件。',
    traits: ['女神', '安排卢格·图阿哈德转生', '把杀死勇者设为卢格的使命', '操纵命运', '促成卢格与玛哈相遇', '促成卢格与塔儿朵相遇', '促成卢格与迪亚相遇', '知道三人的既定命运', '转生事件的安排者', '发布讨伐勇者任务'],
  },
  255890: {
    native: '阿古屋真珠', voice: 'Yuuka Aisaka',
    nicknames: ['Matama Akoya', '真珠', '阿古屋真珠', 'Loco Musica', 'ロコムジカ', 'Loco', 'ロコ', 'Utaboshi Pearl'],
    description: '阿古屋真珠是恩诺尔米塔的成员，变身后以“洛可穆吉卡”之名活动，身高155厘米。她性格开朗，也相当自恋，对批评很敏感；她害怕恩诺尔米塔首领恩诺尔米与魔法缇娜。她唱歌并不擅长，近期希望自己的演唱视频能在社交平台走红。甜蛋卷是她喜欢的食物，香菜则是她不喜欢的食物。',
    traits: ['恩诺尔米塔成员', '变身名为洛可穆吉卡', '身高155厘米', '性格开朗', '自恋', '对批评敏感', '害怕恩诺尔米', '害怕魔法缇娜', '不擅长唱歌', '希望演唱视频走红', '喜欢甜蛋卷', '讨厌香菜', '紫发', '蓝瞳'],
  },
  256378: {
    native: '諸葛孔明', voice: 'Ryoutarou Okiayu',
    nicknames: ['Kongming Zhuge', '孔明', '诸葛孔明', '诸葛亮', '諸葛孔明', 'Koumei', 'Zhuge Liang', 'Crouching Dragon'],
    description: '诸葛孔明是三国时期蜀汉的丞相与著名军师，临终时希望转生到一个和平的世界。此后他来到现代东京，在涩谷遇见歌手月见英子，并成为她的军师。孔明将熟悉的谋略用于现代音乐活动，帮助英子策划演出、吸引听众，协助她朝着成为知名歌手的目标前进。',
    traits: ['三国时期人物', '蜀汉丞相', '著名军师', '精通谋略', '临终希望转生到和平世界', '转生到现代东京', '在涩谷遇见月见英子', '成为月见英子的军师', '将谋略用于音乐活动', '棕发', '棕瞳'],
  },
}

const ids = Object.keys(patches).map(Number)
for (const id of ids) {
  const row = byId.get(id)
  const slimRow = slimById.get(id)
  const profile = profiles[id]
  const patch = patches[id]
  if (!row || !slimRow) throw new Error(`本地导出缺少角色 ${id}`)
  if (row.anime_title !== (id === 249256 ? '月光下的异世界之旅' : id === 250490 ? '对我垂涎欲滴的非人少女' : id === 250641 ? '世界顶尖的暗杀者转生为异世界贵族' : id === 255890 ? '憧憬成为魔法少女' : '派对浪客诸葛孔明')) throw new Error(`作品对应不一致：${id}`)
  if (profile?.name?.native !== patch.native) throw new Error(`AniList 原名不匹配：${id}`)
  if (!(row.voice_actors || []).some(actor => actor.name === patch.voice)) throw new Error(`声优关系不匹配：${id}`)
  if (patch.description.length < 100 || patch.description.length > 200 || patch.traits.length < 8) throw new Error(`简介或特征长度不合格：${id}`)
  row.nicknames = [...new Set(patch.nicknames)]
  row.description = patch.description
  row.traits = [...new Set(patch.traits)]
  row.search_text = [row.name, row.anime_title, ...row.nicknames, ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的简介进入搜索索引`)
  for (const key of ['nicknames', 'description', 'traits', 'search_text']) slimRow[key] = row[key]
}

const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csv = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) csv.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${csv.join('\n')}\n`)

const reportPath = `${root}/batch104-audit-report.json`
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const checked = new Set((report.checkedIds || []).map(Number))
for (const id of ids) if (!checked.has(id)) throw new Error(`角色 ${id} 不在第104批范围`)
for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds']) {
  report[key] = (report[key] || []).map(Number).filter(id => !ids.includes(id))
}
report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...ids])].sort((a, b) => a - b)
report.profileFactsRound27 = ids.map(id => ({ id, source: `https://anilist.co/character/${id}`, verifiedVoiceActor: patches[id].voice }))
report.localFollowup ||= {}
report.localFollowup.profileFactsRound27 = { updatedAt: new Date().toISOString(), correctedDescriptionsTraitsAndAliases: ids, externalWritePending: true }
report.note = '依据 AniList 官方角色资料改写短简介、具体化特征并补充角色别名；原有颜色特征沿用已完成的视觉复核。'
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

const evidence = {
  fetchedAt: new Date().toISOString(),
  source: 'AniList character profiles; native names, biographies and Japanese anime voice relations',
  characters: Object.fromEntries(ids.map(id => [id, { name: profiles[id].name.full, native: profiles[id].name.native, description: profiles[id].description, verifiedVoiceActor: patches[id].voice, url: `https://anilist.co/character/${id}` }])),
}
fs.writeFileSync(`${root}/anilist-profile-facts-round27.json`, JSON.stringify(evidence, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
const marker = '\n\n## AniList 角色资料与特征补核（Round 27）'
const prior = summary.indexOf(marker)
if (prior >= 0) summary = summary.slice(0, prior)
summary += `${marker}（${new Date().toISOString().slice(0, 10)}）\n\n- 依据 AniList 角色原名、人物资料和日语声优关联，重写索菲亚、八百谷雏子、女神、阿古屋真珠、诸葛孔明 5 条简介；修正空泛特征，并补充已知别名。\n- 更新本地搜索索引；简介未进入搜索。头像颜色沿用此前视觉复核结果。来源和对应关系见 anilist-profile-facts-round27.json。\n- Supabase 写入待完成；未提交或推送 Git。\n`
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ corrected: ids, descriptionLengths: Object.fromEntries(ids.map(id => [id, patches[id].description.length])) }, null, 2))
