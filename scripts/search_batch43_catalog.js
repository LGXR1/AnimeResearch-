import fs from 'node:fs'

const norm = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const knownRows = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownIds = new Set(knownRows.map(row => row.id))
const knownTitles = new Set(knownRows.map(row => norm(row.anime_title)))
const usedMedia = new Set()
for (const file of fs.readdirSync('data/anime_update_drafts')) {
  if (!/^batch\d+-selection\.json$/.test(file)) continue
  for (const item of JSON.parse(fs.readFileSync(`data/anime_update_drafts/${file}`, 'utf8')).anime || []) usedMedia.add(item.mediaId)
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
async function request(query) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }),
    })
    if (response.status === 429) {
      const delay = Math.min(90000, 20000 * (attempt + 1))
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

const fields = `pageInfo{hasNextPage total} edges{role node{id name{full native alternative}image{large}description gender age}voiceActors(language:JAPANESE){id name{full native}image{large}}}`
const outputPath = 'data/anime_update_drafts/batch43-search-candidates.json'
const accepted = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : []
const targetCount = 100
const seenMedia = new Set([...usedMedia, ...accepted.map(item => item.id)])
const acceptedCharacterIds = new Set(accepted.flatMap(item => (item.characters?.edges || []).map(edge => edge.node.id)))
for (let page = 15; page <= 80 && accepted.length < targetCount; page++) {
  const query = `query{Page(page:${page},perPage:30){pageInfo{hasNextPage total}media(type:ANIME,format_in:[TV,ONA],status:FINISHED,countryOfOrigin:JP,startDate_greater:20000101,startDate_lesser:20230101,sort:POPULARITY_DESC){id title{romaji english native}synonyms format status startDate{year month day}countryOfOrigin genres popularity characters(sort:FAVOURITES_DESC,page:1,perPage:25){${fields}}}}}`
  const data = await request(query)
  const mediaList = data.Page.media || []
  for (const media of mediaList) {
    if (seenMedia.has(media.id)) continue
    const aliases = [media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean)
    if (aliases.some(alias => knownTitles.has(norm(alias)))) continue
    if (media.countryOfOrigin !== 'JP' || media.status !== 'FINISHED') continue
    const eligible = (media.characters.edges || []).filter(edge => !knownIds.has(edge.node.id) && !acceptedCharacterIds.has(edge.node.id)
      && edge.node.image?.large && edge.voiceActors.some(actor => actor.image?.large)
      && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
    const main = eligible.filter(edge => edge.role === 'MAIN')
    if (eligible.length < 5 || !main.length) continue
    accepted.push({ ...media, eligibleCount: eligible.length, mainCount: main.length,
      sampleCharacters: eligible.map(edge => ({ id: edge.node.id, name: edge.node.name.full, native: edge.node.name.native, role: edge.role,
        description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
        voiceActors: edge.voiceActors.map(actor => actor.name.native || actor.name.full) })) })
    seenMedia.add(media.id)
    for (const edge of eligible) acceptedCharacterIds.add(edge.node.id)
    console.log([media.id, media.startDate?.year || '', media.popularity, media.format,
      media.title.english || media.title.romaji, media.title.native, eligible.length, main.length, media.genres.join(',')].join('\t'))
    if (accepted.length === targetCount) break
  }
  fs.writeFileSync(outputPath, JSON.stringify(accepted, null, 2))
  console.log(`已检查 AniList 第 ${page} 页，找到 ${accepted.length}/50 部新作品`)
  if (!data.Page.pageInfo.hasNextPage) break
  await wait(750)
}
if (accepted.length !== targetCount) throw new Error(`仅找到 ${accepted.length} 部合格候选作品`)
console.log(`已找到 ${accepted.length} 部 2000–2022 年间未收录且角色资料完整的动漫`)
