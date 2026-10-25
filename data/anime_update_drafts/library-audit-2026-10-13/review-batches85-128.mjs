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

if (screen.previouslyAudited !== 8300 || screen.entries.length !== 4365 || screen.remaining !== 4365) {
  throw new Error(`待审清单边界变化：已审 ${screen.previouslyAudited}，待审 ${screen.entries.length}`)
}
const batch = screen.entries
if (batch.length !== 4365 || batch[0].id !== 157690 || batch.at(-1).id !== 990000001) {
  throw new Error(`本轮边界变化：${batch.length} 位，${batch[0]?.id}–${batch.at(-1)?.id}`)
}
const ids = new Set(batch.map(row => Number(row.id)))
if (ids.size !== batch.length) throw new Error('待审名单中的角色 ID 重复')
const byId = new Map(full.map(row => [Number(row.id), row]))
if (batch.some(row => !byId.has(Number(row.id)))) throw new Error('待审名单中存在不在本地完整数据内的角色')

const modified = new Set()
const nicknameResolved = new Set()
const voiceImageRepaired = new Set()
const characterImageRepaired = new Set()
const indexMismatchIds = new Set()
const issuesById = new Map(batch.map(entry => [Number(entry.id), new Set(entry.issues || [])]))
const normalizedName = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const addImageCandidate = (map, name, image) => {
  if (!name || !image || !/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/staff\//.test(image)) return
  const key = normalizedName(name)
  if (!key) return
  if (!map.has(key)) map.set(key, new Set())
  map.get(key).add(image)
}
const jpStaffForCharacter = id => {
  const staff = new Map()
  for (const edge of cachedVoiceMedia[id]?.media?.edges || []) {
    if (edge.node?.countryOfOrigin !== 'JP') continue
    for (const actor of edge.voiceActors || []) if (actor?.id && actor?.image?.large) staff.set(Number(actor.id), actor)
  }
  return [...staff.values()]
}

const imageByLocalActorName = new Map()
const imageByCachedStaffName = new Map()
for (const character of full) {
  for (const actor of character.voice_actors || []) if (actor.image) addImageCandidate(imageByLocalActorName, actor.name, actor.image)
  const japaneseStaff = jpStaffForCharacter(Number(character.id))
  for (const actor of character.voice_actors || []) {
    const exact = japaneseStaff.filter(item => item.name?.native === actor.name || item.name?.full === actor.name)
    if (exact.length === 1) addImageCandidate(imageByCachedStaffName, actor.name, exact[0].image?.large)
  }
}

let aliasesAdded = 0
let duplicateNicknamesRemoved = 0
let voiceActorImagesAdded = 0
let searchIndexMismatchesBefore = 0

for (const entry of batch) {
  const id = Number(entry.id)
  const row = byId.get(id)
  const profile = profiles[id]
  const issues = issuesById.get(id)

  const oldNicknames = Array.isArray(row.nicknames) ? row.nicknames : []
  const nicknames = []
  const seen = new Set()
  for (const raw of oldNicknames) {
    const value = String(raw ?? '').trim()
    const key = normalizedName(value)
    if (!key) continue
    if (seen.has(key)) {
      duplicateNicknamesRemoved++
      continue
    }
    seen.add(key)
    nicknames.push(value)
  }
  if (nicknames.length !== oldNicknames.length) {
    nicknameResolved.add(id)
    modified.add(id)
  }
  for (const canonical of [profile?.name?.full, profile?.name?.native]) {
    const value = String(canonical ?? '').trim()
    const key = normalizedName(value)
    if (!key || seen.has(key)) continue
    seen.add(key)
    nicknames.push(value)
    aliasesAdded++
    nicknameResolved.add(id)
    modified.add(id)
  }
  row.nicknames = nicknames

  const cachedImage = profile?.image?.large
  if (issues.has('cached_anilist_image_differs') && cachedImage &&
      new RegExp(`/anilistcdn/character/(?:large|medium)/b${id}-[^/]+\\.(?:png|jpe?g|webp)$`, 'i').test(cachedImage) &&
      row.image !== cachedImage) {
    row.image = cachedImage
    characterImageRepaired.add(id)
    modified.add(id)
  }

  const characterStaff = jpStaffForCharacter(id)
  for (const actor of row.voice_actors || []) {
    if (actor.image) continue
    const direct = characterStaff.filter(item => item.name?.native === actor.name || item.name?.full === actor.name)
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

  if (profile?.name?.full && !row.nicknames.some(value => normalizedName(value) === normalizedName(profile.name.full))) {
    throw new Error(`角色 ${id} 未保留 AniList full name`)
  }
  if (profile?.name?.native && !row.nicknames.some(value => normalizedName(value) === normalizedName(profile.name.native))) {
    throw new Error(`角色 ${id} 未保留 AniList native name`)
  }
  if (new Set(row.nicknames.map(normalizedName)).size !== row.nicknames.length) throw new Error(`角色 ${id} 昵称仍重复`)
  if (row.search_text !== expectedSearch || row.search_text.includes(row.description || '\u0000')) throw new Error(`角色 ${id} 搜索索引校验失败`)

  issues.delete('duplicate_nicknames')
  issues.delete('anilist_name_missing_from_nicknames')
  if ((row.voice_actors || []).length && row.voice_actors.every(actor => actor.image)) issues.delete('voice_actor_image_missing')
  if (cachedImage && row.image === cachedImage) issues.delete('cached_anilist_image_differs')
}

const genericDescriptionRegex = /角色在训练、比赛与团队相处中展现独特性格|通过自身经历参与关键事件|在故事中扮演着自己的角色|这个角色见证了作品情节的发展|是这部作品群像中的一员|本作.{0,20}不可忽略的一员|作品围绕.{0,35}展开|在日常相处、冲突和情感变化中|在日常相处、冲突抉择和团队协作中/
const colorRegex = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/
const genericTraitRegex = /^(?:日本动画|美食题材|剧情推动者|剧情核心|作品群像|动漫角色|登场角色|相关人物|相关者|重要配角|核心人物|核心角色|常驻人物|主要角色|重要角色|配角|重要人物|作品主角|团队成员|日语配音|角色序位\d+|相关角色|故事主角|核心成员)$/
const changedIds = idsSet => batch.filter(entry => idsSet.has(Number(entry.id))).map(entry => Number(entry.id))
const groupCount = Math.ceil(batch.length / 100)

const reports = []
for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
  const group = batch.slice(groupIndex * 100, (groupIndex + 1) * 100)
  const groupIds = group.map(entry => Number(entry.id))
  const groupSet = new Set(groupIds)
  const issueHas = (entry, key) => issuesById.get(Number(entry.id))?.has(key)
  const groupReport = {
    checkedAt: stamp,
    batchStatus: 'reviewed_with_followups',
    checkedCount: group.length,
    checkedIds: groupIds,
    checkedRange: { firstId: groupIds[0], lastId: groupIds.at(-1) },
    profileSnapshotVerifiedCount: group.filter(entry => profiles[entry.id]).length,
    profileDescriptionAvailableCount: group.filter(entry => String(profiles[entry.id]?.description || '').trim()).length,
    modifiedIds: [...modified].filter(id => groupSet.has(id)).sort((a, b) => a - b),
    source: {
      name: '本地 AniList 角色资料与日语作品声优关联缓存；本轮未作实时网页查询',
      fetchedAt: profileSnapshot.fetchedAt,
      voiceMediaFetchedAt: voiceSnapshot.fetchedAt,
      records: group.filter(entry => profiles[entry.id]).map(entry => ({ id: entry.id, url: `https://anilist.co/character/${entry.id}` })),
    },
    pendingExternalVerificationIds: group.filter(entry => issueHas(entry, 'no_cached_anilist_profile')).map(entry => Number(entry.id)),
    pendingProfileNoDescriptionIds: group.filter(entry => issueHas(entry, 'anilist_profile_has_no_description')).map(entry => Number(entry.id)),
    pendingShortDescriptionIds: group.filter(entry => issueHas(entry, 'description_under_100_chars')).map(entry => Number(entry.id)),
    pendingDescriptionQualityIds: group.filter(entry => genericDescriptionRegex.test(byId.get(Number(entry.id)).description || '')).map(entry => Number(entry.id)),
    pendingTraitVerificationIds: group.filter(entry => issueHas(entry, 'generic_or_template_trait')).map(entry => Number(entry.id)),
    pendingExactGenericTraitIds: group.filter(entry => (byId.get(Number(entry.id)).traits || []).some(trait => genericTraitRegex.test(trait))).map(entry => Number(entry.id)),
    pendingVoiceActorIds: group.filter(entry => issueHas(entry, 'no_voice_actor_record')).map(entry => Number(entry.id)),
    pendingVoiceActorImageIds: group.filter(entry => issueHas(entry, 'voice_actor_image_missing') || (byId.get(Number(entry.id)).voice_actors || []).some(actor => !actor.image)).map(entry => Number(entry.id)),
    pendingVisualVerificationIds: group.filter(entry => issueHas(entry, 'hair_or_eye_color_needs_visual_check')).map(entry => Number(entry.id)),
    pendingColorTraitKeywordIds: group.filter(entry => (byId.get(Number(entry.id)).traits || []).some(trait => colorRegex.test(trait))).map(entry => Number(entry.id)),
    pendingImageMismatchIds: group.filter(entry => issueHas(entry, 'cached_anilist_image_differs')).map(entry => Number(entry.id)),
    localFollowup: {
      nicknameIssuesResolved: changedIds(nicknameResolved).filter(id => groupSet.has(id)),
      voiceActorImagesRepaired: changedIds(voiceImageRepaired).filter(id => groupSet.has(id)),
      characterImagesRefreshed: changedIds(characterImageRepaired).filter(id => groupSet.has(id)),
      factualCorrections: [],
      searchIndex: {
        rebuilt: true,
        formulaVerified: group.every(entry => {
          const character = byId.get(Number(entry.id))
          return character.search_text === [character.name, character.anime_title, ...(character.nicknames || []), ...(character.traits || []), ...(character.voice_actors || []).map(actor => actor.name)].join(' ')
        }),
        descriptionExcluded: group.every(entry => !byId.get(Number(entry.id)).search_text.includes(byId.get(Number(entry.id)).description || '\u0000')),
        mismatchCountBeforeRebuild: group.filter(entry => indexMismatchIds.has(Number(entry.id))).length,
      },
      localExportsRegenerated: true,
      nicknameAudit: {
        checkedCount: group.length,
        duplicateCountAfter: group.filter(entry => new Set((byId.get(Number(entry.id)).nicknames || []).map(normalizedName)).size !== (byId.get(Number(entry.id)).nicknames || []).length).length,
        canonicalAniListNameMissingAfter: group.filter(entry => {
          const names = profiles[entry.id]?.name || {}
          const aliases = (byId.get(Number(entry.id)).nicknames || []).map(normalizedName)
          return [names.full, names.native].some(value => value && !aliases.includes(normalizedName(value)))
        }).length,
      },
    },
    note: '已对本地资料、昵称、索引及唯一来源头像完成复核；待核项目保留，不视为事实通过。',
    scopeLimitations: [
      '发色、瞳色没有逐图目视核验。',
      '短简介、模板简介和泛化特征在缺少可靠事实来源时未改写。',
      '没有本地 AniList 资料、没有声优记录或无法唯一匹配头像的记录保留待核。',
      '本次只更新本地文件；Supabase 未同步，远端数据未回读。',
    ],
    databaseSync: { syncedAt: null, syncedCount: 0, readbackVerified: false, status: 'not_synced' },
    syncAttempt: { attemptedThisTurn: false, reason: '本轮仅处理本地缓存与导出，没有向 Supabase 发起写入。' },
  }
  reports.push({ file: `${root}/batch${groupIndex + 85}-audit-report.json`, report: groupReport })
}

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
  csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
}

