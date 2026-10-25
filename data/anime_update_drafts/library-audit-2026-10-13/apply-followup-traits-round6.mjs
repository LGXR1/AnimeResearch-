import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  30557: {
    traits: ['来自地球的人类游客', '与丈夫一同旅行', '丈夫是她在地球时认识的', '专程来到水星乘坐晃的贡多拉', '很喜欢可爱的事物', '喜欢见到三位见习领航员和总统猫', '曾加入三位女孩的练习', '体验晃的训练方式后感到惊讶'],
    source: 'https://kitsu.io/characters/amelie',
  },
  31176: {
    traits: ['原种的“终端”程序', '负责原种情报搜集', '担任原种的现场指挥官', '外形是悬浮的人偶小丑', '以十字姿态站在平衡球上', '球体可展开并收纳折叠的人形躯体', '能借球体高速移动', '说话冷漠单调且情绪很少外露', '帕斯达毁灭后吸收其残片与知识', '后来被原种核心回收并并入Z主'],
    source: 'https://kitsu.io/characters/pagliaccio',
  },
  35601: {
    traits: ['南十字学园高中生', '高中阶段已结婚', '丈夫是Grand Tonnerre负责人渡边雷昂', '闪亮十字团Adult Bank第四分队队长', '在组织中的称号为“President”', '是Star Driver', '驾驶Cybody“Betrienda”', '知道Simone因父亲忽视其母亲而怨恨自己', '曾用能力救下Simone的性命'],
    source: 'https://kitsu.io/characters/kanako-watanabe',
  },
  35602: {
    traits: ['闪亮十字团Adult Bank成员', '与大·大空一同服务渡边加奈子', '负责照顾加奈子的日常起居', '性格忠诚沉着', '是闪亮十字团的Star Driver之一', '说服大·大空挑战塔克特以争取领导地位', '因加奈子令父亲忽视其母亲而怨恨加奈子', '与大·大空合谋让加奈子失去领导职位', '对大·大空抱有好感'],
    source: 'https://kitsu.io/characters/simone-aragon',
  },
  35606: {
    traits: ['南十字学园二年级生', '担任塔克特宿舍的宿舍助理', '剑道部部长', '闪亮十字团第五分队Filament的首领', '第一阶段能力可控制被她亲吻的男性', '曾亲吻须方宫司并试图控制他', '控制须方宫司的计划失败', '从小喜欢须方宫司', '家族曾拥有标记但因血统稀释而失去标记'],
    source: 'https://kitsu.io/characters/benio-shinada',
  },
  35610: {
    traits: ['南十字学园二年级生', '与塔克特住在同一宿舍', '拳击部成员', '体格健壮', '闪亮十字团第五分队Filament成员', '驾驶Cybody“Alpheisto”', '在组织中的代号为“Raging Bull”', '曾计划强行解除和子封印', '在零时间与塔克特交战并落败', '战败后Cybody被摧毁且Star Driver称号被剥夺'],
    source: 'https://kitsu.io/characters/george-honda',
  },
  37171: {
    traits: ['闪亮十字团代理首领', 'Vanishing Age分队首领', '兼任南十字学园董事', '行事神秘', '对闪亮十字团事务兴趣不高', '常听北方巫女讲述“刺鱿鱼的山姆”故事', '真实姓名为绵津见时绪', '是塔克特与空之所生的父亲', '驾驶Cybody“Reshbal”', 'Reshbal外形与塔乌班相似但配色不同'],
    source: 'https://kitsu.io/characters/reiji-miyabi',
  },
  37910: {
    traits: ['被称为水野阳的双胞胎姐姐', '闪亮十字团成员', '隶属Head领导的Banishing Age分队', '在闪亮十字团中的称号是“Manticore”', '加入组织的目的是保护水野阳', '实际是水野阳创造出的存在', '她的出现源于水野阳被母亲遗弃后的孤独', '与水野阳的关系兼有“孪生姐妹”外观和创造者／创造物真相'],
    source: 'https://kitsu.io/characters/marino-you',
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
fs.writeFileSync(`${root}/followup-traits-round6.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
