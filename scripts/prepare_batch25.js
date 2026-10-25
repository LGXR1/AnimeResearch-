import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidates = JSON.parse(fs.readFileSync(`${root}/batch25-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [155730, '公司的小小前辈'],
  [153554, '男女之间的友情存在吗？（不，不存在！！）'],
  [117989, '女神宿舍的管理员。'],
  [9936, '魔剑姬！'],
  [146676, '恋爱Flops'],
  [140501, '圣剑学院的魔剑使'],
  [173295, '小市民系列'],
  [2104, '濑户的花嫁'],
  [97730, '清恋'],
  [20521, '浜虎'],
  [11761, '最强会长黑神'],
  [177506, '总有一天要成为最强的炼金术师？'],
  [170890, '新世界之门'],
  [128223, '即使如此，步还是靠了过来'],
  [12679, '女子落语'],
  [130166, '里亚德录大地'],
  [21584, 'Love Live! Sunshine!!'],
  [106863, '猫娘乐园'],
  [173584, '魔王军最强的魔术师是人类'],
  [158926, '鸭乃桥论的禁忌推理'],
  [10588, '女神异闻录4 动画版'],
  [107339, '旗扬！兽道'],
  [168139, '我将成为史上最恶毒女反派'],
  [112357, '日本沉没2020'],
  [20520, 'LOVE STAGE!!'],
  [164172, '结缘甘神神社'],
  [161476, '异修罗'],
  [177385, '异国日记'],
  [135778, 'HIGH CARD'],
  [168138, '爷爷奶奶返老还童'],
]

const byId = new Map(candidates.map(media => [media.id, media]))
const anime = chosen.map(([mediaId, title]) => {
  const media = byId.get(mediaId)
  if (!media) throw new Error(`合格候选中缺少 AniList ID ${mediaId}`)
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `${root}/batch25-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 30 || new Set(anime.map(item => item.mediaId)).size !== 30) throw new Error('选择清单必须包含30部不同作品')
fs.mkdirSync(`${root}/batch25-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch25-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
