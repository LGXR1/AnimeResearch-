import fs from 'fs'

// 从 AniList 拉取校园恋爱番（第 1 批：纯爱治愈 9 部）角色 + 声优
// 运行：node scripts/fetch_koi1.js

const ANI_LIST_API = 'https://graphql.anilist.co'

const ANIME = [
  { cn: '好想告诉你', search: 'Kimi ni Todoke', year: 2009 },
  { cn: '月色真美', search: 'Tsuki ga Kirei', year: 2017 },
  { cn: '青春之旅', search: 'Ao Haru Ride', year: 2014 },
  { cn: '邻座的怪同学', search: 'Tonari no Kaibutsu-kun', year: 2012 },
  { cn: '跃动青春', search: 'Skip and Loafer', year: 2023 },
  { cn: '我们的存在', search: 'Bokura ga Ita', year: 2006 },
  { cn: '花野井君和相思病', search: 'Hananoi-kun to Koi no Yamai', year: 2024 },
  { cn: '指尖相触恋恋不舍', search: 'Yubisaki to Renren', year: 2024 },
  { cn: '放学后失眠的你', search: 'Kimi wa Houkago Insomnia', year: 2023 },
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
  const q = `query ($id: Int) { Media(id: $id, type: ANIME) { id title { romaji english native } characters(sort: ROLE, perPage: 30) { edges { role node { id name { full native } image { large } } voiceActors(language: JAPANESE, sort: ROLE) { id name { full native } image { large } } } } } }`
  const r = await gql(q, { id: mediaId })
  return r.data.Media
}

async function main() {
  const results = []
  for (const a of ANIME) {
    const mediaList = await searchMedia(a.search)
    if (!mediaList.length) { console.log(`⚠️ 未找到: ${a.cn}`); continue }
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
      characters: media.characters.edges.map(e => ({
        id: e.node.id,
        name: e.node.name.full,
        native: e.node.name.native,
        image: e.node.image && e.node.image.large,
        voiceActors: (e.voiceActors || []).map(v => ({ id: v.id, name: v.name.full, native: v.name.native, image: v.image && v.image.large })),
      })),
    })
    await new Promise(r => setTimeout(r, 900))
  }
  fs.writeFileSync('scripts/koi1_data.json', JSON.stringify(results, null, 2))
  console.log(`\n✅ 完成，保存 ${results.length} 部动漫`)
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
