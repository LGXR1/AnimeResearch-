import fs from 'node:fs'
import path from 'node:path'

const root = 'data/anime_update_drafts/batch40-sources'
const picks = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch40-selection.json', 'utf8')).anime
  .filter(item => item.snapshotPath.includes('batch40-sources/'))
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function request(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
    if (response.status === 429) { const delay = Math.min(60000, 15000 * (attempt + 1)); console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`); await wait(delay); continue }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 240)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data
  }
  throw new Error('AniList 限流重试超过上限')
}

const fields = `pageInfo{hasNextPage total}edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
const batches = Array.from({ length: Math.ceil(picks.length / 4) }, (_, i) => picks.slice(i * 4, (i + 1) * 4))
for (const batch of batches) {
  const pagesById = new Map(batch.map(item => [item.mediaId, []]))
  const metadata = new Map()
  let page = 1
  let remaining = [...batch]
  while (remaining.length) {
    const query = `query{${remaining.map((item, i) => `m${i}:Media(id:${item.mediaId},type:ANIME){id title{romaji english native}synonyms format status startDate{year month day}countryOfOrigin genres description siteUrl characters(sort:FAVOURITES_DESC,page:${page},perPage:50){${fields}}}`).join('\n')}}`
    const result = await request(query)
    const next = []
    for (let i = 0; i < remaining.length; i++) {
      const media = result[`m${i}`]
      if (!media) continue
      metadata.set(media.id, { id: media.id, title: media.title, synonyms: media.synonyms, format: media.format, status: media.status,
        startDate: media.startDate, countryOfOrigin: media.countryOfOrigin, genres: media.genres, description: media.description, siteUrl: media.siteUrl })
      pagesById.get(media.id).push(...(media.characters.edges || []))
      if (media.characters.pageInfo.hasNextPage) next.push(remaining[i])
    }
    remaining = next
    page++
    if (remaining.length) await wait(1400)
  }
  for (const item of batch) {
    const info = metadata.get(item.mediaId)
    if (!info) throw new Error(`AniList 无法返回作品 ${item.mediaId}`)
    const snapshot = { fetchedAt: new Date().toISOString(), ...info, characters: pagesById.get(item.mediaId) }
    if (snapshot.countryOfOrigin !== 'JP' || snapshot.status !== 'FINISHED') throw new Error(`作品状态或来源不符：${item.mediaId}/${snapshot.status}/${snapshot.countryOfOrigin}`)
    fs.writeFileSync(path.join(root, `anime-source-${item.mediaId}.json`), JSON.stringify(snapshot, null, 2))
    console.log(`${item.mediaId}\t${item.title}\t${snapshot.characters.length} 位人物\t${snapshot.status}`)
  }
  await wait(1400)
}
