import fs from 'node:fs'

const scan = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch36-candidate-scan.json', 'utf8')).results
const previous = new Set(JSON.parse(fs.readFileSync('data/anime_update_drafts/batch36-selection.json', 'utf8')).anime.map(x => x.mediaId))
const anime = scan
  .filter(x => x.status === 'FINISHED' && x.countryOfOrigin === 'JP' && !x.titleAlreadyInLibrary && x.newCharactersWithVoiceImage >= 5 && !previous.has(x.id))
  .map(x => ({
    mediaId: x.id,
    title: x.title.english || x.title.romaji,
    titleAliases: [...new Set([x.title.english, x.title.romaji, x.title.native, ...(x.synonyms || [])].filter(Boolean))],
    references: [x.siteUrl || `https://anilist.co/anime/${x.id}`],
    snapshotPath: `data/anime_update_drafts/batch37-sources/anime-source-${x.id}.json`,
  }))

if (anime.length < 30) throw new Error(`可核验候选只有 ${anime.length} 部，无法选择 30 部`)
fs.mkdirSync('data/anime_update_drafts/batch37-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch37-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`第37批候选 ${anime.length} 部，待核验后选择 30 部`)
