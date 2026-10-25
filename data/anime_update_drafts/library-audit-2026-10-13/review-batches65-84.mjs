import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const screenPath = `${root}/remaining-review-screen.json`
const stamp = new Date().toISOString()

const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const screen = JSON.parse(fs.readFileSync(screenPath, 'utf8'))
const profileSnapshot = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles.json`, 'utf8'))
const voiceSnapshot = JSON.parse(fs.readFileSync(`${root}/anilist-voice-media.json`, 'utf8'))
const profiles = profileSnapshot.profiles
const cachedVoiceMedia = voiceSnapshot.characters

if (screen.previouslyAudited !== 6300 || screen.entries.length !== 6365) {
  throw new Error(`待审清单边界变化：已审 ${screen.previouslyAudited}，待审 ${screen.entries.length}`)
}
const batch = screen.entries.slice(0, 2000)
if (batch.length !== 2000 || batch[0].id !== 126544 || batch.at(-1).id !== 157689) {
  throw new Error(`本批边界变化：${batch.length} 位，${batch[0]?.id}–${batch.at(-1)?.id}`)
}
const ids = new Set(batch.map(row => Number(row.id)))
if (ids.size !== batch.length) throw new Error('本批待审角色 ID 重复')

const byId = new Map(full.map(row => [Number(row.id), row]))
if (batch.some(row => !byId.has(Number(row.id)))) throw new Error('待审名单中存在不在本地完整数据内的角色')
const modified = new Set()
const nicknameResolved = new Set()
const nicknameAddedCount = new Map()
const duplicateRemovedCount = new Map()
const voiceImageRepaired = new Set()
const characterImageRepaired = new Set()
const indexMismatchIds = new Set()
const issueById = new Map(batch.map(row => [Number(row.id), new Set(row.issues || [])]))

const normalizedName = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const addImageCandidate = (map, name, image) => {
  if (!name || !image || !/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/staff\//.test(image)) return
  const key = normalizedName(name)
  if (!key) return
  if (!map.has(key)) map.set(key, new Set())
  map.get(key).add(image)
}
const jpStaffForCharacter = id => {
  const candidates = new Map()
  for (const edge of cachedVoiceMedia[id]?.media?.edges || []) {
    if (edge.node?.countryOfOrigin !== 'JP') continue
    for (const actor of edge.voiceActors || []) {
      if (actor?.id && actor?.image?.large) candidates.set(Number(actor.id), actor)
    }
  }
  return [...candidates.values()]
}

// Build reusable, source-backed image maps only from exact AniList staff-name matches.
const imageByLocalActorName = new Map()
const imageByCachedStaffName = new Map()
for (const character of full) {
  for (const actor of character.voice_actors || []) {
    if (actor.image) addImageCandidate(imageByLocalActorName, actor.name, actor.image)
  }
  const staff = jpStaffForCharacter(Number(character.id))
  for (const actor of character.voice_actors || []) {
    const exact = staff.filter(item => item.name?.native === actor.name || item.name?.full === actor.name)
    if (exact.length !== 1) continue
    addImageCandidate(imageByCachedStaffName, actor.name, exact[0].image?.large)
  }
}

let aliasesAdded = 0
let nicknameDuplicatesRemoved = 0
let searchIndexMismatchesBefore = 0
let voiceActorImagesAdded = 0

for (const entry of batch) {
  const id = Number(entry.id)
  const row = byId.get(id)
  const profile = profiles[id]
  const issues = issueById.get(id)

  // Deduplicate aliases after trimming and Unicode normalization, then add AniList's canonical names.
  const oldNicknames = Array.isArray(row.nicknames) ? row.nicknames : []
  const seen = new Set()
  const nicknames = []
  for (const raw of oldNicknames) {
    const value = String(raw ?? '').trim()
    const key = normalizedName(value)
    if (!key) continue
    if (seen.has(key)) {
      nicknameDuplicatesRemoved++
      continue
    }
    seen.add(key)
    nicknames.push(value)
  }
  const removedForRow = oldNicknames.length - nicknames.length
  if (removedForRow) {
    duplicateRemovedCount.set(id, removedForRow)
    nicknameResolved.add(id)
    modified.add(id)
  }
  let addedForRow = 0
  for (const canonical of [profile?.name?.full, profile?.name?.native]) {
    const value = String(canonical ?? '').trim()
    const key = normalizedName(value)
    if (!key || seen.has(key)) continue
    seen.add(key)
    nicknames.push(value)
    addedForRow++
  }
  if (addedForRow) {
    aliasesAdded += addedForRow
    nicknameAddedCount.set(id, addedForRow)
    nicknameResolved.add(id)
    modified.add(id)
  }
  row.nicknames = nicknames

  // Refresh stale image hashes only when the cached AniList image is explicitly keyed to this ID.
  const cachedImage = profile?.image?.large
  if (issues.has('cached_anilist_image_differs') && cachedImage &&
      new RegExp(`/anilistcdn/character/(?:large|medium)/b${id}-[^/]+\\.(?:png|jpe?g|webp)$`, 'i').test(cachedImage) &&
      row.image !== cachedImage) {
    row.image = cachedImage
    characterImageRepaired.add(id)
    modified.add(id)
  }

  // Use a character-specific Japanese AniList cast match first; otherwise require one unique local/source image.
  for (const actor of row.voice_actors || []) {
    if (actor.image) continue
    const direct = jpStaffForCharacter(id).filter(item => item.name?.native === actor.name || item.name?.full === actor.name)
    let candidates = new Set(direct.map(item => item.image?.large).filter(Boolean))
    if (candidates.size !== 1) candidates = imageByCachedStaffName.get(normalizedName(actor.name)) || new Set()
    if (candidates.size !== 1) candidates = imageByLocalActorName.get(normalizedName(actor.name)) || new Set()
    if (candidates.size !== 1) continue
    actor.image = [...candidates][0]
    voiceActorImagesAdded++
    voiceImageRepaired.add(id)
    modified.add(id)
  }

  const beforeIndex = row.search_text || ''
  const expectedSearch = [row.name, row.anime_title, ...row.nicknames, ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (beforeIndex !== expectedSearch) {
    searchIndexMismatchesBefore++
    indexMismatchIds.add(id)
    modified.add(id)
  }
  row.search_text = expectedSearch

  // Clear only findings that were fixed and re-read from the resulting local record.
  if (!row.nicknames.some(value => normalizedName(value) === normalizedName(profile?.name?.full)) && profile?.name?.full) {
    throw new Error(`角色 ${id} 未保留 AniList full name`)
  }
  if (profile?.name?.native && !row.nicknames.some(value => normalizedName(value) === normalizedName(profile.name.native))) {
    throw new Error(`角色 ${id} 未保留 AniList native name`)
  }
  if (new Set(row.nicknames.map(normalizedName)).size !== row.nicknames.length) throw new Error(`角色 ${id} 昵称仍重复`)
  if (row.search_text !== expectedSearch || row.search_text.includes(row.description || '\u0000')) throw new Error(`角色 ${id} 搜索索引校验失败`)

  issues.delete('duplicate_nicknames')
  if (profile && (!profile.name?.full || row.nicknames.some(value => normalizedName(value) === normalizedName(profile.name.full))) &&
      (!profile.name?.native || row.nicknames.some(value => normalizedName(value) === normalizedName(profile.name.native)))) {
    issues.delete('anilist_name_missing_from_nicknames')
  }
  if ((row.voice_actors || []).every(actor => actor.image)) issues.delete('voice_actor_image_missing')
  if (cachedImage && row.image === cachedImage) issues.delete('cached_anilist_image_differs')
}

const updatedIssues = new Map([...issueById].map(([id, issues]) => [id, [...issues].sort()]))
const slim = full.map(row => ({
  id: row.id,
  name: row.name,
  anime_title: row.anime_title,
  image: row.image,
  description: row.description,
  nicknames: row.nicknames || [],
  traits: row.traits || [],
  voice_actors: (row.voice_actors || []).map(({ name, language, image }) => ({ name, language, image })),
}))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) {
  csvLines.push([
    row.id,
    row.name,
    row.anime_title,
    row.image,
    row.description,
    (row.nicknames || []).join('|'),
    (row.traits || []).join('|'),
    (row.voice_actors || []).map(actor => actor.name).join(','),
  ].map(csvField).join(','))
}

const colorRegex = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/
const genericTraitRegex = /^(?:日本动画|美食题材|剧情推动者|剧情核心|作品群像|动漫角色|登场角色|相关人物|相关者|重要配角|核心人物|核心角色|常驻人物|主要角色|重要角色|配角|重要人物|作品主角|团队成员|日语配音|角色序位\d+|相关角色|故事主角|核心成员)$/
const genericDescriptionRegex = /角色在训练、比赛与团队相处中展现独特性格|通过自身经历参与关键事件|在故事中扮演着自己的角色|这个角色见证了作品情节的发展|是这部作品群像中的一员|本作.{0,20}不可忽略的一员|作品围绕.{0,35}展开|在日常相处、冲突和情感变化中|在日常相处、冲突抉择和团队协作中/
const getRowsForIds = set => batch.filter(row => set.has(Number(row.id))).map(row => Number(row.id))
const pendingFor = (group, predicate) => group.filter(row => predicate(byId.get(Number(row.id)))).map(row => Number(row.id))

// Build a changed-ID report for each 100-character group.
for (let groupIndex = 0; groupIndex < 20; groupIndex++) {
  const group = batch.slice(groupIndex * 100, (groupIndex + 1) * 100)
  const groupIds = group.map(row => Number(row.id))
  const groupSet = new Set(groupIds)
  const records = group.filter(row => profiles[row.id]).map(row => ({ id: row.id, url: `https://anilist.co/character/${row.id}` }))
  const postFlags = row => updatedIssues.get(Number(row.id)) || []
  const report = {
    checkedAt: stamp,
    batchStatus: 'reviewed_with_followups',
    checkedCount: group.length,
    checkedIds: groupIds,
    checkedRange: { firstId: groupIds[0], lastId: groupIds.at(-1) },
    profileSnapshotVerifiedCount: group.filter(row => profiles[row.id]).length,
    profileDescriptionAvailableCount: group.filter(row => String(profiles[row.id]?.description || '').trim()).length,
    modifiedIds: [...modified].filter(id => groupSet.has(id)).sort((a, b) => a - b),
    source: {
      name: '本地 AniList 角色资料与日语作品声优关联缓存；本轮未作实时网页查询',
      fetchedAt: profileSnapshot.fetchedAt,
      voiceMediaFetchedAt: voiceSnapshot.fetchedAt,
      records,
    },
    pendingExternalVerificationIds: group.filter(row => !profiles[row.id]).map(row => Number(row.id)),
    pendingShortDescriptionIds: pendingFor(group, character => String(character?.description || '').trim().length < 100),
    pendingDescriptionQualityIds: pendingFor(group, character => genericDescriptionRegex.test(character?.description || '')),
    pendingTraitVerificationIds: pendingFor(group, character => (character?.traits || []).some(trait => genericTraitRegex.test(trait))),
    pendingVoiceActorIds: group.filter(row => postFlags(row).includes('no_voice_actor_record')).map(row => Number(row.id)),
    pendingVoiceActorImageIds: pendingFor(group, character => (character?.voice_actors || []).some(actor => !actor.image)),
    pendingVisualVerificationIds: pendingFor(group, character => (character?.traits || []).some(trait => colorRegex.test(trait))),
    pendingImageMismatchIds: group.filter(row => postFlags(row).includes('cached_anilist_image_differs')).map(row => Number(row.id)),
    localFollowup: {
      nicknameIssuesResolved: getRowsForIds(nicknameResolved).filter(id => groupSet.has(id)),
      voiceActorImagesRepaired: getRowsForIds(voiceImageRepaired).filter(id => groupSet.has(id)),
      characterImagesRefreshed: getRowsForIds(characterImageRepaired).filter(id => groupSet.has(id)),
      factualCorrections: [],
      searchIndex: {
        rebuilt: true,
        formulaVerified: group.every(row => {
          const character = byId.get(Number(row.id))
          return character.search_text === [character.name, character.anime_title, ...(character.nicknames || []), ...(character.traits || []), ...(character.voice_actors || []).map(actor => actor.name)].join(' ')
        }),
        descriptionExcluded: group.every(row => !byId.get(Number(row.id)).search_text.includes(byId.get(Number(row.id)).description || '\u0000')),
        mismatchCountBeforeRebuild: group.filter(row => indexMismatchIds.has(Number(row.id))).length,
      },
      localExportsRegenerated: true,
      nicknameAudit: {
        checkedCount: group.length,
        duplicateCountAfter: group.filter(row => new Set((byId.get(Number(row.id)).nicknames || []).map(normalizedName)).size !== (byId.get(Number(row.id)).nicknames || []).length).length,
        canonicalAniListNameMissingAfter: group.filter(row => {
          const names = profiles[row.id]?.name || {}
          const aliases = (byId.get(Number(row.id)).nicknames || []).map(normalizedName)
          return [names.full, names.native].some(value => value && !aliases.includes(normalizedName(value)))
        }).length,
      },
    },
    note: '完成本地资料、昵称去重、AniList 官方全名/原文名补录、可唯一核实的头像修复及搜索索引回读；仍列出的待核项没有标为事实通过。',
    scopeLimitations: [
      '发色、瞳色没有逐图目视核验；AniList文字与本地特征出现冲突时保留待核。',
      '短简介、模板简介和泛化特征未在缺少可靠中文事实来源时改写。',
      '没有本地 AniList 资料、缺少声优关联或无法唯一匹配声优头像的记录保留待核。',
      '本次只更新本地文件；Supabase 未同步，远端数据未回读。',
    ],
    databaseSync: { syncedAt: null, syncedCount: 0, readbackVerified: false, status: 'not_synced' },
    syncAttempt: { attemptedThisTurn: false, reason: '本轮仅处理本地缓存与导出，没有向 Supabase 发起写入。' },
  }
  fs.writeFileSync(`${root}/batch${groupIndex + 65}-audit-report.json`, JSON.stringify(report, null, 2))
}

