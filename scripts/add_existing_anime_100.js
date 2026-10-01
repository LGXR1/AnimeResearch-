import { createClient } from '@supabase/supabase-js'
import { groups } from './add_existing_anime_100_data.js'

const supabaseUrl = process.env.SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY
if (!supabaseUrl || !secretKey) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。')

const supabase = createClient(supabaseUrl, secretKey)
const anilist = 'https://graphql.anilist.co'
const query = `query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title { romaji english native }
    characters(page: 1, perPage: 50, sort: ROLE) {
      edges {
        node { id name { full native } image { large } }
        voiceActors(language: JAPANESE) { name { full native } image { large } }
      }
    }
  }
}`

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const hasHashedImage = (url, bucket) =>
  typeof url === 'string' && url.includes('anilistcdn') && url.includes(`/${bucket}/`) &&
  /(?:^|\/)(?:[a-z]?\d+-[a-z0-9_-]+)\.(?:png|jpe?g|webp)$/i.test(url)

async function fetchAnime(group) {
  const response = await fetch(anilist, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { id: group.mediaId } }),
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
      .select('id, name, anime_title')
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

async function main() {
  const records = groups.flatMap(group => group.characters.map(character => ({ group, character })))
  const ids = records.map(row => row.character.id)
  if (records.length !== 100 || new Set(ids).size !== 100) {
    throw new Error(`批次必须恰好包含 100 个不同角色，当前 ${records.length} 条、${new Set(ids).size} 个不同 ID。`)
  }
  for (const group of groups) {
    if (group.themes.length < 3 || group.characters.length < 5) throw new Error(`《${group.title}》资料不完整。`)
    if (new Set(group.characters.map(c => c.id)).size !== group.characters.length) throw new Error(`《${group.title}》内角色 ID 重复。`)
  }

  const { data: idMatches, error: idError } = await supabase.from('characters')
    .select('id, name, anime_title').in('id', ids)
  if (idError) throw new Error(`角色 ID 查重失败：${idError.message}`)
  if (idMatches?.length) {
    throw new Error(`以下角色已存在，停止写入：${idMatches.map(row => `${row.name}《${row.anime_title}》#${row.id}`).join('、')}`)
  }

  const existingRows = await fetchExistingTitles(groups.map(group => group.title))
  const existingNames = new Set(existingRows.map(row => `${row.anime_title}\0${row.name}`))
  const nameMatches = records.filter(({ group, character }) => existingNames.has(`${group.title}\0${character.name}`))
  if (nameMatches.length) {
    throw new Error(`发现同名重复角色，停止写入：${nameMatches.map(row => `${row.character.name}《${row.group.title}》`).join('、')}`)
  }

  const characters = []
  const voiceActors = []
  for (const group of groups) {
    const byId = await fetchAnime(group)
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
      if (traits.length < 8 || nicknames.length < 1 || descriptionLength < 100 || descriptionLength > 200) {
        throw new Error(`${record.name} 字段不合格：特征 ${traits.length} 项、别名 ${nicknames.length} 项、简介 ${descriptionLength} 字。`)
      }

      const character = {
        id: record.id,
        name: record.name,
        image,
        description,
        anime_title: group.title,
        nicknames,
        traits,
        search_text: [record.name, group.title, ...nicknames, ...traits, actor.name.native].join(' '),
      }
      characters.push(character)
      voiceActors.push({ character_id: record.id, name: actor.name.native, image: actor.image.large, language: '日语' })
    }
    await sleep(800)
  }

  const counts = new Map()
  for (const row of existingRows) counts.set(row.anime_title, (counts.get(row.anime_title) || 0) + 1)
  console.log(`核验通过：${groups.length} 部已有动漫，新增 ${characters.length} 位角色和 ${voiceActors.length} 条日语声优资料。`)
  console.log(groups.map(group => `${group.title} ${counts.get(group.title) || 0}→${(counts.get(group.title) || 0) + group.characters.length}`).join('；'))
  console.log('已核对 AniList 角色 ID、角色/声优头像 hash、别名、至少 8 个特征、100–200 字简介及重复记录。')
  if (!process.argv.includes('--write')) {
    console.log('预览模式；确认写入 Supabase 时运行并添加 --write。')
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
  if (verifyError || inserted?.length !== 100) {
    throw new Error(`写入后核验失败：${verifyError?.message || `数据库只返回 ${inserted?.length || 0}/100 条角色`}。`)
  }
  const { data: insertedActors, error: actorsVerifyError } = await supabase.from('voice_actors')
    .select('character_id, name, image').in('character_id', ids)
  if (actorsVerifyError || insertedActors?.length !== 100) {
    throw new Error(`声优写入后核验失败：${actorsVerifyError?.message || `数据库只返回 ${insertedActors?.length || 0}/100 条记录`}。`)
  }
  const byId = new Map(inserted.map(row => [row.id, row]))
  for (const { group, character } of records) {
    const row = byId.get(character.id)
    const expected = characters.find(item => item.id === character.id)
    if (!row || row.anime_title !== group.title || row.search_text !== expected.search_text || row.description !== expected.description) {
      throw new Error(`写入后字段不匹配：${character.name} (#${character.id})。`)
    }
  }
  console.log('Supabase 写入及 100 条角色、100 条声优回读核验通过。')
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
