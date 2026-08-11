/**
 * 动漫人物数据填充脚本
 * 用法: node scripts/populate.js
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

// ============ 热门动漫列表 ============
const ANIME_LIST = [
  'Jujutsu Kaisen',
  'Shingeki no Kyojin',
  'SPY x FAMILY',
  'Chainsaw Man',
  'One Piece',
  'Sousou no Frieren',
  'Tensei shitara Slime Datta Ken',
  'Oshi no Ko',
  'Boku no Hero Academia',
  'Kimetsu no Yaiba',
]

// ============ API ============
async function graphql(query, variables) {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message)
  return json.data
}

// ============ 翻译 ============
const translateCache = new Map()

async function translate(text) {
  if (!text || text.length < 2) return text
  const key = text.slice(0, 100)
  if (translateCache.has(key)) return translateCache.get(key)

  const doChunk = async (chunk) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|zh-CN`
    const r = await fetch(url)
    const j = await r.json()
    return j.responseData?.translatedText || chunk
  }

  let result
  if (text.length <= 450) {
    result = await doChunk(text)
  } else {
    const sentences = text.match(/[^.!?\n]+[.!?]?/g) || [text]
    const chunks = []; let cur = ''
    for (const s of sentences) {
      if ((cur + s).length > 400 && cur) { chunks.push(cur); cur = s }
      else cur += s
    }
    if (cur) chunks.push(cur)
    const translated = []
    for (let i = 0; i < chunks.length; i++) {
      translated.push(await doChunk(chunks[i]))
      if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 80))
    }
    result = translated.join('')
  }

  translateCache.set(key, result)
  return result
}

// ============ 特征提取 ============
function extractTraits(desc, name) {
  const traits = []
  const text = (desc || '').toLowerCase()

  // Hair color
  const hairMap = {
    'black hair': '黑发', 'blond': '金发', 'blonde': '金发', 'yellow hair': '金发',
    'white hair': '白发', 'silver hair': '银发', 'red hair': '红发', 'reddish': '红发',
    'blue hair': '蓝发', 'pink hair': '粉发', 'purple hair': '紫发', 'green hair': '绿发',
    'brown hair': '棕发', 'orange hair': '橙发', 'grey hair': '灰发', 'gray hair': '灰发',
  }
  for (const [en, zh] of Object.entries(hairMap)) {
    if (text.includes(en)) { traits.push(zh); break }
  }

  // Eye color
  const eyeMap = {
    'blue eyes': '蓝色眼瞳', 'red eyes': '红色眼瞳', 'green eyes': '绿色眼瞳',
    'brown eyes': '棕色眼瞳', 'purple eyes': '紫色眼瞳', 'yellow eyes': '金色眼瞳',
    'black eyes': '黑色眼瞳', 'pink eyes': '粉色眼瞳', 'grey eyes': '灰色眼瞳',
  }
  for (const [en, zh] of Object.entries(eyeMap)) {
    if (text.includes(en)) { traits.push(zh); break }
  }

  // Personality
  const personalityMap = {
    'kind': '善良', 'gentle': '温柔', 'cheerful': '开朗', 'shy': '害羞',
    'serious': '认真', 'stoic': '冷静', 'cold': '冷酷', 'arrogant': '傲慢',
    'brave': '勇敢', 'timid': '胆小', 'energetic': '活泼', 'lazy': '懒散',
    'intelligent': '聪慧', ' cunning': '狡猾', 'loyal': '忠诚', 'stubborn': '固执',
    'hot-headed': '暴躁', 'calm': '沉着', 'mysterious': '神秘', 'eccentric': '古怪',
    'strong': '强大', 'powerful': '实力强大', 'weak': '弱小',
  }
  for (const [en, zh] of Object.entries(personalityMap)) {
    if (text.includes(en)) traits.push(zh)
  }

  // Role/archetype
  const roleMap = {
    'swordsman': '剑士', 'ninja': '忍者', 'pirate': '海贼', 'mage': '法师',
    'demon': '恶魔', 'god': '神', 'king': '王', 'princess': '公主', 'prince': '王子',
    'student': '学生', 'teacher': '教师', 'doctor': '医生', 'soldier': '战士',
    'assassin': '刺客', 'hero': '英雄', 'villain': '反派', 'leader': '领袖',
    'hunter': '猎人', 'scientist': '科学家', 'detective': '侦探', 'idol': '偶像',
    'spy': '间谍', 'maid': '女仆', 'dragon': '龙', 'monster': '怪物',
    'giant': '巨人', 'vampire': '吸血鬼',
  }
  for (const [en, zh] of Object.entries(roleMap)) {
    if (text.includes(en)) traits.push(zh)
  }

  return [...new Set(traits)].slice(0, 12)
}

// ============ 主流程 ============
async function main() {
  console.log('=== 动漫人物数据填充 ===\n')

  let totalInserted = 0
  let totalSkipped = 0

  for (const animeTitle of ANIME_LIST) {
    console.log(`\n📺 搜索动漫: "${animeTitle}"`)

    // Step 1: Search for the anime to get its characters
    const animeData = await graphql(
      `query ($search: String) {
        Media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english }
          characters(sort: ROLE, perPage: 5) {
            nodes {
              id
              name { full alternative }
              image { large }
              description(asHtml: false)
            }
          }
        }
      }`,
      { search: animeTitle }
    )

    const media = animeData?.Media
    if (!media) { console.log('  ⚠️ 未找到'); continue }

    const animeNameCN = await translate(media.title.romaji || media.title.english || animeTitle)
    console.log(`  动漫: ${animeNameCN} (ID: ${media.id})`)

    const nodes = media.characters?.nodes || []

    for (const c of nodes) {
      // Check if exists
      const { data: existing } = await supabase
        .from('characters').select('id').eq('id', c.id).maybeSingle()
      if (existing) { totalSkipped++; process.stdout.write('.'); continue }

      try {
        // Get full detail + voice actors
        const full = await graphql(
          `query ($id: Int) {
            Character(id: $id) {
              description(asHtml: false)
              media(sort: POPULARITY_DESC, perPage: 3) {
                edges {
                  voiceActors(language: JAPANESE) { id name { full } image { medium } }
                }
              }
            }
          }`,
          { id: c.id }
        )

        const desc = full?.Character?.description || c.description || ''
        const descCN = await translate(desc)
        const traits = extractTraits(desc, c.name.full)
        const nameAliases = (c.name.alternative || []).filter(Boolean)

        // Voice actors
        const vas = []
        const seenVA = new Set()
        for (const edge of full?.Character?.media?.edges || []) {
          for (const va of edge.voiceActors || []) {
            if (!seenVA.has(va.id)) {
              seenVA.add(va.id)
              vas.push({ id: va.id, name: va.name.full, image: va.image?.medium || '' })
            }
          }
        }

        // Build search_text
        const searchText = [
          c.name.full, animeNameCN, descCN,
          ...nameAliases, ...traits, ...vas.map(v => v.name),
        ].join(' ')

        // Insert character
        await supabase.from('characters').insert({
          id: c.id,
          name: c.name.full,
          image: c.image?.large || '',
          description: descCN,
          anime_title: animeNameCN,
          nicknames: nameAliases,
          traits: traits,
          search_text: searchText,
        })

        // Insert voice actors
        for (const va of vas) {
          await supabase.from('voice_actors').insert({
            character_id: c.id,
            name: va.name,
            image: va.image,
            language: '日语',
          })
        }

        totalInserted++
        process.stdout.write('+')
        await new Promise(r => setTimeout(r, 300))
      } catch (err) {
        process.stdout.write('x')
      }
    }

    console.log(`\n  已插入 ${totalInserted}, 跳过 ${totalSkipped}`)
    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\n\n🏁 完成! 新增 ${totalInserted} 个角色，跳过 ${totalSkipped} 个`)
}

main().catch(err => { console.error('💥', err); process.exit(1) })
