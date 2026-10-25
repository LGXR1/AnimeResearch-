import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch42-selection.json', 'utf8')).anime
const edges = new Map()
for (const item of selection) {
  const source = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  for (const edge of source.characters) edges.set(edge.node.id, edge)
}

export function meta(id) {
  const item = selection.find(row => row.mediaId === id)
  if (!item) throw new Error(`未知作品 ${id}`)
  return { mediaId: id, title: item.title, titleAliases: item.titleAliases, references: item.references }
}

export function p(id, name, setup, facts, extraNicknames = []) {
  const edge = edges.get(id)
  if (!edge) throw new Error(`${name} 缺少 AniList 角色资料`)
  const traits = [...new Set(facts.map(value => value.trim()).filter(Boolean))]
  if (traits.length !== 8) throw new Error(`${name} 必须有 8 项不重复特征，当前${traits.length}项`)
  const actors = [...new Set(edge.voiceActors.map(actor => actor.name.native || actor.name.full).filter(Boolean))]
  let description = `${name}${setup}。${traits.slice(0, 4).join('，')}；${traits.slice(4).join('，')}。`
  if ([...description].length < 100 && actors.length) description += `日语配音：${actors.join('、')}。`
  if ([...description].length < 100) description += '资料依据AniList角色档案整理。'
  if ([...description].length > 200) throw new Error(`${name} 简介长度 ${[...description].length}，需不超过200字`)
  const nicknames = [...new Set([name, edge.node.name.full, edge.node.name.native, ...(edge.node.name.alternative || []), ...extraNicknames].filter(Boolean))]
  return { id, name, nicknames, traits, description }
}
