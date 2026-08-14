import fs from 'fs'

// 从 AniList 拉取 9 部热血番的角色 + 声优数据，存到 rexue_data.json
// 运行：node scripts/fetch_rexue.js（无需 Supabase）

const ANI_LIST_API = 'https://graphql.anilist.co'

const ANIME = [
  { cn: '网球王子', search: 'Prince of Tennis', year: 2001 },
  { cn: '钻石王牌', search: 'Ace of Diamond', year: 2013 },
  { cn: '石纪元', search: 'Dr. Stone', year: 2019 },
  { cn: '黑色五叶草', search: 'Black Clover', year: 2017 },
  { cn: '驱魔少年', search: 'D.Gray-man', year: 2006 },
  { cn: '炎炎消防队', search: 'Fire Force', year: 2019 },
  { cn: '境界触发者', search: 'World Trigger', year: 2014 },
  { cn: '一人之下', search: 'Hitori no Shita', year: 2016 },
  { cn: '胆大党', search: 'Dandadan', year: 2024 },
]

async function gql(query, variables) {
  const res = await fetch(ANI_LIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`AniList ${res.status}: ${await res.text()}`)
  return res.json()
}

async function searchMedia(title) {
  const q = `query ($s: String) { Page(page: 1, perPage: 8) { media(search: $s, type: ANIME, sort: SEARCH_MATCH) { id title { romaji english native } format seasonYear } } }`
  const r = await gql(q, { s: title })
  return r.data.Page.media || []
}

async function fetchChars(mediaId) {
  // 关键坑：voiceActors 必须带 node { id }，否则返回 null
  const q = `query ($id: Int) { Media(id: $id, type: ANIME) { id title { romaji english native } characters(sort: ROLE, perPage: 30) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE, sort: ROLE) { id name { full native } image { large } } } } } }`
  const r = await gql(q, { id: mediaId })
  return r.data.Media
}

async function main() {
  const results = []
  for (const a of ANIME) {
    const mediaList = await searchMedia(a.search)
    if (!mediaList.length) { console.log(`⚠️ 未找到: ${a.cn}`); continue }

    // 优先匹配：romaji/english 完全一致 + 是 TV + 年份接近
    const exact = mediaList.filter(m =>
      (m.title.romaji || '').toLowerCase() === a.search.toLowerCase() ||
      (m.title.english || '').toLowerCase() === a.search.toLowerCase()
    )
    const pool = exact.length ? exact : mediaList
    const best = pool.find(m => m.format === 'TV') || pool[0]

    console.log(`✅ ${a.cn} → Media ${best.id} (${best.title.romaji || best.title.english || best.title.native} | ${best.seasonYear})`)
    const media = await fetchChars(best.id)
    results.push({
      cn: a.cn,
      mediaId: best.id,
      title: { romaji: best.title.romaji, english: best.title.english, native: best.title.native },
      characters: media.characters.edges.map(e => ({
        role: e.role,
        id: e.node.id,
        name: e.node.name.full,
        native: e.node.name.native,
        image: e.node.image && e.node.image.large,
        voiceActors: (e.voiceActors || []).map(v => ({ id: v.id, name: v.name.full, native: v.name.native, image: v.image && v.image.large })),
      })),
    })
    await new Promise(r => setTimeout(r, 900)) // 限流：约 90 req/min
  }

  fs.writeFileSync('scripts/rexue_data.json', JSON.stringify(results, null, 2))
  console.log(`\n✅ 完成，保存 ${results.length} 部动漫到 rexue_data.json`)
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
