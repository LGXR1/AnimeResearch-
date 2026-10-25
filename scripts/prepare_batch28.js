import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const picked = JSON.parse(fs.readFileSync(`${root}/batch28-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [182, '天空之艾斯嘉科尼'],
  [267, '枪墓'],
  [2026, '旋风管家'],
  [5060, '黑塔利亚 Axis Powers'],
  [6324, '守护猫娘绯鞠'],
  [6747, '吸血鬼同盟'],
  [21038, '潮与虎'],
  [21361, '碧蓝幻想'],
  [21708, '超自然九人组'],
  [100245, '没有心跳的少女'],
  [102926, '中之人基因组【实况中】'],
  [107418, '妖精兵的战争'],
  [109946, '超级骗子'],
  [111501, '请在T台上微笑'],
  [20951, '城下町的蒲公英'],
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
    snapshotPath: `${root}/batch28-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(item => item.mediaId)).size !== 15) throw new Error('选择清单必须包含15部不同作品')
fs.mkdirSync(`${root}/batch28-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch28-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
