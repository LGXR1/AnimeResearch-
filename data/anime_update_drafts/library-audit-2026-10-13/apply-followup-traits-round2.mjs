import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error('缺少 Supabase 本地环境变量')
}

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  28202: {
    traits: ['25岁', '克里斯纳王国国王', '西姬的丈夫', '军校时期结识莱卡特与杰斯', '曾为救猫头鹰逃课', '军校学业成绩较差', '本人不愿当国王', '努力承担国王职责', '重视克里斯纳人民的生命'],
    source: 'https://kitsu.io/characters/hodr',
  },
  28203: {
    traits: ['25岁', '阿萨斯士兵', '优秀的机动兵器驾驶员', '军校时成绩出色', '被称为“守规矩的杰斯”', '得知阿萨斯计划征服克里斯纳后率先遣队行动', '试图让赫兹尔尽快投降以保护克里斯纳', '起初不知道阿萨斯高层要处决王族', '已婚', '有一名两岁女儿'],
    source: 'https://kitsu.io/characters/zess',
  },
  28360: {
    traits: ['南條辉正之子', '接手父亲在新岛的诊所', '父亲于1986年去世后继承诊所', '家人对父亲之死十分敏感', '不满媒体轻率呈现六轩岛惨案', '面对案件相关询问时起初沉默', '接受右代宫缘寿对事件的询问', '因缘寿同为失去家人的受害者而逐渐愿意倾诉'],
    source: 'https://kitsu.io/characters/masayuki-nanjo',
  },
  28361: {
    traits: ['客船船长', '驾驶高速船往返六轩岛', '负责运送右代宫家族往返六轩岛', '1986年惨案后因未能及时接走家族而自责', '当时台风阻止船只出航', '即使受天气阻碍仍把未能接人的经历归咎自身', '1998年同意载送右代宫缘寿前往六轩岛', '希望缘寿能在岛上找到事件的了结'],
    source: 'https://kitsu.io/characters/captain-kawabata',
  },
  28522: {
    traits: ['鑢七花流当代掌门', '由前掌门父亲严格训练', '不使用鑢七花流也能战胜挑战者', '为流派创出新招', '关心健康不佳的姐姐鑢七实', '经常替姐姐做杂务', '喜欢咎梅', '随咎梅收集十二把变体刀', '自称不善思考但并不天真', '能察觉周围局势'],
    source: 'https://kitsu.io/characters/shichika-yasuri',
  },
  28523: {
    traits: ['自称幕府军师', '体能较弱', '头脑出众', '没落大名之女', '真实姓名为容赦（Yousha）', '被称为奥州公主', '拥有特殊眼睛', '与七花同行收集十二把变体刀', '留有极长白发', '摔倒时会说“嘎噗”', '习惯边打七花边喊“cheerio”', '在动画结局中死亡'],
    source: 'https://kitsu.io/characters/togame',
  },
  28558: {
    traits: ['真庭忍军成员', '七花遇到的第一位真庭忍者', '名字意为蝙蝠', '衣着模仿蝙蝠', '持有变体刀“铚”', '能把刀吞入体内保护', '能变成其他人的模样', '变身后可复制对方的外表与能力'],
    source: 'https://kitsu.io/characters/koumori-maniwa',
  },
  29053: {
    traits: ['CMAP最受欢迎的成员', '红色蓬乱发型', '睡眼惺忪', '尤其受到女性仰慕', '认真看待烹饪', '曾因扮演外国人而需要同时说英语和日语', '与东和马比赛落败后退出CMAP', '赛后友善对待东和马、冠茂与河内', '用针灸弥补比赛带来的麻烦'],
    source: 'https://kitsu.io/characters/takumi-tsubozuka',
  },
  29057: {
    traits: ['奥地利宫廷厨师', '冠茂同父异母的兄长', '专长是果酱', '参加过Yakitate!! 25／Yakitate!! 9比赛', '比赛决定谁继承父亲的黑道组织', '有强烈自卑感', '不服输', '嫉妒冠茂并认为对方过得更轻松'],
    source: 'https://kitsu.io/characters/masanobu-tsutsumi',
  },
  29108: {
    traits: ['14岁', '身高158厘米', '生日为6月11日', '血型B型', '圣玛丽学园学生', '与天野莓同寝室', '是莓的好友', '性格善良', '莓遭到同学欺负时会维护她'],
    source: 'https://kitsu.io/characters/rumi-katou',
  },
  29447: {
    traits: ['12岁', '身高153厘米', '机动兵器驾驶员', '学习速度快', '有时笨拙且思考较慢', '自述擅长料理、洗衣和站岗', '与李同上军校并提前毕业', '两年完成通常需六年的军校课程', '曾误以为琉格特杀害李而想报仇', '在战斗中展现出色的驾驶技术', '为掩护杰斯撤退而被俘', '被俘后与西姬成为朋友'],
    source: 'https://kitsu.io/characters/cleo-zaubraff',
  },
  29513: {
    traits: ['24岁', '身高165厘米', '克里斯纳女性重骑士', '幼年与兄弟一同成为孤儿', '在True将军经营的孤儿院长大', '尊敬True将军并视其为父亲', '加入克里斯纳军队', '奉国王命令调入特别部队'],
    source: 'https://kitsu.io/characters/narvi-stryze',
  },
  29604: {
    traits: ['17岁', '身高165厘米', '血型A型', '圣玛丽学园学生会长', '是亨利·卢卡斯最欣赏的学生', '以糕点制作天才闻名', '糕点作品曾获奖', '关注天野莓的味觉天赋'],
    source: 'https://kitsu.io/characters/mari-tennouji',
  },
  30141: {
    traits: ['克里斯纳将军', '性情急躁', '经常不作战术规划就直接冲入战场', '行动常给部下带来麻烦', '受到克里斯纳民众爱戴', '将个人所有钱财捐给孤儿院', '亲自照顾孤儿院的孩子', '曾照顾娜尔薇与奈尔'],
    source: 'https://kitsu.io/characters/true',
  },
  30159: {
    traits: ['甜点精灵', '最初没有人类搭档', '由卡西等人邀请到人间', '被带到圣玛丽学园寻找搭档', '希望与人类搭档制作甜点', '香草、巧克力、咖啡和焦糖建议她与宫小路组队', '初见宫小路时因他的倦怠态度而拒绝', '看到宫小路挑战天王寺麻里后改变主意并与其搭档'],
    source: 'https://kitsu.io/characters/marron-422e5e30-7926-4e73-a492-0e88becd7fff',
  },
}

