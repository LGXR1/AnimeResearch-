import fs from 'node:fs'

const titles = new Map([
  [174188, '拔作岛'],
  [170206, '歪小子斯科特：火力全开'],
  [200769, '最强职业不是勇者也不是贤者而是鉴定士（暂定）'],
  [196218, '领民0人开局的边境领主大人'],
  [176158, '我成了S级怪兽，被误认成猫的精灵女孩骑士宠物'],
  [152072, '在异世界抚摸毛茸茸过活'],
  [175198, '厄贝尔·布拉特'],
  [128757, '大小姐不玩格斗游戏'],
  [144932, '伊甸星原 第二季'],
  [185039, '透明男与人类女～成为夫妻的两人～'],
  [185211, '柔弱老师'],
  [186863, '猫与龙'],
  [183661, '异世界的处置依社畜而定'],
  [194219, '鬼的新娘'],
  [183660, '小伽椰酱不害怕'],
  [195333, '灰原君的强势青春回归'],
  [192800, '女主角？圣女？不，我是万事通女仆！'],
  [206521, '舞动世界'],
  [196219, '无自觉圣女今天也无意识地泄漏力量'],
  [166700, '黄昏光影'],
  [160442, '六道的恶女们'],
  [196029, '楠木邸的神明庭院'],
  [186744, '复制品也会坠入爱河'],
  [195539, '赛博朋克：边缘行者 第二季'],
  [171025, '魔法少女株式会社'],
])
const normalize = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownIds = new Set(local.map(row => row.id))
const knownTitles = new Set(local.map(row => normalize(row.anime_title)))
const aliases = new Set()
const anime = []

// Reuse the five fully prepared, not-yet-written anime from the previous AniList batch.
const prior = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-selection.json', 'utf8')).anime.slice(20, 25)
for (const item of prior) {
  const source = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  if (source.characters.some(edge => knownIds.has(edge.node.id))) throw new Error(`重复角色：${item.title}`)
  anime.push({ ...item, snapshotPath: item.snapshotPath })
}

const previousCandidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-search-candidates.json', 'utf8'))
const previousSelection = new Set(JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-selection.json', 'utf8')).anime.map(item => item.mediaId))
const nextCandidates = previousCandidates.filter(item => !previousSelection.has(item.id) && item.mainCount > 0 && item.id !== 192808 && item.id !== 183270)
if (nextCandidates.length !== 23 || nextCandidates.some(item => !titles.has(item.id))) throw new Error(`缓存候选数量不符：${nextCandidates.length}`)
const replacements = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch40-replacements-unique.json', 'utf8'))
if (replacements.length !== 2) throw new Error(`替代候选数量不符：${replacements.length}`)

for (const candidate of [...nextCandidates, ...replacements]) {
  const mediaId = candidate.id
  const title = titles.get(mediaId)
  const titleAliases = [...new Set([candidate.title?.english, candidate.title?.romaji, candidate.title?.native, ...(candidate.synonyms || [])].filter(Boolean))]
  const sourceCharacters = candidate.sampleCharacters || []
  if (sourceCharacters.some(character => knownIds.has(character.id))) throw new Error(`角色已收录：${title}`)
  const allAliases = [...new Set([title, ...titleAliases].map(normalize))]
  for (const key of allAliases) {
    if (knownTitles.has(key)) throw new Error(`作品已收录：${title}/${key}`)
    if (aliases.has(key)) throw new Error(`本批动漫别名重复：${title}/${key}`)
    aliases.add(key)
  }
  anime.push({ mediaId, title, titleAliases, references: [`https://anilist.co/anime/${mediaId}`],
    snapshotPath: `data/anime_update_drafts/batch40-sources/anime-source-${mediaId}.json` })
}

// Check the reused entries against this batch and the current database too.
for (const item of anime.slice(0, 5)) {
  for (const alias of [item.title, ...(item.titleAliases || [])]) {
    const key = normalize(alias)
    if (knownTitles.has(key) || aliases.has(key)) throw new Error(`旧候选作品已收录或重复：${item.title}/${key}`)
    aliases.add(key)
  }
}

if (anime.length !== 30 || new Set(anime.map(item => item.mediaId)).size !== 30) throw new Error(`作品数量有误：${anime.length}`)
fs.mkdirSync('data/anime_update_drafts/batch40-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch40-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`候选核对通过：${anime.length} 部未收录作品（前批缓存 5 部 + 新候选 25 部）`)
for (const item of anime) console.log(`${item.mediaId}\t${item.title}`)
