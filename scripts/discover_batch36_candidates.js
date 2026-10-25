import fs from 'node:fs'

const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const existingIds = new Set(full.map(x => x.id))
const existingTitles = new Set(full.map(x => String(x.anime_title || '').trim().toLowerCase()))
const knownAnimeIds = new Set()
for (const file of fs.readdirSync('scripts').filter(name => /^new_anime_curated_batch.*\.js$/.test(name))) {
  const source = fs.readFileSync(`scripts/${file}`, 'utf8')
  for (const match of source.matchAll(/meta\((\d+)\)/g)) knownAnimeIds.add(Number(match[1]))
}
for (const file of fs.readdirSync('data/anime_update_drafts').filter(name => /^batch\d+-selection\.json$/.test(name))) {
  const selection = JSON.parse(fs.readFileSync(`data/anime_update_drafts/${file}`, 'utf8'))
  for (const anime of selection.anime || []) knownAnimeIds.add(Number(anime.mediaId))
}
const isCharacterImage = (url, id) => typeof url === 'string' && new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/character/large/(?:[bn]?${id}-[a-z0-9_-]+\\.(?:png|jpe?g|webp)|${id}\\.jpe?g)$`, 'i').test(url)
const isStaffImage = (url, id) => {
  if (typeof url !== 'string') return false
  const ids = id > 95000 ? `${id}|${id - 95000}` : String(id)
  return new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/staff/large/(?:[bn]?(?:${ids})-[a-z0-9_-]+\\.(?:png|jpe?g|webp)|(?:${ids})\\.jpe?g)$`, 'i').test(url)
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
let lastRequest = 0
async function request(query) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await wait(Math.max(0, 1200 - (Date.now() - lastRequest)))
    lastRequest = Date.now()
    const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
    if (response.status === 429) {
      const delay = Math.min(60000, 15000 * (attempt + 1))
      console.log(`AniList 限流，等待 ${delay / 1000} 秒后重试`)
      await wait(delay)
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 250)}`)
    const payload = await response.json()
    if (payload.errors?.length) throw new Error(JSON.stringify(payload.errors))
    return payload.data
  }
  throw new Error('AniList 限流重试超过上限')
}

const titleExists = media => [media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])]
  .filter(Boolean).some(title => existingTitles.has(title.trim().toLowerCase()))
const candidates = []
for (const year of [2026, 2025, 2024]) {
  const yearStart = candidates.length
  for (let page = 1; page <= 10 && candidates.length - yearStart < 20; page++) {
    const data = await request(`query{Page(page:${page},perPage:40){media(type:ANIME,status:FINISHED,seasonYear:${year},isAdult:false,sort:POPULARITY_DESC){id title{romaji english native} synonyms format status countryOfOrigin genres startDate{year} siteUrl popularity}}}`)
    for (const media of data.Page.media) {
      if (!['TV', 'TV_SHORT', 'ONA', 'OVA'].includes(media.format) || !['JP', 'CN'].includes(media.countryOfOrigin) || knownAnimeIds.has(media.id) || titleExists(media)) continue
      candidates.push(media)
    }
    console.log(`AniList ${year} 已完结作品第 ${page} 页：当前未命中标题 ${candidates.length} 部`)
  }
}

const results = []
for (let offset = 0; offset < candidates.length && results.length < 80; offset += 4) {
  const batch = candidates.slice(offset, offset + 4)
  const query = `query{${batch.map((m, i) => `m${i}:Media(id:${m.id},type:ANIME){id title{romaji english native}synonyms format status countryOfOrigin genres startDate{year month day}siteUrl characters(sort:FAVOURITES_DESC,page:1,perPage:25){pageInfo{total hasNextPage}edges{role node{id name{full native alternative}image{large}}voiceActors(language:JAPANESE){id name{full native}image{large}}}}}`).join('\n')}}`
  const data = await request(query)
  for (let i = 0; i < batch.length; i++) {
    const media = data[`m${i}`]
    if (!media) continue
    const edges = media.characters.edges || []
    const visible = edges.filter(edge => isCharacterImage(edge.node.image.large, edge.node.id))
    const withVoice = visible.filter(edge => edge.voiceActors.some(voice => isStaffImage(voice.image.large, voice.id)))
    const newWithVoice = withVoice.filter(edge => !existingIds.has(edge.node.id))
    const overlapIds = edges.filter(edge => existingIds.has(edge.node.id)).map(edge => edge.node.id)
    results.push({
      id: media.id, title: media.title, synonyms: media.synonyms, format: media.format, status: media.status,
      countryOfOrigin: media.countryOfOrigin, genres: media.genres, startDate: media.startDate, siteUrl: media.siteUrl,
      totalCharacters: media.characters.pageInfo.total, hasNextPage: media.characters.pageInfo.hasNextPage,
      visibleCharacters: visible.length, charactersWithVoiceImage: withVoice.length, newCharactersWithVoiceImage: newWithVoice.length, overlapIds,
      titleAlreadyInLibrary: titleExists(media),
    })
  }
  console.log(`候选角色核验 ${Math.min(offset + batch.length, candidates.length)}/${candidates.length}`)
}
const file = 'data/anime_update_drafts/batch36-candidate-scan.json'
fs.writeFileSync(file, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2))
console.log(`保存 ${results.length} 部候选检查结果到 ${file}`)
