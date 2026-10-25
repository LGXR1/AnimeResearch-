import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// Repair missing voice actor records only. Default mode is read-only; pass --apply to write.
// Japanese casts come from AniList character/media relations and official cast pages.
// Chinese-dub mappings below were checked against the linked streaming/platform cast credits.
const apply = process.argv.includes('--apply')
const recordsPath = 'data/characters_full.json'
const voiceCachePath = 'data/anime_update_drafts/library-audit-2026-10-13/anilist-voice-media.json'
const reportPath = 'data/anime_update_drafts/library-audit-2026-10-13/voice-actor-repair.report.json'
const localRecords = JSON.parse(fs.readFileSync(recordsPath, 'utf8'))
const voiceCache = JSON.parse(fs.readFileSync(voiceCachePath, 'utf8')).characters

const cacheActorByName = new Map()
for (const char of Object.values(voiceCache)) {
  for (const edge of char.media?.edges || []) {
    for (const actor of edge.voiceActors || []) {
      const key = norm(actor.name?.native || actor.name?.full)
      if (key && !cacheActorByName.has(key)) cacheActorByName.set(key, actor)
    }
  }
}

// Explicitly choose the current/primary anime cast where the character was recast.
// For a stable role, the AniList relation with the most anime credits is used.
const preferredJapaneseActor = {
  26: '小山力也', 87: '悠木碧', 88: '斉藤壮馬',
  147: '斉藤壮馬', 148: '高橋李依', 149: '八代拓', 150: '小市眞琴',
  269: '高木均', 352: 'うえだゆうじ', 354: '神谷浩史',
  422: '岩永洋昭', 423: '行成とあ', 424: '櫻井孝宏',
  671: 'ニーコ', 1184: '関智一', 1185: '川澄綾子', 1535: '市瀬秀和',
  2366: '金元寿子', 2654: '山寺宏一', 2825: '小清水亜美', 5267: '鈴村健一',
  5407: '広橋涼', 19706: '石川由依', 25034: '早見沙織',
  40591: '入野自由', 40594: '櫻井孝宏', 42501: '梶裕貴',
  50691: '杉田智和', 50693: '鈴村健一', 65645: '渕上舞',
  75454: '庵野秀明', 75456: '瀧本美織', 90108: '小野大輔', 90109: '茅野愛衣',
  120726: '宮野真守', 120890: '久保ユリカ', 121563: '水瀬いのり',
  126818: '熊谷健太郎', 127574: '安元洋貴', 127689: '中博史',
  139462: '島﨑信長', 140856: '浦和希', 162213: '海渡翼',
  168866: '佐藤元', 180692: '福西勝也', 259510: '原菜乃華',
  269129: '小野賢章',
}

// Officially credited manual fallbacks absent from the AniList cache.
const verifiedJapaneseFallback = {
  13886: { name: '小林沙苗', source: 'Natsume Yuujinchou official character page' },
  87267: { name: '岡本信彦', source: 'TV Tokyo official cast page' },
  87271: { name: '小澤亜李', source: 'TV Tokyo official cast page' },
  154103: { name: '興津和幸', source: 'Anime cast listing; character profile cross-check' },
  318148: { name: '上田燿司', source: 'Frieren official character page' },
  327305: { name: '照井春佳', source: 'Frieren official character page' },
  40962: { name: '田中冴樹', source: 'STAR DRIVER character/cast reference' },
  57259: { name: '井上まひろ', source: 'Production Ace and Another cast references' },
  135145: { name: '清水はる香', source: 'Isekai Izakaya cast listing' },
  288960: { name: '稲垣好', source: 'Animate Times cast interview', url: 'https://www.animatetimes.com/news/details.php?id=1665028048&p=2' },
  288961: { name: '佐倉綾音', source: 'Animate Times cast interview', url: 'https://www.animatetimes.com/news/details.php?id=1665028048&p=2' },
  305606: {
    name: '大塚芳忠',
    image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95337-NnvEQEBKV2dR.jpg',
    source: 'Mau2 episode cast credit for the anime role “先生”; Anibase identifies this role as 大善欺波/斯波大善.',
    url: 'https://www.mau2.com/anime/tomodatigame',
  },
  305642: {
    name: '椎名へきる',
    image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n96482-dH6qurWW2af8.jpg',
    source: 'Voice actor’s official announcement: she played 友一母 in the TV anime; character profile identifies her as 片切友華.',
    url: 'https://x.com/shiina_hekiru_/status/1511509264275484676',
  },
}

