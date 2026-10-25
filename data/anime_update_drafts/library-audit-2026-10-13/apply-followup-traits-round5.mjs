import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  31273: {
    traits: ['6至7岁', '生日为8月14日', '五岛列岛小学一年级学生', '与祖父同住', '经常去半田家玩', '性格开朗', '孩子气且精力旺盛', '做事常先行动后思考', '常不听半田清舟的话'],
    source: 'https://kitsu.io/characters/naru-kotoishi',
  },
  31293: {
    traits: ['天海护的青梅竹马', '对天海护抱有好感', '表妹菖蒲常把她卷入危险事件', '被原种俘虏后见到Latio形态的护', '起初以为护被外星人替换', '确认护仍是自己熟悉的人后成为他的支持者', '曾向其他孩子揭示护的身份', '在护离开时穿婚纱与他告别并接吻', '在精神紧张时会重复“我不害怕”', '这句自我鼓励最初由护教给她'],
    source: 'https://kitsu.io/characters/hana-hatsuno',
  },
  32130: {
    traits: ['五叶帮首领', '性格有魅力且行事神秘', '不愿谈及自己的过去', '浅色头发', '肤色黝黑', '常抽烟斗', '住在当地妓院并保护那里的女性', '初期表现得沉着随性', '曾招募害羞又经济窘迫的秋津政之助', '本名清之进', '幼年被显赫家族收养后遭养父母排斥', '成年后曾以“清”之名做盗贼'],
    source: 'https://kitsu.io/characters/yaichi',
  },
  32135: {
    traits: ['技艺出众的武士', '出身显赫家族', '性格害羞', '常因害羞而被雇主辞退', '因觉得不属于故乡而离家', '受弥一雇用担任护卫后加入五叶', '起初不知道五叶涉及绑架等违法活动', '仰慕弥一随性的一面', '对弥一的过去感到好奇'],
    source: 'https://kitsu.io/characters/masanosuke-akitsu',
  },
  32137: {
    traits: ['五叶帮的艺伎', '曾在妓院工作', '由弥一出钱赎身', '获救后与弥一合作', '参与创立五叶帮', '为五叶帮取名', '头脑冷静', '风情成熟', '最早接纳初到五叶的政之助之一', '后来搬进政之助从前住过的公寓', '养了一只常去政之助住处的猫'],
    source: 'https://kitsu.io/characters/take',
  },
  32412: {
    traits: ['五叶成员聚会酒馆的老板', '过去是盗贼团伙成员', '退出犯罪团伙后成家', '亡妻因病去世', '独自抚养女儿阿锦', '性格粗犷', '非常保护女儿', '会记恨让阿锦哭泣的人', '起初不认同害羞且心软的政之助', '后来逐渐接纳政之助'],
    source: 'https://kitsu.io/characters/umezou',
  },
  32617: {
    traits: ['曾是独行盗贼', '现为五叶帮成员', '在帮中担任间谍并搜集目标情报', '以制作女性金属发饰赚取外快', '性格沉着冷静', '有目标时会坚持到底', '坚持行动时会被他人认为鲁莽', '因欠弥一人情而加入五叶', '早年行窃被追捕时曾获弥一救助', '曾为供养妻儿而偷钱'],
    source: 'https://kitsu.io/characters/matsukichi-8af46436-d8f1-4a3c-aefc-094d053b42c6',
  },
  37215: {
    traits: ['17岁', '身高168厘米', '体重54千克', '在喜翠庄兼职打扫与接待', '性格害羞内向', '不擅长主动社交', '从3岁起练习游泳', '对游泳很有自信', '因游泳能力被称为“河童少女”', '与绪花、民子和结名就读同一所高中'],
    source: 'https://kitsu.io/characters/nako-oshimizu',
  },
  37250: {
    traits: ['南十字学园一年级生', '担任须方宫司的专属女仆', '暗恋宫司', '擅长武术', '知道闪亮十字团藏在校舍内部', '性格友善温柔', '也有些胆怯', '能驾驶Cybody', '曾被闪亮十字团利用来制造零时间幻象', '驾驶的Cybody被塔乌班击败后幻象解除'],
    source: 'https://kitsu.io/characters/tiger-sugatame',
  },
  38707: {
    traits: ['17岁', '团守彦的侄女', '高中二年级生', '就读团侦探学园', '知名推理小说作家', '高中时已出版成功作品', '起初更想成为推理小说家而非侦探', '小学三年级时首次获警方表彰', '很少提及与团守彦的亲属关系', '竞争心强', '对自己和他人都要求严格', '是七海怜的友好竞争对手'],
    source: 'https://kitsu.io/characters/sakurako-yukihira',
  },
  39695: {
    traits: ['1936年出生', '团侦探学园创办人兼校长', '知名侦探', '曾解决多起案件', '日本唯一获准持枪的私人侦探', '曾与犯罪组织冥王交手', '事件后终身坐轮椅', '晚年察觉冥王可能复活', '创设特别班Q', '亲自训练并评估Q班学生', '打算从中选出自己的继任者'],
    source: 'https://kitsu.io/characters/morihiko-dan',
  },
}

const ids = Object.keys(updates).map(Number)
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const fullById = new Map(full.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
for (const id of ids) {
  if (!fullById.has(id) || !slimById.has(id) || updates[id].traits.length < 8 || new Set(updates[id].traits).size !== updates[id].traits.length) throw new Error(`角色 ${id} 的本地记录或特征不合格`)
}

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
fs.writeFileSync(`${root}/followup-traits-round5.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
