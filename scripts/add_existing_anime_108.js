import { createClient } from '@supabase/supabase-js'
import { groups } from './add_existing_anime_108_data.js'

const supabaseUrl = process.env.SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY
if (!supabaseUrl || !secretKey) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。')

const EXPECTED_START = 4692
const EXPECTED_END = 4800
const supabase = createClient(supabaseUrl, secretKey)
const anilist = 'https://graphql.anilist.co'
const query = `query ($id: Int, $page: Int) {
  Media(id: $id, type: ANIME) {
    id
    characters(page: $page, perPage: 50, sort: ROLE) {
      edges {
        node { id name { full native } image { large } description }
        voiceActors(language: JAPANESE) { name { full native } image { large } }
      }
    }
  }
}`

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const hasHashedImage = (url, bucket) =>
  typeof url === 'string' && url.includes('anilistcdn') && url.includes(`/${bucket}/`) &&
  /(?:^|\/)(?:[a-z]?\d+-[a-z0-9_-]+)\.(?:png|jpe?g|webp)$/i.test(url)
const normalize = value => String(value || '').toLocaleLowerCase().replace(/[\s·・.·'’ʼ_-]/g, '')

async function fetchAnime(group, page = 1) {
  const response = await fetch(anilist, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { id: group.mediaId, page } }),
  })
  const payload = await response.json()
  if (!response.ok || payload.errors) {
    throw new Error(`AniList《${group.title}》请求失败：${payload.errors?.map(e => e.message).join('; ') || response.status}`)
  }
  const media = payload.data?.Media
  if (!media || media.id !== group.mediaId) throw new Error(`AniList 未返回《${group.title}》预期作品。`)
  return new Map(media.characters.edges.map(edge => [edge.node.id, edge]))
}

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
  const records = groups.flatMap(group => group.characters.map(character => ({ group, character })))
  const ids = records.map(row => row.character.id)
  if (records.length !== EXPECTED_END - EXPECTED_START || new Set(ids).size !== records.length) {
    throw new Error(`批次必须恰好包含 ${EXPECTED_END - EXPECTED_START} 个不同角色，当前 ${records.length} 条、${new Set(ids).size} 个不同 ID。`)
  }
  for (const group of groups) {
    if (group.themes.length !== 3 || group.characters.length < 3) throw new Error(`《${group.title}》资料不完整。`)
    if (new Set(group.characters.map(c => c.id)).size !== group.characters.length) throw new Error(`《${group.title}》内角色 ID 重复。`)
  }

  const startingCount = await getTotalCount()
  if (startingCount !== EXPECTED_START) {
    throw new Error(`数据库当前共 ${startingCount} 个角色，预期 ${EXPECTED_START}；为避免超过目标，已停止。`)
  }

  const { data: idMatches, error: idError } = await supabase.from('characters')
    .select('id, name, anime_title').in('id', ids)
  if (idError) throw new Error(`角色 ID 查重失败：${idError.message}`)
  if (idMatches?.length) {
    throw new Error(`以下角色已存在，停止写入：${idMatches.map(row => `${row.name}《${row.anime_title}》#${row.id}`).join('、')}`)
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
  for (const [index, group] of groups.entries()) {
    const byId = await fetchAnime(group, 1)
    if (group.characters.some(record => !byId.has(record.id))) {
      await sleep(800)
      for (const [id, edge] of (await fetchAnime(group, 2))) byId.set(id, edge)
    }
    for (const record of group.characters) {
      const edge = byId.get(record.id)
      if (!edge) throw new Error(`AniList《${group.title}》未返回角色 ${record.name} (#${record.id})。`)
      const image = edge.node.image?.large
      if (!hasHashedImage(image, 'character')) throw new Error(`${record.name} 的 AniList 角色头像缺少有效 hash。`)
      const actor = edge.voiceActors?.find(item => item?.name?.native && hasHashedImage(item.image?.large, 'staff'))
      if (!actor) throw new Error(`${record.name} 缺少带 AniList hash 头像的日语声优。`)

      const description = `${group.context}${record.bio}${group.ending}`
      const descriptionLength = Array.from(description).length
      const traits = [...new Set([...group.themes, ...record.traits])]
      const nicknames = [...new Set([record.name, edge.node.name.full, edge.node.name.native, ...record.aliases].filter(Boolean))]
      if (traits.length < 8 || traits.length > 10 || nicknames.length < 1 || descriptionLength < 100 || descriptionLength > 200) {
        throw new Error(`${record.name} 字段不合格：特征 ${traits.length} 项、别名 ${nicknames.length} 项、简介 ${descriptionLength} 字。`)
      }

      characters.push({
        id: record.id,
        name: record.name,
        image,
        description,
        anime_title: group.title,
        nicknames,
        traits,
        search_text: [record.name, group.title, ...nicknames, ...traits, actor.name.native].join(' '),
      })
      voiceActors.push({ character_id: record.id, name: actor.name.native, image: actor.image.large, language: '日语' })
    }
    if (index < groups.length - 1) await sleep(800)
  }

  const counts = new Map()
  for (const row of existingRows) counts.set(row.anime_title, (counts.get(row.anime_title) || 0) + 1)
  console.log(`核验通过：${groups.length} 部已有动漫，新增 ${characters.length} 位角色和 ${voiceActors.length} 条日语声优资料。`)
  console.log(groups.map(group => `${group.title} ${counts.get(group.title) || 0}→${(counts.get(group.title) || 0) + group.characters.length}`).join('；'))
  console.log('已核对 AniList 角色 ID、角色/声优头像 hash、作品内别名重复、至少 8 个特征、100–200 字简介及数据库起始总数。')
  if (!process.argv.includes('--write')) {
    console.log(`预览模式；确认写入后总数将为 ${EXPECTED_END}。加 --write 执行写入。`)
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
    .select('id, name, anime_title, nicknames, traits, description, search_text, image')
    .in('id', ids)
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
  for (const { group, character } of records) {
    const row = byId.get(character.id)
    const expected = characters.find(item => item.id === character.id)
    if (!row || row.anime_title !== group.title || row.search_text !== expected.search_text || row.description !== expected.description) {
      await supabase.from('voice_actors').delete().in('character_id', ids)
      await supabase.from('characters').delete().in('id', ids)
      throw new Error(`写入后字段不匹配，已回滚：${character.name} (#${character.id})。`)
    }
  }

  const endingCount = await getTotalCount()
  if (endingCount !== EXPECTED_END) throw new Error(`写入已完成但总数为 ${endingCount}，目标应为 ${EXPECTED_END}；请检查是否有并发数据变更。`)
  console.log(`Supabase 写入及回读核验通过：${records.length} 条角色、${records.length} 条声优，全库共 ${endingCount} 位角色。`)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
