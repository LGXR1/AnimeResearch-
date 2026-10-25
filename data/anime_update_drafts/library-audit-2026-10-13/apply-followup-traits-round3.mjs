import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  41136: {
    traits: ['男性', '身高232厘米', '体重307千克', '美食会三名副料理长之一', '能操控火焰与热量', '曾操控GT机器人与特瑞科交战', 'GT机器人战绩不能代表他的真实实力', '被认为有能力应对美食界', '与大竹组成搭档', '拥有美食细胞遗传特征', '极限战斗后额头显现第三只眼', '拒绝将小松交给NEO首领乔亚'],
    source: 'https://kitsu.io/characters/starjun',
  },
  41141: {
    traits: ['IGO开发局局长', '美食研究所负责人', 'IGO排名第三的重要人物', '负责管理IGO第一生境区', '与特瑞科相识', '喜爱饮酒且经常醉酒', '会用酒疗伤', '常把别人叫他的名字误听成“handsome”', '饲养捕获等级31的海豹豹利奇'],
    source: 'https://kitsu.io/characters/mansam',
  },
  41400: {
    traits: ['15岁', '身高167厘米', '体重55千克', '夜见山北中学三年三班学生', '1998年5月转入三年三班', '榊原家独子', '生母在生下他后去世', '患有气胸并因此缺课一个月', '因缺课而不知见崎鸣当年被班级视作“不存在”', '对见崎鸣感到好奇并试图与她交朋友'],
    source: 'https://kitsu.io/characters/kouichi-sakakibara',
  },
  41402: {
    traits: ['15岁', '身高152厘米', '夜见山北中学三年三班学生', '性格神秘而孤僻', '左眼常被眼罩遮住', '经常独自画画', '曾被班级当作“不存在”的人', '左眼为人偶眼', '人偶眼能看见将死或已死之人'],
    source: 'https://kitsu.io/characters/mei-misaki',
  },
  41900: {
    traits: ['《美食的俘虏》动画原创角色', '电视台记者', '主持每集片尾的“美食新闻”节目', '镜头前显得开朗谦逊', '私下意志坚定', '头脑聪明且要求严格', '为获得独家新闻会积极追踪特瑞科', '热爱美食', '遇到惊艳料理时会难以保持冷静', '曾在漫画第145话客串'],
    source: 'https://kitsu.io/characters/tina-b5790fc6-0d13-460f-96b4-c616994c6b95',
  },
  43009: {
    traits: ['高仓家中年纪最小的妹妹', '性格开朗', '非常爱护两位哥哥', '常以微笑掩饰病情以免哥哥担心', '出院后在水族馆昏倒并死亡', '戴上水族馆纪念品企鹅帽后复活', '戴帽后会变成水晶公主且性格改变', '童年曾与雏菊和光组成偶像团体Triple H', '离开学校后与旧友断了联系', '与晶马和冠叶并无血缘关系', '幼时被母亲遗弃后由高仓家收养'],
    source: 'https://kitsu.io/characters/himari-takakura',
  },
  43334: {
    traits: ['生日为1995年3月20日', '双鱼座', '双胞胎兄弟中较严肃冷峻的一位', '为取得企鹅鼓愿意使用各种手段', '红发', '比弟弟更受女性欢迎', '过去曾与女生交往后又将对方甩掉', '似乎对阳毬抱有感情', '作为长子负责维持家庭经济与生活', '为让阳毬活下去而展现强烈执念'],
    source: 'https://kitsu.io/characters/kanba-takakura',
  },
  43335: {
    traits: ['生日为1995年3月20日', '双鱼座', '比哥哥更单纯', '不愿做道德含糊的事', '受命取得荻野目苹果的日记并误以为它是企鹅鼓', '陪伴苹果实施跟踪计划', '多次试图充当苹果的良知', '对父母造成的惨案怀有负罪感', '日记遗失后因自责而疏远苹果', '曾从儿童粉碎机救出被遗弃的阳毬并带她回家'],
    source: 'https://kitsu.io/characters/shouma-takakura',
  },
  43385: {
    traits: ['生日为1995年3月20日', '双鱼座', '与兄弟们受命监视的对象', '出生当天姐姐桃果去世', '家庭因此破裂', '与母亲一同生活', '持有姐姐桃果留下的预言日记', '曾试图扮成桃果以让家庭复合', '会不顾代价地促成日记所写事件', '起初声称与多蕗是命中注定的一对', '后来意识到自己喜欢晶马'],
    source: 'https://kitsu.io/characters/ringo-oginome',
  },
}

const ids = Object.keys(updates).map(Number)
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const fullById = new Map(local.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
for (const id of ids) {
  if (!fullById.has(id) || !slimById.has(id) || updates[id].traits.length < 8) throw new Error(`角色 ${id} 的本地记录或特征不合格`)
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
  const localRow = fullById.get(id)
  const remoteRow = remoteById.get(id)
  for (const key of ['name', 'anime_title', 'nicknames', 'traits']) {
    if (JSON.stringify(localRow[key] ?? null) !== JSON.stringify(remoteRow[key] ?? null)) throw new Error(`角色 ${id} 的本地与 Supabase ${key} 不一致，停止写入`)
  }
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

const readbackResult = await db.from('characters').select('id,traits,search_text').in('id', ids)
if (readbackResult.error) throw readbackResult.error
const savedById = new Map((readbackResult.data || []).map((row) => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const payload of payloads) {
  const saved = savedById.get(payload.id)
  if (JSON.stringify(saved.traits) !== JSON.stringify(payload.traits) || saved.search_text !== payload.search_text || saved.search_text.includes(fullById.get(payload.id).description)) throw new Error(`角色 ${payload.id} 回读校验失败`)
  fullById.get(payload.id).traits = saved.traits
  fullById.get(payload.id).search_text = saved.search_text
  slimById.get(payload.id).traits = saved.traits
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of local) lines.push([
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
fs.writeFileSync(`${root}/followup-traits-round3.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
