import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  39195: {
    traits: ['16岁', '是松前绪花最好的朋友', '喜欢绪花', '做事耐心', '表达感情时常绕弯子', '在绪花离开东京前向绪花告白', '告白后在绪花回应前跑开', '在故事后段得到绪花的回应', '与绪花的感情线贯穿全剧'],
    source: 'https://kitsu.io/characters/kouichi-tanemura',
  },
  39198: {
    traits: ['23岁的年轻厨师', '在喜翠庄厨房担任年轻厨师', '工作认真勤奋', '跟随主厨学习料理', '在厨房教民子做料理', '说话直率', '常因工作训斥民子', '也会调侃绪花', '会关注民子的成长', '做事可靠并愿意帮助同事'],
    source: 'https://kitsu.io/characters/tohru-miyagishi',
  },
  41730: {
    traits: ['出生于2029年的冲绳', '是赤井君子的女儿', '亲昵地称高屋法子为“法子阿姨”', '18岁时加入冲绳女子高中Sizzler计划', '希望成为战斗飞行员', '教官是太田和美', '敬仰法子与父辈参与的宇宙战争', '在训练中面对自己是否适合担任飞行员的挑战'],
    source: 'https://kitsu.io/characters/takami-akai',
  },
  41729: {
    traits: ['是高屋法子高中时期最好的朋友', '学生时代接受过RX-7驾驶训练', '未能入选银星号飞行队', '未入选后留在地球', '成年后结婚', '育有女儿高见', '是高见的母亲', '与法子选择了不同的人生道路'],
    source: 'https://kitsu.io/characters/kimiko-higuchi',
  },
  33023: {
    traits: ['京都大学牙科专业学生', '喜欢喝酒', '醉酒后会明显失去判断力', '醉酒时会主动调戏身边的人', '知道自己醉酒后的表现', '会谨慎选择一起喝酒的对象', '英语表达流利', '在第6至第8话成为主角的正式恋爱对象', '会与主角、小津及樋口清太郎来往'],
    source: 'https://kitsu.io/characters/ryouko-hanuki',
  },
  37301: {
    traits: ['从巴黎圣玛丽学园本校转入', '在糕点大奖赛早期向天野草莓队发起挑战', '在比赛中败给草莓队', '受到草莓的努力鼓舞', '败北后返回巴黎继续学习', '第二季再次登场并加入草莓的新队伍', '新队伍成员还包括樫野真与约翰尼·麦克比尔', '擅长用热带水果装饰糕点', '性格好胜', '会把比赛中的挫折转化为继续练习的动力'],
    source: 'https://kitsu.io/characters/lemon-yamagishi',
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
