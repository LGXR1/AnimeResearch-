import fs from 'node:fs'
import path from 'node:path'

const characters = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownIds = new Set(characters.map(x => x.id))
const knownTitles = new Set(characters.map(x => x.anime_title.trim().toLocaleLowerCase()))
const normalize = s => String(s || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const knownNormalized = new Set([...knownTitles].map(normalize))
const currentPoolPath = 'data/anime_update_drafts/batch38-selection.json'
const usedIds = new Set([
  ...JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-selection.json', 'utf8')).anime.map(x => x.mediaId),
  ...(fs.existsSync(currentPoolPath) ? JSON.parse(fs.readFileSync(currentPoolPath, 'utf8')).anime.map(x => x.mediaId) : []),
])
const allFiles = []
for (const dir of fs.readdirSync('data/anime_update_drafts', { withFileTypes: true }).filter(x => x.isDirectory())) {
  for (const file of fs.readdirSync(path.join('data/anime_update_drafts', dir.name))) if (file.startsWith('anime-source-') && file.endsWith('.json')) allFiles.push(path.join('data/anime_update_drafts', dir.name, file))
}
const seen = new Set()
for (const file of allFiles) {
  const media = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (usedIds.has(media.id) || seen.has(media.id) || media.countryOfOrigin !== 'JP' || media.status !== 'FINISHED') continue
  seen.add(media.id)
  const titleAliases = [media.title?.english, media.title?.romaji, media.title?.native, ...(media.synonyms || [])].filter(Boolean)
  if (titleAliases.some(x => knownNormalized.has(normalize(x)))) continue
  const eligible = media.characters.filter(edge => !knownIds.has(edge.node.id) && edge.node.image?.large && edge.voiceActors.some(va => va.image?.large))
  const withBio = eligible.filter(edge => (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
  if (eligible.length < 5 || withBio.length < 5) continue
  console.log(`${media.id}\t${media.startDate?.year || ''}\t${media.title?.english || media.title?.romaji}\t${eligible.length}\t${withBio.length}`)
}
