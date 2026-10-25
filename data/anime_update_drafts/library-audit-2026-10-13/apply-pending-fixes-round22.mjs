import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const sources = {
  24129: [
    'https://kitsu.io/api/edge/characters/7484',
    'https://myanimelist.net/character/24129/Nami',
  ],
  34419: [
    'https://kitsu.io/api/edge/characters/1116',
    'https://myanimelist.net/character/34419/Haijima',
  ],
  36309: ['https://anilist.co/character/36309'],
  42948: [
    'https://kitsu.io/api/edge/characters/32562',
    'https://myanimelist.net/character/42948/Mother_Tachibana',
    'https://notify.moe/character/OlCNwrimR1',
  ],
  42949: [
    'https://kitsu.io/api/edge/characters/32563',
    'https://myanimelist.net/character/42949/Atsuji_Tachibana',
    'https://www.anime-planet.com/characters/atsuji-tachibana',
  ],
  43961: [
    'https://kitsu.io/api/edge/characters/17034',
    'https://anilist.co/character/43961',
    'https://s4.anilist.co/file/anilistcdn/character/large/43961.jpg',
  ],
  43976: [
    'https://kitsu.io/api/edge/characters/17045',
    'https://anilist.co/character/43976',
    'https://s4.anilist.co/file/anilistcdn/character/large/43976.jpg',
  ],
}

const updates = {
  24129: {
    traits: ['女性', '年轻女孩', '村落居民', '曾受白郎帮助', '对白郎产生好感', '在村中生活', '《虫师》角色', '日语声优明坂聡美'],
  },
  34419: {
    nicknames: ['Haijima', '灰岛'],
    description: '灰岛（Haijima）是《日式面包王》人物目录收录的角色。Kitsu对应条目确认其英文名为Haijima，并将其关联到该作品；AniList记录的日语声优为神田朱未（Akemi Kanda）。目前公开角色页没有提供人物传记，无法确认其职业、性格、外貌或与主角的具体关系，因此本条仅保留能够核对的姓名、作品和配音信息，不补写剧情经历。',
  },
  36309: {
    traits: ['旁白／解说员', '通用旁白条目', '条目英文名为Narrator', '未记录个人本名', '未提供独立人物背景', '关联作品《斗牌传说》', 'AniList声优记录为Tooru Furuya', '不代表具名登场角色'],
  },
  42948: {
    traits: ['女性', '立花家的母亲角色', '条目未记载个人姓名', '《花开物语》配角', '第6集登场', '单集客串角色', '日语声优为Fuyuka Ooura', '与立花敦治同集登场'],
  },
  42949: {
    traits: ['男性', '棕色头发', '戴眼镜', '立花家相关人物', '《花开物语》配角', '第6集登场', '单集客串角色', '日语声优为Mitsuru Ogata'],
  },
  43961: {
    name: '多香绘',
    nicknames: ['Takae', '多香絵', '多香绘'],
    traits: ['女性', '短深色发', '黄褐色眼睛', '头部两侧可见角状突起', '穿蓝色上衣', '《女恶魔人》角色', '日语声优为Naoko Takano', 'Kitsu日文名为多香絵'],
    description: '多香绘（Takae）是《女恶魔人》的人物之一。Kitsu与AniList的公开角色条目确认了她的名字和作品关联，但没有提供剧情简介或性格关系说明。她的角色图像显示短深色发、黄褐色眼睛、头部两侧的角状突起及蓝色上衣；AniList记录的日语声优为Naoko Takano。公开资料不足以确认她的具体经历，因此本简介只描述可核对的作品、外观与配音信息。',
  },
  43976: {
    name: '真纪猛',
    nicknames: ['Takeshi Maki', 'Maki Takeshi', '真紀猛', '真纪猛'],
    traits: ['男性', '短深棕发', '棕色眼睛', '穿红色上衣', '上衣带黄色“A”图案', '《女恶魔人》角色', '日语声优为Ryouichi Tanaka', 'Kitsu日文名为真紀猛'],
    description: '真纪猛（Takeshi Maki）是《女恶魔人》的人物之一。Kitsu与AniList的公开角色条目确认了他的名字、作品关联及声优记录，但没有提供剧情简介或性格关系说明。角色图像中他留着短深棕发、棕色眼睛，穿着胸前带黄色“A”图案的红色上衣；AniList记录的日语声优为Ryouichi Tanaka。公开资料不足以确认他的具体经历，因此本简介只记录可核对的作品、外观与配音信息。',
  },
}