// Each mapping is a role credit, not a guess. Rows with no reliable credit are omitted.
const chineseCredits = [
  ['仙王的日常生活', [
    ['阎小罗', '李诗萌'], ['王令', '孙路路'], ['孙蓉', '钱琛'], ['吞天蛤', '音匣老鬼'],
    ['陈超', '谷江山'], ['郭豪', '星潮'], ['卓异', '金弦'],
  ], 'Bilibili official episode cast credits'],
  ['仙逆', [
    ['王林', '史泽鲲'], ['柳眉', '王婧儿'], ['藤化元', '赵铭洲'],
    ['许立国', '刘思岑'], ['李慕婉', '张惠霖'], ['托森', '边江'],
  ], 'Bilibili/MoeGirl series cast references'],
  ['武庚纪', [
    ['武庚', '梁达伟'], ['天', '吴磊'], ['鬼木', '李元韬'], ['李靖', '孟祥龙'], ['疤面', '韩雨希'],
  ], 'Tencent Video series cast credits'],
  ['秦时明月', [
    ['荆天明', '洪海天'], ['盖聂', '刘钦'], ['石兰', '洪海天'], ['高月', '黄怡晴'], ['项少羽', '沈达威'],
  ], 'Series cast credits; later-season recasts not inferred'],
  ['少年歌行', [
    ['雷无桀', '张博恒'], ['萧瑟', '赵毅'], ['冥侯', '赵毅'], ['白发仙', '姚雷'], ['司空千落', '褚珺'],
  ], 'Bilibili official series page'],
  ['大鱼海棠', [
    ['椿', '季冠霖'], ['湫', '苏尚卿'], ['灵婆', '金士杰'], ['鲲', '许魏洲'], ['凤凰', '张媛媛'],
  ], 'Film credit references'],
  ['昨日青空', [
    ['姚哲恬', '段艺璇'], ['齐景轩', '王一博'], ['屠小意', '苏尚卿'], ['花生', '马斑马'], ['陈老师', '叮当'],
  ], 'Film cast references'],
  ['斗罗大陆', [
    ['戴沐白', '赵路'], ['马红俊', '苏志豪'], ['朱竹清', '黄莺'], ['宁荣荣', '李蝉妃'],
  ], 'Tencent Video series cast credits'],
  ['白蛇：缘起', [['蛇母', '刘薇']], 'Film cast credits; Chinese original voice'],
  ['罗小黑战记', [
    ['罗小黑', '山新'], ['老君', '笑谈'], ['罗小白', '山新'], ['阿根', '山新'], ['皇受', '山新'],
  ], 'Bilibili official series/movie credits'],
  ['大护法', [
    ['小姜', '李兰陵'], ['大护法', '小连杀'], ['太子', '图特哈蒙'],
    ['隐婆', '李佳怡'], ['彩', '叶知秋'],
  ], 'Film cast credits'],
  ['哪吒之魔童闹海', [
    ['哪吒', '吕艳婷'], ['申公豹', '杨卫'], ['殷夫人', '绿绮'], ['敖丙', '瀚墨'], ['李靖', '陈浩'],
  ], 'Film credits; lead voice cross-checked with official/distributor listings'],
  ['神印王座', [
    ['圣采儿', '沈念如'], ['龙皓晨', '李轻扬'], ['蒋虎', '邓宥希'], ['王原原', '常蓉珊'], ['三水', '唐小喜'],
  ], 'Tencent Video series cast credits'],
  ['诡秘之主', [
    ['克莱恩·莫雷蒂', '杨凯祺'], ['邓恩·史密斯', '吴磊'], ['伦纳德·米切尔', '金弦'],
    ['奥黛丽·霍尔', '赵爽'], ['阿兹克·艾格斯', '刘琮'],
  ], 'Bilibili series cast credits'],
  ['喜羊羊与灰太狼', [
    ['喜羊羊', '祖晴'], ['美羊羊', '邓玉婷'], ['沸羊羊', '刘红韵'], ['懒羊羊', '梁颖'], ['红太狼', '赵娜'],
  ], 'Series credits'],
  ['灵笼', [
    ['马克', '李元韬'], ['冉冰', '陶典'], ['摩根', '张欣'], ['镜南', '黄莺'], ['查尔斯', '梁达伟'],
  ], 'Bilibili official series cast credits'],
  ['吞噬星空', [
    ['徐欣', '谢莹'], ['罗峰', '赵乾景'], ['罗华', '黄进泽'], ['邬通', '吴磊'], ['张泽虎', '陈瑀'],
  ], 'Tencent Video series cast credits'],
  ['一念永恒', [
    ['白小纯', '马正阳'], ['杜凌菲', '李诗萌'], ['侯小妹', '赵爽'], ['李青候', '郭浩然'], ['宋君婉', '赵熠彤'],
  ], 'Bilibili/Tencent series cast references'],
  ['百妖谱', [['蜉蝣少女', '曹一茜'], ['春花', '黎筱濛']], 'Series cast references'],
  ['镇魂街', [
    ['夏铃', '黎筱濛'], ['曹焱兵', '郭盛'], ['曹玄亮', '小连杀'], ['于禁', '李璐'], ['小柔', 'C小调'],
  ], 'Bilibili series credits'],
  ['迷域行者', [
    ['宁远', '苏尚卿'], ['何志扬', '陈张太康'], ['苏瑾', '云鹤追'], ['罗密欧·艾贝尔', '马斑马'], ['丁鹤春', '凌振赫'],
  ], 'Bilibili series credits'],
  ['端脑', [
    ['夏驰', '藤新'], ['夏驰', '谢添天'], ['晴知', '朱雀橙'], ['孟秦', '沈达威'],
    ['春絮香', '小连杀'], ['博卞', '图特哈蒙'],
  ], 'Bilibili official series episode credits'],
  ['十万个冷笑话', [
    ['无名男主角', '阿杰'], ['白雪公主', '朱雀橙'], ['哪吒', '山新'], ['李靖', '宝木中阳'], ['女王大人', '山新'],
  ], 'Series credits'],
  ['凡人修仙传', [
    ['韩立', '钱文青'], ['南宫婉', '李诗萌'], ['厉飞雨', '杨天翔'], ['菡云芝', '佟心竹'], ['张铁', '张福正'],
  ], 'Bilibili official episode cast credits'],
  ['妙先生', [
    ['丁果', '小连杀'], ['殷凤', '王潇倩'], ['赶鸭人', '宝木中阳'], ['孝文', '张振'], ['无生', '高枫'],
  ], 'Film credits'],
  ['镖人', [
    ['知世郎', '赵乾景'], ['刀马', '刘北辰'], ['小七', '宴宁'], ['裴行俨', '黄翔宇'],
  ], 'Bilibili/official series promotional cast credits; Arhat left unresolved'],
  ['雄狮少年', [
    ['阿娟', '大昕'], ['阿狗', '郭皓'], ['咸鱼强', '李盟'], ['阿猫', '大雄'], ['阿珍', '李佳思'],
  ], 'Film credits'],
  ['遮天', [
    ['叶凡', '徐翔'], ['姬紫月', '李蝉妃'], ['土匪', '张坤'], ['庞博', '赵乾景'], ['秦瑶', '阮从青'],
  ], 'Tencent Video series credits; “土匪” kept as database character label'],
  ['斗破苍穹', [['药尘', '黑石稔'], ['萧炎', '张沛']], 'Tencent Video series credits; latest lead cast'],
  ['全职高手', [['叶修', '张杰'], ['陈果', '季冠霖'], ['唐柔', '乔诗语']], 'Bilibili series credits'],
]

