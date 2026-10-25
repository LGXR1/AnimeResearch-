import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  40074: {
    traits: ['女性', '转入南十字学园高中部一年级二班', '与当麻幸一同转学', '是绮罗星十字团成员', '组织代号为“窗之星”', '初看安静端庄', '实际性格十分激烈', '渡边加奈子曾评价她“非常危险”', '参与Cybody相关计划'],
    source: 'https://kitsu.io/characters/madoka-kei',
  },
  37787: {
    traits: ['高中二年级学生', '留着及腰的黑色长发', '说话带关西腔', '性格害羞', '不擅长面对恐怖事物', '害怕时有时会尖叫并说身后有鬼', '常被透和渚取笑', '与伦、渚和透是好友', '和朋友们一起上学与玩耍'],
    source: 'https://kitsu.io/characters/yuuko-nishi',
  },
  30140: {
    traits: ['克里修纳的战略家', '性格冷静', '被评价为出色的战略家', '担任莱卡特的上级', '教莱卡特如何成为真正的士兵', '有一名驾驶机甲的儿子', '因儿子在训练中无故杀害同学而与其断绝关系', '担任克里修纳将军', '指挥王国军队抵抗雅特涅斯'],
    source: 'https://kitsu.io/characters/baldr',
  },
  30812: {
    traits: ['来自过去的人物', '在灯里探访桥梁时出现', '举止与水无灯里相似', '被认为可能是另一个时空的灯里', '动画暗示她可能从事教师工作', '属于动画原创人物', '没有出现在原作漫画中', '带有神秘感', '与灯里的短暂相遇促使她重新思考自己与水城的关系'],
    source: 'https://kitsu.io/characters/akiko-hoshino',
  },
  43447: {
    traits: ['南部网球俱乐部成员', '与丸尾荣一郎在同一所高中且同年级', '目标是成为职业网球选手', '第二季及漫画中与丸尾交往', '会积极参加网球训练', '打球风格具有冲劲', '帮助丸尾进入网球领域', '追求职业梦想时面对成绩与训练挑战', '需要为未来作出选择'],
    source: 'https://kitsu.io/characters/natsu-takasaki',
  },
  33794: {
    traits: ['著名甜点公司“城堡”的社长之女', '因家世被同学称作“大小姐”', '比天野草莓高一年级', '喜欢樫野真', '会努力争取与樫野相处', '与甜点精灵马龙搭档', '会利用家世资源参加糕点活动', '竞争心较强', '恋爱执着常给学园生活带来波折'],
    source: 'https://kitsu.io/characters/miya-koshiro',
  },
  38485: {
    traits: ['南十字学园高中部一年级二班学生', '是水野阳和玛丽诺的同班同学', '真实身份是绮罗星十字团成员', '属于Vanishing Age第二部队', '部队代号为“剑之星”', '在学校表面上像普通学生', '暗恋同班的玛丽诺', '在校园生活与组织任务之间切换', '参与Cybody战斗相关秘密'],
    source: 'https://kitsu.io/characters/takeo-takumi',
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
