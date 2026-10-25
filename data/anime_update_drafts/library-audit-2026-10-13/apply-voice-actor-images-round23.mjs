import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const voice = JSON.parse(fs.readFileSync(`${root}/anilist-voice-media-round23.json`, 'utf8'))
const exactNativeNameByLocalName = new Map([
  ['若山诗音', '若山詩音'],
  ['种崎敦美', '種﨑敦美'],
  ['伊驹百合绘', '伊駒ゆりえ'],
  ['大冢刚央', '大塚剛央'],
  ['市之濑加那', '市ノ瀬加那'],
  ['东地宏树', '東地宏樹'],
  ['冈本信彦', '岡本信彦'],
  ['潘惠美', '潘めぐみ'],
  ['石见舞菜香', '石見舞菜香'],
])
const resolved = []

for (const [idText, character] of Object.entries(voice.characters)) {
  const id = Number(idText)
  const row = byId.get(id)
  if (!row) continue
  const localActors = row.voice_actors || []
  const japaneseActors = (character.media?.edges || [])
    .filter(edge => edge.node?.countryOfOrigin === 'JP')
    .flatMap(edge => edge.voiceActors || [])
    .filter(actor => actor?.id && actor?.image?.large)
  for (const localActor of localActors) {
    if (localActor.image) continue
    const expectedNative = exactNativeNameByLocalName.get(localActor.name)
    if (!expectedNative) continue
    const matches = [...new Map(japaneseActors
      .filter(actor => actor.name?.native === expectedNative)
      .map(actor => [Number(actor.id), actor])).values()]
    const images = [...new Set(matches.map(actor => actor.image?.large).filter(Boolean))]
    if (matches.length !== 1 || images.length !== 1) continue
    localActor.image = images[0]
    resolved.push({ characterId: id, character: row.name, voiceActor: localActor.name, aniListName: expectedNative, image: images[0] })
  }
}

const changedIds = new Set(resolved.map(item => item.characterId))
for (const id of changedIds) {
  const row = byId.get(id)
  const slimRow = slimById.get(id)
  slimRow.voice_actors = row.voice_actors
  slimRow.search_text = row.search_text
}
fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const reportPaths = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
const stamp = new Date().toISOString()
for (const path of reportPaths) {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = report.checkedIds.map(Number)
  const inBatch = resolved.filter(item => batchIds.includes(item.characterId))
  report.pendingVoiceActorImageIds = (report.pendingVoiceActorImageIds || []).filter(id => !changedIds.has(Number(id)))
  report.localFollowup ||= {}
  report.localFollowup.voiceActorImagesFetchedRound23 = inBatch.map(item => ({ characterId: item.characterId, voiceActor: item.voiceActor, anilistName: item.aniListName }))
  report.localFollowup.voiceActorImagesFetchedAt = voice.fetchedAt
  report.source.voiceMediaRound23 = voice.fetchedAt
  if (inBatch.length) report.note = 'AniList 角色及日语动画声优资料已实时复查；可唯一对应的声优头像已补入，其余待核项保留。'
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const summaryPath = `${root}/batch85-128-audit-summary.md`
const summaryAddition = `\n\n## AniList 声优头像补查（${stamp.slice(0, 10)}）\n\n- 实时查询 153 位待补声优或头像的角色，AniList 返回 152 位；其中 9 位角色有日语动画声优关联。\n- 将 AniList 官方原文姓名与本地声优姓名逐一对应，补齐 ${resolved.length} 张可唯一确认的声优头像（角色 ID：${[...changedIds].sort((a,b)=>a-b).join('、')}）。其余头像没有唯一匹配，保留待核。\n- 逐角色记录和头像来源保存在 anilist-voice-media-round23.json 与对应审核批次报告中。\n`
fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf8') + summaryAddition)
console.log(JSON.stringify({ fetchedCharacters: voice.returnedCount, animeVoiceActorCharacters: 9, imagesRepaired: resolved.length, resolved }, null, 2))