function norm(value) {
  return String(value || '').normalize('NFKC').toLowerCase().replace(/[\s\-_.·・'’‘「」『』★☆]/g, '')
}

function aliases(record) {
  return [record.name, ...(record.nicknames || [])].filter(Boolean)
}

function cacheCharacterFor(record) {
  // The database id is the AniList character id. Prefer this exact match before
  // resolving localized aliases (which can be short or shared by many roles).
  if (voiceCache[record.id]) return voiceCache[record.id]
  const localAliases = new Map()
  for (const alias of aliases(record)) {
    const key = norm(alias)
    if (!key) continue
    // One- or two-letter Latin nicknames are too ambiguous; keep exact CJK/native aliases.
    if (/^[a-z0-9]+$/i.test(key) && key.length < 5) continue
    localAliases.set(key, Math.max(localAliases.get(key) || 0, key === norm(record.name) ? 100 : 70))
  }
  const found = []
  for (const candidate of Object.values(voiceCache)) {
    let score = 0
    for (const remoteName of [candidate.name?.native, candidate.name?.full]) {
      const key = norm(remoteName)
      if (key && localAliases.has(key)) score = Math.max(score, localAliases.get(key) + (remoteName === candidate.name?.native ? 10 : 0))
    }
    if (score) found.push({ candidate, score })
  }
  found.sort((a, b) => b.score - a.score)
  if (!found.length || (found[1] && found[1].score === found[0].score && found[1].candidate.id !== found[0].candidate.id)) return null
  return found[0].candidate
}

function japaneseActorsFor(record) {
  const cached = cacheCharacterFor(record)
  if (!cached) return []
  const counts = new Map()
  for (const edge of cached.media?.edges || []) {
    if (edge.node?.countryOfOrigin !== 'JP') continue
    for (const actor of edge.voiceActors || []) {
      const key = norm(actor.name?.native || actor.name?.full)
      if (!key) continue
      const current = counts.get(key) || { actor, count: 0, main: 0 }
      current.count++
      if (edge.characterRole === 'MAIN') current.main++
      counts.set(key, current)
    }
  }
  const preferred = preferredJapaneseActor[record.id]
  if (preferred) {
    const selected = counts.get(norm(preferred))?.actor || cacheActorByName.get(norm(preferred))
    if (selected) return [actorRecord(record.id, selected.name?.native || selected.name?.full, selected.image?.large, '日语')]
  }
  const selected = [...counts.values()].sort((a, b) => b.count - a.count || b.main - a.main)[0]?.actor
  return selected
    ? [actorRecord(record.id, selected.name?.native || selected.name?.full, selected.image?.large, '日语')]
    : []
}

function actorRecord(characterId, name, image, language) {
  return { character_id: characterId, name: String(name || '').trim(), image: image || null, language }
}

function curatedActorsFor(record) {
  const manual = verifiedJapaneseFallback[record.id]
  if (manual) {
    const cachedActor = cacheActorByName.get(norm(manual.name))
    return [actorRecord(record.id, manual.name, manual.image || cachedActor?.image?.large, '日语')]
  }
  if (record.anime_title === '妖精森林的小不点' && record.id === 198357) return []
  if (record.anime_title === '卫宫家今天的饭' && record.id === 504) return japaneseActorsFor(record)
  for (const [title, credits] of chineseCredits) {
    if (title !== record.anime_title) continue
    return credits
      .filter(([name]) => name === record.name)
      .map(([, actor]) => actorRecord(record.id, actor, null, '中文'))
  }
  return []
}

const localById = new Map(localRecords.map((record) => [Number(record.id), record]))
const unresolvedLocal = localRecords.filter((record) => {
  const actors = record.voice_actors || []
  return !actors.length || actors.some((actor) => /暂未收录|待补|未知/.test(actor.name))
})

const report = {
  generatedAt: new Date().toISOString(),
  mode: apply ? 'apply' : 'dry-run',
  localUnresolved: unresolvedLocal.length,
  planned: [],
  unresolved: [],
  skippedLiveChanges: [],
  verifiedSources: {
    anilist: 'https://anilist.co/',
    donghuaExamples: [
      'https://www.bilibili.com/bangumi/play/ep692681',
      'https://www.bilibili.com/bangumi/play/ss22088',
      'https://www.bilibili.com/bangumi/play/ep64033',
      'https://www.bilibili.com/bangumi/play/ss24608',
      'https://www.bilibili.com/bangumi/play/ep4389449',
    ],
    officialJapaneseExamples: [
      'https://www.natsume-anime.jp/character/夏目レイコ',
      'https://frieren-anime.jp/character/chara_group1/1-4/',
      'https://frieren-anime.jp/character/chara_group1/1-20/',
      'https://www.tv-tokyo.co.jp/anime/nozakikun/sp/chara/index.html',
      'https://www.aniplex.co.jp/lineup/rurounikenshin-anime/',
      'https://jojo-portal.com/anime/sbr/staff-cast/',
    ],
    newlyCheckedCastCredits: [
      'https://www.animatetimes.com/news/details.php?id=1665028048&p=2',
      'https://www.maigoo.com/citiao/951970.html',
      'https://bkso.baidu.com/item/边江/10206574',
      'https://www.mau2.com/anime/tomodatigame',
      'https://x.com/shiina_hekiru_/status/1511509264275484676',
      'https://anibase.net/ja/anime-characters/1DoAm/トモダチゲーム',
    ],
  },
}

const manualSourceUrlById = {
  155275: 'https://www.maigoo.com/citiao/951970.html',
  155283: 'https://www.maigoo.com/citiao/951970.html',
  288960: 'https://www.animatetimes.com/news/details.php?id=1665028048&p=2',
  288961: 'https://www.animatetimes.com/news/details.php?id=1665028048&p=2',
  376058: 'https://bkso.baidu.com/item/边江/10206574',
}

for (const record of unresolvedLocal) {
  const currentActors = record.voice_actors || []
  const isPlaceholder = currentActors.some((actor) => /暂未收录|待补|未知/.test(actor.name))
  const cachedJapanese = isPlaceholder ? japaneseActorsFor(record) : []
  const candidates = cachedJapanese.length ? cachedJapanese : curatedActorsFor(record)
  const cleaned = [...new Map(candidates.filter((actor) => actor.name).map((actor) => [norm(actor.name), actor])).values()]
  if (!cleaned.length) {
    report.unresolved.push({ id: record.id, name: record.name, anime_title: record.anime_title, reason: isPlaceholder
      ? 'AniList/official source did not provide a confirmed Japanese voice actor.'
      : 'No reliable aired-anime voice credit found; do not infer a cast.' })
    continue
  }
  report.planned.push({
    id: record.id,
    name: record.name,
    anime_title: record.anime_title,
    source: verifiedJapaneseFallback[record.id]?.source || (isPlaceholder ? 'AniList or official anime cast page' : 'Official/platform cast credit'),
    sourceUrl: manualSourceUrlById[record.id] || verifiedJapaneseFallback[record.id]?.url || null,
    oldPlaceholder: isPlaceholder,
    voice_actors: cleaned.map(({ name, image, language }) => ({ name, image, language })),
  })
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

async function fetchAll(table) {
  const rows = []
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from(table).select('*').order('id').range(offset, offset + 999)
    if (error) throw new Error(`${table} read failed: ${error.message}`)
    rows.push(...(data || []))
    if ((data || []).length < 1000) break
  }
  return rows
}

const [characters, voiceActors] = await Promise.all([fetchAll('characters'), fetchAll('voice_actors')])
const liveById = new Map(characters.map((character) => [Number(character.id), character]))
const vaByCharacter = new Map()
for (const actor of voiceActors) {
  const items = vaByCharacter.get(Number(actor.character_id)) || []
  items.push(actor)
  vaByCharacter.set(Number(actor.character_id), items)
}
if (characters.length !== localRecords.length) throw new Error(`本地角色数 ${localRecords.length} 与线上 ${characters.length} 不一致；停止写入。`)

const planToApply = []
for (const plan of report.planned) {
  const local = localById.get(plan.id)
  const live = liveById.get(plan.id)
  const liveActors = vaByCharacter.get(plan.id) || []
  if (!local || !live || local.name !== live.name || local.anime_title !== live.anime_title) {
    report.skippedLiveChanges.push({ id: plan.id, name: plan.name, reason: 'Live character identity differs from local export.' })
    continue
  }
  const liveHasPlaceholder = liveActors.some((actor) => /暂未收录|待补|未知/.test(actor.name))
  const currentNames = new Set(liveActors.filter((actor) => !/暂未收录|待补|未知/.test(actor.name)).map((actor) => norm(actor.name)))
  const missing = plan.voice_actors.filter((actor) => !currentNames.has(norm(actor.name)))
  const searchTextComplete = plan.voice_actors.every((actor) => String(live.search_text || '').includes(actor.name))
  // Reconcile against live state instead of assuming the previous run was all-or-nothing.
  // This makes retries safe after an interrupted write and repairs search_text independently.
  if (!missing.length && !liveHasPlaceholder && searchTextComplete) continue
  planToApply.push({ ...plan, missing, placeholderRows: liveActors.filter((actor) => /暂未收录|待补|未知/.test(actor.name)) })
}

report.liveCounts = { characters: characters.length, voiceActors: voiceActors.length }
report.plannedCount = report.planned.length
report.applicableCount = planToApply.length
report.unresolvedCount = report.unresolved.length
report.chineseMappedCount = report.planned.filter((x) => x.voice_actors.some((a) => a.language === '中文')).length
report.placeholderRepairs = report.planned.filter((x) => x.oldPlaceholder).length

if (!apply) {
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`只读预览完成：线上 ${characters.length} 位角色；计划补 ${report.plannedCount} 位（占位 ${report.placeholderRepairs}、国产配音 ${report.chineseMappedCount}）；${report.unresolvedCount} 位仍无可靠配音资料。`)
  console.log(`报告：${reportPath}`)
  process.exit(0)
}

// Insert confirmed names first. This makes retries safe if a later request is interrupted.
// The report stores actor names separately from the character id; restore the
// relationship key from the enclosing plan when writing the table rows.
const inserts = planToApply.flatMap((plan) => plan.missing.map((actor) => ({ ...actor, character_id: plan.id })))
for (let offset = 0; offset < inserts.length; offset += 100) {
  const { error } = await supabase.from('voice_actors').insert(inserts.slice(offset, offset + 100))
  if (error) throw new Error(`Voice actor insert failed at ${offset}: ${error.message}`)
}

const placeholderIds = planToApply.flatMap((plan) => plan.placeholderRows.map((row) => row.id))
for (let offset = 0; offset < placeholderIds.length; offset += 100) {
  const { error } = await supabase.from('voice_actors').delete().in('id', placeholderIds.slice(offset, offset + 100))
  if (error) throw new Error(`Placeholder removal failed at ${offset}: ${error.message}`)
}

const affectedIds = planToApply.map((plan) => plan.id)
const actorNamesById = new Map()
for (const plan of planToApply) {
  const prior = (vaByCharacter.get(plan.id) || []).filter((actor) => !/暂未收录|待补|未知/.test(actor.name)).map((actor) => actor.name)
  actorNamesById.set(plan.id, [...prior, ...plan.missing.map((actor) => actor.name)])
}
for (let offset = 0; offset < affectedIds.length; offset += 10) {
  const batch = affectedIds.slice(offset, offset + 10)
  await Promise.all(batch.map(async (id) => {
    const character = liveById.get(id)
    const searchText = [character.name, character.anime_title || '', ...(character.nicknames || []), ...(character.traits || []), ...(actorNamesById.get(id) || [])].join(' ')
    const { error } = await supabase.from('characters').update({ search_text: searchText }).eq('id', id)
    if (error) throw new Error(`search_text update failed for ${id}: ${error.message}`)
  }))
}

// Read back every changed relationship and search field.
const verifiedCharacters = new Map()
const verifiedActors = new Map()
for (let offset = 0; offset < affectedIds.length; offset += 100) {
  const batch = affectedIds.slice(offset, offset + 100)
  const [{ data: chars, error: charError }, { data: actors, error: actorError }] = await Promise.all([
    supabase.from('characters').select('id,name,description,search_text').in('id', batch),
    supabase.from('voice_actors').select('id,character_id,name,image,language').in('character_id', batch),
  ])
  if (charError) throw new Error(`Character readback failed: ${charError.message}`)
  if (actorError) throw new Error(`Voice actor readback failed: ${actorError.message}`)
  for (const row of chars || []) verifiedCharacters.set(Number(row.id), row)
  for (const row of actors || []) {
    const items = verifiedActors.get(Number(row.character_id)) || []
    items.push(row)
    verifiedActors.set(Number(row.character_id), items)
  }
}
for (const plan of planToApply) {
  const character = verifiedCharacters.get(plan.id)
  const current = verifiedActors.get(plan.id) || []
  if (!character || current.some((actor) => /暂未收录|待补|未知/.test(actor.name))) throw new Error(`Readback still has placeholder for ${plan.id}`)
  for (const expected of plan.voice_actors) {
    if (!current.some((actor) => norm(actor.name) === norm(expected.name))) throw new Error(`Voice actor readback mismatch for ${plan.id}: ${expected.name}`)
    if (!character.search_text.includes(expected.name)) throw new Error(`search_text missing voice actor for ${plan.id}: ${expected.name}`)
  }
  if (character.description && character.search_text.includes(character.description)) throw new Error(`Description leaked into search_text for ${plan.id}`)
}

report.verifiedCount = planToApply.length
report.insertedActorRows = inserts.length
report.removedPlaceholderRows = placeholderIds.length
report.completedAt = new Date().toISOString()
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(`补全并回读通过：${planToApply.length} 位角色，新增 ${inserts.length} 条声优记录，移除 ${placeholderIds.length} 条占位；${report.unresolvedCount} 位缺少可核实配音资料。`)
console.log(`报告：${reportPath}`)
