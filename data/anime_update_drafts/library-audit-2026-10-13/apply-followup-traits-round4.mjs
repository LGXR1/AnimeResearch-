import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  31274: {
    traits: ['23岁', '生日为4月15日', '职业书法家', '因不满画廊负责人批评其书法而动手打人', '被父亲安排到长崎县五岛列岛“避风头”', '在岛上与居民相处后逐渐找到个人风格', '与少女琴石奈留关系亲近', '奈留起初叫他“Junon Boy”', '后来奈留称他为“老师”', '前传漫画《半田君传说》中是高中生偶像与书法神童', '曾误以为同学敬仰他的举动代表排斥'],
    source: 'https://kitsu.io/characters/seishuu-handa',
  },
  31667: {
    traits: ['15岁', '网球新手', '勤奋好学', '有些完美主义', '考试总得全优而被称为“荣酱”', '以显眼的鸡冠状发型闻名', '体能较弱后加入南网球社', '起初需要补习网球基础', '逐渐能与县大赛种子选手较量', '曾赴佛罗里达强化训练', '后来击败世界排名前1000的职业选手Alex', '喜欢同社员高崎奈津'],
    source: 'https://kitsu.io/characters/eiichirou-maruo',
  },
  32008: {
    traits: ['Night Kids车队成员', '驾驶红色本田Civic SiR-II（EG6）', 'Night Kids第二快的车手', '常以轻撞对手的方式使其失控', '不喜欢普通下坡赛', '偏好自己提出的“胶带死亡赛”', '认为中里毅不适合领导Night Kids', '本人觊觎车队领队位置', '是Impact Blue导航员佐月的儿时玩伴'],
    source: 'https://kitsu.io/characters/shingo-shoji',
  },
  34715: {
    traits: ['长期从事拳击的老人', '鹰村守与幕之内一步的教练鸭川源二的旧友', '与鸭川是长期好友和宿敌', '隐居在山中', '与爱犬八公生活', '仍持续关注拳击比赛', '会录影带回看比赛', '协助训练鸭川拳馆的拳手', '曾在鸭川拳馆训练新人', '年轻时以野性直觉和快速反应见长'],
    source: 'https://kitsu.io/characters/ginpachi-nekota',
  },
  34973: {
    traits: ['居住在东京的水母爱好者', '立志成为插画家', '受已故母亲影响而喜爱水母', '熟悉多种水母', '天水馆居民中唯一知道鲤渊藏之介真实性别的人', '面对时髦人士容易紧张僵住', '饲养一只名叫克拉拉的斑点水母', '喜欢修·鲤渊', '对女装状态的藏之介较自在', '面对男装状态的藏之介时会紧张'],
    source: 'https://kitsu.io/characters/tsukimi-kurashita',
  },
  35476: {
    traits: ['出身富有的政治世家', '常以“Kurako”之名在天水馆居民面前隐藏性别', '喜欢女装打扮', '对从政没有兴趣', '希望进入时尚行业', '一直寻找母亲留下的地址', '想再次见到母亲珍藏的衣橱', '帮助月海救回水母克拉拉', '此后频繁探望月海', '逐渐意识到自己喜欢月海'],
    source: 'https://kitsu.io/characters/kuranosuke-koibuchi',
  },
  36885: {
    traits: ['资深拳击记者', '熟悉各拳手近况', '从一步与宫田一郎第二次试合起追踪一步生涯', '常被视作一步最早的支持者之一', '会到鸭川拳馆提供对手情报', '报道过一步参加的新人王赛', '为人随和', '常显得不修边幅且像刚睡醒', '与鹰村守和伊达英二相熟', '曾多次尝试戒烟'],
    source: 'https://kitsu.io/characters/minoru-fujii',
  },
  37067: {
    traits: ['赤城RedSuns车队年轻成员', '车队内排名第三的车手', '驾驶橙红色日产Silvia Q’s Aero（S14）', '崇拜高桥启介', '急于向启介证明自己', '驾驶技术曾获启介认可', '擅长雨天路况', '曾经常在雨中练习以减少轮胎磨损', '曾在雨战中挑战藤原拓海但落败', 'Project D时期负责驾驶二号面包车', '负责预先勘察并记录赛道'],
    source: 'https://kitsu.io/characters/kenta-nakamura',
  },
  37069: {
    traits: ['Project D副手与协调人', '负责安排并组织与其他车队的对决', '会为车队勘察比赛路线', '担任高桥凉介的执行助理', '曾在赤城RedSuns担任相同工作', 'Project D活动时通常驾驶一号面包车', '个人用车曾出现过丰田MR2（SW20）', '高桥启介曾给他起外号“Shiko”'],
    source: 'https://kitsu.io/characters/fumihiro',
  },
  37074: {
    traits: ['21至22岁', '驾驶白色日产180SX Type X（RPS13）', '池谷浩一郎的朋友', 'Speed Stars前三名车手之一', '常去池谷、拓海和树工作的加油站', '会与池谷和佑一讨论汽车及驾驶技术', '敬重Speed Stars领队池谷', '仰慕藤原拓海的驾驶技术', '常带汽车杂志和赛车消息到加油站'],
    source: 'https://kitsu.io/characters/kenji-2eaedf8d-c351-4cd6-bb0d-18e2f8cd191b',
  },
  39199: {
    traits: ['松前绪花的母亲', '职业作家', '与自己的母亲关系紧张', '拒绝继承喜翠庄', '离开家后由母亲和弟弟经营旅馆', '曾与男友交往', '男友欠债后她在夜间离开原本生活', '因不适合照顾绪花而将女儿送到外婆的旅馆', '在喜翠庄员工间有着鲜明名声'],
    source: 'https://kitsu.io/characters/satsuki-matsumae',
  },
  41133: {
    traits: ['四名“美食人间国宝”之一', '传奇料理人', '在美食镇经营餐厅', '顾客通常需要等待十年才能入店', '首位成功处理河豚鲸而未破坏食材的人', '曾尝试重现世纪浓汤', '邀请特瑞科与小松协助完成世纪浓汤', '过去曾与敲击大师次郎搭档', '实力强大', '与一龙及美食会首领均有交情'],
    source: 'https://kitsu.io/characters/setsuno',
  },
}

const ids = Object.keys(updates).map(Number)
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const fullById = new Map(full.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
for (const id of ids) if (!fullById.has(id) || !slimById.has(id) || updates[id].traits.length < 8) throw new Error(`角色 ${id} 的本地记录或特征不合格`)

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
fs.writeFileSync(`${root}/followup-traits-round4.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