const traitResolvedIds = [24129, 36309, 42948, 42949, 43961, 43976]
const descriptionResolvedIds = [34419, 43961, 43976]
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const localById = new Map(local.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const ids = Object.keys(updates).map(Number)

for (const id of ids) {
  const patch = updates[id]
  const row = localById.get(id)
  if (!row || !slimById.has(id)) throw new Error(`本地导出缺少角色 ${id}`)
  if (patch.traits && patch.traits.length < 8) throw new Error(`角色 ${id} 的特征不足 8 条`)
  if (patch.description && (patch.description.length < 100 || patch.description.length > 200)) throw new Error(`角色 ${id} 的简介为 ${patch.description.length} 字，不在 100–200 字范围内`)
  if (!sources[id]?.length) throw new Error(`角色 ${id} 缺少来源记录`)
}

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw charactersResult.error
if (actorsResult.error) throw actorsResult.error
const remoteById = new Map((charactersResult.data || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位角色，停止写入`)
for (const id of ids) {
  const row = localById.get(id)
  const remote = remoteById.get(id)
  if (remote.name !== row.name || remote.anime_title !== row.anime_title) throw new Error(`角色 ${id} 的本地与 Supabase 姓名或作品名不一致`)
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const list = actorsById.get(Number(actor.character_id)) || []
  list.push(actor.name)
  actorsById.set(Number(actor.character_id), list)
}
const payloads = ids.map(id => {
  const row = localById.get(id)
  const patch = updates[id]
  const next = {
    name: patch.name || row.name,
    nicknames: patch.nicknames || row.nicknames || [],
    traits: patch.traits || row.traits || [],
    description: patch.description || row.description,
  }
  next.search_text = [next.name, row.anime_title, ...next.nicknames, ...next.traits, ...(actorsById.get(id) || [])].join(' ')
  return { id, row, next }
})

for (const item of payloads) {
  const { error } = await db.from('characters').update(item.next).eq('id', item.id)
  if (error) throw new Error(`角色 ${item.id} 写入失败：${error.message}`)
}
const readbackResult = await db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', ids)
if (readbackResult.error) throw readbackResult.error
const savedById = new Map((readbackResult.data || []).map(row => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const item of payloads) {
  const saved = savedById.get(item.id)
  for (const key of ['name', 'nicknames', 'traits', 'description']) {
    if (JSON.stringify(saved[key] ?? null) !== JSON.stringify(item.next[key] ?? null)) throw new Error(`角色 ${item.id} 的 ${key} 回读不一致`)
  }
  if (saved.search_text !== item.next.search_text || saved.search_text.includes(saved.description || '\u0000')) throw new Error(`角色 ${item.id} 的搜索索引回读失败`)
  const tokens = [saved.name, ...saved.nicknames, ...saved.traits].filter(Boolean)
  for (const token of tokens) if (!saved.search_text.includes(token)) throw new Error(`角色 ${item.id} 的搜索索引缺少“${token}”`)
  item.row.name = saved.name
  item.row.nicknames = saved.nicknames
  item.row.traits = saved.traits
  item.row.description = saved.description
  item.row.search_text = saved.search_text
  const slimRow = slimById.get(item.id)
  for (const key of ['name', 'nicknames', 'traits', 'description', 'search_text']) slimRow[key] = saved[key]
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of local) csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const correctedAt = new Date().toISOString()
for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const inBatch = ids.filter(id => report.checkedIds.map(Number).includes(id))
  if (!inBatch.length) continue
  for (const field of ['pendingTraitVerificationIds', 'pendingExternalVerificationIds']) report[field] = (report[field] || []).filter(id => !traitResolvedIds.includes(Number(id)))
  for (const field of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds']) report[field] = (report[field] || []).filter(id => !descriptionResolvedIds.includes(Number(id)))
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...inBatch])]
  report.localFollowup ||= {}
  report.localFollowup.researchCorrections ||= {}
  for (const id of inBatch) report.localFollowup.researchCorrections[id] = {
    sources: sources[id],
    correctedAt,
    databaseReadbackVerified: true,
    introExcludedFromSearch: true,
  }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const summaryPath = `${root}/batch25-34-audit-summary.md`
const summaryAddition = `\n\n## 继续核实与修正（${correctedAt.slice(0, 10)}）\n\n- 依据 Kitsu 角色 API、角色图片及公开角色目录，将 24129、42948、42949、43961、43976 的泛化标签换成有来源的姓名、外观、配音或登场信息；另将 36309 明确标为通用旁白条目，避免把它当作具名人物。\n- 为 34419、43961、43976 改写资料边界说明，明确公开来源缺少人物传记，不再使用无依据的模板剧情简介。简介均为 100–200 字，并已回读验证未进入搜索索引。\n- 核对 43961、43976 的 AniList 头像：43961 为短深色发、黄褐色眼睛及角状突起；43976 为短深棕发、棕色眼睛及红色“A”字上衣。\n- 目前仍无法核实具体人物特征的角色：34419 灰岛。另 30728 已更正为旧恋人小兰；MAL 中真正的小倩没有对应的本地 AniList 角色记录，尚未新增，避免误用来源不明的图片或角色ID。\n- 8 位 JOJO 角色仍未找到可确认的动画声优；不使用游戏或宣传配音代替动画声优。\n- 未提交 Git。\n`
fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf8') + summaryAddition)

console.log(JSON.stringify({ correctedAt, modifiedCount: ids.length, ids, traitsResolved: traitResolvedIds, biographyNotesUpdated: descriptionResolvedIds, traitPendingIds: [34419], jojoVoiceActorsPending: 8, supabaseReadbackVerified: true, introExcludedFromSearch: true }, null, 2))
