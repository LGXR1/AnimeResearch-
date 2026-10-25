import fs from 'node:fs'

const chosen = [
  [146346, '变成狗后被喜欢的人捡了。'],
  [178100, '技能果实'],
  [169583, '转校后的清纯美少女是童年玩伴'],
  [146233, '不德的公会'],
  [21563, '时钟机关之星'],
  [197715, 'LV999的村民'],
  [191205, '悠闲领主的愉快领地防卫'],
  [179297, '魔法制造者～异世界魔法的制作方法～'],
  [100382, '我喜欢的妹妹不是妹妹'],
  [188487, '被驱逐的宫廷魔法师立志成为最强'],
  [166372, '被称作废柴的前英雄随心所欲地生活'],
  [176053, '再见龙生，你好人生'],
  [3092, '纯情罗曼史'],
  [3342, 'Mnemosyne－记忆女神的女儿们－'],
  [196935, '朱音落语'],
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
    snapshotPath: `data/anime_update_drafts/batch33-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(x => x.mediaId)).size !== 15) throw new Error('本批必须有15部不同作品')
fs.mkdirSync('data/anime_update_drafts/batch33-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch33-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