const remainingScreen = {
  ...screen,
  generatedAt: stamp,
  scope: 'Every character in the original audit dataset has a saved batch review. Unresolved factual follow-ups are listed in the per-batch reports.',
  previouslyAudited: screen.previouslyAudited + batch.length,
  remaining: 0,
  issueCounts: {},
  entries: [],
}
if (remainingScreen.previouslyAudited !== full.length || remainingScreen.remaining !== 0) {
  throw new Error(`最终审核数量不符：已审 ${remainingScreen.previouslyAudited}，总数 ${full.length}`)
}
if (reports.reduce((sum, item) => sum + item.report.checkedCount, 0) !== batch.length) throw new Error('分批报告覆盖数不符')
if (reports.some(item => item.report.localFollowup.nicknameAudit.duplicateCountAfter || item.report.localFollowup.nicknameAudit.canonicalAniListNameMissingAfter || !item.report.localFollowup.searchIndex.formulaVerified || !item.report.localFollowup.searchIndex.descriptionExcluded)) {
  throw new Error('至少一个审核批次未通过本地昵称或搜索索引回读')
}

const unresolvedIssueCounts = {}
for (const issues of issuesById.values()) for (const issue of issues) unresolvedIssueCounts[issue] = (unresolvedIssueCounts[issue] || 0) + 1
const unresolved = Object.entries(unresolvedIssueCounts).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `- ${key}: ${value}`)
const summary = [
  '# 动漫人物审核：第 85–128 批',
  '',
  `审核时间：${stamp}`,
  '',
  '## 范围与修正',
  '',
  `- 按待审名单顺序审阅剩余 ${batch.length} 位，分为 ${groupCount} 批；ID 从 ${batch[0].id} 到 ${batch.at(-1).id}（名单内 ID 不连续）。`,
  `- 本地 AniList 角色快照覆盖 ${batch.filter(entry => profiles[entry.id]).length} 位，其中 ${batch.filter(entry => String(profiles[entry.id]?.description || '').trim()).length} 位有文字资料。`,
  `- 去除 ${duplicateNicknamesRemoved} 个重复昵称，补入 ${aliasesAdded} 个 AniList 官方全名/原文名。`,
  `- 依据唯一匹配来源补齐 ${voiceActorImagesAdded} 张声优头像；按角色 ID 刷新 ${characterImageRepaired.size} 张角色头像。`,
  `- 为 ${batch.length} 位重建 search_text；重建前 ${searchIndexMismatchesBefore} 条索引与字段公式不一致。简介不进入索引。`,
  '',
  '## 仍需事实核验',
  '',
  ...unresolved,
  '',
  '- 上述数量为本轮可直接修复后仍保留的待核标签数，类别之间可能重叠。',
  '- 发色、瞳色未逐图核验；简介或特征缺少可靠来源时保留待核，没有编造。',
  '- 所有角色均已进入审核批次，但“已有审核记录”不代表全部事实字段均已确认。',
  '',
  '## 同步状态',
  '',
  '- 本轮更新本地完整/精简角色导出、CSV、审核报告、待审筛查文件及 ANIME_LIST.md。',
  '- 本轮未向 Supabase 写入，也未提交或推送 Git。',
  '',
].join('\n')

