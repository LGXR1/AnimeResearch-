import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidatePath = `${root}/batch22-refined-candidates.json`
const refined = JSON.parse(fs.readFileSync(candidatePath, 'utf8'))
const titles = new Map([
  [5682, '幻灵镇魂曲'],
  [10213, '认真和我恋爱！'],
  [1281, '学校怪谈'],
  [1029, '岁月的童话'],
  [11933, '织田信奈的野望'],
  [139606, '英雄教室'],
  [101381, '我让最想被拥抱的男人给威胁了'],
  [177104, '最狂辅助职业【话术士】世界最强战团听我号令'],
  [98389, '牙斗'],
  [20553, '舰队Collection'],
  [153360, '转生为自动贩卖机的我今天也在迷宫徘徊'],
  [165254, 'BUCCHIGIRI?!'],
  [127050, '杀爱'],
  [156023, '身为魔王的我娶了奴隶精灵为妻，该如何表达我的爱呢？'],
  [16732, '黄金拼图'],
  [131863, '谎言游戏'],
  [5231, '闪电十一人'],
  [13655, 'Little Busters!'],
  [114840, '恋爱令人作呕'],
  [1530, 'Kanon'],
  [101, 'AIR'],
  [147642, '非自愿的不死冒险者'],
  [113260, '天官赐福'],
  [104723, '普通攻击是全体二连击，这样的妈妈你喜欢吗？'],
  [12175, '恋爱与选举与巧克力'],
  [21855, 'UQ HOLDER！悠久持有者'],
  [20663, '精灵使的剑舞'],
  [98005, '舞动青春'],
  [134252, '与变成了异世界美少女的大叔一起冒险'],
  [148465, '虽然等级只有1级但固有技能是最强的'],
])

const picked = refined.picked.filter(media => titles.has(media.id))
const missing = [...titles.keys()].filter(id => !picked.some(media => media.id === id))
if (missing.length || picked.length !== 30) throw new Error(`候选不齐，缺失 AniList ID: ${missing.join(', ')}`)
refined.picked = picked
fs.writeFileSync(candidatePath, JSON.stringify(refined, null, 2))

const anime = picked.map(media => ({
  mediaId: media.id,
  title: titles.get(media.id),
  titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
  references: [media.siteUrl || `https://anilist.co/anime/${media.id}`],
  snapshotPath: `${root}/batch22-sources/anime-source-${media.id}.json`,
}))
fs.mkdirSync(`${root}/batch22-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch22-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部动漫；清单与角色资料快照路径已保存`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
