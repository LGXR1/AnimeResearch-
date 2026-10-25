import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  40587: {
    traits: ['主人公拓人的生母', '曾与凉介订婚', '后来爱上东京', '曾让东京以裸体形象为自己作画', '怀有东京的孩子', '怀孕一事曝光时东京正沉迷于零时间', '东京当时没有给予她多少关注', '凉介把自己的怀表交给她', '收到怀表后不久便离开岛屿'],
    source: 'https://kitsu.io/characters/sora-51a68e1e-69fe-4760-bf5f-99ea03ca154f',
  },
  39288: {
    traits: ['美食会副料理长', '外形带有昆虫特征', '长有昆虫翅膀', '在体内饲养寄生虫', '能够随时从体内释放寄生虫', '缺乏明显情绪表现', '战斗时专注于完成目标', '佩戴的臂环可以限制自身力量', '被阿尔法罗认为具备进入美食界的能力'],
    source: 'https://kitsu.io/characters/tommyrod',
  },
  41139: {
    traits: ['已退休的美食猎人', '经常处于醉酒状态', '曾与节乃搭档', '是阿卡西亚的学生', '与一龙及美食会首领同为阿卡西亚门生', '是铁平的祖父', '全餐前菜为百叶草', '全餐汤品为熔岩浓汤', '全餐鱼料理为王者陆鲨', '全餐肉料理为阿修罗龙', '全餐主菜为ET米', '全餐沙拉为格拉纳生菜', '全餐甜点为绿洲甜瓜', '全餐饮品为多哈姆泉酒'],
    source: 'https://kitsu.io/characters/jirou-18ec6dda-0616-4c4e-887c-371ccae63e05',
  },
  30555: {
    traits: ['以女孩形态出现的猫灵', '在《ARIA The ANIMATION》第4话登场', '第4话标题为《无法送达的信》', '在该集中遇见水无灯里与阿利亚社长', '委托灯里帮忙递送一封信', '她无法用电脑找到信件所写的地址', '在第13话的回忆片段中再次出现', '属于动画原创角色', '没有出现在原作漫画中'],
    source: 'https://kitsu.io/characters/ami-0a38b8b4-6a90-4b6b-b573-dc6f4d223825',
  },
  35471: {
    traits: ['喜欢看枫拍摄的照片', '习惯主要用口哨表达想法', '冈崎乃莉能听懂她的口哨', '乃莉通常会把她表达的内容转述给其他人', '父母经营一间颇有名气的小旅馆', '这间旅馆位于岛上', '父母期望她在退休后接手旅馆', '朋友们帮助她争取到父母的同意', '父母同意她追寻自己的梦想'],
    source: 'https://kitsu.io/characters/maon-sakurada',
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