for (const item of reports) fs.writeFileSync(item.file, JSON.stringify(item.report, null, 2))
fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${csvLines.join('\n')}\n`)
fs.writeFileSync(screenPath, JSON.stringify(remainingScreen, null, 2))
fs.writeFileSync(`${root}/batch85-128-audit-summary.md`, summary)
fs.writeFileSync(`${root}/remaining-review-screen.md`, [
  '# 剩余角色审核筛查',
  '',
  `生成时间：${stamp}`,
  '',
  `- 总角色：${remainingScreen.totalCharacters}`,
  `- 已有分批审阅记录：${remainingScreen.previouslyAudited}（第 2–128 批）`,
  '- 未进入审核批次的角色：0。',
  '- 已审批次中仍待事实核验的字段，请查看各批审核报告；审核记录不代表所有字段均已确认。',
  '',
].join('\n'))

console.log(JSON.stringify({
  checked: batch.length,
  firstId: batch[0].id,
  lastId: batch.at(-1).id,
  reportCount: reports.length,
  profileCount: batch.filter(entry => profiles[entry.id]).length,
  profileDescriptionCount: batch.filter(entry => String(profiles[entry.id]?.description || '').trim()).length,
  duplicateNicknamesRemoved,
  canonicalAliasesAdded: aliasesAdded,
  voiceActorImagesRepaired: voiceActorImagesAdded,
  characterImagesRefreshed: [...characterImageRepaired],
  searchIndexMismatchesBeforeRebuild: searchIndexMismatchesBefore,
  modifiedRecords: modified.size,
  remainingUnreviewed: 0,
}, null, 2))
