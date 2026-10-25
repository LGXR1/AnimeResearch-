import fs from 'node:fs'

const chosen = [
  [172463, '咒术回战 第三季 死灭回游篇'],
  [182255, '葬送的芙莉莲 第二季'],
  [178789, '无职转生～到了异世界就拿出真本事～ 第三季'],
  [189046, 'Re:从零开始的异世界生活 第四季'],
  [182205, '关于我转生变成史莱姆这档事 第四季'],
  [195600, '黄泉使者'],
  [182300, '杖与剑的魔剑谭 第二季'],
  [180745, '欢迎来到实力至上主义的教室 第四季'],
  [182587, '我推的孩子 第三季'],
  [135865, '幼女战记 第二季'],
  [166617, 'Fate/strange Fake'],
  [199221, '新石纪 科学未来 第三部分'],
  [176276, '魔都精兵的奴隶 第二季'],
  [176496, '我独自升级 第二季'],
  [176301, '药屋少女的呢喃 第二季'],
]
const scan = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch35-candidate-scan.json', 'utf8')).results
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
    snapshotPath: `data/anime_update_drafts/batch35-sources/anime-source-${mediaId}.json`,
  }
})
if (anime.length !== 15 || new Set(anime.map(x => x.mediaId)).size !== 15) throw new Error('本批必须包含15部不同作品')
fs.mkdirSync('data/anime_update_drafts/batch35-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch35-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`第35批选定 ${anime.length} 部作品：`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
