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
  253965: {
    native: '綾小路美月', voice: 'Sumire Uesaka',
    description: '绫小路美月是身高171厘米的高中一年级生，性格认真，并有社交焦虑，较难理解他人的情绪。她重视咖啡厅里“沙龙”的秩序，在工作时扮演亲切的前辈角色；对白鹭阳芽而言，她也是可靠的“大姐姐”。她十分在意沙龙的完整与规矩。',
    traits: ['高中一年级生', '身高171厘米', '认真严肃', '有社交焦虑', '较难理解他人情绪', '重视沙龙秩序', '在咖啡厅扮演亲切前辈', '是白鹭阳芽可靠的“大姐姐”', '在意沙龙的完整与规矩', '棕发', '棕瞳'],
  },
  253966: {
    native: '知花純加', voice: 'Makoto Koichi',
    description: '知花纯加是身高165厘米的高中三年级生。她在百合咖啡厅外会以辣妹风格打扮，十分看重工作场所的和谐，也不愿看到同事因恋爱受伤。她在店内扮演冷静、戴眼镜的前辈角色，同时担任间宫果乃子的“大姐姐”。店外风格与店内角色形成反差。',
    traits: ['高中三年级生', '身高165厘米', '工作外会打扮成辣妹', '重视工作场所和谐', '不愿同事因恋爱受伤', '在咖啡厅扮演冷静前辈', '店内角色戴眼镜', '担任间宫果乃子的“大姐姐”', '店外风格与店内形象有反差', '金发', '绿瞳'],
  },
  253967: {
    native: '西寺寧々', voice: 'Asami Seto',
    description: '西寺宁宁身高156厘米，是咖啡厅Liebe的厨房员工。她以前在前台工作，曾在店内角色扮演中担任知花纯加的“妹妹”；后来一段复杂的恋情让她离开前台，转到幕后负责厨房工作。她现在主要在后台协助店里的餐饮工作。',
    traits: ['女性', '身高156厘米', 'Liebe厨房员工', '曾在前台工作', '曾扮演知花纯加的妹妹角色', '因复杂恋情转到幕后', '负责咖啡厅厨房工作', '白发', '紫瞳'],
  },
  253968: {
    native: '小柴舞', voice: 'Yukari Tamura',
    description: '小柴舞是咖啡厅Liebe的店长，身高145厘米。她曾受手臂伤势困扰，店内角色扮演时担任后辈型角色，也常被当作咖啡厅的吉祥物。虽然外表稚气，她实际上是成熟的大人，并会照看店里的员工与咖啡厅日常；她也会留意员工的情况，照料店内事务。',
    traits: ['Liebe店长', '身高145厘米', '曾受手臂伤势困扰', '扮演后辈角色', '被视为咖啡厅吉祥物', '外表稚气', '实际是成熟的大人', '照看咖啡厅员工', '照看店内日常', '粉发', '棕瞳'],
  },
  253969: {
    native: '間宮果乃子', voice: 'Minami Tanaka',
    description: '间宫果乃子是身高156厘米的高中一年级生，也是白鹭阳芽最好的朋友。她非常保护阳芽，表面轻声细语，实际说话直率；在Liebe扮演羞怯的后辈角色，并作为知花纯加的“妹妹”登场。她平时戴眼镜，只有演绎咖啡厅角色时不戴。',
    traits: ['高中一年级生', '身高156厘米', '白鹭阳芽的好友', '十分保护阳芽', '外表轻声细语', '说话直率', '扮演羞怯的后辈角色', '担任知花纯加的“妹妹”角色', '平时戴眼镜', '角色扮演时不戴眼镜', '蓝发', '蓝瞳'],
  },
}

for (const [rawId, patch] of Object.entries(patches)) {
  const id = Number(rawId)
  const row = byId.get(id)
  const profile = profiles[id]
  if (!row || !slimById.has(id)) throw new Error(`本地导出缺少角色 ${id}`)
  if (row.anime_title !== '百合是我的工作' || profile?.name?.native !== patch.native) throw new Error(`角色身份不一致：${id}`)
  if (!(row.voice_actors || []).some(actor => actor.name === patch.voice)) throw new Error(`声优关系不一致：${id}`)
  if (patch.description.length < 100 || patch.description.length > 200 || patch.traits.length < 8) throw new Error(`简介或特征长度不合格：${id}`)
  row.description = patch.description
  row.traits = [...new Set(patch.traits)]
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的简介进入搜索索引`)
  const slimRow = slimById.get(id)
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

const path = `${root}/batch104-audit-report.json`
const report = JSON.parse(fs.readFileSync(path, 'utf8'))
const ids = Object.keys(patches).map(Number)
const checked = new Set(report.checkedIds.map(Number))
for (const id of ids) if (!checked.has(id)) throw new Error(`角色 ${id} 不在第104批范围`)
for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds']) {
  report[key] = (report[key] || []).map(Number).filter(id => !ids.includes(id))
}
report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...ids])].sort((a, b) => a - b)
report.profileFactsRound26 = ids.map(id => ({ id, source: `https://anilist.co/character/${id}`, verifiedVoiceActor: patches[id].voice }))
report.localFollowup ||= {}
report.localFollowup.profileFactsRound26 = { updatedAt: new Date().toISOString(), correctedDescriptionsAndTraits: ids, externalWritePending: true }
report.note = 'AniList 角色身份、简介及日语动画声优关系已核对；根据资料修正本批简介与特征。'
fs.writeFileSync(path, JSON.stringify(report, null, 2))

const evidence = {
  fetchedAt: new Date().toISOString(),
  source: 'AniList GraphQL API; official character profile and Japanese anime voice relation',
  characters: {
    253965: { name: 'Mitsuki Ayanokouji', native: '綾小路美月', voice: { full: 'Sumire Uesaka', native: '上坂すみれ' } },
    253966: { name: 'Sumika Chibana', native: '知花純加', voice: { full: 'Makoto Koichi', native: '小市眞琴' } },
    253967: { name: 'Nene Nishidera', native: '西寺寧々', voice: { full: 'Asami Seto', native: '瀬戸麻沙美' } },
    253968: { name: 'Mai Koshiba', native: '小柴舞', voice: { full: 'Yukari Tamura', native: '田村ゆかり' } },
    253969: { name: 'Kanoko Mamiya', native: '間宮果乃子', voice: { full: 'Minami Tanaka', native: '田中美海' } },
  },
}
fs.writeFileSync(`${root}/anilist-profile-facts-round26.json`, JSON.stringify(evidence, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
const marker = '\n\n## AniList《百合是我的工作》角色资料补核（Round 26）'
let prior = fs.readFileSync(summaryPath, 'utf8')
const previous = prior.indexOf(marker)
if (previous >= 0) prior = prior.slice(0, previous)
const addition = `${marker}（${new Date().toISOString().slice(0, 10)}）\n\n- 依据 AniList 角色资料改写绫小路美月、知花纯加、西寺宁宁、小柴舞、间宫果乃子 5 条简介并补足具体特征；角色外观色彩沿用已完成的头像复核结果。\n- 核对 5 位角色的日语动画声优关系，均与 AniList 资料和本地记录一致；已重建搜索索引，简介不参与搜索。\n- 来源与声优对应保存在 anilist-profile-facts-round26.json；Supabase 写入待完成，未提交或推送 Git。\n`
fs.writeFileSync(summaryPath, prior + addition)
console.log(JSON.stringify({ corrected: ids, descriptions: Object.fromEntries(ids.map(id => [id, patches[id].description.length])), voicesChanged: 0 }, null, 2))
