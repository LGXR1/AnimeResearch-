import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const picked = JSON.parse(fs.readFileSync(`${root}/batch27-refined-candidates.json`, 'utf8')).picked
const chosen = [
  [1292, '武士阿非'],
  [112818, '弩级战队H×EROS'],
  [2924, '悠久之翼'],
  [97995, '在世界尽头咏唱恋曲的少女YU-NO'],
  [4725, '食灵-零-'],
  [178005, '多闻君今夜要怎么办！'],
  [20629, '火星异种'],
  [20475, '生存游戏社'],
  [2923, '守护甜心！'],
  [100645, '敦君与女朋友'],
  [21557, 'Qualidea Code'],
  [158539, '看脸时代'],
  [162985, '金属口红'],
  [20583, 'RAIL WARS！日本国有铁道公安队'],
  [3503, '狐仙女友'],
]

const byId = new Map(picked.map(media => [media.id, media]))
const anime = chosen.map(([mediaId, title]) => {
  const media = byId.get(mediaId)
  if (!media) throw new Error(`筛选结果中缺少 AniList ID ${mediaId}`)
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `${root}/batch27-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(item => item.mediaId)).size !== 15) throw new Error('选择清单必须包含15部不同作品')
fs.mkdirSync(`${root}/batch27-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch27-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
