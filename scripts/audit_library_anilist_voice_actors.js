import fs from 'node:fs'
import path from 'node:path'

const recordsPath = 'data/characters_full.json'
const outputDir = 'data/anime_update_drafts/library-audit-2026-10-13'
const outputPath = path.join(outputDir, 'anilist-voice-media.json')
const checkpointPath = path.join(outputDir, 'anilist-voice-media.checkpoint.json')
const perPage = 25
const delayMs = 800
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const records = JSON.parse(fs.readFileSync(recordsPath, 'utf8'))
const targets = records.filter(row => {
  const actors = row.voice_actors || []
  return !actors.length || actors.some(actor => /暂未收录|待补|未知/.test(actor.name) || !actor.image)
})
const ids = [...new Set(targets.map(row => Number(row.id)).filter(Number.isInteger))].sort((a, b) => a - b)
const cached = fs.existsSync(checkpointPath) ? JSON.parse(fs.readFileSync(checkpointPath, 'utf8')) : {}
const pending = ids.filter(id => !cached[id])
const batches = Array.from({ length: Math.ceil(pending.length / perPage) }, (_, i) => pending.slice(i * perPage, (i + 1) * perPage))

async function request(batch) {
  const query = `query{Page(page:1,perPage:${perPage}){characters(id_in:[${batch.join(',')}],sort:ID){id name{full native} media(type:ANIME,perPage:50){edges{node{id title{romaji english native} countryOfOrigin} characterRole voiceActors(language:JAPANESE){id name{full native} image{large}}}}}}}`
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query }),
    })
    if (response.status === 429 && attempt < 4) {
      const seconds = Number(response.headers.get('retry-after'))
      const waitMs = Math.max(60_000, Number.isFinite(seconds) ? seconds * 1000 : 0)
      console.log(`AniList 限流，等待 ${Math.ceil(waitMs / 1000)} 秒后继续`)
      await wait(waitMs)
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
    const body = await response.json()
    if (body.errors?.length) throw new Error(JSON.stringify(body.errors))
    return body.data?.Page?.characters || []
  }
  throw new Error('AniList 重试次数已用完')
}

fs.mkdirSync(outputDir, { recursive: true })
console.log(`AniList 声优对照：${targets.length} 位人物，尚未缓存 ${pending.length} 位`)
for (let index = 0; index < batches.length; index++) {
  const batch = batches[index]
  const results = await request(batch)
  for (const character of results) cached[character.id] = character
  const received = new Set(results.map(x => x.id))
  const absent = batch.filter(id => !received.has(id))
  if (absent.length) console.log(`本页 AniList 未返回 ${absent.length} 个 ID：${absent.join(',')}`)
  if ((index + 1) % 5 === 0 || index === batches.length - 1) {
    fs.writeFileSync(checkpointPath, JSON.stringify(cached))
    console.log(`已核对 ${Math.min((index + 1) * perPage, pending.length)} / ${pending.length} 位`)
  }
  if (index + 1 < batches.length) await wait(delayMs)
}

fs.writeFileSync(outputPath, JSON.stringify({ fetchedAt: new Date().toISOString(), targetCharacters: targets.length, returned: Object.keys(cached).length, characters: cached }, null, 2))
fs.rmSync(checkpointPath, { force: true })
console.log(`声优对照资料已保存：${outputPath}（${Object.keys(cached).length} 人）`)
