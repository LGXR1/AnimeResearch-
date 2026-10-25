import fs from 'node:fs'

const chosen = [
  [103303, '二十世纪电气目录', 'older'],
  [198113, 'KILL BLUE', 'older'],
  [190704, '佳奈大人太好哄了', 'older'],
  [190143, '春夏秋冬代行者 春之舞', 'older'],
  [190569, '天幕上的贾杜加', 'older'],
  [204466, '乙女怪兽焦糖化', 'older'],
  [192507, '美丽的夜色月光', 'older'],
  [184356, '盗墓王', 'older'],
  [171031, '异世界悠闲纪行～带着孩子冒险～', 'older'],
  [202955, '棱镜恋曲', 'older'],
  [16157, '超次元游戏：海王星 THE ANIMATION', 'older'],
  [185660, '胆大党 第二季', 'recent'],
  [178754, '怪兽8号 第二季', 'recent'],
  [185736, '我的英雄学院：Vigilantes', 'recent'],
  [149118, '炎炎消防队 叁之章', 'recent'],
]

const olderCandidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch28-refined-candidates.json', 'utf8')).eligible
const olderScan = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch32-candidate-scan.json', 'utf8')).results
const recentScan = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch34-candidate-scan.json', 'utf8')).results
const anime = chosen.map(([mediaId, title, source]) => {
  const media = source === 'older'
    ? olderCandidates.find(x => x.id === mediaId)
    : recentScan.find(x => x.id === mediaId)
  const scan = source === 'older'
    ? olderScan.find(x => x.id === mediaId)
    : recentScan.find(x => x.id === mediaId)
  if (!media || !scan || scan.status !== 'FINISHED' || scan.totalCharacters < 5 || scan.titleAlreadyInLibrary) throw new Error(`候选未通过基本核验：${mediaId}`)
  if (source === 'older' && (scan.overlapIds.length || scan.charactersWithVoiceImage < 5)) throw new Error(`旧候选含已有角色或日配头像不足：${mediaId}`)
  if (source === 'recent' && scan.newCharactersWithVoiceImage < 5) throw new Error(`续作可新增的角色不足：${mediaId}`)
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `data/anime_update_drafts/batch34-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(x => x.mediaId)).size !== 15) throw new Error('本批必须有15部不同作品')
fs.mkdirSync('data/anime_update_drafts/batch34-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch34-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