const ids = Object.keys(updates).map(Number)
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const localById = new Map(local.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
if (ids.some((id) => !localById.has(id) || !slimById.has(id))) throw new Error('本地导出缺少待更正角色')
for (const [idText, item] of Object.entries(updates)) {
  if (item.traits.length < 8 || new Set(item.traits).size !== item.traits.length) throw new Error(`角色 ${idText} 的特征数量或重复项不合格`)
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
  const localRow = localById.get(id)
  const remoteRow = remoteById.get(id)
  for (const key of ['name', 'anime_title', 'nicknames', 'traits']) {
    if (JSON.stringify(localRow[key] ?? null) !== JSON.stringify(remoteRow[key] ?? null)) {
      throw new Error(`角色 ${id} 的本地与 Supabase ${key} 不一致，停止写入`)
    }
  }
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const names = actorsById.get(Number(actor.character_id)) || []
  names.push(actor.name)
  actorsById.set(Number(actor.character_id), names)
}
const payloads = ids.map((id) => {
  const row = localById.get(id)
  const traits = updates[id].traits
  const search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...traits, ...(actorsById.get(id) || [])].join(' ')
  return { id, traits, search_text }
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
  if (JSON.stringify(saved.traits) !== JSON.stringify(payload.traits) || saved.search_text !== payload.search_text || saved.search_text.includes(localById.get(payload.id).description)) {
    throw new Error(`角色 ${payload.id} 回读校验失败`)
  }
  localById.get(payload.id).traits = saved.traits
  localById.get(payload.id).search_text = saved.search_text
  slimById.get(payload.id).traits = saved.traits
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const header = 'id,name,anime_title,image,description,nicknames,traits,voice_actors'
const lines = [header]
for (const row of local) {
  lines.push([
    row.id,
    row.name,
    row.anime_title,
    row.image,
    row.description,
    (row.nicknames || []).join('|'),
    (row.traits || []).join('|'),
    (row.voice_actors || []).map((actor) => actor.name).join(','),
  ].map(csvField).join(','))
}
fs.writeFileSync('data/characters.csv', `\uFEFF${lines.join('\n')}\n`)

const updatedAt = new Date().toISOString()
for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = ids.filter((id) => (report.checkedIds || []).map(Number).includes(id))
  if (!batchIds.length) continue
  report.pendingTraitVerificationIds = (report.pendingTraitVerificationIds || []).filter((id) => !batchIds.includes(Number(id)))
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...batchIds])]
  report.localFollowup ||= {}
  report.localFollowup.traitCorrections ||= {}
  for (const id of batchIds) report.localFollowup.traitCorrections[id] = { source: updates[id].source, correctedAt: updatedAt, readbackVerified: true }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const evidence = {
  correctedAt: updatedAt,
  count: ids.length,
  ids,
  sources: Object.fromEntries(ids.map((id) => [id, updates[id].source])),
  supabaseReadbackVerified: true,
  searchIndexVerifiedForAllIds: true,
  introExcludedFromSearch: true,
}
fs.writeFileSync(`${root}/followup-traits-round2.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
