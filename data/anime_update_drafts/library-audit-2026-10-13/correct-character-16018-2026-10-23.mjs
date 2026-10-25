import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const dir = 'data/anime_update_drafts/library-audit-2026-10-13'
const id = 16018
const actorId = 377
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).find(row => row.id === id)
const profile = JSON.parse(fs.readFileSync(`${dir}/anilist-character-profiles.json`, 'utf8')).profiles[id]
const media = JSON.parse(fs.readFileSync(`${dir}/anilist-voice-media.json`, 'utf8')).characters[id]
const staff = media?.media?.edges?.find(edge => edge.node?.id === 10087 && edge.node.countryOfOrigin === 'JP')?.voiceActors?.find(actor => actor.id === 106609)
if (!local || local.name !== '卫宫切嗣' || local.voice_actors.length !== 1 || local.voice_actors[0].id !== actorId ||
    profile?.name?.full !== 'Aoi Tohsaka' || profile?.name?.native !== '遠坂葵' ||
    staff?.name?.native !== '和泉忍' || !staff.image?.large?.includes('/n106609-')) throw new Error('身份或 AniList 来源校验失败')
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 写入环境变量')

const newRow = {
  name: '远坂葵',
  image: profile.image.large,
  anime_title: 'Fate系列',
  nicknames: ['Aoi Tohsaka', '遠坂葵', '葵'],
  traits: ['女性', '远坂时臣之妻', '远坂凛之母', '远坂樱之母', '间桐雁夜的青梅竹马', '婚后冠远坂姓', '知晓嫁入魔术师家族的意义', '对丈夫忠诚', '不干涉丈夫事务', '身高160厘米'],
  description: '远坂葵是《Fate/Zero》中远坂时臣的妻子，也是远坂凛和樱的母亲。她与间桐雁夜自幼相识，后来在知晓嫁入魔术师家族意味着什么的情况下接受时臣的求婚，并冠上远坂姓氏。葵性格温顺，信任丈夫，平时不介入他的事务；她与雁夜仍保持往来，女儿们也熟悉这位旧友。她的家庭关系与所作选择，是第四次圣杯战争故事中的一部分。',
}
if (newRow.description.length < 100 || newRow.description.length > 200 || newRow.traits.length < 8) throw new Error('新资料长度不足')
newRow.search_text = [newRow.name, newRow.anime_title, ...newRow.nicknames, ...newRow.traits, '和泉忍'].join(' ')

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const { data: current, error: charError } = await client.from('characters').select('*').eq('id', id).single()
const { data: actor, error: actorError } = await client.from('voice_actors').select('*').eq('id', actorId).single()
if (charError || actorError || !current || !actor || current.name !== local.name || current.description !== local.description ||
    actor.name !== '小山力也' || Number(actor.character_id) !== id || actor.image) throw new Error('线上记录与备份不一致')

const backupPath = `${dir}/character-16018-before-2026-10-23.json`
fs.writeFileSync(backupPath, JSON.stringify({ at: new Date().toISOString(), character: current, voice_actor: actor, source: ['https://anilist.co/character/16018', 'https://anilist.co/anime/10087'] }, null, 2))
const { data: updatedActor, error: updateActorError } = await client.from('voice_actors')
  .update({ name: '和泉忍', image: staff.image.large })
  .eq('id', actorId).eq('character_id', id).eq('name', actor.name).eq('image', '')
  .select('*').single()
if (updateActorError || updatedActor?.name !== '和泉忍' || updatedActor.image !== staff.image.large) throw new Error(`声优纠错未完成：${updateActorError?.message || ''}`)

const { data: updatedChar, error: updateCharError } = await client.from('characters')
  .update(newRow).eq('id', id).eq('name', current.name).eq('description', current.description)
  .select('*').single()
if (updateCharError || !updatedChar || updatedChar.name !== newRow.name || updatedChar.image !== newRow.image ||
    updatedChar.description !== newRow.description || updatedChar.search_text !== newRow.search_text) throw new Error(`人物纠错未完成：${updateCharError?.message || ''}`)

const reportPath = `${dir}/character-16018-correction-2026-10-23.json`
fs.writeFileSync(reportPath, JSON.stringify({ completedAt: new Date().toISOString(), id, actorId, oldName: current.name, newName: updatedChar.name, newVoiceActor: updatedActor.name, sourceCharacter: 'https://anilist.co/character/16018', sourceAnime: 'https://anilist.co/anime/10087', backupPath }, null, 2))
console.log(JSON.stringify({ id, oldName: current.name, newName: updatedChar.name, actor: updatedActor.name, reportPath, backupPath }))
