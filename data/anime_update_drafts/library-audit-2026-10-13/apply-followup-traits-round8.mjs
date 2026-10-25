import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  27923: {
    traits: ['东浦高中三年六班学生', '生日为9月21日', '血型A型', '身高176厘米', '体重70千克', '右投右打', '东浦高中二垒手', '担任球队第三棒', '球衣号码4号', '父母健在且有一名哥哥', '尽管个人数据普通，仍被阿部评价为东浦最强打者'],
    source: 'https://kitsu.io/characters/shingo-yamazaki',
  },
  32647: {
    traits: ['大学八年级学生', '与作品主角住在同一宿舍', '第一集以“结缘之神”身份登场', '本名樋口清太郎', '更多时候被称作“师傅”', '总是穿着浴衣', '气质睿智而超然', '常以直接方式帮助主角', '主角有时没有察觉他提供的帮助'],
    source: 'https://kitsu.io/characters/seitarou-higuchi',
  },
  34324: {
    traits: ['河内恭介在新人赛中的对手', '曾制作出妻子造型的面包', '在新人赛中败给河内', '落败后曾独自在山中徘徊', '遇到一头猪并向它学习猪的知识', '答应猪临终请求后吃下它', '此后脸部反应变得像猪', '成为全日本肉类锦标赛总冠军', '以凯撒面包屑制作的炸猪排夺冠'],
    source: 'https://kitsu.io/characters/katsuo-umino',
  },
  37466: {
    traits: ['拥有圣者身份', '外形像留着黑绿色长发的少女', '身披长围巾状布料', '会获得观察者的外貌与性格', '外貌会呈现观察者不愿回忆之人的样子', '现有外貌源自鑢七花并融合四季崎记纪的遗憾', '性格来自咎梅的记忆', '已活超过300年', '是四季崎记纪的旧识', '持有无实体刀刃的变体刀“铫”', '曾因担心变体刀的毒性而将刀埋藏', '会用幻象折磨同伴并引导他们认识自己'],
    source: 'https://kitsu.io/characters/rinne-higaki',
  },
  39202: {
    traits: ['30岁', '喜翠庄的经营顾问', '曾与和仓缘二就读同一所大学', '努力协助旅馆恢复经营', '要求旅馆员工改善礼仪', '每月只到旅馆一次', '认为喜翠庄过于守旧', '提出的改革有时相当激进', '会说英语', '与缘二相恋并在第22集结婚'],
    source: 'https://kitsu.io/characters/takako-kawajiri',
  },
  40478: {
    traits: ['流行组合CHAM!的歌手', '是组合成员之一', '雾越未麻离团后与雪子的人气上升', '与雪子一同进入歌唱团体排行榜', '即使未麻转行仍关心她', '与雪子共同主持电台谈话节目', '节目中曾看到未麻的幻影', '看到幻影时起初很高兴', '未麻幻影突然离开时感到震惊'],
    source: 'https://kitsu.io/characters/rei-497a088f-4902-4369-a212-9501d155e1d3',
  },
  40940: {
    traits: ['美食会副料理长', '在特瑞科寻找BB玉米途中与他相遇', '曾与特瑞科交手但没有认真作战', '左胸有一道伤疤', '身体上附有一对额外手臂', '曾使用巨蚊制成的坚韧吸管作战', '会用吸管把食物吸入口中', '饲养捕获等级85的巨型杰克大象', '曾被阿尔法罗评价为能应付美食界'],
    source: 'https://kitsu.io/characters/grinpatch',
  },
}

const ids = Object.keys(updates).map(Number)
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const fullById = new Map(full.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
for (const id of ids) if (!fullById.has(id) || !slimById.has(id) || updates[id].traits.length < 8 || new Set(updates[id].traits).size !== updates[id].traits.length) throw new Error(`角色 ${id} 的本地记录或特征不合格`)

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title,nicknames,traits').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw charactersResult.error
if (actorsResult.error) throw actorsResult.error
const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位角色，停止写入`)
for (const id of ids) {
  const local = fullById.get(id)
  const remote = remoteById.get(id)
  for (const key of ['name', 'anime_title', 'nicknames', 'traits']) if (JSON.stringify(local[key] ?? null) !== JSON.stringify(remote[key] ?? null)) throw new Error(`角色 ${id} 的本地与 Supabase ${key} 不一致，停止写入`)
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const names = actorsById.get(Number(actor.character_id)) || []
  names.push(actor.name)
  actorsById.set(Number(actor.character_id), names)
}
const payloads = ids.map((id) => {
  const row = fullById.get(id)
  const traits = updates[id].traits
  return { id, traits, search_text: [row.name, row.anime_title, ...(row.nicknames || []), ...traits, ...(actorsById.get(id) || [])].join(' ') }
})
for (const payload of payloads) {
  const { error } = await db.from('characters').update({ traits: payload.traits, search_text: payload.search_text }).eq('id', payload.id)
  if (error) throw new Error(`角色 ${payload.id} 写入失败：${error.message}`)
}

const readback = await db.from('characters').select('id,traits,search_text').in('id', ids)
if (readback.error) throw readback.error
const savedById = new Map((readback.data || []).map((row) => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const payload of payloads) {
  const saved = savedById.get(payload.id)
  if (JSON.stringify(saved.traits) !== JSON.stringify(payload.traits) || saved.search_text !== payload.search_text || saved.search_text.includes(fullById.get(payload.id).description)) throw new Error(`角色 ${payload.id} 回读校验失败`)
  fullById.get(payload.id).traits = saved.traits
  fullById.get(payload.id).search_text = saved.search_text
  slimById.get(payload.id).traits = saved.traits
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(full, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) lines.push([
  row.id, row.name, row.anime_title, row.image, row.description,
  (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(','),
].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${lines.join('\n')}\n`)

for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = ids.filter((id) => (report.checkedIds || []).map(Number).includes(id))
  if (!batchIds.length) continue
  report.pendingTraitVerificationIds = (report.pendingTraitVerificationIds || []).filter((id) => !batchIds.includes(Number(id)))
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...batchIds])]
  report.localFollowup ||= {}
  report.localFollowup.traitCorrections ||= {}
  for (const id of batchIds) report.localFollowup.traitCorrections[id] = { source: updates[id].source, correctedAt: new Date().toISOString(), readbackVerified: true }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const evidence = {
  correctedAt: new Date().toISOString(),
  count: ids.length,
  ids,
  sources: Object.fromEntries(ids.map((id) => [id, updates[id].source])),
  supabaseReadbackVerified: true,
  searchIndexVerifiedForAllIds: true,
  introExcludedFromSearch: true,
}
fs.writeFileSync(`${root}/followup-traits-round8.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
