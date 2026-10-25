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
const sourceUrl = id => `https://anilist.co/character/${id}`

const patches = {
  222104: {
    name: '藤井佳奈',
    nicknames: ['Kana Fujii', '藤井かな', '佳奈'],
    description: '藤井佳奈是《歌愈少女》中的歌愈师见习生，在乌丸声疗院接受训练。她性格开朗、情绪积极，喜欢唱歌。幼年时，佳奈曾受到一位歌愈师帮助，这段经历让她一直憧憬对方，也成为她学习歌愈、走上声疗之路的重要缘由。她会继续在声疗院接受训练。',
    traits: ['歌愈师见习生', '乌丸声疗院培训生', '性格开朗', '情绪积极', '喜欢唱歌', '幼年曾受歌愈师帮助', '憧憬帮助过自己的歌愈师', '女性', '红发', '棕瞳'],
  },
  222105: {
    name: '矢薙索尼娅',
    nicknames: ['Sonia Yanagi', '矢薙ソニア', '索尼娅'],
    description: '矢薙索尼娅是《歌愈少女》的高中一年级生，与藤井佳奈就读于同一所学校。AniList 所载官方简介只说明这两项信息，暂缺她个人经历与性格的可靠细节。',
    traits: ['女性', '高中一年级生', '与藤井佳奈同校', '白发', '蓝瞳'],
    pending: ['description', 'traits'],
  },
  222106: {
    name: '五城玲美',
    nicknames: ['Reimi Itsushiro', '五城玲美', '玲美'],
    description: '五城玲美是《歌愈少女》中举止端庄、受人尊敬的少女。她在乌丸声疗院工作，与藤井佳奈、森岛响一同朝成为歌愈师的目标努力。AniList 引用的官方简介没有交代她的家庭或过往经历，故本条只保留已确认的身份、性格和工作关系。',
    traits: ['少女', '举止端庄', '受人尊敬', '在乌丸声疗院工作', '与藤井佳奈一同工作', '与森岛响一同工作', '目标成为歌愈师', '女性', '金发', '紫瞳'],
  },
  222107: {
    name: '森岛响',
    nicknames: ['Hibiki Morishima', '森嶋響', '森岛響', '响'],
    description: '森岛响是乌丸声疗院的歌愈师见习生，喜欢唱歌。她是家中六个弟妹的长姐，会照顾弟妹，也擅长做饭。她的父母在乡间兼职务农；响目前住在乌丸声疗院内，并在那里继续学习歌愈，磨练成为歌愈师所需的本领。她也在日常生活中照料弟妹并继续学习歌愈。',
    traits: ['歌愈师见习生', '喜欢唱歌', '有六个弟妹的长姐', '会照顾弟妹', '擅长做饭', '父母在乡间兼职务农', '住在乌丸声疗院', '女性', '白发', '蓝瞳'],
  },
  253609: {
    name: '青天国春',
    nicknames: ['Haru Nabatame', '青天国春', '春', 'Haru'],
    description: '青天国春是16岁的偶像团体TiNgS成员，身高160厘米。AniList 角色资料提到，经纪人日瀬直树常称赞她具有出色的观察与调整能力。她参与组合的偶像活动，并以细致观察周围情况、及时调整行动见长。她也是团体中擅长观察的成员之一。',
    traits: ['TiNgS成员', '偶像', '16岁', '身高160厘米', '观察能力出众', '善于调整安排', '女性', '棕发', '蓝瞳'],
  },
  253611: {
    name: '圣舞理王',
    nicknames: ['Rio Seibu', '聖舞理王', '圣舞理王', '理王', 'Rio'],
    description: '圣舞理王是14岁的偶像团体TiNgS成员，身高155厘米。AniList 角色资料提到，经纪人日瀬直树常以她的勤勉努力为特点进行介绍。她活跃于组合偶像活动中，努力投入练习和工作；本条不扩写未经证实的过往经历。',
    traits: ['TiNgS成员', '偶像', '14岁', '身高155厘米', '勤勉努力', '积极参与组合活动', '女性', '金发', '红瞳'],
  },
  306616: {
    name: '河原木桃香',
    nicknames: ['Momoka Kawaragi', '河原木桃香', '桃香', 'Momoka'],
    description: '河原木桃香是20岁的街头音乐家，身高164厘米。她性格随和而坚定，不喜欢过于女性化的装扮，习惯披着头发、穿着朴素；为人开朗体贴，给人以运动社团中可靠前辈的印象。她后来在乐队中担任吉他手，也把街头演奏经验带进团队活动中。',
    traits: ['街头音乐家', '吉他手', '20岁', '身高164厘米', '性格随和', '意志坚定', '不喜欢过于女性化的装扮', '习惯披散头发', '衣着朴素', '开朗体贴', '有可靠前辈气质', '银发', '蓝瞳'],
  },
  306618: {
    name: '安和昴',
    nicknames: ['Subaru Awa', '安和すばる', '安和昴', '昴', 'Subaru'],
    description: '安和昴是17岁的娱乐学校学生，身高158厘米。她曾出演广告，未来发展备受期待，也具备成为模特的外形条件；她善于交际、举止优雅，但内心意志坚强且好胜。加入乐队后她担任鼓手，与成员们共同参与演出，也是《Girls Band Cry》乐队故事中的鼓手成员。',
    traits: ['娱乐学校学生', '鼓手', '17岁', '身高158厘米', '出演过广告', '有成为模特的潜力', '善于交际', '举止优雅', '意志坚强', '好胜', '黑发', '紫瞳'],
  },
}

