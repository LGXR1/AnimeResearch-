import fs from 'node:fs'
import path from 'node:path'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch43-selection.json', 'utf8'))
const outDir = 'data/anime_update_drafts/batch43-sources'
fs.mkdirSync(outDir, { recursive: true })
const pending = selection.anime.filter(item => {
  const target = path.join(outDir, `anime-source-${item.mediaId}.json`)
  if (!fs.existsSync(target)) return true
  const source = JSON.parse(fs.readFileSync(target, 'utf8'))
  if (source.id !== item.mediaId || source.countryOfOrigin !== 'JP' || source.status !== 'FINISHED' || !Array.isArray(source.characters)) {
    throw new Error(`已有作品快照不完整：${item.mediaId}`)
  }
  return false
})
console.log(`复用 ${selection.anime.length - pending.length} 份已完整核验快照，补抓 ${pending.length} 份`)
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
for (let offset = 0; offset < pending.length; offset += pageSize) {
  const items = pending.slice(offset, offset + pageSize)
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
for (const item of selection.anime) {
  const source = JSON.parse(fs.readFileSync(path.join(outDir, `anime-source-${item.mediaId}.json`), 'utf8'))
  if (source.id !== item.mediaId || source.countryOfOrigin !== 'JP' || source.status !== 'FINISHED' || !source.characters.length) {
    throw new Error(`最终作品快照核对失败：${item.mediaId}`)
  }
}
console.log(`已核验 ${selection.anime.length} 部动漫的角色快照，完整分页总数均通过`)
