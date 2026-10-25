import fs from 'node:fs'
import path from 'node:path'

const draft = [
  [186497, '冰之城壁'],
  [190569, '蒙古魔女贾杜加'],
  [190704, '加南大人不只是可爱'],
  [192507, '黄昏光影下'],
  [189987, '笨拙的风纪委员与短裙女孩'],
  [202102, '主播女孩重度依赖'],
  [211778, '世界最强的魔女，开始了'],
  [198946, '克雷瓦提斯 第二季'],
  [199111, '碧蓝之海 第三季'],
  [195322, '我的英雄学院：Vigilantes 第二季'],
  [171110, '小书痴的下克上：领主的养女'],
  [149118, '炎炎消防队 参之章'],
  [209983, '地狱模式 第二季'],
  [102926, '实况主的逃脱游戏'],
  [105807, '幻海奇情'],
  [20521, '滨虎'],
  [19221, '我的脑内选项正在全力妨碍学园恋爱喜剧'],
  [103303, '二十世纪电气目录：尤里卡·尤里卡'],
  [206949, '凶乱令嬢尼亚·利斯顿'],
  [191656, '学生会里也有洞！'],
]
const sourceFiles = []
for (const dir of fs.readdirSync('data/anime_update_drafts', { withFileTypes: true }).filter(x => x.isDirectory())) {
  for (const file of fs.readdirSync(path.join('data/anime_update_drafts', dir.name))) if (file.startsWith('anime-source-') && file.endsWith('.json')) sourceFiles.push(path.join('data/anime_update_drafts', dir.name, file))
}
const snapshots = new Map()
for (const file of sourceFiles) {
  const snapshot = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (!snapshots.has(snapshot.id)) snapshots.set(snapshot.id, snapshot)
}
const anime = draft.map(([mediaId, title]) => {
  const source = snapshots.get(mediaId)
  if (!source && ![206949, 191656, 211778].includes(mediaId)) throw new Error(`缺少 AniList 快照 ${mediaId}`)
  const english = source?.title?.english || ({ 206949: 'Nia Liston: The Merciless Maiden', 191656: 'Even the Student Council Has Its Holes!', 211778: "The World's Strongest Witch" })[mediaId]
  const romaji = source?.title?.romaji || ({ 206949: 'Kyouran Reijou Nia Liston', 191656: 'Seitokai ni mo Ana wa Aru!', 211778: 'Sekai Saikyou no Majo, Hajimemashita' })[mediaId]
  const native = source?.title?.native || ({ 206949: '凶乱令嬢ニア・リストン', 191656: '生徒会にも穴はある！', 211778: '世界最強の魔女、始めました' })[mediaId]
  const titleAliases = [...new Set([english, romaji, native, ...(source?.synonyms || [])].filter(Boolean))]
  return { mediaId, title, titleAliases, references: [`https://anilist.co/anime/${mediaId}`], snapshotPath: `data/anime_update_drafts/batch38-sources/anime-source-${mediaId}.json` }
})
if (anime.length !== 20 || new Set(anime.map(x => x.mediaId)).size !== 20) throw new Error('作品数量或 AniList ID 重复')
fs.mkdirSync('data/anime_update_drafts/batch38-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch38-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`准备核实 ${anime.length} 部动漫`)
