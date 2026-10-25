import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const staffSearch = JSON.parse(fs.readFileSync(`${root}/anilist-missing-voice-staff-round23.json`, 'utf8'))
const exactMatches = new Map()
const realImage = url => typeof url === 'string' && /\/staff\/large\/n\d+-[^/]+\.(?:png|jpe?g|webp)(?:\?|$)/i.test(url)

for (const [query, candidates] of Object.entries(staffSearch.staffByName || {})) {
  const matches = [...new Map((candidates || [])
    .filter(staff => [staff.name?.full, staff.name?.native, ...(staff.name?.alternative || [])]
      .filter(Boolean).some(name => name.trim().toLocaleLowerCase() === query.trim().toLocaleLowerCase()))
    .filter(staff => realImage(staff.image?.large))
    .map(staff => [Number(staff.id), staff])).values()]
  if (matches.length === 1) exactMatches.set(query, matches[0])
}

const resolved = []
const added = []
const changedCharacterIds = new Set()
for (const row of full) {
  for (const actor of row.voice_actors || []) {
    const staff = exactMatches.get(actor.name)
    if (!staff) continue
    if (!actor.image) {
      actor.image = staff.image.large
      added.push(Number(row.id))
    }
    if (actor.image !== staff.image.large) continue
    changedCharacterIds.add(Number(row.id))
    resolved.push({
      characterId: Number(row.id),
      character: row.name,
      anime: row.anime_title,
      voiceActor: actor.name,
      aniListStaffId: Number(staff.id),
      image: staff.image.large,
    })
  }
}

const lily = byId.get(394843)
if (!lily) throw new Error('找不到莉莉（394843）')
const lilyBefore = [...(lily.traits || [])]
lily.traits = [
  '朱慧月的侍女', '母亲来自西方之地', '母亲曾是舞者', '红发遗传自母亲',
  '侍奉朱氏圣女', '参与内廷生活', '由菱川花菜配音', '红发', '金瞳',
]
if (JSON.stringify(lilyBefore) !== JSON.stringify(lily.traits)) changedCharacterIds.add(394843)

for (const id of changedCharacterIds) {
  const row = byId.get(id)
  const slimRow = slimById.get(id)
  if (!row || !slimRow) throw new Error(`导出中缺少角色 ${id}`)
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.description && row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的简介进入 search_text`)
  slimRow.traits = row.traits
  slimRow.search_text = row.search_text
  slimRow.voice_actors = (row.voice_actors || []).map(actor => ({ name: actor.name, language: actor.language, image: actor.image }))
}

fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) csvLines.push([
  row.id, row.name, row.anime_title, row.image, row.description,
  (row.nicknames || []).join('|'), (row.traits || []).join('|'),
  (row.voice_actors || []).map(actor => actor.name).join(','),
].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const updatedBatchRecords = []
for (let batch = 85; batch <= 128; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const checkedIds = new Set((report.checkedIds || []).map(Number))
  const batchResolved = resolved.filter(item => checkedIds.has(item.characterId))
  report.pendingVoiceActorImageIds = (report.pendingVoiceActorImageIds || []).filter(id => {
    const row = byId.get(Number(id))
    return !row || (row.voice_actors || []).some(actor => !actor.image || /\/default\.jpg(?:\?|$)/i.test(actor.image))
  })
  report.localFollowup ||= {}
  const previousResolved = report.localFollowup.voiceActorImagesResolvedFromAniListStaffRound23B || []
  report.localFollowup.voiceActorImagesResolvedFromAniListStaffRound23B = [...new Map([...previousResolved, ...batchResolved].map(item => [
    `${item.characterId}:${item.aniListStaffId}`,
    {
    characterId: item.characterId,
    voiceActor: item.voiceActor,
    aniListStaffId: item.aniListStaffId,
    },
  ])).values()]
  report.localFollowup.voiceActorStaffSearchRound23B = staffSearch.fetchedAt
  if (checkedIds.has(394843)) {
    report.localFollowup.lilyTraitCleanupRound23B = {
      source: 'AniList character profile 394843; red hair inherited from her mother, a dancer from the Western Lands',
      removedGenericOrFragmentTraits: ['继承母亲', '同伴的侍女', '拥有独立角色资料', '是重要配角'],
      retainedVerifiedTraits: lily.traits,
    }
  }
  report.source ||= {}
  report.source.voiceStaffSearchRound23B = staffSearch.fetchedAt
  if (batchResolved.length || checkedIds.has(394843)) report.note = '本轮可唯一对应的 AniList 声优头像已补入；莉莉的残缺及泛化特征已清理。其余待核项仅在来源不足时保留。'
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
  updatedBatchRecords.push({ batch, addedVoiceActorImages: batchResolved.length, pendingVoiceActorImageIds: report.pendingVoiceActorImageIds.length })
}

const summaryPath = `${root}/batch85-128-audit-summary.md`
const summaryText = fs.readFileSync(summaryPath, 'utf8')
if (!summaryText.includes('## AniList 声优头像与莉莉特征补核')) {
  const summaryAddition = `\n\n## AniList 声优头像与莉莉特征补核（${new Date().toISOString().slice(0, 10)}）\n\n- 依据 AniList 工作人员原名或别名精确匹配，使用带官方头像文件标识的唯一结果，补入 ${resolved.length} 条角色声优头像，涉及 ${new Set(resolved.map(item => item.voiceActor)).size} 位声优；匹配和角色 ID 记录在各批报告及 anilist-missing-voice-staff-round23.json。\n- 清理莉莉（394843）的残缺及泛化标签；保留由 AniList 角色资料、头像和本地配音记录支持的事实。\n- 尚未为没有 AniList 唯一头像结果的声优补图；这类记录继续待核。\n`
  fs.writeFileSync(summaryPath, summaryText + summaryAddition)
}
console.log(JSON.stringify({ matchedStaff: exactMatches.size, voiceActorImagesAdded: added.length, voiceActorImagesResolved: resolved.length, changedCharacters: changedCharacterIds.size, lilyTraitsBefore: lilyBefore, lilyTraitsAfter: lily.traits, updatedBatchRecords }, null, 2))
