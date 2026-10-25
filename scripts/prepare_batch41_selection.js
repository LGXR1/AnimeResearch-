import fs from 'node:fs'

const old = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-selection.json', 'utf8'))
const pending = old.anime.slice(25, 30).map(item => ({ ...item }))
if (pending.length !== 5) throw new Error(`batch39 待补作品应为5部，实际${pending.length}部`)

const zhTitles = {
  142853: '东京复仇者 圣夜决战篇',
  163146: '蓝色监狱 VS. U-20 日本',
  153406: '神之塔 第二季',
  175977: '鹿乃子乃子乃子虎视眈眈',
  155211: '在地下城寻求邂逅是否搞错了什么 第四季 深章 厄灾篇',
  146953: '政宗君的复仇R',
  154473: '平凡职业造就世界最强 第三季',
  138056: '终末的女武神 第二季',
  158931: '青之驱魔师 岛根启明结社篇',
  147571: '带着智慧型手机闯荡异世界。第二季',
  155168: '打工吧！魔王大人！！第二季 后半篇',
  139095: '妖精的尾巴 百年任务',
  143271: '魔法科高中的劣等生 第三季',
  168872: '好想告诉你 第三季',
  151380: '约会大作战V',
  139825: '你与我最后的战场，亦或是世界起始的圣战 第二季',
  173533: '物语系列 外传与怪物季',
  165356: '终末的女武神 第二季 后篇',
  109731: '吹响吧！上低音号 第三季',
  166522: '公主大人，“拷问”的时间到了',
  154384: '提亚穆帝国物语～从断头台开始，公主重生后的逆转人生～',
  177637: '再见，拉拉',
  126830: 'Code Geass 夺还的罗赛',
  143327: 'MF GHOST 燃油车斗魂',
  185213: '机动战士高达 GQuuuuuuX',
}
const candidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch41-search-candidates.json', 'utf8'))
if (candidates.length !== 25) throw new Error(`本次新候选应为25部，实际${candidates.length}部`)
const fresh = candidates.map(item => ({
  mediaId: item.id,
  title: zhTitles[item.id],
  titleAliases: [...new Set([item.title.english, item.title.romaji, item.title.native, ...(item.synonyms || [])].filter(Boolean))],
  references: [`https://anilist.co/anime/${item.id}`],
  snapshotPath: `data/anime_update_drafts/batch41-sources/anime-source-${item.id}.json`,
}))
if (fresh.some(item => !item.title)) throw new Error('存在缺少中文译名的候选作品')

const anime = [...pending, ...fresh]
if (anime.length !== 30 || new Set(anime.map(item => item.mediaId)).size !== 30) throw new Error('batch41 作品数量或ID重复')
const titles = anime.map(item => item.title.trim().toLocaleLowerCase())
if (new Set(titles).size !== titles.length) throw new Error('batch41 中文作品名重复')
const selection = { selectedAt: new Date().toISOString(), anime }
fs.writeFileSync('data/anime_update_drafts/batch41-selection.json', JSON.stringify(selection, null, 2))
console.log(`batch41 已组成 ${anime.length} 部：上一批待补 ${pending.length} 部 + AniList新作品 ${fresh.length} 部`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