const expectations = {
  222104: { anime: '歌愈少女', oldName: '藤井佳奈', profileNative: '藤井かな' },
  222105: { anime: '歌愈少女', oldName: '五城玲美', profileNative: '矢薙ソニア' },
  222106: { anime: '歌愈少女', oldName: '森岛響', profileNative: '五城玲美' },
  222107: { anime: '歌愈少女', oldName: '矢薙索尼娅', profileNative: '森嶋響' },
  253609: { anime: '闪耀路标', oldName: '圣舞理王', profileNative: '青天国春' },
  253611: { anime: '闪耀路标', oldName: '青天国春', profileNative: '聖舞理王' },
  306616: { anime: 'Girls Band Cry', oldName: '安和すばる', profileNative: '河原木桃香' },
  306618: { anime: 'Girls Band Cry', oldName: '河原木桃香', profileNative: '安和すばる' },
}

for (const [rawId, patch] of Object.entries(patches)) {
  const id = Number(rawId)
  const row = byId.get(id)
  const expected = expectations[id]
  const profile = profiles[id]
  if (!row || !slimById.has(id)) throw new Error(`本地导出缺少角色 ${id}`)
  if (row.anime_title !== expected.anime) throw new Error(`角色 ${id} 作品变化：${row.anime_title}`)
  if (row.name !== expected.oldName && row.name !== patch.name) throw new Error(`角色 ${id} 名称变化，拒绝覆盖：${row.name}`)
  if (profile?.name?.native !== expected.profileNative) throw new Error(`AniList 原名校验失败：${id}`)
  if (patch.traits.length < 5) throw new Error(`角色 ${id} 的可核特征不足`)
  if (!patch.pending && (patch.description.length < 100 || patch.description.length > 200)) throw new Error(`角色 ${id} 简介长度 ${patch.description.length} 不符合100–200字`)
  row.name = patch.name
  row.nicknames = [...new Set(patch.nicknames)]
  row.description = patch.description
  row.traits = [...new Set(patch.traits)]
  row.search_text = [row.name, row.anime_title, ...row.nicknames, ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的简介进入搜索索引`)
  const slimRow = slimById.get(id)
  for (const key of ['name', 'nicknames', 'description', 'traits', 'search_text']) slimRow[key] = row[key]
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

const reportIds = { 100: [222104, 222105, 222106, 222107], 104: [253609, 253611], 114: [306616, 306618] }
const resolvedIds = Object.keys(patches).map(Number).filter(id => !patches[id].pending)
for (const [rawBatch, ids] of Object.entries(reportIds)) {
  const batch = Number(rawBatch)
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const checked = new Set(report.checkedIds.map(Number))
  for (const id of ids) if (!checked.has(id)) throw new Error(`角色 ${id} 不在第 ${batch} 批范围`)
  for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds']) {
    report[key] = (report[key] || []).map(Number).filter(id => !resolvedIds.includes(id))
  }
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...ids])].sort((a, b) => a - b)
  report.identityFixesRound24 = ids.map(id => ({
    id,
    beforeName: expectations[id].oldName,
    afterName: patches[id].name,
    anilistProfile: sourceUrl(id),
    pending: patches[id].pending || [],
  }))
  report.localFollowup ||= {}
  report.localFollowup.profileIdentityRound24 = {
    updatedAt: new Date().toISOString(),
    correctedNames: ids.filter(id => expectations[id].oldName !== patches[id].name),
    descriptionAndTraitCorrections: ids.filter(id => !patches[id].pending),
    remainingThinSourceIds: ids.filter(id => patches[id].pending),
    voiceActorRelationsVerified: [222105, 222106, 222107].filter(id => ids.includes(id)),
    externalWritePending: true,
  }
  report.note = 'AniList 角色 ID 与原名逐项复核后，修正本批角色姓名及有来源支持的简介和特征；资料不足处继续待核。'
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const voiceEvidence = {
  fetchedAt: new Date().toISOString(),
  source: 'AniList GraphQL API; official character IDs, native names, anime voice actor relations',
  characters: {
    222105: { name: 'Sonia Yanagi', native: '矢薙ソニア', japaneseVoiceActor: 'Chihaya Yoshitake', source: 'https://anilist.co/character/222105' },
    222106: { name: 'Reimi Itsushiro', native: '五城玲美', japaneseVoiceActor: 'Marina Horiuchi', source: 'https://anilist.co/character/222106' },
    222107: { name: 'Hibiki Morishima', native: '森嶋響', japaneseVoiceActor: 'Akane Kumada', source: 'https://anilist.co/character/222107' },
    253609: { name: 'Haru Nabatame', native: '青天国春', japaneseVoiceActor: 'Sayumi Suzushiro', source: 'https://anilist.co/character/253609' },
    253611: { name: 'Rio Seibu', native: '聖舞理王', japaneseVoiceActor: 'Yuuko Natsuyoshi', source: 'https://anilist.co/character/253611' },
    306616: { name: 'Momoka Kawaragi', native: '河原木桃香', japaneseVoiceActor: 'Yuri', source: 'https://anilist.co/character/306616' },
    306618: { name: 'Subaru Awa', native: '安和すばる', japaneseVoiceActor: 'Mirei', source: 'https://anilist.co/character/306618' },
  },
}
fs.writeFileSync(`${root}/anilist-identity-voice-round24.json`, JSON.stringify(voiceEvidence, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
const summary = `\n\n## AniList ID 与角色名交叉核对（${new Date().toISOString().slice(0, 10)}）\n\n- 对照 AniList 官方角色 ID、原文名及日语动画声优关系，修正 7 位角色的名称错配：《歌愈少女》3 位、《闪耀路标》2 位、《Girls Band Cry》2 位。\n- 同步改写 7 条有资料支持的简介和特征；本地声优关系与 AniList 查询相符，没有更换声优记录。\n- 《歌愈少女》索尼娅（222105）的官方简介只确认年级及与佳奈同校，保留其简介和特征待补，不把其他人物设定套用给她。\n- 7 位角色的 ID、原名、日语声优关系和 AniList 来源保存在 anilist-identity-voice-round24.json；已重建搜索索引，简介不参与搜索。\n- Supabase 写入待完成；未提交或推送 Git。\n`
const summaryMarker = '\n\n## AniList ID 与角色名交叉核对'
let priorSummary = fs.readFileSync(summaryPath, 'utf8')
const previousSection = priorSummary.indexOf(summaryMarker)
if (previousSection >= 0) priorSummary = priorSummary.slice(0, previousSection)
fs.writeFileSync(summaryPath, priorSummary + summary)

console.log(JSON.stringify({
  correctedNameIds: Object.keys(patches).map(Number).filter(id => expectations[id].oldName !== patches[id].name),
  fixedDescriptionsAndTraits: resolvedIds,
  pending: [222105],
  voiceActorRelationsChanged: 0,
}, null, 2))
