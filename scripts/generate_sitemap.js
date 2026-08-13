import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// 生成 public/sitemap.xml —— 首页 + 所有角色详情页
// 运行：node --env-file=.env.local scripts/generate_sitemap.js
// 新增角色后需重新运行，让 sitemap 保持最新

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY
)

const BASE = 'https://animeresearch.netlify.app'

async function main() {
  const ids = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from('characters')
      .select('id')
      .order('id')
      .range(offset, offset + 999)
    if (error) { console.error('查询失败:', error.message); process.exit(1) }
    ids.push(...(data || []).map((c) => c.id))
    if ((data || []).length < 1000) break
    offset += 1000
  }

  const urls = [
    { loc: `${BASE}/`, changefreq: 'daily', priority: '1.0' },
    ...ids.map((id) => ({ loc: `${BASE}/character/${id}`, changefreq: 'weekly', priority: '0.8' })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`

  fs.writeFileSync('public/sitemap.xml', xml)
  console.log(`✅ 生成 public/sitemap.xml，共 ${urls.length} 个 URL（${ids.length} 个角色 + 首页）`)
}

main()
