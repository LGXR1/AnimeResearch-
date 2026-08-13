import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://yjsthpnwcjfktwychskq.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_w-I9P1-ipx2T3_qDt_gq1w_F2VBl0hU'
)

export { supabase }

export async function getAllCharacters(page = 1, limit = 24) {
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

export async function searchCharacters(query, page = 1) {
  const limit = 24
  const offset = (page - 1) * limit

  // Split query into words, search each with AND logic
  const words = query.trim().split(/\s+/).filter(Boolean)

  let q = supabase
    .from('characters')
    .select('id, name, image, anime_title', { count: 'exact' })

  // Chain ilike for each word
  for (const word of words) {
    q = q.ilike('search_text', `%${word}%`)
  }

  const { data, count, error } = await q.range(offset, offset + limit - 1)

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
  }
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
