import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const file = process.argv.find(x => x.startsWith('--file='))?.slice(7)
if (!file) throw new Error('用 --file=... 指定已核对的角色资料')
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少本地数据库环境变量')
const { groups } = await import(pathToFileURL(path.resolve(file)).href)
const sourceDir = process.argv.find(x => x.startsWith('--source-dir='))?.slice(13) || 'data/anime_update_drafts'
const requested = process.argv.find(x => x.startsWith('--media='))?.slice(8).split(',').map(Number)
const completion = process.argv.includes('--complete')
const skipExisting = process.argv.includes('--skip-existing')
const selected = requested ? groups.filter(x => requested.includes(x.mediaId)) : groups
if (!selected.length || (requested && selected.length !== requested.length)) throw new Error('指定作品不存在')
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
// AniList 的旧头像沿用旧式数字图片地址；staff API ID 可能比图片编号多 95000。
const validAnilistImage = (url, bucket, id) => {
  const imageIds = bucket === 'staff' && id > 95000 ? `${id}|${id - 95000}` : String(id)
  if (typeof url !== 'string') return false
  const hashed = new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/${bucket}/large/[bn]?(?:${imageIds})-[a-z0-9_-]+\\.(?:png|jpe?g|webp)$`, 'i')
  const legacy = new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/${bucket}/large/(?:${bucket === 'staff' && id > 95000 ? id - 95000 : id})\\.jpe?g$`, 'i')
  const legacyCharacter = bucket === 'character' && new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/character/large/${id}\\.jpe?g$`, 'i').test(url)
  return hashed.test(url) || legacy.test(url) || legacyCharacter
}
const unique = xs => [...new Set(xs.filter(Boolean).map(x => x.trim()))]
const chunks = (xs, size = 100) => Array.from({ length: Math.ceil(xs.length / size) }, (_, i) => xs.slice(i * size, (i + 1) * size))
const planned = []
const actors = []
const ids = new Set()
const titles = new Set()
const aliases = new Set()
const searchableTraitById = new Map()

for (const group of selected) {
  if (titles.has(group.title)) throw new Error(`重复作品 ${group.title}`)
  if (group.characters.length < (completion ? 1 : 5)) throw new Error(`${group.title} 可核实角色数量不足`)
  titles.add(group.title)
  for (const title of [group.title, ...(group.titleAliases || [])]) aliases.add(title)
  const byId = new Map()
  const mediaIds = group.sourceMediaIds || [group.mediaId]
  let country
  for (const mediaId of mediaIds) {
    const snapshot = JSON.parse(fs.readFileSync(path.join(sourceDir, `anime-source-${mediaId}.json`), 'utf8'))
    if (snapshot.id !== mediaId) throw new Error(`作品快照ID不符 ${mediaId}`)
    country ||= snapshot.countryOfOrigin
    for (const edge of snapshot.characters) {
      const previous = byId.get(edge.node.id)
      if (previous) edge.voiceActors = [...previous.voiceActors, ...edge.voiceActors].filter((x, i, a) => a.findIndex(y => y.id === x.id) === i)
      byId.set(edge.node.id, edge)
    }
  }
  const names = new Set()
  for (const c of group.characters) {
    if (ids.has(c.id) || names.has(c.name)) throw new Error(`批内重复角色 ${c.id}/${c.name}`)
    ids.add(c.id); names.add(c.name)
    const source = byId.get(c.id)
    if (!source) throw new Error(`${c.name} 没有对应作品的AniList资料`)
    const variants = [c.name, ...c.nicknames].map(x => x.trim().toLowerCase())
    if (![source.node.name.full, source.node.name.native].filter(Boolean).some(x => variants.includes(x.toLowerCase()))) throw new Error(`${c.name} 名字与ID不匹配`)
    if (!validAnilistImage(source.node.image.large, 'character', c.id)) throw new Error(`${c.name} 角色图片不合格`)
    const vas = source.voiceActors.filter(x => validAnilistImage(x.image.large, 'staff', x.id)).map(va => {
      const correctedName = group.voiceActorNameCorrections?.[va.id]
      return correctedName ? { ...va, name: { ...va.name, native: correctedName } } : va
    })
    if (country !== 'CN' && !vas.length) throw new Error(`${c.name} 缺少可核实的日配图片`)
    const sourceAliases = source.node.name.alternative.filter(x => !(c.rejectedSourceAliases || []).includes(x))
    const nicknames = unique([c.name, source.node.name.full, source.node.name.native, ...sourceAliases, ...c.nicknames]).filter(x => !(c.rejectedSourceAliases || []).includes(x))
    const traits = unique(c.traits)
    const length = [...c.description].length
    if (traits.length < 8 || length < 100 || length > 200) throw new Error(`${c.name} 字段不合格，特征${traits.length}、简介${length}字`)
    const searchableTraits = traits.map(trait => group.characters
      .filter(other => other.id !== c.id && other.name.length > 1)
      .reduce((text, other) => text.replaceAll(other.name, ''), trait)
      .replace(/\s+/g, ' ')
      .trim()).filter(Boolean)
    searchableTraitById.set(c.id, searchableTraits)
    const vaNames = unique(vas.map(x => x.name.native || x.name.full))
    planned.push({ id: c.id, name: c.name, anime_title: group.title, image: source.node.image.large, description: c.description, nicknames, traits,
      search_text: [c.name, group.title, ...nicknames, ...searchableTraits, ...vaNames].join(' ') })
    for (const va of vas) actors.push({ character_id: c.id, name: (va.name.native || va.name.full).trim(), image: va.image.large, language: '日语' })
  }
}

const existing = new Map()
for (const list of chunks([...ids])) {
  const { data, error } = await client.from('characters').select('id,name,anime_title,image,description,nicknames,traits,search_text,voice_actors(name,image,language)').in('id', list).limit(1000)
  if (error) throw new Error(error.message)
  for (const row of data) existing.set(row.id, row)
}
const titleRows = []
for (const list of chunks([...aliases], 10)) {
  const { data, error } = await client.from('characters').select('id,name,anime_title,nicknames').in('anime_title', list).limit(1000)
  if (error) throw new Error(error.message)
  titleRows.push(...data)
  for (const row of data) if (!ids.has(row.id) && !completion) throw new Error(`作品已收录：${row.anime_title}/${row.name}`)
}
if (completion) {
  for (const group of selected) {
    const groupTitles = [group.title, ...(group.titleAliases || [])]
    const rows = titleRows.filter(x => groupTitles.includes(x.anime_title))
    if (!rows.length) throw new Error(`补全模式要求作品已存在：${group.title}`)
    for (const expected of planned.filter(x => x.anime_title === group.title)) {
      const variants = new Set([expected.name, ...expected.nicknames].map(x => x.trim().toLowerCase()))
      const duplicate = rows.find(x => {
        const pending = planned.find(y => y.id === x.id) || x
        return x.id !== expected.id && [pending.name, ...(pending.nicknames || [])].some(n => variants.has(n.trim().toLowerCase()))
      })
      if (duplicate) throw new Error(`同作品名字或别名重复：${expected.name}/${duplicate.name}`)
    }
  }
}
const exact = (row, expected) => ['name', 'anime_title', 'image', 'description', 'search_text', 'nicknames', 'traits'].every(k => JSON.stringify(row[k]) === JSON.stringify(expected[k]))
const modified = planned.filter(row => existing.has(row.id) && !exact(existing.get(row.id), row))
for (const row of modified) {
  const old = existing.get(row.id)
  if (skipExisting) {
    if (old.name !== row.name) throw new Error(`AniList角色ID已存在但中文名不一致：${row.id}/${old.name}/${row.name}`)
    continue
  }
  const identityCorrection = selected.some(g => g.characters.some(c => c.id === row.id && c.correctsPreviousNames?.includes(old.name)))
  if (!process.argv.includes('--update') || (old.name !== row.name && !identityCorrection) || old.anime_title !== row.anime_title) throw new Error(`ID已经存在且资料不同：${row.id}/${old.name}/${old.anime_title}`)
}
const fresh = planned.filter(x => !existing.has(x.id))
if (skipExisting && !completion) {
  for (const group of selected) {
    const newCount = fresh.filter(x => x.anime_title === group.title).length
    if (newCount < 5) throw new Error(`${group.title} 去除已收录角色后只剩 ${newCount} 位新角色，低于每部至少5位的要求`)
  }
}
const missingActors = actors.filter(x => (!skipExisting || !existing.has(x.character_id)) && !existing.get(x.character_id)?.voice_actors.some(v => v.name === x.name && v.image === x.image && v.language === x.language))
console.log(`预检通过：${selected.length} 部作品，${planned.length} 位候选角色；待新增 ${fresh.length} 人、跳过已收录 ${skipExisting ? planned.length - fresh.length : 0} 人、待新增 ${missingActors.length} 条日配`)
if (!process.argv.includes('--write')) process.exit(0)

for (const list of chunks(fresh)) {
  const { error } = await client.from('characters').insert(list)
  if (error) throw new Error(`角色写入失败：${error.message}`)
}
for (const list of chunks(skipExisting ? [] : modified)) {
  const { error } = await client.from('characters').upsert(list, { onConflict: 'id' })
  if (error) throw new Error(`资料更新失败：${error.message}`)
}
for (const list of chunks(missingActors)) {
  const { error } = await client.from('voice_actors').insert(list)
  if (error) throw new Error(`声优写入失败，可重跑本脚本补齐：${error.message}`)
}
const placeholderCorrections = modified.filter(row => selected.some(g => g.characters.some(c => c.id === row.id && c.replacePlaceholderVoiceActors)))
for (const row of placeholderCorrections) {
  const { error } = await client.from('voice_actors').delete().eq('character_id', row.id).eq('name', '暂未收录').eq('image', '')
  if (error) throw new Error(`占位声优清理失败：${error.message}`)
}
const readback = []
const verifiedIds = skipExisting ? fresh.map(x => x.id) : [...ids]
for (const list of chunks(verifiedIds)) {
  const { data, error } = await client.from('characters').select('id,name,anime_title,image,description,nicknames,traits,search_text,voice_actors(name,image,language)').in('id', list).limit(1000)
  if (error) throw new Error(error.message)
  readback.push(...data)
}
const expectedReadbackCount = skipExisting ? fresh.length : planned.length
if (readback.length !== expectedReadbackCount) throw new Error(`回读数量不符 ${readback.length}/${expectedReadbackCount}`)
for (const row of readback) {
  const expected = planned.find(x => x.id === row.id)
  if (!exact(row, expected) || row.search_text.includes(row.description)) throw new Error(`角色回读不一致 ${row.id}`)
  for (const va of actors.filter(x => x.character_id === row.id)) {
    if (!row.voice_actors.some(x => x.name === va.name && x.image === va.image && x.language === va.language)) throw new Error(`声优回读不一致 ${row.id}/${va.name}`)
  }
}
for (const group of selected) {
  const row = (skipExisting ? fresh : planned).find(x => x.anime_title === group.title)
  if (!row) throw new Error(`${group.title} 没有可供搜索校验的新角色`)
  for (const term of [row.name, row.nicknames.find(x => /[a-z]/i.test(x)) || row.nicknames[0], searchableTraitById.get(row.id)?.[0]]) {
    const { data, error } = await client.from('characters').select('id').eq('id', row.id).ilike('search_text', `%${term}%`).limit(1000)
    if (error || data.length !== 1) throw new Error(`${group.title} 搜索校验失败：${term}`)
  }
}
const report = { verifiedAt: new Date().toISOString(), curatedFile: file, anime: selected.map(x => ({ id: x.mediaId, title: x.title, count: x.characters.length, insertedCount: fresh.filter(c => c.anime_title === x.title).length, excluded: x.excluded || [], references: x.references || [] })), insertedCharacters: fresh.length,
  skippedExistingCharacters: skipExisting ? planned.length - fresh.length : 0, insertedVoiceActors: missingActors.length, updatedCharacters: skipExisting ? 0 : modified.length, verifiedCharacters: readback.length, verifiedVoiceActors: actors.filter(x => verifiedIds.includes(x.character_id)).length }
fs.writeFileSync(`${file}.report.json`, JSON.stringify(report, null, 2))
const historyPath = `${file}.writes.json`
const history = fs.existsSync(historyPath) ? JSON.parse(fs.readFileSync(historyPath, 'utf8')) : []
history.push(report)
fs.writeFileSync(historyPath, JSON.stringify(history, null, 2))
console.log(`写入和回读通过：${readback.length} 人、${report.verifiedVoiceActors} 条日配；中文名、别名和特征搜索通过，简介不参与搜索`)
