import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const supplement = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles-round23.json`, 'utf8'))
const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const fullById = new Map(full.map(row => [Number(row.id), row]))
const returned = new Map(Object.entries(supplement.profiles).map(([id, profile]) => [Number(id), profile]))
const requested = new Set(supplement.requestedIds.map(Number))
const reportPaths = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
const stamp = new Date().toISOString()
const normalize = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const modified = new Set()
const aliasAddedIds = new Set()
const imageRefreshedIds = new Set()
const missingIds = []

for (const id of requested) {
  const profile = returned.get(id)
  if (!profile) {
    missingIds.push(id)
    continue
  }
  const row = fullById.get(id)
  const slimRow = slimById.get(id)
  if (!row || !slimRow) throw new Error(`本地导出缺少 AniList 角色 ${id}`)
  const nicknames = Array.isArray(row.nicknames) ? row.nicknames : []
  const seen = new Set(nicknames.map(normalize))
  const officialNames = [profile.name?.full, profile.name?.native, ...(profile.name?.alternative || [])]
  for (const name of officialNames) {
    const value = String(name ?? '').trim()
    const key = normalize(value)
    if (!key || seen.has(key)) continue
    nicknames.push(value)
    seen.add(key)
    aliasAddedIds.add(id)
    modified.add(id)
  }
  row.nicknames = nicknames
  const image = String(profile.image?.large || '')
  if (new RegExp(`/anilistcdn/character/(?:large|medium)/b${id}-[^/]+\\.(?:png|jpe?g|webp)$`, 'i').test(image) && row.image !== image) {
    row.image = image
    imageRefreshedIds.add(id)
    modified.add(id)
  }
  row.search_text = [row.name, row.anime_title, ...row.nicknames, ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description || '\u0000')) throw new Error(`角色 ${id} 的简介进入了搜索索引`)
  for (const key of ['name', 'image', 'nicknames', 'search_text']) slimRow[key] = row[key]
}

for (const path of reportPaths) {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = report.checkedIds.map(Number)
  const inBatch = batchIds.filter(id => requested.has(id))
  const hasProfile = id => returned.has(id)
  const hasDescription = profile => String(profile?.description || '').trim().length > 0
  report.pendingExternalVerificationIds = batchIds.filter(id => requested.has(id) && !hasProfile(id))
  report.pendingProfileNoDescriptionIds = [...new Set([
    ...(report.pendingProfileNoDescriptionIds || []).map(Number),
    ...inBatch.filter(id => hasProfile(id) && !hasDescription(returned.get(id))),
  ])].sort((a, b) => a - b)
  report.profileSnapshotVerifiedCount = batchIds.filter(id => hasProfile(id)).length
  report.profileDescriptionAvailableCount = batchIds.filter(id => hasDescription(returned.get(id))).length
  report.source.name = 'AniList GraphQL 角色资料快照（本地缓存 + 2026-10-22 实时补查）'
  report.source.round23FetchedAt = supplement.fetchedAt
  report.source.records = batchIds.filter(id => hasProfile(id)).map(id => ({ id, url: `https://anilist.co/character/${id}` }))
  report.localFollowup ||= {}
  report.localFollowup.anilistProfilesRefetched = inBatch.filter(hasProfile)
  report.localFollowup.anilistDescriptionsAvailable = inBatch.filter(id => hasDescription(returned.get(id)))
  report.localFollowup.officialAliasesAdded = [...aliasAddedIds].filter(id => batchIds.includes(id))
  report.localFollowup.officialCharacterImagesRefreshed = [...imageRefreshedIds].filter(id => batchIds.includes(id))
  report.localFollowup.searchIndexRebuiltForProfileChanges = [...modified].filter(id => batchIds.includes(id))
  report.note = '已实时复查 AniList 角色 ID、正式姓名、头像与简介字段；API 未返回的 ID 保留待核，不视为角色不存在。'
  report.scopeLimitations = (report.scopeLimitations || []).filter(value => !value.includes('没有本地 AniList 资料'))
  report.scopeLimitations.push('AniList 实时接口仅未返回合成占位 ID 990000001；该记录继续标为待核。')
  report.scopeLimitations.push('AniList 未提供简介的角色仍需其他可靠人物资料来源；未根据作品简介推造人物传记。')
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join('\n')}\n`)

const summaryPath = `${root}/batch85-128-audit-summary.md`
const summaryAddition = `\n\n## AniList 实时补查（${stamp.slice(0, 10)}）\n\n- 对原先无本地资料的 1,652 个 AniList 角色 ID 逐页串行查询；接口返回 1,651 条角色资料，其中 923 条有 AniList 简介，1 条合成占位 ID（990000001）未返回。\n- 为返回的角色补齐 AniList 正式全名/原文名/替代名别名；刷新与该角色 ID 对应的 AniList 官方头像。共修改 ${modified.size} 条本地记录，其中 ${aliasAddedIds.size} 条新增官方别名，${imageRefreshedIds.size} 条刷新头像；已按站点公式重建搜索索引，简介不进入索引。\n- AniList 简介只记录为可用来源，不直接覆盖中文人物简介；无简介者仍需外部角色资料或逐条核实，不根据作品介绍编造人物传记。\n- AniList API 回传资料、缺失 ID 与逐批统计保存在 anilist-character-profiles-round23.json。\n`
fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf8') + summaryAddition)

console.log(JSON.stringify({ fetchedAt: stamp, requested: requested.size, returned: returned.size, apiMissingIds: missingIds, modified: modified.size, officialAliasesAdded: aliasAddedIds.size, officialImagesRefreshed: imageRefreshedIds.size }, null, 2))
