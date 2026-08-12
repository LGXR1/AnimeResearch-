// Step 1: Fetch VA data from AniList, save to JSON file
import fs from 'fs'

const CHAR_IDS = [
  // 全职高手
  130025, 124093, 130027,
  // 哪吒之魔童降世
  156371, 156374,
  // 终结的炽天使
  83015, 87287, 88993,
  // 末日时在做什么
  122768, 121661,
  // 食戟之灵
  75216, 75284, 76026,
  // 打工吧魔王大人
  70735, 70733,
  // 斗破苍穹
  138713, 146584,
  // ALDNOAH.ZERO
  88174, 88173, 88175,
  // 斗罗大陆
  142006, 142007, 142010, 142005,
  // 夏日大作战
  22812, 22808, 22809, 22810,
  // 她和她的猫
  7801, 10126,
  // 星之声
  3531, 3532,
  // 恋爱研究所
  74269, 74271,
  // 四月一日灵异事件簿
  236, 235, 567, 568,
  // 高校舰队
  89347, 89730,
  // 强袭魔女
  7632, 7630,
  // 犬王
  175676, 175675,
  // 未来的未来
  130646, 130645,
  // 言叶之庭
  79463, 79465,
  // 穿越时空的少女
  2531, 2530,
  // 狼的孩子雨与雪
  60279, 60281, 60283,
  // 赛博朋克边缘行者
  284157, 284165, 284158,
  // 云之彼端约定的地方
  3902, 3903, 3904,
]

function buildBatchQuery(ids) {
  const fields = ids.map((id, i) => `
    c${i}: Character(id: ${id}) {
      media(sort: POPULARITY_DESC, page: 1, perPage: 2) {
        edges {
          voiceActorRoles(sort: ROLE, language: JAPANESE) {
            voiceActor { name { full } image { large } }
          }
          node { id }
        }
      }
    }`).join('')
  return `query { ${fields} }`
}

async function fetchBatch(ids) {
  const query = buildBatchQuery(ids)
  const resp = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
  })
  const json = await resp.json()
  const results = {}
  for (let i = 0; i < ids.length; i++) {
    const char = json.data?.['c' + i]
    if (!char) { results[ids[i]] = null; continue }
    for (const edge of char.media?.edges || []) {
      const role = edge.voiceActorRoles?.[0]
      if (role?.voiceActor?.name?.full) {
        results[ids[i]] = {
          name: role.voiceActor.name.full,
          image: role.voiceActor.image?.large || '',
        }
        break
      }
    }
    if (!results[ids[i]]) results[ids[i]] = null
  }
  return results
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

console.log(`Fetching VAs for ${CHAR_IDS.length} characters in batches of 10...\n`)

const BATCH_SIZE = 10
const allResults = {}

for (let i = 0; i < CHAR_IDS.length; i += BATCH_SIZE) {
  const batch = CHAR_IDS.slice(i, i + BATCH_SIZE)
  const batchNum = Math.floor(i / BATCH_SIZE) + 1
  const totalBatches = Math.ceil(CHAR_IDS.length / BATCH_SIZE)
  console.log(`Batch ${batchNum}/${totalBatches}...`)

  const results = await fetchBatch(batch)
  for (const [id, va] of Object.entries(results)) {
    allResults[id] = va
    console.log(`  [${id}] ${va ? '✅ ' + va.name : '❌ NOT FOUND'}`)
  }

  if (i + BATCH_SIZE < CHAR_IDS.length) {
    await sleep(1500)
  }
}

const found = Object.values(allResults).filter(Boolean).length
console.log(`\nFound: ${found}, Missing: ${CHAR_IDS.length - found}`)

fs.writeFileSync('scripts/va_data.json', JSON.stringify(allResults, null, 2))
console.log('Saved to scripts/va_data.json')
