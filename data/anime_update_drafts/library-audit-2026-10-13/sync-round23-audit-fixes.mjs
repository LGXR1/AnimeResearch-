import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
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

const expectedVoices = []
for (const character of full) for (const actor of character.voice_actors || []) {
  const staff = exactMatches.get(actor.name)
  if (staff && actor.image === staff.image.large) expectedVoices.push({
    id: Number(actor.id), name: actor.name, characterId: Number(character.id), image: staff.image.large,
  })
}
const remoteVoiceRows = []
for (let i = 0; i < expectedVoices.length; i += 100) {
  const ids = expectedVoices.slice(i, i + 100).map(actor => actor.id)
  const { data, error } = await supabase.from('voice_actors').select('id,name,image,character_id').in('id', ids)
  if (error) throw new Error(`读取声优记录失败: ${error.message}`)
  remoteVoiceRows.push(...(data || []))
}
const remoteVoices = new Map(remoteVoiceRows.map(row => [Number(row.id), row]))
const voiceUpdates = []
for (const expected of expectedVoices) {
  const row = remoteVoices.get(expected.id)
  if (!row) throw new Error(`数据库缺少声优记录 ${expected.id}`)
  if (row.name !== expected.name || Number(row.character_id) !== expected.characterId) throw new Error(`数据库声优记录与本地不一致：${expected.id}`)
  if (row.image === expected.image) continue
  if (row.image && !/\/default\.jpg(?:\?|$)/i.test(row.image)) continue
  const { error } = await supabase.from('voice_actors').update({ image: expected.image }).eq('id', expected.id)
  if (error) throw new Error(`更新声优头像失败 ${expected.id}: ${error.message}`)
  voiceUpdates.push(expected)
}

const { data: placeholderRows, error: placeholderReadError } = await supabase
  .from('voice_actors').select('id,name,character_id').eq('id', 518)
if (placeholderReadError) throw new Error(`读取占位声优记录失败: ${placeholderReadError.message}`)
let placeholderRemoved = false
if ((placeholderRows || []).length) {
  const placeholder = placeholderRows[0]
  if (placeholder.name !== '暂未收录' || Number(placeholder.character_id) !== 306847) throw new Error('声优占位记录已改变，拒绝删除')
  const { error } = await supabase.from('voice_actors').delete().eq('id', 518)
  if (error) throw new Error(`删除无效声优占位记录失败: ${error.message}`)
  placeholderRemoved = true
}

const characterIds = [157882, 174778, 182729, 210921, 234805, 306847, 320607, 394843]
const localById = new Map(full.map(row => [Number(row.id), row]))
const { data: remoteCharacters, error: charactersError } = await supabase
  .from('characters').select('id,name,traits,search_text').in('id', characterIds)
if (charactersError) throw new Error(`读取角色记录失败: ${charactersError.message}`)
const remoteCharacterById = new Map((remoteCharacters || []).map(row => [Number(row.id), row]))
const characterUpdates = []
for (const id of characterIds) {
  const local = localById.get(id)
  const remote = remoteCharacterById.get(id)
  if (!local || !remote || remote.name !== local.name) throw new Error(`角色 ${id} 的本地与数据库记录无法安全对应`)
  const traitsMatch = JSON.stringify(remote.traits || []) === JSON.stringify(local.traits || [])
  if (traitsMatch && remote.search_text === local.search_text) continue
  const { error } = await supabase.from('characters').update({ traits: local.traits, search_text: local.search_text }).eq('id', id)
  if (error) throw new Error(`更新角色特征失败 ${id}: ${error.message}`)
  characterUpdates.push(id)
}

const { data: verifiedVoiceRows, error: verifyVoiceError } = await supabase
  .from('voice_actors').select('id,name,image,character_id').in('id', expectedVoices.map(actor => actor.id))
if (verifyVoiceError) throw new Error(`回读声优头像失败: ${verifyVoiceError.message}`)
const verifiedVoiceById = new Map((verifiedVoiceRows || []).map(row => [Number(row.id), row]))
const missingVoiceImages = expectedVoices.filter(actor => verifiedVoiceById.get(actor.id)?.image !== actor.image)
const { data: remainingPlaceholder, error: verifyPlaceholderError } = await supabase
  .from('voice_actors').select('id').eq('id', 518)
if (verifyPlaceholderError) throw new Error(`回读占位声优记录失败: ${verifyPlaceholderError.message}`)
const { data: verifiedCharacters, error: verifyCharacterError } = await supabase
  .from('characters').select('id,name,traits,search_text').in('id', characterIds)
if (verifyCharacterError) throw new Error(`回读角色记录失败: ${verifyCharacterError.message}`)
const verifiedCharacterById = new Map((verifiedCharacters || []).map(row => [Number(row.id), row]))
const mismatchCharacters = characterIds.filter(id => {
  const local = localById.get(id)
  const remote = verifiedCharacterById.get(id)
  return !remote || JSON.stringify(remote.traits || []) !== JSON.stringify(local.traits || []) || remote.search_text !== local.search_text
})
if (missingVoiceImages.length || mismatchCharacters.length || (remainingPlaceholder || []).length) throw new Error(`回读未通过: 声优头像 ${missingVoiceImages.length} 条，角色特征 ${mismatchCharacters.length} 条，占位记录 ${(remainingPlaceholder || []).length} 条`)
console.log(JSON.stringify({
  exactAniListStaffMatches: exactMatches.size,
  verifiedVoiceRecords: expectedVoices.length,
  voiceActorImagesUpdated: voiceUpdates.length,
  invalidPlaceholderRemoved: placeholderRemoved,
  characterRowsUpdated: characterUpdates,
  verification: 'passed',
}, null, 2))
