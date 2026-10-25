import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const oldId = 101024
const newId = 127050
const replacementTitle = '杀爱'
const selectionPath = `${root}/batch22-selection.json`
const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf8'))
const originalCandidateSet = JSON.parse(fs.readFileSync(`${root}/batch22-candidates.json`, 'utf8'))
const alternateCheck = JSON.parse(fs.readFileSync(`${root}/batch22-refined-candidates.json`, 'utf8'))
const media = [...(originalCandidateSet.candidatePool || []), ...(alternateCheck.picked || [])].find(x => x.id === newId)
if (!media || !selection.anime.some(x => x.mediaId === oldId)) throw new Error('找不到原作品或替代候选')

const anime = selection.anime.map(item => item.mediaId === oldId ? {
  mediaId: newId,
  title: replacementTitle,
  titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
  references: [media.siteUrl || `https://anilist.co/anime/${newId}`],
  snapshotPath: `${root}/batch22-sources/anime-source-${newId}.json`,
} : item)
selection.anime = anime
fs.writeFileSync(selectionPath, JSON.stringify(selection, null, 2))

const byId = new Map([...(originalCandidateSet.candidatePool || []), ...(alternateCheck.picked || [])].map(x => [x.id, x]))
const picked = anime.map(x => byId.get(x.mediaId))
if (picked.some(x => !x)) throw new Error('部分已选作品的 AniList 候选资料丢失')
fs.writeFileSync(`${root}/batch22-refined-candidates.json`, JSON.stringify({ eligibleCount: alternateCheck.eligibleCount, distinctCount: alternateCheck.distinctCount, picked }, null, 2))
console.log(`已用 ${replacementTitle} 替换已收录作品，保留 30 部候选清单`)
