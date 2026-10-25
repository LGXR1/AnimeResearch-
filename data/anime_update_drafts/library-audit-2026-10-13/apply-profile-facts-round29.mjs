import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const row = full.find(item => Number(item.id) === 251839)
const slimRow = slim.find(item => Number(item.id) === 251839)
if (!row || !slimRow || row.anime_title !== '独自一人的异世界攻略' || !row.voice_actors.some(actor => actor.name === 'Aguri Onishi')) throw new Error('梅莉艾尔本地记录身份或声优关系不符')

row.nicknames = [...new Set(['Merielle Omui', '梅莉艾尔', '梅莉', 'マリエルシムオムイ', 'メリエール', 'MERIELLE'])]
row.description = '梅莉艾尔是奥姆伊街领主的女儿，也是遥和同学们到访奥姆伊时遇见的当地贵族少女。她曾遭到盗贼袭击，危急时被遥救下。作品官网将她介绍为有些天然、容易哭泣的大小姐。她的生日是5月2日，身高169厘米。她以领主之女的身份和遥一行产生联系，并在奥姆伊相关剧情中登场。'
row.traits = ['奥姆伊街领主之女', '当地贵族大小姐', '遭盗贼袭击', '被遥救下', '性格有些天然', '容易哭泣', '生日为5月2日', '身高169厘米', '与遥和同学们在奥姆伊相遇', '在奥姆伊相关剧情中登场']
row.search_text = [row.name, row.anime_title, ...row.nicknames, ...row.traits, ...row.voice_actors.map(actor => actor.name)].join(' ')
if (row.description.length < 100 || row.description.length > 200 || row.traits.length < 8 || row.search_text.includes(row.description)) throw new Error('梅莉艾尔简介、特征或搜索索引校验失败')
for (const key of ['nicknames', 'description', 'traits', 'search_text']) slimRow[key] = row[key]

const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csv = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const item of full) csv.push([item.id, item.name, item.anime_title, item.image, item.description, (item.nicknames || []).join('|'), (item.traits || []).join('|'), (item.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${csv.join('\n')}\n`)

const reportPath = `${root}/batch104-audit-report.json`
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
for (const key of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds', 'pendingTraitVerificationIds', 'pendingExactGenericTraitIds', 'pendingColorTraitKeywordIds']) report[key] = (report[key] || []).map(Number).filter(id => id !== 251839)
report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), 251839])].sort((a, b) => a - b)
report.profileFactsRound29 = [{ id: 251839, sources: ['https://bocchi-kouryaku.com/character', 'https://anilist.co/character/251839'] }]
report.localFollowup ||= {}
report.localFollowup.profileFactsRound29 = { updatedAt: new Date().toISOString(), correctedDescriptionTraitsAndAliases: [251839], removedUnverifiedHairAndEyeColorTraits: true, pendingAvatarVisualReview: true, externalWritePending: true }
report.note = '梅莉艾尔简介与经历依据《独自一人的异世界攻略》官网角色资料补充；因本轮无法完成头像视觉复核，移除金发、蓝瞳标签并保留头像视觉待核。'
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

fs.writeFileSync(`${root}/official-profile-facts-round29.json`, JSON.stringify({
  fetchedAt: new Date().toISOString(),
  source: { title: 'TVアニメ「ひとりぼっちの異世界攻略」公式サイト', url: 'https://bocchi-kouryaku.com/character' },
  character: { id: 251839, officialJapaneseName: 'メリエール', romanizedName: 'MERIELLE', officialProfile: '遥とクラスメイトたちが訪れるオムイの街の領主の娘。盗賊に襲われていたところを遥に助けられる。ちょっと天然で泣き虫のお嬢様。', birthday: '5月2日', heightCm: 169, voiceActor: 'Aguri Onishi' },
}, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
const marker = '\n\n## 《独自一人的异世界攻略》梅莉艾尔资料补核（Round 29）'
const prior = summary.indexOf(marker)
if (prior >= 0) summary = summary.slice(0, prior)
summary += `${marker}（${new Date().toISOString().slice(0, 10)}）\n\n- 依据官方角色页补充梅莉艾尔为奥姆伊领主之女、遭盗贼袭击后获遥救助、性格天然爱哭、生日与身高；追加官网日文名“メリエール”。\n- 移除未完成视觉复核的金发、蓝瞳标签，保留头像视觉待核；搜索索引已重建，简介未参与搜索。证据见 official-profile-facts-round29.json。\n- Supabase 写入待完成；未提交或推送 Git。\n`
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ id: 251839, descriptionLength: row.description.length, traits: row.traits.length, removedUnverifiedColorTraits: true }, null, 2))
