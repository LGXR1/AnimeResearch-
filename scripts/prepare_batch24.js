import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidates = JSON.parse(fs.readFileSync(`${root}/batch24-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [11703, '法外制裁者'],
  [105989, '满脑都是○○的我没办法谈恋爱'],
  [187538, '黑色火炬'],
  [151847, '公爵的契约未婚妻'],
  [98449, '鲸鱼之子们在沙丘上歌唱'],
  [21887, '风夏'],
  [857, '飞轮少年'],
  [16201, '恶之华'],
  [99940, '伊藤润二惊选集'],
  [180746, '靠死亡游戏混饭吃'],
  [19775, '希德尼娅的骑士'],
  [21221, '情热传说 the X'],
  [187264, '被勇者队伍开除的器用贫乏'],
  [20984, '我老婆是学生会长！'],
  [199588, '御宅族也能被辣妹温柔对待吗？'],
  [7817, 'B型H系'],
  [21378, '魔装学园H×H'],
  [169417, '怪物转生 Re:Monster'],
  [20627, '圣剑使的禁咒咏唱'],
  [97682, '从零开始的魔法书'],
  [6802, '空之音'],
  [101227, '我不是说了能力要平均值吗？'],
  [137909, '不相信人类的冒险者们好像要去拯救世界'],
  [107956, '为了女儿，我说不定连魔王都能干掉。'],
  [113286, '魔物娘的医生'],
  [21033, '其实我是…'],
  [139589, '小太郎一个人生活'],
  [1726, '鬼泣'],
  [4087, '道子与哈金'],
  [100891, '拳愿阿修罗'],
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
    snapshotPath: `${root}/batch24-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 30 || new Set(anime.map(item => item.mediaId)).size !== 30) throw new Error('选择清单必须包含30部不同作品')
fs.mkdirSync(`${root}/batch24-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch24-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