const remainingEntries = screen.entries.slice(2000)
const issueCounts = {}
for (const entry of remainingEntries) for (const issue of entry.issues || []) issueCounts[issue] = (issueCounts[issue] || 0) + 1
const updatedScreen = {
  ...screen,
  generatedAt: stamp,
  scope: 'All characters not present in saved audit batches 2–84. Static screening only; unresolved fields remain in the corresponding batch reports.',
  previouslyAudited: screen.previouslyAudited + batch.length,
  remaining: remainingEntries.length,
  issueCounts,
  entries: remainingEntries,
}
if (updatedScreen.previouslyAudited !== 8300 || updatedScreen.remaining !== 4365) {
  throw new Error(`更新后的待审数量不符：已审 ${updatedScreen.previouslyAudited}，待审 ${updatedScreen.remaining}`)
}

const summary = [
  '# 动漫人物审核：第 65–84 批',
  '',
  `审核时间：${stamp}`,
  '',
  '## 范围与修正',
  '',
  `- 按待审名单顺序复核 2,000 位人物，分为 20 批；ID 从 ${batch[0].id} 到 ${batch.at(-1).id}（名单内 ID 不连续）。`,
  `- 本地 AniList 角色快照覆盖 ${batch.filter(row => profiles[row.id]).length} 位，其中 ${batch.filter(row => String(profiles[row.id]?.description || '').trim()).length} 位有文字资料。`,
  `- 对本批完成昵称规范化：去除 ${nicknameDuplicatesRemoved} 个重复昵称，补入 ${aliasesAdded} 个 AniList 官方全名/原文名。`,
  `- 依据唯一匹配来源补齐 ${voiceActorImagesAdded} 张声优头像；按角色 ID 刷新 ${characterImageRepaired.size} 张 AniList 角色头像。`,
  `- 为 2,000 位重建 search_text；重建前 ${searchIndexMismatchesBefore} 条索引与字段公式不一致。简介不进入索引。`,
  '',
  '## 保留待核',
  '',
  `- ${batch.filter(row => updatedIssues.get(Number(row.id)).includes('description_under_100_chars')).length} 条简介仍短于 100 字；${batch.filter(row => genericDescriptionRegex.test(byId.get(Number(row.id)).description || '')).length} 条简介仍含模板表达。`,
  `- ${batch.filter(row => updatedIssues.get(Number(row.id)).includes('generic_or_template_trait')).length} 位仍有泛化或模板特征；${batch.filter(row => updatedIssues.get(Number(row.id)).includes('hair_or_eye_color_needs_visual_check')).length} 位发色/瞳色仍需逐图核对。`,
  `- ${batch.filter(row => updatedIssues.get(Number(row.id)).includes('no_voice_actor_record')).length} 位没有声优记录；${batch.filter(row => updatedIssues.get(Number(row.id)).includes('voice_actor_image_missing')).length} 位仍有声优头像待补。`,
  `- ${batch.filter(row => updatedIssues.get(Number(row.id)).includes('no_cached_anilist_profile')).length} 位无本地 AniList 资料；${batch.filter(row => updatedIssues.get(Number(row.id)).includes('anilist_profile_has_no_description')).length} 位缓存资料没有简介。`,
  '- 没有可靠证据确认的字段继续待核，不标记为事实通过。',
  '',
  '## 同步状态',
  '',
  '- 本轮更新本地完整/精简角色导出、CSV、审核报告、剩余待审名单及 ANIME_LIST.md。',
  '- 本轮未向 Supabase 写入，也未尝试推送 Git。',
  '',
].join('\n')

fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join('\n')}\n`)
fs.writeFileSync(screenPath, JSON.stringify(updatedScreen, null, 2))
fs.writeFileSync(`${root}/batch65-84-audit-summary.md`, summary)
fs.writeFileSync(`${root}/remaining-review-screen.md`, [
  '# 剩余角色审核筛查',
  '',
  `生成时间：${stamp}`,
  '',
  `- 总角色：${updatedScreen.totalCharacters}`,
  `- 已有分批审阅记录：${updatedScreen.previouslyAudited}（第 2–84 批）`,
  `- 缺少分批审阅记录：${updatedScreen.remaining}；本文件记录逐条名单。`,
  '- 本文件仅列出尚未进入已审阅批次的角色；已审阅批次中的待核事项见各批报告。',
  '',
  '## 待核项数量',
  '',
  ...Object.entries(issueCounts).sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => `- ${key}: ${count}`),
  '',
  '逐角色 ID、姓名、作品和待核项见 `remaining-review-screen.json`。',
  '',
].join('\n'))

console.log(JSON.stringify({
  checked: batch.length,
  firstId: batch[0].id,
  lastId: batch.at(-1).id,
  profileCount: batch.filter(row => profiles[row.id]).length,
  profileDescriptionCount: batch.filter(row => String(profiles[row.id]?.description || '').trim()).length,
  duplicateNicknamesRemoved: nicknameDuplicatesRemoved,
  canonicalAliasesAdded: aliasesAdded,
  voiceActorImagesRepaired: voiceActorImagesAdded,
  characterImagesRefreshed: [...characterImageRepaired],
  searchIndexMismatchesBeforeRebuild: searchIndexMismatchesBefore,
  modifiedRecords: modified.size,
  remaining: remainingEntries.length,
  remainingIssueCounts: issueCounts,
}, null, 2))
