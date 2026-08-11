import { supabase } from './_lib/supabase.js'

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`)
  const q = (searchParams.get('q') || '').trim()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 24
  const offset = (page - 1) * limit

  if (!q) {
    return res.status(200).json({ data: [], pagination: { current_page: 1, last_visible_page: 0 } })
  }

  try {
    // Search across name, anime title, and description using ILIKE
    const keyword = `%${q}%`

    // Get matching count
    const { count } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })
      .or(`name.ilike.${keyword},anime_title.ilike.${keyword},description.ilike.${keyword}`)

    // Get paginated results
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, image, anime_title')
      .or(`name.ilike.${keyword},anime_title.ilike.${keyword},description.ilike.${keyword}`)
      .range(offset, offset + limit - 1)

    if (error) throw error

    const lastPage = Math.max(1, Math.ceil((count || 0) / limit))

    return res.status(200).json({
      data: data || [],
      pagination: {
        current_page: page,
        last_visible_page: lastPage,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
