import fs from 'node:fs'

const initial = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-selection.json', 'utf8')).anime
const excluded = new Set([
  184951, 181444, 186794, 182814, 183385, 180929, 151807,
  171018, 153288, 162804, 163270, 189117, 181244, 172258, 210031,
])
const chineseTitles = new Map([
  [177699, '攻壳机动队 THE GHOST IN THE SHELL'],
  [154768, '更衣人偶坠入爱河 第二季'],
  [153800, '一拳超人 第三季'],
  [182896, '我的英雄学院 最终季'],
  [177937, '间谍过家家 第三季'],
  [172019, '石纪元 SCIENCE FUTURE'],
  [175914, '彻夜之歌 第二季'],
  [184237, '坂本日常 后篇'],
  [178680, '防风少年 第二季'],
  [180367, '魔女与使魔'],
  [171046, '青春猪头少年不会梦到圣诞服女郎'],
  [173780, '盾之勇者成名录 第四季'],
  [182309, '碧蓝之海 第二季'],
  [178090, '转生为第七王子，随心所欲的魔法学习之路 第二季'],
  [169441, '我的幸福婚姻 第二季'],
  [170577, '拥有超常技能的异世界流浪美食家 第二季'],
  [143337, '持续狩猎史莱姆三百年 第二季'],
  [180516, '赛马娘 芦毛灰姑娘'],
  [181841, 'CITY THE ANIMATION'],
  [172453, '中年大叔转生反派千金'],
  [172439, '欢迎来到日本，精灵小姐'],
  [166873, '无职转生 第二季 Part 2'],
  [146066, '欢迎来到实力至上主义的教室 第三季'],
  [156822, '关于我转生变成史莱姆这档事 第三季'],
])
const anime = initial.filter(x => !excluded.has(x.mediaId)).map(x => ({ ...x, title: chineseTitles.get(x.mediaId) }))
if (anime.some(x => !x.title) || anime.length !== 24) throw new Error(`候选筛选结果异常：${anime.length}`)
for (const [mediaId, title, english, native] of [
  [145140, '勇者赫鲁库', 'Helck', 'Helck'],
  [166910, '杀手寓言', 'The Fable', 'ザ・ファブル'],
  [168194, '战国妖狐', 'Sengoku Youko', '戦国妖狐'],
  [140830, '小鸟之翼：高尔夫少女', "BIRDIE WING -Golf Girls' Story-", "BIRDIE WING -Golf Girls' Story-"],
  [163132, '堀与宫村 -piece-', 'Horimiya: The Missing Pieces', 'ホリミヤ -piece-'],
  [150075, '为美好的世界献上爆焰', 'KONOSUBA -An Explosion on This Wonderful World!', 'この素晴らしい世界に爆焔を！'],
]) {
  anime.push({ mediaId, title, titleAliases: [english, native], references: [`https://anilist.co/anime/${mediaId}`], snapshotPath: `data/anime_update_drafts/batch37-sources/anime-source-${mediaId}.json` })
}
const existingTitles = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(x => x.anime_title))
if (anime.length !== 30 || new Set(anime.map(x => x.mediaId)).size !== 30) throw new Error('作品数量或 ID 重复')
for (const item of anime) if (existingTitles.has(item.title)) throw new Error(`已收录作品：${item.title}`)
fs.writeFileSync('data/anime_update_drafts/batch37-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`确定 ${anime.length} 部不同作品：`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
