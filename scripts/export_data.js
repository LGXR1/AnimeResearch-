import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// 导出数据库到 data/ 目录（3 个文件：full.json / slim.json / csv）
// 运行：node --env-file=.env.local scripts/export_data.js
// 读操作，用 publishable key 即可（fallback secret key）

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY
)

// 分页拉全表（Supabase 单次最多 1000 行）
async function fetchAll(table) {
  const rows = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id')
      .range(offset, offset + 999)
    if (error) throw new Error(error.message)
    rows.push(...(data || []))
    if ((data || []).length < 1000) break
    offset += 1000
  }
  return rows
}

function csvField(v) {
  const s = String(v ?? '')
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

async function main() {
  const chars = await fetchAll('characters')
  const vas = await fetchAll('voice_actors')

  const vaByChar = {}
  for (const v of vas) {
    ;(vaByChar[v.character_id] ||= []).push(v)
  }

  // full.json：完整字段 + 完整声优对象
  const full = chars.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    description: c.description,
    anime_title: c.anime_title,
    nicknames: c.nicknames || [],
    created_at: c.created_at,
    updated_at: c.updated_at,
    traits: c.traits || [],
    search_text: c.search_text,
    voice_actors: (vaByChar[c.id] || []).map((v) => ({
      id: v.id,
      name: v.name,
      image: v.image,
      language: v.language,
      character_id: v.character_id,
    })),
  }))

  // slim.json：精简字段 + 声优精简对象
  const slim = chars.map((c) => ({
    id: c.id,
    name: c.name,
    anime_title: c.anime_title,
    image: c.image,
    description: c.description,
    nicknames: c.nicknames || [],
    traits: c.traits || [],
    voice_actors: (vaByChar[c.id] || []).map((v) => ({
      name: v.name,
      language: v.language,
      image: v.image,
    })),
  }))

  // csv：扁平表，nicknames/traits 用 | 分隔，声优名用 , 分隔
  const header = 'id,name,anime_title,image,description,nicknames,traits,voice_actors'
  const lines = [header]
  for (const c of chars) {
    const names = (vaByChar[c.id] || []).map((v) => v.name)
    lines.push(
      [
        c.id,
        c.name,
        c.anime_title,
        c.image,
        c.description,
        (c.nicknames || []).join('|'),
        (c.traits || []).join('|'),
        names.join(','),
      ]
        .map(csvField)
        .join(',')
    )
  }
  const csv = '﻿' + lines.join('\n') + '\n'

  fs.writeFileSync('data/characters_full.json', JSON.stringify(full, null, 2))
  fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
  fs.writeFileSync('data/characters.csv', csv)

  console.log(`✅ 导出完成：${chars.length} 个角色，${vas.length} 条声优`)
  console.log(`   data/characters_full.json (${(JSON.stringify(full).length / 1024 / 1024).toFixed(2)} MB)`)
  console.log(`   data/characters_slim.json (${(JSON.stringify(slim).length / 1024 / 1024).toFixed(2)} MB)`)
  console.log(`   data/characters.csv`)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
