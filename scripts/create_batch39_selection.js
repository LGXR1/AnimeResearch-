import fs from 'node:fs'
import path from 'node:path'

const draft = [
  [143200, '夏日口袋'],
  [156184, '女儿离家后成为S级冒险者'],
  [169927, '单人房、日照一般、附天使。'],
  [179950, '轮回的花瓣'],
  [162893, '莱莎的炼金工房 ～常暗女王与秘密藏身处～'],
  [179919, '悲喜渔生'],
  [185544, '欢迎来到流放者食堂！'],
  [177120, '忍者与杀手二人组的日常生活'],
  [174044, '深夜Punch'],
  [187901, '死亡账号'],
  [187464, '东岛丹三郎想成为假面骑士'],
  [179879, '被姐姐的前未婚夫溺爱的破烂千金'],
  [180425, '和雨和你'],
  [185939, '时光流逝，饭菜依旧美味'],
  [180228, '加油！中村君！！'],
  [163077, '这个世界不够完整'],
  [140291, '迪士尼扭曲仙境'],
  [184639, '安妮·雪莉'],
  [168345, '迷宫中的人'],
  [170604, '吸血鬼男子宿舍'],
  [167146, '百千家的妖怪王子'],
  [184279, '球场抓到你了'],
  [167927, '忘却电池'],
  [196012, '摩绪'],
  [177580, '花样少年少女'],
  [175409, '不管怎样都要谈恋爱'],
  [171545, '妖怪学校的新人教师'],
  [202381, '又被杀了，侦探大人'],
  [181443, '黑暗之月：血之祭坛'],
  [195518, '邻国王子的溺爱反派千金'],
]
const normalize = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const knownIds = new Set(local.map(x => x.id))
const knownTitles = new Set(local.map(x => normalize(x.anime_title)))
const candidates = new Map(JSON.parse(fs.readFileSync('data/anime_update_drafts/batch39-search-candidates.json', 'utf8')).map(x => [x.id, x]))
const usedIds = new Set()
const aliases = new Set()
const anime = draft.map(([mediaId, title]) => {
  if (usedIds.has(mediaId)) throw new Error(`批内重复 AniList ID：${mediaId}`)
  usedIds.add(mediaId)
  const source = candidates.get(mediaId)
  if (!source) throw new Error(`缺少候选 AniList 资料：${mediaId}/${title}`)
  if (source.countryOfOrigin !== 'JP' || source.status !== 'FINISHED' || !['TV', 'ONA'].includes(source.format)) throw new Error(`作品状态、来源或格式不符：${mediaId}/${source.status}/${source.countryOfOrigin}/${source.format}`)
  if (source.sampleCharacters.filter(x => x.role === 'MAIN').length < 1) throw new Error(`缺少可核实主角：${mediaId}/${title}`)
  const titleAliases = [...new Set([source.title?.english, source.title?.romaji, source.title?.native, ...(source.synonyms || [])].filter(Boolean))]
  const currentAliases = new Set([title, ...titleAliases].map(normalize))
  for (const key of currentAliases) {
    if (knownTitles.has(key)) throw new Error(`作品已在本地清单中：${title}/${key}`)
    if (aliases.has(key)) throw new Error(`本批标题别名重复：${title}/${key}`)
    aliases.add(key)
  }
  if (source.sampleCharacters.length < 5 || source.sampleCharacters.some(x => knownIds.has(x.id))) throw new Error(`人物与本地数据存在重叠或候选不足：${mediaId}/${title}`)
  return { mediaId, title, titleAliases, references: [`https://anilist.co/anime/${mediaId}`], snapshotPath: `data/anime_update_drafts/batch39-sources/anime-source-${mediaId}.json` }
})
if (anime.length !== 30) throw new Error(`预期 30 部作品，实际 ${anime.length}`)
fs.mkdirSync('data/anime_update_drafts/batch39-sources', { recursive: true })
fs.writeFileSync('data/anime_update_drafts/batch39-selection.json', JSON.stringify({ selectedAt: new Date().toISOString(), anime }, null, 2))
console.log(`候选校验通过：${anime.length} 部作品，均未收录且至少有 5 位可核实角色`)
