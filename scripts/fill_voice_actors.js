import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// Remaining 59 characters
const CHAR_IDS = [
  // 全职高手 (Chinese donghua - may not have JP VAs)
  130025, 124093, 130027,
  // 哪吒 (Chinese film)
  156371, 156374,
  // 终结的炽天使 (remaining)
  83015, 87287, 88993,
  // 末日时在做什么
  122768, 121661,
  // 食戟之灵
  75216, 75284, 76026,
  // 打工吧魔王大人
  70735, 70733,
  // 斗破苍穹 (Chinese)
  138713, 146584,
  // ALDNOAH.ZERO
  88174, 88173, 88175,
  // 斗罗大陆 (Chinese)
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

// Build batched query
function buildBatchQuery(ids) {
  const fields = ids.map((id, i) => `
    c${i}: Character(id: ${id}) {
      media(sort: POPULARITY_DESC, page: 1, perPage: 2) {
        edges {
          voiceActorRoles(sort: ROLE, language: JAPANESE) {
            voiceActor { id name { full } image { large } }
          }
        }
      }
    }`).join('')
  return `query { ${fields} }`
}

async function fetchVABatch(ids) {
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

  const results = await fetchVABatch(batch)
  for (const [id, va] of Object.entries(results)) {
    allResults[id] = va
    console.log(`  [${id}] ${va ? '✅ ' + va.name : '❌ NOT FOUND'}`)
  }

  if (i + BATCH_SIZE < CHAR_IDS.length) {
    await sleep(1500)
  }
}

const found = Object.values(allResults).filter(Boolean).length
const missing = Object.values(allResults).filter(v => !v).length
console.log(`\nFound: ${found}, Missing: ${missing}`)

// Insert
console.log('\nInserting voice actors...')
let inserted = 0

for (const [charId, va] of Object.entries(allResults)) {
  if (!va) continue

  const { data: existing } = await supabase
    .from('voice_actors')
    .select('id')
    .eq('character_id', charId)
    .eq('name', va.name)
    .limit(1)

  if (existing?.length > 0) {
    console.log(`  SKIP [${charId}] ${va.name}`)
    continue
  }

  const { error } = await supabase
    .from('voice_actors')
    .insert({
      character_id: parseInt(charId),
      name: va.name,
      image: va.image,
      language: 'Japanese',
    })

  if (error) {
    console.log(`  ❌ [${charId}] ${va.name} — ${error.message}`)
  } else {
    console.log(`  ✅ [${charId}] ${va.name}`)
    inserted++
  }
}

console.log(`\nInserted: ${inserted}`)

// Rebuild search_text
console.log('\nRebuilding search_text...')
for (const [charId, va] of Object.entries(allResults)) {
  if (!va) continue
  const { data: ch } = await supabase
    .from('characters')
    .select('id, name, anime_title, nicknames, traits, voice_actors(name)')
    .eq('id', charId)
    .single()

  if (!ch) continue
  const s = [
    ch.name, ch.anime_title || '',
    ...(ch.nicknames || []), ...(ch.traits || []),
    ...(ch.voice_actors || []).map(v => v.name),
  ].join(' ')
  await supabase.from('characters').update({ search_text: s }).eq('id', ch.id)
}

console.log('✅ Done!')
