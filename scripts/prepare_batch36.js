import fs from 'node:fs'

const chosen = [
  [197824, '异世界悠闲农家 第二季'],
  [185542, '骸骨骑士大人异世界冒险中 第二季'],
  [198946, '克雷瓦提斯 第二季'],
  [194317, '终末起点 第二季'],
  [173172, '异兽魔都 第二季'],
  [209983, '地狱模式～喜欢慢慢挑战的玩家～第二季'],
  [197754, '欺诈游戏'],
  [199111, '碧蓝之海 第三季'],
  [184492, '入间同学入魔了 第四季'],
  [200637, '超超超超超喜欢你的100个女朋友 第三季'],
  [171110, '小书痴的下克上：领主的养女'],
  [202102, 'NEEDY GIRL OVERDOSE'],
  [195322, '我的英雄学院：Vigilantes 第二季'],
  [189987, '笨拙的班长与短裙少女'],
  [186333, '能看见魔法的库农'],
]
const scan = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch36-candidate-scan.json', 'utf8')).results
const anime = chosen.map(([mediaId, title]) => {
  const media = scan.find(x => x.id === mediaId)
  if (!media || media.status !== 'FINISHED' || media.titleAlreadyInLibrary || media.newCharactersWithVoiceImage < 5) {
    throw new Error(`候选不满足完结、查重或可核实角色数量要求：${mediaId}`)
  }
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `data/anime_update_drafts/batch36-sources/anime-source-${mediaId}.json`,
  }
})
if (anime.length !== 15 || new Set(anime.map(x => x.mediaId)).size !== 15) throw new Error('本批必须包含15部不同作品')
fs.mkdirSync('data/anime_update_drafts/batch36-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch36-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`第36批选定 ${anime.length} 部作品：`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
