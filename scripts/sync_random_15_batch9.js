import { createClient } from "@supabase/supabase-js"
import { groups } from "./sync_random_15_batch9_data.js"

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error("需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。")
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = "https://graphql.anilist.co"

const query = `query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    characters(page: 1, perPage: 50, sort: ROLE) {
      edges {
        node { id name { full native } image { large } }
        voiceActors(language: JAPANESE) { name { full native } image { large } }
      }
    }
  }
}`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const hasHashedImage = (url, bucket) => {
  if (typeof url !== 'string' || !url.includes('anilistcdn') || !url.includes('/' + bucket + '/')) return false
  return /(?:^|\/)(?:[a-z]?\d+-[a-z0-9_-]+)\.(?:png|jpe?g|webp)$/i.test(url)
}

async function fetchCharacters(group) {
  const response = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables: { id: group.id } }),
  })
  if (!response.ok) throw new Error('AniList《' + group.title + '》请求失败：' + response.status)
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  const media = payload.data?.Media
  if (!media || media.id !== group.id) throw new Error('AniList 未返回《' + group.title + '》的预期作品。')
  const byId = new Map(media.characters.edges.map((edge) => [edge.node.id, edge]))
  return group.characters.map((record) => {
    const edge = byId.get(record.id)
    if (!edge) throw new Error('AniList 未返回《' + group.title + '》角色 ' + record.name + ' (' + record.id + ')')
    const actor = edge.voiceActors.find((person) => person?.name?.native && hasHashedImage(person.image?.large, 'staff'))
    const image = edge.node.image?.large
    if (!hasHashedImage(image, 'character')) throw new Error(record.name + ' 的角色头像缺少有效 AniList hash')
    if (!actor) throw new Error(record.name + ' 缺少带有效 AniList 头像的日语声优')
    const nicknames = [...new Set([edge.node.name.full, edge.node.name.native, record.name, ...record.aliases].filter(Boolean))]
    const traits = [...new Set([...group.themes, ...record.traits])]
    const descriptionLength = Array.from(record.description).length
    if (nicknames.length < 1 || traits.length < 8 || descriptionLength < 100 || descriptionLength > 200) {
      throw new Error(record.name + ' 字段不符合规范：别名 ' + nicknames.length + ' 项，特征 ' + traits.length + ' 项，简介 ' + descriptionLength + ' 字')
    }
    const character = {
      id: record.id,
      name: record.name,
      image,
      description: record.description,
      anime_title: group.title,
      nicknames,
      traits,
    }
    const voiceActor = {
      character_id: record.id,
      name: actor.name.native.trim(),
      image: actor.image.large,
      language: '日语',
    }
    return {
      character: { ...character, search_text: [character.name, group.title, ...nicknames, ...traits, voiceActor.name].join(' ') },
      voiceActor,
    }
  })
}

async function main() {
  if (process.argv.includes('--repair')) {
    const ids = groups.flatMap((group) => group.characters.map((character) => character.id))
    const expectedTitles = new Map(groups.flatMap((group) => group.characters.map((character) => [character.id, group.title])))
    const { data: existing, error: lookupError } = await supabase
      .from('characters')
      .select('id, anime_title')
      .in('id', ids)
    if (lookupError) throw new Error('修复前查询失败：' + lookupError.message)
    if (existing?.length !== ids.length || existing.some((row) => expectedTitles.get(row.id) !== row.anime_title)) {
      throw new Error('修复前检查失败：本批 75 位角色未完整存在于预期作品中。')
    }

    const rows = []
    for (const group of groups) {
      rows.push(...await fetchCharacters(group))
      await sleep(800)
    }
    const { error: updateError } = await supabase
      .from('characters')
      .upsert(rows.map((row) => row.character), { onConflict: 'id' })
    if (updateError) throw new Error('修复搜索特征失败：' + updateError.message)
    console.log('已修复本批 ' + rows.length + ' 位角色的特征与 search_text。')
    return
  }

  const titleSet = new Set()
  const idSet = new Set()
  for (const group of groups) {
    if (titleSet.has(group.title)) throw new Error('批次内作品重复：' + group.title)
    titleSet.add(group.title)
    if (group.characters.length < 5) throw new Error(group.title + ' 少于 5 位角色')
    for (const character of group.characters) {
      if (idSet.has(character.id)) throw new Error('批次内角色 ID 重复：' + character.id)
      idSet.add(character.id)
    }
  }

  const { data: existing, error: lookupError } = await supabase
    .from('characters')
    .select('id, name, anime_title')
    .in('anime_title', [...titleSet])
  if (lookupError) throw new Error('数据库作品查重失败：' + lookupError.message)
  if (existing?.length) {
    throw new Error('数据库已有本批作品，已停止写入：' + existing.map((row) => row.anime_title + '/' + row.name).join('、'))
  }

  const rows = []
  for (const group of groups) {
    rows.push(...await fetchCharacters(group))
    await sleep(800)
  }

  const { data: idMatches, error: idError } = await supabase
    .from('characters')
    .select('id, name, anime_title')
    .in('id', [...idSet])
  if (idError) throw new Error('数据库角色 ID 查重失败：' + idError.message)
  if (idMatches?.length) {
    throw new Error('角色 ID 已被占用：' + idMatches.map((row) => row.name + '《' + row.anime_title + '》(' + row.id + ')').join('、'))
  }

  const characters = rows.map((row) => row.character)
  const voiceActors = rows.map((row) => row.voiceActor)
  console.log('资料核验通过：' + groups.length + ' 部动漫，' + characters.length + ' 位角色，' + voiceActors.length + ' 位日语声优。')
  console.log('作品名查重、角色 ID 查重、头像 hash、别名、特征及简介长度均通过。')
  if (!process.argv.includes('--write')) {
    console.log('当前为预览模式；确认写入请添加 --write。')
    return
  }

  const { error: insertError } = await supabase.from('characters').insert(characters)
  if (insertError) throw new Error('角色写入失败：' + insertError.message)
  const { error: actorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (actorError) throw new Error('声优写入失败：' + actorError.message)
  console.log('已新增 ' + groups.length + ' 部动漫、' + characters.length + ' 位角色及 ' + voiceActors.length + ' 位日语声优。')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
