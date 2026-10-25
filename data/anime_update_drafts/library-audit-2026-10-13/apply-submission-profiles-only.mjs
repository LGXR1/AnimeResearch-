import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const profiles = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles.json`, 'utf8')).profiles
const updates = new Map([
  [182729, {
    description: '博士是罗德岛的战术指挥官，曾取得神经学博士学位并研究矿石病。失忆后，博士在切尔诺伯格由阿米娅救出，重新参与罗德岛的行动。虽然失去了对过去的记忆，博士仍能制定作战方案、指挥干员，并与阿米娅等人共同应对整合运动引发的危机。',
    traits: ['兜帽', '失忆', '罗德岛战术指挥官', '神经学博士', '曾研究矿石病', '由阿米娅从切尔诺伯格救出', '擅长制定战术', '指挥罗德岛干员'],
  }],
  [234805, {
    description: '远山文乃是岩仓美津未的童年好友，住在两人故乡所在的石川县。美津未前往东京读高中后，文乃仍留在石川。虽然两人相隔两地，她们一直保持亲密的朋友关系，经常通过视频通话分享近况，也会向对方倾诉心事。文乃是美津未离乡之后仍可联系、信赖的老朋友。',
    traits: ['棕发', '女性', '16岁', '岩仓美津未的童年好友', '住在石川县', '美津未去东京后仍留在石川', '与美津未保持远距离友情', '经常与美津未视频通话', '与美津未互相倾诉心事'],
  }],
  [320607, {
    description: '梅洛斯是《异世界失格》中安妮特的使魔，拥有变换形态的能力。“梅洛斯”这个名字由被称为“老师”的主角所取。它并非与老师同行的人类青年，而是以使魔身份登场的非人类角色。',
    traits: ['安妮特的使魔', '非人类生物', '能够变换形态', '由老师命名为梅洛斯'],
  }],
  [222105, {
    description: '矢薙索尼娅是《歌愈少女》中的一年级高中生，与藤井佳奈在同一所学校就读。她有白色头发和蓝色眼睛，在故事中以佳奈的同校学生身份登场。',
    traits: ['女性', '高中一年级生', '与藤井佳奈同校', '白发', '蓝瞳'],
  }],
  [252292, {
    description: '干蛇（姦姦蛇螺，Kankandara）是《里世界郊游》中的角色，由伊藤静担任日语配音。角色形象呈黑发红瞳。',
    traits: ['黑发', '红瞳'],
  }],
])

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('Missing write credentials')
const ids = [...updates.keys()]
const { data: remote, error } = await db.from('characters').select('id,name,anime_title,description,nicknames,traits,search_text,voice_actors(name)').in('id', ids)
if (error || remote.length !== ids.length) throw new Error(`Preflight read failed: ${error?.message || 'missing rows'}`)
const current = new Map(remote.map(row => [row.id, row]))
const plan = []
for (const id of ids) {
  const row = current.get(id)
  const original = local.find(item => item.id === id)
  const target = updates.get(id)
  if (!profiles[String(id)] || !original || row.name !== original.name || row.anime_title !== original.anime_title
    || row.description !== original.description || JSON.stringify(row.traits) !== JSON.stringify(original.traits)
    || row.search_text !== original.search_text) throw new Error(`Preflight mismatch: ${id}`)
  const search_text = [row.name, row.anime_title, ...row.nicknames, ...target.traits, ...row.voice_actors.map(actor => actor.name)].join(' ')
  if (search_text.includes(target.description)) throw new Error(`Description in search: ${id}`)
  plan.push({ id, ...target, search_text })
}
fs.writeFileSync(`${root}/submission-profiles-backup.json`, JSON.stringify({ capturedAt: new Date().toISOString(), characters: remote }, null, 2))
for (const update of plan) {
  const { error: writeError } = await db.from('characters').update({ description: update.description, traits: update.traits, search_text: update.search_text }).eq('id', update.id)
  if (writeError) throw new Error(`Write failed: ${update.id}: ${writeError.message}`)
}
const { data: verified, error: verifyError } = await db.from('characters').select('id,description,traits,search_text').in('id', ids)
if (verifyError) throw new Error(`Readback failed: ${verifyError.message}`)
for (const target of plan) {
  const row = verified.find(item => item.id === target.id)
  if (!row || row.description !== target.description || JSON.stringify(row.traits) !== JSON.stringify(target.traits) || row.search_text !== target.search_text) throw new Error(`Readback mismatch: ${target.id}`)
}
fs.writeFileSync(`${root}/submission-profiles-report.json`, JSON.stringify({ syncedAt: new Date().toISOString(), verifiedIds: ids, sources: ids.map(id => `https://anilist.co/character/${id}`), stillShortOrSparse: [222105, 252292, 320607] }, null, 2))
console.log(JSON.stringify({ verifiedProfiles: ids.length, stillShortOrSparse: [222105, 252292, 320607] }))
