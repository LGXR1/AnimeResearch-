import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidates = JSON.parse(fs.readFileSync(`${root}/batch28-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [21712, 'ISLAND'],
  [10456, '境界线上的地平线'],
  [20656, '电波少女与钱仙大人'],
  [113418, '本田小狼与我'],
  [87494, '独占我的英雄'],
  [174653, '格斗实况'],
  [115183, 'MARS RED'],
  [160, '此时此地的我'],
  [107672, '致曾为神之众兽'],
  [2402, '明日之丈'],
  [1571, '奇幻贵公子'],
  [16035, '狂欢节'],
  [64, '蔷薇少女'],
  [874, '数码宝贝驯兽师之王'],
  [106893, 'COP CRAFT 警察×战车'],
]

const byId = new Map(candidates.map(media => [media.id, media]))
const anime = chosen.map(([mediaId, title]) => {
  const media = byId.get(mediaId)
  if (!media) throw new Error(`筛选结果中缺少 AniList ID ${mediaId}`)
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `${root}/batch29-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(item => item.mediaId)).size !== 15) throw new Error('选择清单必须包含15部不同作品')
fs.mkdirSync(`${root}/batch29-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch29-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
