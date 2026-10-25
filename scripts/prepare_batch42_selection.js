import fs from 'node:fs'

const candidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch42-search-candidates.json', 'utf8'))
const zhTitles = {
  148862: '七大罪：默示录的四骑士', 142849: '妖幻三重奏', 163144: '枪神 STARGAZE',
  160488: 'VTuber 传说：忘记关直播后我成了传奇', 166699: '冲绳女孩正方言太难懂了',
  156632: '赛马娘 Pretty Derby 第三季', 185880: '青之驱魔师 终夜篇',
  191718: '被勇者队伍驱逐后，在王都悠闲生活', 187921: '终末的女武神 III',
  169931: '去联谊却发现没有女生', 176246: 'mono女孩', 159559: '16bit的感动 ANOTHER LAYER',
  196974: '黑猫与魔女的教室', 148370: '赛马娘 Pretty Derby ROAD TO THE TOP',
  158895: '明日方舟 冬隐归路', 177476: '真·侍传 YAIBA', 194742: '魔王的女儿太温柔了！',
  185965: '两个人的独自露营', 206951: '女神，我想转生异世界！我想成为勇者的肋骨',
  178675: '坏女孩', 167142: 'YOUR FORMA', 153841: '弦音 -连结的一射-',
  198374: '人外教室的厌人教师', 185514: '香菇魔女', 170891: '娜娜蕾，为你加油！',
  198709: '百变的维多利亚', 176509: '刃牙道', 209504: '被遗弃圣女的异世界美食之旅',
  169698: '欢迎回来，爸爸', 182771: '温和贵族的休假推荐', 186161: '与你跨越恋爱的界线',
  203880: '令和的达拉小姐', 155227: '王者天下 第五季', 150077: 'Paradox Live THE ANIMATION',
  196144: '雪球地球', 188388: '数码宝贝 BEATBREAK', 173523: '笑容不断的工作职场',
  151606: 'BIRDIE WING -高尔夫少女的故事- 第二季', 171040: 'Astro Note',
  170916: '魔法使的约定', 196356: '不刻薄的继母与继姐', 145740: '灰色：幻影扳机',
  188525: '画了就去死！', 177501: '阿波岛百景', 179678: '地狱老师（2025）',
  157965: 'ACRO TRIP', 176660: '战国妖狐 千魔混沌篇', 197868: '女仆小姐的点心日记',
  197731: '兼职拷问师的日常', 183984: '阿尔涅事件簿',
}
if (candidates.length !== 50) throw new Error(`预期50部候选，实际${candidates.length}`)
const anime = candidates.map(item => ({
  mediaId: item.id,
  title: zhTitles[item.id],
  titleAliases: [...new Set([item.title.english, item.title.romaji, item.title.native, ...(item.synonyms || [])].filter(Boolean))],
  references: [`https://anilist.co/anime/${item.id}`],
  snapshotPath: `data/anime_update_drafts/batch42-sources/anime-source-${item.id}.json`,
}))
if (anime.some(item => !item.title)) throw new Error('候选作品缺少中文译名')
const norm = value => String(value || '').toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const all = new Map()
for (const item of anime) for (const title of [item.title, ...item.titleAliases]) {
  const key = norm(title)
  const old = all.get(key)
  if (old && old !== item.mediaId) throw new Error(`作品名/别名重复：${title} (${old}/${item.mediaId})`)
  all.set(key, item.mediaId)
}
const selection = { selectedAt: new Date().toISOString(), anime }
fs.writeFileSync('data/anime_update_drafts/batch42-selection.json', JSON.stringify(selection, null, 2))
console.log(`已整理 ${anime.length} 部候选作品中文名和AniList来源`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
