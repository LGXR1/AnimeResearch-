import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const id = 252292
const row = full.find(item => Number(item.id) === id)
const slimRow = slim.find(item => Number(item.id) === id)
if (!row || !slimRow || row.anime_title !== '里世界郊游' || !row.voice_actors.some(actor => actor.name === 'Shizuka Itou')) throw new Error('干蛇本地记录身份或声优关系不符')

row.nicknames = [...new Set([...(row.nicknames || []), 'Kankandara', '姦姦蛇螺'])]
row.description = '干蛇（Kankandara，姦姦蛇螺）是《里世界郊游》的角色，登记的日语配音为伊藤静。AniList人物条目没有提供她的简介，官方动画人物页也没有列出她。逐集梗概与公开搜索未找到可核实的身份、性格、能力或与主角关系；因此本条只保留姓名、作品和已知配音，不填入推测内容。'
row.traits = ['黑发', '红瞳']
row.search_text = [row.name, row.anime_title, ...row.nicknames, ...row.traits, ...row.voice_actors.map(actor => actor.name)].join(' ')
if (row.search_text.includes(row.description)) throw new Error('干蛇简介误入搜索索引')
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
report.pendingExactGenericTraitIds = (report.pendingExactGenericTraitIds || []).map(Number).filter(value => value !== id)
report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), id])].sort((a, b) => a - b)
report.localFollowup ||= {}
report.localFollowup.profileFactsRound30 = { updatedAt: new Date().toISOString(), removedUnsupportedCompanionAndPersonalityClaims: true, verifiedTraits: ['黑发', '红瞳'], sourcesSearched: ['AniList', 'Otherside Picnic official character page', 'official 12 episode summaries', 'Bing public search'], biographyAndAdditionalTraitsStillPending: true, externalWritePending: true }
report.note = '干蛇原有“与主角亲密、可靠”等无来源描述已移除。AniList无简介，官方人物页和12集梗概均无独立设定，外部检索未找到可靠出处；保留角色名、声优及已核对外观，生平和其他特征仍待核。'
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

fs.writeFileSync(`${root}/source-search-round30.json`, JSON.stringify({
  searchedAt: new Date().toISOString(),
  characterId: id,
  anilist: { url: `https://anilist.co/character/${id}`, description: null, nativeName: '姦姦蛇螺', englishName: 'Kankandara' },
  officialCharacterPage: { url: 'https://www.othersidepicnic.com/character/', characterListed: false },
  officialEpisodeSummaries: { baseUrl: 'https://www.othersidepicnic.com/story/story{1..12}', queriedEpisodes: 12, nameFound: false },
  publicSearches: ['"姦姦蛇螺" "裏世界ピクニック"', 'カンカンダラ 裏世界ピクニック', 'Kankandara Otherside Picnic'],
  result: 'No reliable biographical or story-specific details found; do not infer personality, powers, or relationship to the protagonists.',
}, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
let summary = fs.readFileSync(summaryPath, 'utf8')
const marker = '\n\n## 《里世界郊游》干蛇来源复查（Round 30）'
const prior = summary.indexOf(marker)
if (prior >= 0) summary = summary.slice(0, prior)
summary += `${marker}（${new Date().toISOString().slice(0, 10)}）\n\n- 移除干蛇原记录中无来源的“与主角亲密、可靠”等描述和泛化特征，保留已核对的姓名、日语声优、黑发与红瞳。\n- 查询 AniList、官方人物页、12 集官方梗概及公开搜索，仍未找到可核实的人物经历或更多特征；详情和特征继续待核，不用传说或推测补写。检索记录见 source-search-round30.json。\n- Supabase 写入待完成；未提交或推送 Git。\n`
fs.writeFileSync(summaryPath, summary)
console.log(JSON.stringify({ id, descriptionLength: row.description.length, traits: row.traits, biographyStillPending: true }, null, 2))
