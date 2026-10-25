import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { groups } from './new_anime_curated_batch10.js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY')
}

const draftFiles = new Map([
  [98977, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [129195, 'anime-update-2026-10-02T14-11-15-567Z-108577-179302-180523-2924-15085-198188-9941-21815-21382-106967-158539-129195-178434-18095-97716.json'],
  [170695, 'anime-update-2026-10-02T13-29-57-892Z-21517-160188-21006-759-59-168374-142455-13161-20590-21110-155963-12445-170695-146625-20527.json'],
  [163142, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [21565, 'anime-update-2026-10-03T02-06-26-168Z-8424-100714-112444-105081-105807-123899-146954-20719-139825-189-209939-21565-201514-114195-101381.json'],
  [185993, 'anime-update-2026-10-02T14-06-24-464Z-176642-199748-240-20565-185993-160090-101249-5909-107672-20638-13599-2026-183274-146233-20839.json'],
  [150, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [9941, 'anime-update-2026-10-02T14-11-15-567Z-108577-179302-180523-2924-15085-198188-9941-21815-21382-106967-158539-129195-178434-18095-97716.json'],
  [13599, 'anime-update-2026-10-02T14-06-24-464Z-176642-199748-240-20565-185993-160090-101249-5909-107672-20638-13599-2026-183274-146233-20839.json'],
  [199748, 'anime-update-2026-10-02T14-06-24-464Z-176642-199748-240-20565-185993-160090-101249-5909-107672-20638-13599-2026-183274-146233-20839.json'],
  [127401, 'anime-update-2026-10-03T02-42-42-398Z-11499-2034-14749-137908-125428-21123-117448-21878-127401-20773-9041-124410-7724-126192-875.json'],
  [20771, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [182814, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [163076, 'anime-update-2026-10-02T14-34-57-673Z-150695-5042-190327-15379-119675-178462-104252-151639-21410-20529-10080-163076-115740-158417-4063.json'],
  [158417, 'anime-update-2026-10-02T14-34-57-673Z-150695-5042-190327-15379-119675-178462-104252-151639-21410-20529-10080-163076-115740-158417-4063.json'],
  [21410, 'anime-update-2026-10-02T14-34-57-673Z-150695-5042-190327-15379-119675-178462-104252-151639-21410-20529-10080-163076-115740-158417-4063.json'],
  [98436, 'anime-update-anilist-98436.json'],
  [790, 'anime-update-anilist-790.json'],
  [21268, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [21269, 'anime-update-2026-10-02T13-59-50-783Z-131863-163142-150-885-98977-182814-99698-21269-101361-109979-21268-21714-20771-20599-19703.json'],
  [101165, 'anime-update-anilist-101165.json'],
  [98460, 'anime-update-anilist-98460.json'],
  [116006, 'anime-update-anilist-116006.json'],
  [226, 'anime-update-anilist-226.json'],
  [120697, 'anime-update-anilist-120697.json'],
  [20954, 'anime-update-anilist-20954.json'],
  [99750, 'anime-update-anilist-99750.json'],
  [99578, 'anime-update-anilist-99578.json'],
  [112301, 'anime-update-anilist-112301.json'],
  [130588, 'anime-update-anilist-130588.json'],
  [6880, 'anime-update-anilist-6880.json'],
  [116267, 'anime-update-anilist-116267.json'],
  [1575, 'anime-update-anilist-1575.json'],
  [2904, 'anime-update-anilist-2904.json'],
  [101348, 'anime-update-anilist-101348.json'],
  [136430, 'anime-update-anilist-136430.json'],
  [130298, 'anime-update-anilist-130298.json'],
  [161964, 'anime-update-anilist-161964.json'],
  [128893, 'anime-update-anilist-128893.json'],
  [166613, 'anime-update-anilist-166613.json'],
])

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const hashedImage = (url, bucket) =>
  typeof url === 'string' &&
  new RegExp(`^https://[^/]+/file/anilistcdn/${bucket}/large/[bn]?\\d+-[a-z0-9_-]+\\.(?:png|jpe?g|webp)$`, 'i').test(url)

async function fetchCurrent(mediaId) {
  const query = `query ($id: Int, $page: Int) {
    Media(id: $id, type: ANIME) {
      id
      characters(page: $page, perPage: 25, sort: ROLE) {
        pageInfo { hasNextPage }
        edges {
          node { id name { full native } image { large } }
          voiceActors(language: JAPANESE) { id name { full native } image { large } }
        }
      }
    }
  }`
  const edges = new Map()
  for (let page = 1; page <= 10; page++) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables: { id: mediaId, page } }),
    })
    if (!response.ok) throw new Error(`AniList ${mediaId} 第 ${page} 页 HTTP ${response.status}`)
    const payload = await response.json()
    if (payload.errors?.length) throw new Error(payload.errors.map((x) => x.message).join('; '))
    if (payload.data?.Media?.id !== mediaId) throw new Error(`AniList 作品 ${mediaId} 未匹配`)
    for (const edge of payload.data.Media.characters.edges) edges.set(edge.node.id, edge)
    if (!payload.data.Media.characters.pageInfo.hasNextPage) return edges
    await sleep(800)
  }
  throw new Error(`AniList 作品 ${mediaId} 角色分页超过 10 页，已停止处理`)
}

async function main() {
  const mediaArg = process.argv.find((x) => x.startsWith('--media='))
  const requestedIds = mediaArg ? new Set(mediaArg.slice('--media='.length).split(',').map(Number)) : null
  const selectedGroups = requestedIds ? groups.filter((x) => requestedIds.has(x.mediaId)) : groups
  if (!selectedGroups.length || (requestedIds && selectedGroups.length !== requestedIds.size)) {
    throw new Error('指定的作品 ID 与已整理资料不匹配')
  }
  let allCharacters = []
  let allVoiceActors = []
  const allIds = new Set()
  const allTitles = new Set()

  for (const group of selectedGroups) {
    if (allTitles.has(group.title)) throw new Error(`重复作品：${group.title}`)
    if (group.characters.length < 5) throw new Error(`${group.title} 少于 5 位可核实角色`)
    allTitles.add(group.title)
    const sourceMediaIds = [...new Set(group.sourceMediaIds ?? [group.mediaId])]
    const sourceById = new Map()
    for (const sourceMediaId of sourceMediaIds) {
      const file = draftFiles.get(sourceMediaId)
      if (!file) throw new Error(`缺少作品 ${sourceMediaId} 的 AniList 资料文件`)
      const draft = JSON.parse(fs.readFileSync(`data/anime_update_drafts/${file}`, 'utf8'))
      const anime = draft.anime.find((x) => x.media_id === sourceMediaId)
      if (!anime) throw new Error(`资料文件没有作品 ${sourceMediaId}`)
      for (const source of anime.characters) sourceById.set(source.id, source)
    }
    const currentById = new Map()
    for (const sourceMediaId of sourceMediaIds) {
      const current = await fetchCurrent(sourceMediaId)
      for (const [id, edge] of current) currentById.set(id, edge)
      await sleep(800)
    }

    for (const curated of group.characters) {
      if (allIds.has(curated.id)) throw new Error(`批次内重复角色 ID：${curated.id}`)
      allIds.add(curated.id)
      const source = sourceById.get(curated.id)
      const current = currentById.get(curated.id)
      if (!source || !current) throw new Error(`${curated.name} 缺少 AniList 角色资料`)
      const verifiedNames = new Set([curated.name, ...curated.nicknames].map((x) => x.trim().toLocaleLowerCase()))
      if (![current.node.name.full, current.node.name.native].filter(Boolean).some((x) => verifiedNames.has(x.trim().toLocaleLowerCase()))) {
        throw new Error(`${curated.name} 的 AniList 名称与角色 ID ${curated.id} 不匹配`)
      }
      const image = current.node.image?.large
      const actor = current.voiceActors.find((x) => (x.name?.native || x.name?.full) && hashedImage(x.image?.large, 'staff'))
      if (!hashedImage(image, 'character') || !actor) throw new Error(`${curated.name} 的角色或日配图片缺少 AniList hash`)
      const nicknames = [...new Set([curated.name, current.node.name.full, current.node.name.native, ...curated.nicknames].filter(Boolean))]
      const traits = [...new Set(curated.traits)]
      const length = Array.from(curated.description).length
      if (!nicknames.length || traits.length < 8 || length < 100 || length > 200) {
        throw new Error(`${curated.name} 字段不合格：别名 ${nicknames.length}、特征 ${traits.length}、简介 ${length} 字`)
      }
      if (group.characters.some((other) => other.id !== curated.id && traits.some((trait) => trait.includes(other.name)))) {
        throw new Error(`${curated.name} 的搜索特征包含其他角色名`)
      }
      const searchText = [curated.name, group.title, ...nicknames, ...traits, actor.name.native].join(' ')
      allCharacters.push({
        id: curated.id, name: curated.name, anime_title: group.title,
        image, description: curated.description, nicknames, traits, search_text: searchText,
      })
      allVoiceActors.push({
        character_id: curated.id, name: actor.name.native?.trim() || actor.name.full.trim(), image: actor.image.large, language: '日语',
      })
    }
    await sleep(800)
  }

  const ids = [...allIds]
  const { data: idMatches, error: idError } = await supabase.from('characters').select('id,name,anime_title').in('id', ids)
  if (idError) throw new Error(`角色查重失败：${idError.message}`)
  const supplement = process.argv.includes('--supplement')
  if (supplement) {
    const supplementTitles = new Map([
      [170695, '我能用刀把一切弹开'],
      [127401, '白金终局'],
      [1575, '叛逆的鲁鲁修'],
      [101348, '冰海战记'],
      [128893, '地狱乐'],
    ])
    const title = selectedGroups.length === 1 ? supplementTitles.get(selectedGroups[0].mediaId) : null
    if (!title || !idMatches.length || idMatches.some((x) => x.anime_title !== title)) {
      throw new Error('补全模式只适用于已核实的既有作品和角色')
    }
    const existingIds = new Set(idMatches.map((x) => x.id))
    allCharacters = allCharacters.filter((x) => !existingIds.has(x.id)).map((x) => {
      const actor = allVoiceActors.find((v) => v.character_id === x.id)
      return { ...x, anime_title: title, search_text: [x.name, title, ...x.nicknames, ...x.traits, actor.name].join(' ') }
    })
    allVoiceActors = allVoiceActors.filter((x) => !existingIds.has(x.character_id))
  } else {
    if (idMatches.length) throw new Error(`角色 ID 已存在：${idMatches.map((x) => `${x.id}/${x.name}`).join('、')}`)
    const { data: titleMatches, error: titleError } = await supabase.from('characters').select('id,name,anime_title').in('anime_title', [...allTitles]).limit(1000)
    if (titleError) throw new Error(`作品查重失败：${titleError.message}`)
    if (titleMatches.length) throw new Error(`作品已存在：${[...new Set(titleMatches.map((x) => x.anime_title))].join('、')}`)
  }

  console.log(`核验通过：${supplement ? '补全已有作品' : `${selectedGroups.length} 部新作品`}，${allCharacters.length} 位角色，${allVoiceActors.length} 条日配资料`)
  if (!process.argv.includes('--write')) return

  const { error: insertError } = await supabase.from('characters').insert(allCharacters)
  if (insertError) throw new Error(`角色写入失败：${insertError.message}`)
  const { error: actorError } = await supabase.from('voice_actors').insert(allVoiceActors)
  if (actorError) throw new Error(`声优写入失败，角色已写入：${actorError.message}`)

  const { data: written, error: readError } = await supabase
    .from('characters').select('id,name,anime_title,nicknames,traits,description,search_text,voice_actors(name,image)')
    .in('id', allCharacters.map((x) => x.id)).limit(1000)
  if (readError) throw new Error(`写入后回读失败：${readError.message}`)
  if (written.length !== allCharacters.length || written.some((x) => !x.voice_actors.length || x.search_text.includes(x.description))) {
    throw new Error('写入后数据校验未通过，请检查本批角色和声优')
  }
  console.log(`写入并回读通过：${written.length} 位角色，${written.reduce((n, x) => n + x.voice_actors.length, 0)} 条声优资料`)
}

main().catch((error) => { console.error(error.message); process.exitCode = 1 })
