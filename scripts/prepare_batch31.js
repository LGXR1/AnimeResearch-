import fs from 'node:fs'

const root = 'data/anime_update_drafts'
const candidates = JSON.parse(fs.readFileSync(`${root}/batch28-refined-candidates.json`, 'utf8')).eligible
const chosen = [
  [154214, '我救下了被退婚的千金，教会她坏坏的事情'],
  [169969, '无职英雄：技能什么的毫无用处'],
  [174043, '被队伍驱逐的治疗师，其实是最强的'],
  [19685, '如果她的旗帜被折断了'],
  [21472, '告诉我！辣妹子酱'],
  [8424, 'MM一族！'],
  [20666, '太空丹迪 第二季'],
  [180675, '末日后酒店'],
  [101597, '拾又之国'],
  [119056, '贤者之弟子贤者'],
  [100085, '七星的昴星团'],
  [153339, '甜点转生'],
  [20488, '稻荷恋之歌'],
  [3167, '夏娃的时间'],
  [5030, '玛利亚狂热'],
]

const byId = new Map(candidates.map(media => [media.id, media]))
const anime = chosen.map(([mediaId, title]) => {
  const media = byId.get(mediaId)
  if (!media) throw new Error(`筛选结果中缺少 AniList ID ${mediaId}`)
  return {
    mediaId,
    title,
    titleAliases: [...new Set([media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean))],
    references: [media.siteUrl || `https://anilist.co/anime/${mediaId}`],
    snapshotPath: `${root}/batch31-sources/anime-source-${mediaId}.json`,
  }
})

if (anime.length !== 15 || new Set(anime.map(item => item.mediaId)).size !== 15) throw new Error('选择清单必须包含15部不同作品')
fs.mkdirSync(`${root}/batch31-sources`, { recursive: true })
fs.writeFileSync(`${root}/batch31-selection.json`, JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`本批选择 ${anime.length} 部作品`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
