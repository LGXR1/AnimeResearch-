import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  // Extract id from URL path: /api/character/500
  const id = parseInt(req.url.split('/').pop(), 10)

  if (!id) {
    return res.status(400).json({ error: 'Invalid character ID' })
  }

  try {
    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !character) {
      return res.status(404).json({ error: '角色未找到' })
    }

    // Get voice actors
    const { data: voices } = await supabase
      .from('voice_actors')
      .select('*')
      .eq('character_id', id)

    return res.status(200).json({
      ...character,
      voices: (voices || []).map((v) => ({
        person: {
          name: v.name,
          images: { jpg: { image_url: v.image } },
        },
        language: v.language,
      })),
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
