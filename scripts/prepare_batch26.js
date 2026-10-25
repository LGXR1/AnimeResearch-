import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidates = JSON.parse(fs.readFileSync(`${root}/batch26-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [140754, '异世界召唤是第二次'],
  [178548, '不遇职【鉴定士】其实是最强的'],
  [177552, '黑岩目高不把我的可爱放在眼里'],
  [184591, '不可能成为恋人！绝对不行。（※不行？可以！）'],
  [101289, '百炼霸王与圣约女武神'],
  [178433, '异世界默示录麦诺格拉'],
  [180812, '退出A阶级队伍，与原学生一起挑战迷宫深处'],
  [178886, '帝乃三姐妹意外地容易搞定'],
  [6205, '肯普法'],
  [20556, '龙娘七七七埋藏的宝藏'],
  [187942, '真夜中心动频率'],
  [20592, '星刻龙骑士'],
  [4975, '混沌头'],
  [130549, 'RE-MAIN'],
  [21567, '迷家'],
  [152682, '佐佐木与文鸟小哔'],
  [108111, '你遭难了吗？'],
  [99131, '漫画女孩'],
  [110547, '阿尔蒂'],
  [165790, '真的要结婚吗？'],
  [79, 'SHUFFLE!'],
  [21291, '鬼牌游戏'],
  [99483, '博多豚骨拉面团'],
  [18229, '科学小飞侠Crowds'],
  [105807, '幻海奇情'],
  [180082, '千岁君在波子汽水瓶中'],
  [195515, '勇者队伍里有可爱的孩子所以我告白了'],
  [7193, '青之文学'],
  [240, '现视研'],
  [18095, '农林'],
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
    snapshotPath: `${root}/batch26-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 30 || new Set(anime.map(item => item.mediaId)).size !== 30) throw new Error('选择清单必须包含30部不同作品')
fs.mkdirSync(`${root}/batch26-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch26-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
