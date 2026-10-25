import fs from 'node:fs'

const chosen = [
  [184322, '无限扭蛋'],
  [188139, '虽然是个不中用的恶女'],
  [10711, '塑料姊姊'],
  [106967, '裤袜视界'],
  [97716, '周一的丰满'],
  [183133, '误解工房主'],
  [100556, '春原庄的管理人小姐'],
  [6201, '公主恋人！'],
  [19315, '蛹'],
  [179885, '被勇者队伍开除的白魔导师，被S级冒险者捡到'],
  [176063, '没落预定贵族，闲暇时就来钻研魔法'],
  [195153, '永久的黄昏'],
  [164299, '重来一次的大小姐征服龙帝陛下'],
  [155838, '强者的新传说'],
  [21322, '玛娜利亚魔法学院'],
]

const candidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch28-refined-candidates.json', 'utf8')).eligible
const scan = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch32-candidate-scan.json', 'utf8')).results
const anime = chosen.map(([mediaId, title]) => {
  const media = candidates.find(item => item.id === mediaId)
  const result = scan.find(item => item.id === mediaId)
  if (!media || !result || result.status !== 'FINISHED' || result.totalCharacters < 5 || result.visibleCharacters < 5 || result.overlapIds.length || result.titleAlreadyInLibrary) {
    throw new Error(`候选资料未通过筛选：${mediaId}`)
  }
  if (result.countryOfOrigin !== 'CN' && result.charactersWithVoiceImage < 5) throw new Error(`日配头像不足：${mediaId}`)
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `data/anime_update_drafts/batch32-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(x => x.mediaId)).size !== 15) throw new Error('本批必须有15部不同作品')
fs.mkdirSync('data/anime_update_drafts/batch32-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch32-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
