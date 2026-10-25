import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))

const patches = {
  253608: {
    description: '玉城杏夏是偶像组合TiNgS的成员，15岁，身高158厘米。她拥有稳定的歌唱和舞蹈能力，是支撑组合舞台表现的重要成员。她外表可爱，性格却十分冷静，偶尔会严厉地提醒团员和经纪人直辉。她的生日是1月17日，血型为A型，喜欢芝士汉堡、不喜欢酸奶，常说“只是个俏皮的笑话”。',
    traits: ['TiNgS成员', '15岁', '生日为1月17日', 'A型血', '身高158厘米', '歌唱稳定', '舞蹈能力稳定', '性格冷静', '外表可爱', '会严厉提醒团员和经纪人', '喜欢芝士汉堡', '不喜欢酸奶', '口头禅是“只是个俏皮的笑话”', '棕发', '棕瞳'],
    sourceText: '『TiNgS』のメンバー。安定した歌唱力とダンス力で『TiNgS』を支える。可愛い外見とは似つかわしくない冷静な性格で、時折メンバーや直輝に厳しい発言も。年齢15歳。誕生日1月17日。血液型A型。身長158cm。好きなものチーズバーガー。嫌いなものヨーグルト。口癖“お茶目なジョークです”。',
  },
  253612: {
    description: '祇园寺雪音是与伊藤红叶组成“ゆきもじ”组合活动的偶像，16岁，身高164厘米。她属于热血型女孩，父母都是知名演员，她本人也有出色的演技。她的生日是8月8日，血型为AB型，喜欢特辣咖喱饭，平时会自信地说“交给本小姐吧！”。',
    traits: ['16岁', '生日为8月8日', 'AB型血', '身高164厘米', '与伊藤红叶组成“ゆきもじ”组合', '热血型性格', '父母都是知名演员', '本人演技出色', '喜欢特辣咖喱饭', '口头禅是“交给本小姐吧”', '红发', '紫瞳'],
    sourceText: '紅葉と一緒に『ゆきもじ』というユニットで活動している、熱血タイプの女の子。両親共に名のある俳優で、本人も優れた演技力を備えている。年齢16歳。誕生日8月8日。血液型AB型。身長164cm。好きなものカレーライス(激辛)。嫌いなもの無し。口癖“私様にお任せだ！”',
  },
  253614: {
    description: '伊藤红叶是艺能事务所Brightest旗下的偶像，与祇园寺雪音组成“ゆきもじ”组合。她14岁，身高146厘米，舞蹈实力尤其突出。圣舞理王曾用“让人战栗的笨蛋”来形容她，带有调侃意味。她的生日是8月15日，血型为A型，喜欢梨，口头禅是“いとおかし”。',
    traits: ['Brightest事务所所属', '14岁', '生日为8月15日', 'A型血', '身高146厘米', '与祇园寺雪音组成“ゆきもじ”组合', '舞蹈实力突出', '被圣舞理王调侃为“让人战栗的笨蛋”', '喜欢梨', '口头禅是“いとおかし”', '蓝发', '紫瞳'],
    sourceText: '芸能事務所「ブライテスト」に所属し、雪音と『ゆきもじ』というユニットで活動している。ダンスの実力はピカ一だが、理王曰く「戦慄するバカ」のレベルらしい（？）。年齢14歳。誕生日8月15日。血液型A型。身長146cm。好きなもの梨。嫌いなもの無し。口癖“いとおかし”。',
  },
}

const expected = {
  253608: ['闪耀路标', 'Moeko Kanisawa'],
  253612: ['闪耀路标', 'Rimo Hasegawa'],
  253614: ['闪耀路标', 'Rika Nakagawa'],
}
const ids = Object.keys(patches).map(Number)
for (const id of ids) {
  const row = byId.get(id)
  const slimRow = slimById.get(id)
  const patch = patches[id]
  if (!row || !slimRow || row.anime_title !== expected[id][0]) throw new Error(`本地角色身份缺失或作品错误：${id}`)
  if (!(row.voice_actors || []).some(actor => actor.name === expected[id][1])) throw new Error(`AniList 声优关系不一致：${id}`)
  if (patch.description.length < 100 || patch.description.length > 200 || patch.traits.length < 8) throw new Error(`简介或特征长度不合格：${id}`)
  row.description = patch.description
  row.traits = [...new Set(patch.traits)]
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的简介进入搜索索引`)
  for (const key of ['description', 'traits', 'search_text']) slimRow[key] = row[key]
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
for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds']) report[key] = (report[key] || []).map(Number).filter(id => !ids.includes(id))
report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...ids])].sort((a, b) => a - b)
report.profileFactsRound28 = ids.map(id => ({ id, source: 'https://shinepost.jp/character/', officialPageTitle: 'CHARACTER｜「シャインポスト」公式サイト' }))
report.localFollowup ||= {}
report.localFollowup.profileFactsRound28 = { updatedAt: new Date().toISOString(), correctedDescriptionsTraits: ids, externalWritePending: true }
report.note = '依据《闪耀路标》官方角色页补写角色简介、团体定位及已公开的性格、年龄、生日、身高和喜好；颜色沿用已复核的头像特征。'
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

const evidence = {
  fetchedAt: new Date().toISOString(),
  source: { title: 'CHARACTER｜「シャインポスト」公式サイト', url: 'https://shinepost.jp/character/' },
  characters: Object.fromEntries(ids.map(id => [id, { officialJapaneseText: patches[id].sourceText, verifiedVoiceActor: expected[id][1], voiceActorSource: `https://anilist.co/character/${id}` }])),
}
fs.writeFileSync(`${root}/official-profile-facts-round28.json`, JSON.stringify(evidence, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
const marker = '\n\n## 《闪耀路标》官方人物资料补核（Round 28）'
const prior = summary.indexOf(marker)
if (prior >= 0) summary = summary.slice(0, prior)
summary += `${marker}（${new Date().toISOString().slice(0, 10)}）\n\n- 依据官方角色页 https://shinepost.jp/character/，重写玉城杏夏、祇园寺雪音、伊藤红叶 3 条简介，补入 TiNgS／“ゆきもじ”定位、年龄、生日、性格、技能与喜好。\n- 重建搜索索引，简介未进入搜索；颜色沿用既有视觉核对。声优与 AniList 对应已检查。\n- Supabase 写入待完成；未提交或推送 Git。\n`
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ corrected: ids, descriptionLengths: Object.fromEntries(ids.map(id => [id, patches[id].description.length])) }, null, 2))
