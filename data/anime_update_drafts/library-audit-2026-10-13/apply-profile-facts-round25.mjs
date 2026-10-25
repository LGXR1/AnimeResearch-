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
  239687: {
    name: '小黑', anime: '迷宫饭', sourceNative: 'クロ',
    nicknames: ['Kuro', 'Yodan', '小黑', 'クロ'],
    description: '小黑是《迷宫饭》中身高145厘米、18岁的雄性科波尔德。他与米克贝尔一同加入卡布鲁的队伍，始终忠于自己的主人。AniList 引用《迷宫饭世界导览：冒险者圣经》作为资料来源，确认了他的种族、年龄、身高和队伍关系。',
    traits: ['科波尔德族', '卡布鲁队伍成员', '与米克贝尔一同加入队伍', '忠于主人', '男性', '18岁', '身高145厘米', '《迷宫饭》角色'],
  },
  231851: {
    name: '米夏·尤尔', anime: '我推是反派大小姐', sourceNative: 'ミシャ・ユール',
    nicknames: ['Misha Jur', '米夏', '尤尔', 'ミシャ・ユール'],
    description: '米夏·尤尔是15岁的贵族少女，身高152厘米，是蕾·泰勒在学院的好友与室友。尤尔家曾显赫，如今因家道中落而陷入贫困，但仍保有一定声望。米夏坦然接受家境变化，不执着于贵族身份，并平等对待平民出身的人，这让她与蕾建立起长久的友谊。',
    traits: ['贵族出身', '15岁', '身高152厘米', '尤尔家族成员', '家道中落后陷入贫困', '家族仍保有贵族声望', '蕾·泰勒的好友', '蕾的学院室友', '坦然接受家境变化', '不执着贵族身份', '平等对待平民'],
  },
  231853: {
    name: '蕾妮·奥鲁索', anime: '我推是反派大小姐', sourceNative: 'レーネ・オルソー',
    nicknames: ['Lene Aurousseau', '蕾妮', '奥鲁索', 'レーネ・オルソー'],
    description: '蕾妮·奥鲁索是富裕商人家族的长女，身高154厘米，担任克莱尔·弗朗索瓦的专属女仆。她忠心侍奉克莱尔，外表耐心、温顺而谦恭；多年相处让她很懂得如何应对克莱尔，这些经验也使她十分了解克莱尔的脾气与应对方式。',
    traits: ['富商家族长女', '身高154厘米', '克莱尔·弗朗索瓦的专属女仆', '忠心侍奉克莱尔', '有耐心', '外表温顺谦恭', '长期侍奉克莱尔', '熟悉克莱尔的性格', '善于应对克莱尔', '女性'],
  },
  244317: {
    name: '高顺', anime: '药屋少女的呢喃', sourceNative: '高順',
    nicknames: ['Gaoshun', '高顺', 'ガオシュン', '高順'],
    description: '高顺是壬氏的侍从，37岁，做事极为可靠。他重视上下尊卑与礼法；遇到不合规矩的事，即使不直接开口，脸上也会明显露出不赞同。虽然常保持沉默，他仍会通过表情表达判断，是壬氏身边值得信任、讲究礼数的随从，也常伴壬氏左右。',
    traits: ['壬氏的侍从', '男性', '37岁', '极为可靠', '重视上下尊卑', '严格遵守礼法', '不赞同不合规矩的行为', '常通过表情表达不满', '即使沉默也能显露立场'],
  },
}

for (const [rawId, patch] of Object.entries(patches)) {
  const id = Number(rawId)
  const row = byId.get(id)
  const profile = profiles[id]
  if (!row || !slimById.has(id)) throw new Error(`本地导出缺少角色 ${id}`)
  if (row.name !== patch.name || row.anime_title !== patch.anime) throw new Error(`角色身份不一致：${id}`)
  if (profile?.name?.native !== patch.sourceNative) throw new Error(`AniList 原名校验失败：${id}`)
  if (patch.description.length < 100 || patch.description.length > 200 || patch.traits.length < 8) throw new Error(`简介或特征长度不合格：${id}`)
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

const reportIds = { 101: [231851, 231853], 102: [239687, 244317] }
for (const [rawBatch, ids] of Object.entries(reportIds)) {
  const batch = Number(rawBatch)
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const checked = new Set(report.checkedIds.map(Number))
  for (const id of ids) if (!checked.has(id)) throw new Error(`角色 ${id} 不在第 ${batch} 批范围`)
  for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds']) {
    report[key] = (report[key] || []).map(Number).filter(id => !ids.includes(id))
  }
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...ids])].sort((a, b) => a - b)
  report.profileFactsRound25 = ids.map(id => ({ id, source: `https://anilist.co/character/${id}`, verifiedVoiceActor: (byId.get(id).voice_actors || []).map(actor => actor.name) }))
  report.localFollowup ||= {}
  report.localFollowup.profileFactsRound25 = { updatedAt: new Date().toISOString(), correctedDescriptionsAndTraits: ids, externalWritePending: true }
  report.note = 'AniList 角色身份、简介及动画声优关系已核对；据可用角色资料修正简介和特征。'
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const identityEvidence = {
  fetchedAt: new Date().toISOString(),
  source: 'AniList GraphQL API; official character profile, name, biography, and Japanese anime voice relation',
  characters: Object.fromEntries(Object.entries(patches).map(([id, patch]) => [id, {
    id: Number(id), name: patch.name, native: patch.sourceNative,
    voiceActors: (byId.get(Number(id)).voice_actors || []).map(actor => actor.name),
    source: `https://anilist.co/character/${id}`,
  }])),
}
fs.writeFileSync(`${root}/anilist-profile-facts-round25.json`, JSON.stringify(identityEvidence, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
const marker = '\n\n## AniList 角色资料与特征纠错（Round 25）'
let prior = fs.readFileSync(summaryPath, 'utf8')
const previous = prior.indexOf(marker)
if (previous >= 0) prior = prior.slice(0, previous)
const addition = `${marker}（${new Date().toISOString().slice(0, 10)}）\n\n- 依据 AniList 角色资料改写并补足小黑（239687）、米夏·尤尔（231851）、蕾妮·奥鲁索（231853）和高顺（244317）的简介及特征；移除小黑“黑猫、宠物、吉祥物”等与科波尔德身份冲突的标签。\n- 核实以上角色的 AniList 日语动画声优关系与本地记录相符；已重建搜索索引，简介不进入搜索。\n- 本批 Supabase 写入待完成；未提交或推送 Git。\n`
fs.writeFileSync(summaryPath, prior + addition)
console.log(JSON.stringify({ corrected: Object.keys(patches).map(Number), descriptions: Object.fromEntries(Object.entries(patches).map(([id,p])=>[id,p.description.length])), voicesChanged: 0 }, null, 2))
