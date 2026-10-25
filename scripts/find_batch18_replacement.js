import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少本地数据库环境变量')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const norm = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
const existingIds = new Set()
const knownTitles = new Set()
for (let offset = 0; ; offset += 1000) {
  const { data, error } = await supabase.from('characters').select('id,anime_title').order('id').range(offset, offset + 999)
  if (error) throw new Error(error.message)
  for (const row of data) { existingIds.add(row.id); knownTitles.add(norm(row.anime_title)) }
  if (data.length < 1000) break
}
const root = 'data/anime_update_drafts'
const selection = JSON.parse(fs.readFileSync(`${root}/batch18-selection.json`, 'utf8')).anime
const currentIds = new Set(selection.map(x => x.mediaId))
const currentCharacters = new Set()
for (const item of selection) {
  const snapshot = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  for (const edge of snapshot.characters || []) currentCharacters.add(edge.node.id)
}
const candidates = JSON.parse(fs.readFileSync(`${root}/batch18-candidates.json`, 'utf8')).candidatePool.filter(x => !currentIds.has(x.id))
const request = async query => {
  const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ query }) })
  if (!response.ok) throw new Error(`AniList HTTP ${response.status}`)
  const body = await response.json()
  if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
  return body.data
}
const found = []
for (let offset = 0; offset < candidates.length && found.length < 15; offset += 40) {
  const batch = candidates.slice(offset, offset + 40)
  const result = await request(`query{Page(page:1,perPage:50){media(id_in:[${batch.map(x => x.id).join(',')}],type:ANIME){id characters(sort:FAVOURITES_DESC,page:1,perPage:25){pageInfo{total}edges{node{id image{large}}voiceActors(language:JAPANESE){id image{large}}}}}}}`)
  const byId = new Map(result.Page.media.map(x => [x.id, x]))
  for (const media of batch) {
    const details = byId.get(media.id)
    if (!details) continue
    const edges = details.characters.edges || []
    const ids = edges.map(x => x.node.id)
    const titleNames = [media.title.english, media.title.romaji, media.title.native, ...(media.synonyms || [])].filter(Boolean).map(norm)
    if (titleNames.some(x => knownTitles.has(x))) continue
    if (ids.some(id => existingIds.has(id) || currentCharacters.has(id))) continue
    const voiceable = edges.filter(x => x.node.image?.large && x.voiceActors?.some(v => v.image?.large)).length
    if (details.characters.pageInfo.total < 5 || voiceable < 5) continue
    found.push({ id: media.id, english: media.title.english, romaji: media.title.romaji, native: media.title.native,
      chineseAliases: (media.synonyms || []).filter(x => /\p{Script=Han}/u.test(x)), genres: media.genres,
      characters: edges.length, total: details.characters.pageInfo.total, voiceable })
    if (found.length >= 15) break
  }
  await new Promise(resolve => setTimeout(resolve, 800))
}
console.log(`数据库作品记录 ${knownTitles.size} 部；检查候选 ${candidates.length} 部；符合条件替代项 ${found.length} 部`)
for (const item of found) console.log(JSON.stringify(item))
