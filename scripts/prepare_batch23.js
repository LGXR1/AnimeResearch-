import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const picks = JSON.parse(fs.readFileSync(`${root}/batch23-candidates.json`, 'utf8')).candidatePool
const chosen = [
  [19221, '我的脑内恋碍选项'],
  [20735, '关于完全听不懂老公在说什么的事'],
  [129192, '转生贤者的异世界生活'],
  [98951, '我的女友是个过度妄想的女高中生'],
  [11785, '潜行吧！奈亚子'],
  [177474, '桃源暗鬼'],
  [228, '地狱少女'],
  [160188, '我喜欢的女孩忘记戴眼镜了'],
  [154459, '我们的恋爱故事：经验丰富的你和经验为零的我交往的故事'],
  [12549, '所以我才只能做H！'],
  [108388, '超人高中生们即便在异世界也能从容生存！'],
  [20462, '棺姬嘉依卡'],
  [153332, '转生贵族的异世界冒险录'],
  [19369, '萌萌侵略者'],
  [126791, '究极进化的完全潜行RPG比现实更像垃圾游戏'],
  [160900, '破灭之国'],
  [164702, '转生贵族凭鉴定技能扭转人生'],
  [175872, '暗黑治疗师的天才治疗师新生活'],
  [20935, '亚尔斯兰战记'],
  [8630, '绯弹的亚里亚'],
  [20527, '一周的朋友'],
  [12291, '一起一起这里那里'],
  [126047, '见面5秒开始战斗'],
  [176273, 'ZENSHU'],
  [129068, '进化之实～踏上胜利的人生～'],
  [142598, '七魔剑支配天下'],
  [139820, '作为恶役大小姐就该养魔王'],
  [18677, '不当勇者的我只好认真找工作了'],
  [186497, '冰之城墙'],
  [148048, '无神世界的神明活动'],
]

const byId = new Map(picks.map(media => [media.id, media]))
const rows = chosen.map(([id, title]) => {
  const media = byId.get(id)
  if (!media) throw new Error(`AniList候选中缺少 ${id}`)
  return {
    mediaId: id,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${id}`],
    snapshotPath: `${root}/batch23-sources/anime-source-${id}.json`,
  }
})

if (rows.length !== 30 || new Set(rows.map(row => row.mediaId)).size !== 30) throw new Error('选择清单必须包含30部不同作品')
fs.mkdirSync(`${root}/batch23-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch23-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime: rows }, null, 2))
console.log(`本批选择 ${rows.length} 部作品`)
for (const row of rows) console.log(`${row.mediaId}\t${row.title}`)
