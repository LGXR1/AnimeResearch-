import fs from 'node:fs'
import path from 'node:path'

const root = 'data/anime_update_drafts/batch20-sources'
const picks = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch20-refined-candidates.json', 'utf8')).picked
  .filter(media => !fs.existsSync(path.join(root, `anime-source-${media.id}.json`)))
if (!picks.length) {
  console.log('所有候选作品的 AniList 快照已存在')
  process.exit(0)
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const request = async query => {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
    if (response.status === 429) {
      const delay = Math.min(60000, 15000 * (attempt + 1))
      console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`)
      await wait(delay)
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 240)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data
  }
  throw new Error('AniList 限流重试超过上限')
}
const fields = `pageInfo{hasNextPage total}edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
const batches = Array.from({ length: Math.ceil(picks.length / 4) }, (_, i) => picks.slice(i * 4, i * 4 + 4))
for (let bi = 0; bi < batches.length; bi++) {
  const batch = batches[bi]
  const pagesById = new Map(batch.map(m => [m.id, []]))
  const metadata = new Map()
  let page = 1
  let remaining = [...batch]
  while (remaining.length) {
    const query = `query{${remaining.map((m, i) => `m${i}:Media(id:${m.id},type:ANIME){id title{romaji english native}synonyms format countryOfOrigin genres description siteUrl characters(sort:FAVOURITES_DESC,page:${page},perPage:50){${fields}}}`).join('\n')}}`
    const result = await request(query)
    const next = []
    for (let i = 0; i < remaining.length; i++) {
      const media = result[`m${i}`]
      if (!media) continue
      metadata.set(media.id, { id: media.id, title: media.title, synonyms: media.synonyms, format: media.format, countryOfOrigin: media.countryOfOrigin, genres: media.genres, description: media.description, siteUrl: media.siteUrl })
      pagesById.get(media.id).push(...(media.characters.edges || []))
      if (media.characters.pageInfo.hasNextPage) next.push(remaining[i])
    }
    remaining = next
    page++
    if (remaining.length) await wait(800)
  }
  for (const media of batch) {
    const info = metadata.get(media.id)
    if (!info) throw new Error(`AniList 无法返回作品 ${media.id}`)
    const snapshot = { fetchedAt: new Date().toISOString(), ...info, characters: pagesById.get(media.id) }
    fs.writeFileSync(path.join(root, `anime-source-${media.id}.json`), JSON.stringify(snapshot, null, 2))
    console.log(`${media.id}\t${media.title.english || media.title.romaji}\t${snapshot.characters.length} 位人物`)
  }
  console.log(`已完成 ${Math.min((bi + 1) * 4, picks.length)}/${picks.length} 部 AniList 完整分页`)
  await wait(900)
}


