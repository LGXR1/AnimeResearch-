import fs from 'node:fs'
import path from 'node:path'

const data = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const existingIds = new Set(data.map(x => x.id))
const knownMediaIds = new Set()
const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
const knownTitles = new Set(data.map(x => normalize(x.anime_title)))
const root = 'data/anime_update_drafts'
const currentSelectionPath = path.join(root, 'batch25-selection.json')
const current = fs.existsSync(currentSelectionPath) ? JSON.parse(fs.readFileSync(currentSelectionPath, 'utf8')).anime : []
const currentIds = new Set(current.map(x => x.mediaId))
const currentTitles = new Set(current.flatMap(x => [x.title, ...(x.titleAliases || [])]).map(normalize))

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (file !== path.join(root, 'batch25-sources')) walk(file)
      continue
    }
    if (!entry.name.endsWith('.json')) continue
    try {
      const value = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (Array.isArray(value.anime)) {
        for (const item of value.anime) {
          const id = item.id ?? item.mediaId
          if (Number.isInteger(id)) knownMediaIds.add(id)
          for (const title of [item.title, ...(item.titleAliases || [])]) if (title) knownTitles.add(normalize(title))
        }
      }
      if (Array.isArray(value.characters) && Number.isInteger(value.id) && value.characters.some(edge => existingIds.has(edge.node?.id))) {
        knownMediaIds.add(value.id)
        for (const title of [value.title?.romaji, value.title?.english, value.title?.native, ...(value.synonyms || [])]) if (title) knownTitles.add(normalize(title))
      }
    } catch {}
  }
}
walk(root)
for (const item of current) for (const title of [item.title, ...(item.titleAliases || [])]) knownTitles.add(normalize(title))

const request = async query => {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
  const body = await response.json()
  if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
  return body.data
}

const pages = Number(process.argv.find(x => x.startsWith('--pages='))?.slice(8) || 30)
const target = Number(process.argv.find(x => x.startsWith('--count='))?.slice(8) || 43)
const candidates = []
for (let first = 1; first <= pages; first += 10) {
  const last = Math.min(pages, first + 9)
  const fields = []
  for (let page = first; page <= last; page++) fields.push(`p${page}:Page(page:${page},perPage:50){media(type:ANIME,sort:POPULARITY_DESC,isAdult:false){id title{romaji english native} synonyms countryOfOrigin genres format siteUrl popularity}}`)
  const dataPage = await request(`query{${fields.join('\n')}}`)
  for (let page = first; page <= last; page++) candidates.push(...(dataPage[`p${page}`]?.media || []))
  console.log(`扫描 AniList 热门页 ${first}-${last}，累计 ${candidates.length} 部`)
  await new Promise(resolve => setTimeout(resolve, 1200))
}

const unique = [...new Map(candidates.map(x => [x.id, x])).values()]
const unseen = unique.filter(media => {
  if (knownMediaIds.has(media.id) || currentIds.has(media.id)) return false
  const titles = [media.title.romaji, media.title.english, media.title.native, ...(media.synonyms || [])].filter(Boolean).map(normalize)
  return !titles.some(title => knownTitles.has(title) || currentTitles.has(title))
})
for (let i = unseen.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[unseen[i], unseen[j]] = [unseen[j], unseen[i]]
}
const picks = []
const usedGenres = new Set()
for (const media of unseen) {
  if (picks.length >= target) break
  if (media.genres?.some(genre => !usedGenres.has(genre))) {
    picks.push(media)
    for (const genre of media.genres || []) usedGenres.add(genre)
  }
}
for (const media of unseen) {
  if (picks.length >= target) break
  if (!picks.some(x => x.id === media.id)) picks.push(media)
}

const output = { scannedPages: pages, candidateCount: unique.length, unseenCount: unseen.length, picks, candidatePool: unseen }
fs.writeFileSync(path.join(root, 'batch25-candidates.json'), JSON.stringify(output, null, 2))
console.log(`可选新作品 ${unseen.length} 部；保存候选 ${picks.length}/${target} 部至 data/anime_update_drafts/batch25-candidates.json`)
for (const media of picks.slice(0, Number(process.env.PRINT_CANDIDATES || 60))) console.log(`${media.id}\t${media.title.english || media.title.romaji}\t${media.genres.join(', ')}`)



