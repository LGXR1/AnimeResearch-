import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  37245: {
    traits: ['剑道部成员', '闪亮十字团成员', 'Star Driver', 'Adult Bank分队的Banker', '在组织中以Banker为称号', '与Simone一同服务渡边加奈子', '拥有Star Driver标记', '具备进入Cybody第三阶段的可能', '不明原因拒绝进入第三阶段', '后来转入Vanishing Age分队'],
    source: 'https://kitsu.io/characters/takashi-dai',
  },
  37248: {
    traits: ['学校保健教师', '闪亮十字团Science Guild分队首领', 'Star Driver', '第一阶段能力可以使外貌年龄倒退', '曾伪装成名为“Hina”的学生', '利用Mandrake药剂影响校内男生', '能借第一阶段能力让自己显得年轻', '偏爱俊美男生'],
    source: 'https://kitsu.io/characters/midori-okamoto',
  },
  37788: {
    traits: ['高中二年级生', '棕发', '双马尾', '近视', '戴眼镜', '常在三位伙伴中担任吐槽役', '对体重和身材敏感', '特别怕冷', '天气预报要下雪时会把全身裹到只露眼睛', '曾多次下决心节食减肥', '不喜欢运动'],
    source: 'https://kitsu.io/characters/nagisa-tennouji',
  },
  37909: {
    traits: ['神秘少女', '举止像年幼孩子', '会向能与鸟交谈的人教授魔法', '南十字岛的西方巫女', '封印解除后决定离开南十字岛', '在第16集离岛', '离岛行为与母亲相似', '被称为水野真理诺的双胞胎妹妹', '真理诺实际是她为应对母亲离开和孤独而创造的存在'],
    source: 'https://kitsu.io/characters/mizuno-you',
  },
  41728: {
    traits: ['宇宙军提督', '高屋法子的父亲', 'Luxion舰队司令', '舰队在地球军首次遭遇宇宙怪兽时被毁', '长期在深空执行任务', '每年都会在女儿生日回家陪她', 'Luxion遇袭时把最后一个逃生舱位让给副官太田', '因此留在舰上并牺牲', '他的牺牲开启了作品的主要事件'],
    source: 'https://kitsu.io/characters/yuzo-takaya',
  },
  43038: {
    traits: ['4岁', '拥有野兽基因', '能以精神力量引发火灾', '年幼时无意中多次引发火灾', '火灾后曾被发现埋在瓦砾下但仍生还', '被当作实验对象观察', '母亲因她无意引发的火焰而死亡', 'Jun接到消灭她的命令', 'Jun变身后仍试图避免伤害她', '无法控制自身的火焰能力', '在Jun拥抱她时周围火焰渐渐熄灭'],
    source: 'https://kitsu.io/characters/remi-takashima-9af48606-cb09-4f3b-aa21-a214b2c68183',
  },
  43845: {
    traits: ['美食猎人', '与特瑞科和小松在前往美食占卜地途中相遇', '主要负责喜剧效果', '性格胆小', '战斗能力欠佳', '战斗时使用斧头', '属于实力较弱的美食猎人', '运气特别好', '常靠运气在危险地点存活', '会用角色扮演游戏术语描述自己的技能'],
    source: 'https://kitsu.io/characters/zonge',
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
fs.writeFileSync(`${root}/followup-traits-round7.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
