import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidates = JSON.parse(fs.readFileSync(`${root}/batch28-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [101773, '笨拙之极的上野'],
  [99390, '小木乃伊到我家'],
  [146234, '异世界一击无双姐姐'],
  [128034, '东方少年'],
  [152765, '为了养老金，去异界存八万金'],
  [146668, 'RWBY 冰雪帝国'],
  [144176, '神明渴望游戏'],
  [162144, '外科医生爱丽丝'],
  [176642, '天久鹰央的推理病历表'],
  [138060, '星球大战：幻境'],
  [20839, '绝命制裁X'],
  [20565, '我，要成为双马尾'],
  [147885, '冷面男子'],
  [179694, '摇滚乐是淑女的嗜好'],
  [143064, '远藤与小林的直播观察日记'],
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
    snapshotPath: `${root}/batch30-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(item => item.mediaId)).size !== 15) throw new Error('选择清单必须包含15部不同作品')
fs.mkdirSync(`${root}/batch30-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch30-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
