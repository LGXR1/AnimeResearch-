import fs from 'node:fs'

const candidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch28-refined-candidates.json', 'utf8')).eligible
const library = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const libraryIds = new Set(library.map(x => x.id))
const libraryTitles = new Set(library.map(x => x.anime_title))
const usedIds = new Set()
for (const file of [28, 29, 30, 31].map(n => `scripts/new_anime_curated_batch${n}.js`)) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(/\.\.\.meta\((\d+)\)/g)) usedIds.add(Number(match[1]))
}
const candidatesToCheck = candidates.filter(media => !usedIds.has(media.id))
const pause = ms => new Promise(resolve => setTimeout(resolve, ms))
const isImage = (url, id) => typeof url === 'string' && url.includes(`/character/large/`) && url.includes(String(id)) && !url.endsWith('/default.jpg')
const isStaffImage = (url, id) => typeof url === 'string' && url.includes('/staff/large/') && (url.includes(String(id)) || (id > 95000 && url.includes(String(id - 95000)))) && !url.endsWith('/default.jpg')
const results = []

for (let offset = 0; offset < candidatesToCheck.length; offset += 4) {
  const batch = candidatesToCheck.slice(offset, offset + 4)
  const query = `query{${batch.map((media, i) => `m${i}:Media(id:${media.id},type:ANIME){id title{english romaji native} synonyms format status countryOfOrigin characters(sort:FAVOURITES_DESC,page:1,perPage:25){pageInfo{total hasNextPage}edges{role node{id name{full native alternative}image{large}}voiceActors(language:JAPANESE){id name{full native}image{large}}}}}`).join('\n')}}`
  const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
  if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`)
  const payload = await response.json()
  if (payload.errors?.length) throw new Error(JSON.stringify(payload.errors))
  for (let i = 0; i < batch.length; i++) {
    const media = payload.data[`m${i}`]
    if (!media) continue
    const edges = media.characters.edges || []
    const overlappingIds = edges.filter(edge => libraryIds.has(edge.node.id)).map(edge => edge.node.id)
    const hasTitle = [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))].some(title => libraryTitles.has(title))
    results.push({
      id: media.id,
      title: media.title,
      synonyms: media.synonyms,
      format: media.format,
      status: media.status,
      countryOfOrigin: media.countryOfOrigin,
      totalCharacters: media.characters.pageInfo.total,
      hasNextPage: media.characters.pageInfo.hasNextPage,
      firstPageCount: edges.length,
      visibleCharacters: edges.filter(edge => isImage(edge.node.image.large, edge.node.id)).length,
      charactersWithVoiceImage: edges.filter(edge => edge.voiceActors.some(voice => isStaffImage(voice.image.large, voice.id))).length,
      charactersWithoutVoice: edges.filter(edge => !edge.voiceActors.length).map(edge => edge.node.id),
      overlapIds: overlappingIds,
      titleAlreadyInLibrary: hasTitle,
    })
  }
  console.log(`AniList 候选核验 ${Math.min(offset + batch.length, candidatesToCheck.length)}/${candidatesToCheck.length}`)
  if (offset + 4 < candidatesToCheck.length) await pause(750)
}

fs.mkdirSync('data/anime_update_drafts', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch32-candidate-scan.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2))
console.log(`已保存 ${results.length} 部候选资料到 batch32-candidate-scan.json`)
