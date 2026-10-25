import fs from 'node:fs'
import path from 'node:path'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch42-selection.json', 'utf8'))
const outDir = 'data/anime_update_drafts/batch42-sources'
fs.mkdirSync(outDir, { recursive: true })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function request(query) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }),
    })
    if (response.status === 429) {
      const delay = Math.min(90000, 30000 * (attempt + 1))
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

const pageSize = 4
const fields = `pageInfo{hasNextPage total} edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
for (let offset = 0; offset < selection.anime.length; offset += pageSize) {
  const items = selection.anime.slice(offset, offset + pageSize)
  const pages = new Map(items.map(item => [item.mediaId, { item, characters: [], page: 1, hasNextPage: true, media: null }]))
  while ([...pages.values()].some(x => x.hasNextPage)) {
    const current = [...pages.values()].filter(x => x.hasNextPage)
    for (let cursor = 0; cursor < current.length; cursor += pageSize) {
      const batch = current.slice(cursor, cursor + pageSize)
      const query = `query{${batch.map((entry, index) => `m${index}:Media(id:${entry.item.mediaId},type:ANIME){id title{romaji english native}synonyms format status startDate{year month day}countryOfOrigin genres popularity characters(sort:FAVOURITES_DESC,page:${entry.page},perPage:25){${fields}}}`).join('\n')}}`
      const data = await request(query)
      for (let index = 0; index < batch.length; index++) {
        const entry = batch[index]
        const media = data[`m${index}`]
        if (!media || media.id !== entry.item.mediaId || media.countryOfOrigin !== 'JP' || media.status !== 'FINISHED') {
          throw new Error(`作品状态或ID不符：${entry.item.mediaId}`)
        }
        entry.media = { id: media.id, title: media.title, synonyms: media.synonyms, format: media.format,
          status: media.status, startDate: media.startDate, countryOfOrigin: media.countryOfOrigin,
          genres: media.genres, popularity: media.popularity }
        entry.characters.push(...media.characters.edges)
        entry.total = media.characters.pageInfo.total
        entry.page++
        entry.hasNextPage = media.characters.pageInfo.hasNextPage
      }
      await wait(800)
    }
  }
  for (const entry of pages.values()) {
    if (entry.characters.length !== entry.total) throw new Error(`${entry.item.title} 角色分页不完整：${entry.characters.length}/${entry.total}`)
    const target = path.join(outDir, `anime-source-${entry.item.mediaId}.json`)
    fs.writeFileSync(target, JSON.stringify({ ...entry.media, characters: entry.characters }, null, 2))
    console.log(`${entry.item.mediaId}\t${entry.item.title}\t${entry.characters.length} 条AniList角色记录`)
  }
}
console.log(`已完整下载 ${selection.anime.length} 部动漫的AniList角色分页快照`)
