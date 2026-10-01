import { createClient } from '@supabase/supabase-js'
import { groups, skippedCandidateIds, anilistSnapshot } from './add_popular_existing_next_data.js'

const supabaseUrl = process.env.SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY
if (!supabaseUrl || !secretKey) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。')

const EXPECTED_START = 4897
const supabase = createClient(supabaseUrl, secretKey)
const skippedIds = new Set(skippedCandidateIds)
const normalize = value => String(value || '').toLocaleLowerCase().replace(/[\s·・.·'’ʼ_-]/g, '')
const unique = values => [...new Set(values.filter(Boolean))]
const hasHashedImage = (url, bucket) =>
  typeof url === 'string' && url.includes('anilistcdn') && url.includes(`/${bucket}/`) &&
  /(?:^|\/)(?:[a-z]?\d+-[a-z0-9_-]+)\.(?:png|jpe?g|webp)$/i.test(url)

async function fetchExistingTitles(titles) {
  const rows = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase.from('characters')
      .select('id, name, anime_title, nicknames')
      .in('anime_title', titles)
      .order('id')
      .range(offset, offset + 999)
    if (error) throw new Error(`作品查重失败：${error.message}`)
    rows.push(...(data || []))
    if ((data || []).length < 1000) break
    offset += 1000
  }
  return rows
}

async function getTotalCount() {
  const { count, error } = await supabase.from('characters').select('id', { count: 'exact', head: true })
  if (error) throw new Error(`读取全库角色数失败：${error.message}`)
  return count
}

async function main() {
  const records = groups.flatMap(group => group.characters.map(([id, name, aliases, traits, bio]) => ({
    group,
    character: { id, name, aliases: aliases.split('|'), traits: Array.isArray(traits) ? traits : traits.split('|'), bio },
  })))
  const ids = records.map(row => row.character.id)
  if (new Set(ids).size !== records.length || records.some(({ character }) => skippedIds.has(character.id))) {
    throw new Error('批次内存在角色 ID 重复，或数据包含明确跳过的匿名候选。')
  }
  for (const group of groups) {
    if (group.themes.length !== 3 || group.characters.length === 0) throw new Error(`《${group.title}》资料不完整。`)
    if (new Set(group.characters.map(([id]) => id)).size !== group.characters.length) throw new Error(`《${group.title}》内角色 ID 重复。`)
  }

  const missingSource = records.filter(({ group, character }) =>
    !anilistSnapshot.some(row => row.title === group.title && row.id === character.id && row.actor))
  if (missingSource.length) {
    throw new Error(`AniList 快照缺少角色或日配声优：${missingSource.map(({ character }) => `${character.name} (#${character.id})`).join('、')}`)
  }

  const startingCount = await getTotalCount()
  if (startingCount !== EXPECTED_START) {
    throw new Error(`数据库当前共 ${startingCount} 个角色，预期 ${EXPECTED_START}；为避免并发覆盖，已停止。`)
  }

  const { data: idMatches, error: idError } = await supabase.from('characters')
    .select('id, name, anime_title').in('id', ids)
  if (idError) throw new Error(`角色 ID 查重失败：${idError.message}`)
  if (idMatches?.length) {
    throw new Error(`以下角色 ID 已存在，停止写入：${idMatches.map(row => `${row.name}《${row.anime_title}》#${row.id}`).join('、')}`)
  }

  const existingRows = await fetchExistingTitles(groups.map(group => group.title))
  const existingKeys = new Set(existingRows.flatMap(row => [row.name, ...(row.nicknames || [])]
    .map(value => `${row.anime_title}\0${normalize(value)}`)))
  const nameMatches = records.filter(({ group, character }) => [character.name, ...character.aliases]
    .some(value => existingKeys.has(`${group.title}\0${normalize(value)}`)))
  if (nameMatches.length) {
    throw new Error(`发现作品内同名或别名重复角色，停止写入：${nameMatches.map(row => `${row.character.name}《${row.group.title}》`).join('、')}`)
  }

  const characters = []
  const voiceActors = []
  for (const { group, character } of records) {
    const source = anilistSnapshot.find(row => row.title === group.title && row.id === character.id)
    const image = source.image
    const actor = source.actor
    if (!hasHashedImage(image, 'character')) throw new Error(`${character.name} 的 AniList 角色头像缺少有效 hash。`)
    if (!actor?.name?.native || !hasHashedImage(actor.image?.large, 'staff')) {
      throw new Error(`${character.name} 缺少带 AniList hash 头像的日语声优。`)
    }

    const description = `${group.context}${character.bio}${group.ending}`
    const descriptionLength = Array.from(description).length
    const traits = unique([...group.themes, ...character.traits])
    const aliases = unique([character.name, source.name.full, source.name.native, ...character.aliases])
    if (traits.length < 8 || traits.length > 10 || aliases.length < 1 || descriptionLength < 100 || descriptionLength > 200) {
      throw new Error(`${character.name} 字段不合格：特征 ${traits.length} 项、别名 ${aliases.length} 项、简介 ${descriptionLength} 字。`)
    }

    characters.push({
      id: character.id,
      name: character.name,
      image,
      description,
      anime_title: group.title,
      nicknames: aliases,
      traits,
      search_text: [character.name, group.title, ...aliases, ...traits, actor.name.native].join(' '),
    })
    voiceActors.push({ character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' })
  }

  const counts = new Map()
  for (const row of existingRows) counts.set(row.anime_title, (counts.get(row.anime_title) || 0) + 1)
  console.log(`核验通过：${groups.length} 部已有动漫，新增 ${characters.length} 位角色和 ${voiceActors.length} 条日语声优资料。`)
  console.log(groups.map(group => `${group.title} ${counts.get(group.title) || 0}→${(counts.get(group.title) || 0) + group.characters.length}`).join('；'))
  console.log('已核对 AniList ID 与头像、日语声优头像、作品内别名重复、至少 8 个特征及 100–200 字简介。')
  if (!process.argv.includes('--write')) {
    console.log(`预览模式；写入后总数将为 ${EXPECTED_START + characters.length}。加 --write 执行写入。`)
    return
  }

  const { error: insertError } = await supabase.from('characters').insert(characters)
  if (insertError) throw new Error(`角色写入失败：${insertError.message}`)
  const { error: actorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (actorError) {
    await supabase.from('characters').delete().in('id', ids)
    throw new Error(`声优写入失败，已回滚本批角色：${actorError.message}`)
  }

  const { data: inserted, error: verifyError } = await supabase.from('characters')
    .select('id, name, anime_title, nicknames, traits, description, search_text, image').in('id', ids)
  if (verifyError || inserted?.length !== records.length) {
    await supabase.from('voice_actors').delete().in('character_id', ids)
    await supabase.from('characters').delete().in('id', ids)
    throw new Error(`写入后核验失败，已回滚：${verifyError?.message || `数据库只返回 ${inserted?.length || 0}/${records.length} 条角色`}。`)
  }
  const { data: insertedActors, error: actorsVerifyError } = await supabase.from('voice_actors')
    .select('character_id, name, image').in('character_id', ids)
  if (actorsVerifyError || insertedActors?.length !== records.length) {
    await supabase.from('voice_actors').delete().in('character_id', ids)
    await supabase.from('characters').delete().in('id', ids)
    throw new Error(`声优回读核验失败，已回滚：${actorsVerifyError?.message || `数据库只返回 ${insertedActors?.length || 0}/${records.length} 条记录`}。`)
  }

  const byId = new Map(inserted.map(row => [row.id, row]))
  for (const expected of characters) {
    const row = byId.get(expected.id)
    if (!row || row.anime_title !== expected.anime_title || row.search_text !== expected.search_text ||
      row.description !== expected.description || row.image !== expected.image || row.traits?.length < 8) {
      await supabase.from('voice_actors').delete().in('character_id', ids)
      await supabase.from('characters').delete().in('id', ids)
      throw new Error(`写入后字段不匹配，已回滚：${expected.name} (#${expected.id})。`)
    }
  }

  const endingCount = await getTotalCount()
  if (endingCount !== EXPECTED_START + records.length) {
    throw new Error(`写入已完成但总数为 ${endingCount}，目标应为 ${EXPECTED_START + records.length}；请检查是否有并发数据变更。`)
  }
  console.log(`Supabase 写入及回读核验通过：${records.length} 条角色、${records.length} 条声优，全库共 ${endingCount} 位角色。`)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
