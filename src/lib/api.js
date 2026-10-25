import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://yjsthpnwcjfktwychskq.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_w-I9P1-ipx2T3_qDt_gq1w_F2VBl0hU'
)

export { supabase }

let statsRequest
let statsRequestedAt = 0
let statsRpcAvailable = true
let rankedSearchAvailable = true
const browseRequests = new Map()
const searchRequests = new Map()

async function getLegacyStats() {
  const { count, error: countError } = await supabase
    .from('characters')
    .select('id', { count: 'exact', head: true })
  if (countError) throw new Error(countError.message)

  const titles = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from('characters')
      .select('anime_title')
      .range(offset, offset + 999)
    if (error) throw new Error(error.message)
    titles.push(...(data || []))
    if ((data || []).length < 1000) break
    offset += 1000
  }
  return { characters: count || 0, anime: new Set(titles.map(t => t.anime_title).filter(Boolean)).size }
}

export function getStats() {
  if (statsRequest && Date.now() - statsRequestedAt > 60_000) statsRequest = undefined
  if (!statsRequest) statsRequestedAt = Date.now()
  statsRequest ||= (async () => {
    if (statsRpcAvailable) {
      const { data, error } = await supabase.rpc('get_site_stats')
      if (!error) {
        return { characters: Number(data?.characters || 0), anime: Number(data?.anime || 0) }
      }
      if (error.code !== 'PGRST202') throw new Error(error.message)
      statsRpcAvailable = false
    }
    return getLegacyStats()
  })().catch((error) => {
    statsRequest = undefined
    throw error
  })
  return statsRequest
}

export async function getVisitCount() {
  const { total } = await getVisitCounts()
  return total
}

export async function getVisitCounts() {
  const { data, error } = await supabase
    .from('site_visits')
    .select('total, today_total, today_date')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw new Error(error.message)

  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const date = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]))
  const today = `${date.year}-${date.month}-${date.day}`

  return {
    today: data?.today_date === today ? Number(data.today_total || 0) : 0,
    total: Number(data?.total || 0),
  }
}

export async function recordVisit() {
  const { error } = await supabase.rpc('increment_site_visits')
  if (error) throw new Error(error.message)
  return getVisitCounts()
}

export function getAllCharacters(page = 1, limit = 24) {
  const key = `${page}:${limit}`
  return reusePendingRequest(browseRequests, key, () => loadAllCharacters(page, limit))
}

async function loadAllCharacters(page, limit) {
  const offset = (page - 1) * limit
  const { data, count, error } = await supabase
    .from('characters')
    .select('id, name, image, anime_title', { count: 'exact' })
    .order('id')
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)

  return {
    data: (data || []).map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      animeTitle: c.anime_title,
    })),
    pagination: {
      current_page: page,
      last_visible_page: Math.max(1, Math.ceil((count || 0) / limit)),
    },
    total: count || 0,
  }
}

export function searchCharacters(query, page = 1) {
  const key = `${query}:${page}`
  return reusePendingRequest(searchRequests, key, () => loadSearchCharacters(query, page))
}

async function loadSearchCharacters(query, page) {
  const limit = 24
  const safePage = Math.max(1, Number(page) || 1)
  const offset = (safePage - 1) * limit

  if (rankedSearchAvailable) {
    const { data: ranked, error: rankedError } = await supabase.rpc('search_characters_ranked', {
      p_query: query,
      p_page: safePage,
      p_page_size: limit,
    })

    if (!rankedError) {
      const count = Number(ranked?.total || 0)
      return {
        data: (ranked?.data || []).map(toCharacterCard),
        pagination: {
          current_page: safePage,
          last_visible_page: Math.max(1, Math.ceil(count / limit)),
        },
        total: count,
      }
    }
    if (rankedError.code !== 'PGRST202') throw new Error(rankedError.message)
    rankedSearchAvailable = false
  }

  // Compatibility path until the ranked SQL function is installed.
  // Name matches occupy the first pages; the remaining matches follow without duplicates.
  const words = query.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return emptySearchResult(safePage)
  const namePattern = `%${query.trim()}%`

  const matchingWords = (request) => words.reduce(
    (filtered, word) => filtered.ilike('search_text', `%${word}%`),
    request
  )
  const nameMatches = (request) => matchingWords(request.ilike('name', namePattern))
  const otherMatches = (request) => matchingWords(request.not('name', 'ilike', namePattern))

  const [{ count: nameCount, error: nameError }, { count: otherCount, error: otherError }] = await Promise.all([
    nameMatches(supabase.from('characters').select('id', { count: 'exact', head: true })),
    otherMatches(supabase.from('characters').select('id', { count: 'exact', head: true })),
  ])
  if (nameError || otherError) throw new Error((nameError || otherError).message)

  const namesBeforePage = Math.min(offset, nameCount || 0)
  const nameSlots = Math.max(0, Math.min(limit, (nameCount || 0) - namesBeforePage))
  const otherSlots = limit - nameSlots
  const requests = []
  if (nameSlots) {
    requests.push(nameMatches(supabase.from('characters').select('id, name, image, anime_title'))
      .order('name').order('id').range(namesBeforePage, namesBeforePage + nameSlots - 1))
  }
  if (otherSlots && offset + nameSlots < (nameCount || 0) + (otherCount || 0)) {
    const otherOffset = Math.max(0, offset - (nameCount || 0))
    requests.push(otherMatches(supabase.from('characters').select('id, name, image, anime_title'))
      .order('id').range(otherOffset, otherOffset + otherSlots - 1))
  }
  const pages = await Promise.all(requests)
  const pageError = pages.find(({ error }) => error)?.error
  if (pageError) throw new Error(pageError.message)

  const count = (nameCount || 0) + (otherCount || 0)

  return {
    data: pages.flatMap(({ data }) => data || []).map(toCharacterCard),
    pagination: {
      current_page: safePage,
      last_visible_page: Math.max(1, Math.ceil(count / limit)),
    },
    total: count,
  }
}

function toCharacterCard(c) {
  return { id: c.id, name: c.name, image: c.image, animeTitle: c.anime_title }
}

function emptySearchResult(page) {
  return { data: [], pagination: { current_page: page, last_visible_page: 1 }, total: 0 }
}

function reusePendingRequest(requests, key, load) {
  if (requests.has(key)) return requests.get(key)
  const request = Promise.resolve().then(load)
  requests.set(key, request)
  void request.finally(() => requests.delete(key)).catch(() => {})
  return request
}

export async function getComments(characterId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, content, created_at')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function addComment(characterId, content) {
  const { error } = await supabase
    .from('comments')
    .insert({ character_id: characterId, content })

  if (error) throw new Error(error.message)
}

export async function getCharacterFull(id) {
  // Get character + voice actors in one query
  const { data: character, error } = await supabase
    .from('characters')
    .select('*, voice_actors(*)')
    .eq('id', id)
    .single()

  if (error || !character) throw new Error('角色未找到')

  return {
    id: character.id,
    name: character.name,
    image: character.image,
    description: character.description,
    animeTitle: character.anime_title,
    nicknames: character.nicknames || [],
    traits: character.traits || [],
    voices: (character.voice_actors || []).map((v) => ({
      person: {
        name: v.name,
        images: { jpg: { image_url: v.image } },
      },
      language: v.language || 'Japanese',
    })),
  }
}
