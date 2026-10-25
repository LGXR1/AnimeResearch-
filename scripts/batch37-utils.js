import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-selection.json', 'utf8')).anime
const edges = new Map()
for (const item of selection) {
  const source = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  for (const edge of source.characters) edges.set(edge.node.id, edge)
}

export function meta(id) {
  const item = selection.find(x => x.mediaId === id)
  if (!item) throw new Error(`未知作品 ${id}`)
  return { mediaId: id, title: item.title, titleAliases: item.titleAliases, references: item.references }
}

export function p(id, name, english, facts, setup) {
  const edge = edges.get(id)
  if (!edge) throw new Error(`${name} 缺少 AniList 角色资料`)
  const traits = facts.split('|').map(x => x.trim()).filter(Boolean)
  if (traits.length !== 8 || new Set(traits).size !== 8) throw new Error(`${name} 必须有 8 项不重复事实`)
  let description = `${name}${setup}。${traits.slice(0, 4).join('，')}；${traits.slice(4).join('，')}。`
  if ([...description].length < 100) {
    const voices = [...new Set(edge.voiceActors.map(va => va.name.native || va.name.full).filter(Boolean))]
    if (voices.length) description += `该角色在本作动画中的日语配音由${voices.join('、')}担任。`
  }
  const length = [...description].length
  if (length < 100 || length > 200) throw new Error(`${name} 简介长度 ${length}，需 100–200 字`)
  return {
    id, name,
    nicknames: [...new Set([english, edge.node.name.native, ...(edge.node.name.alternative || [])].filter(Boolean))],
    traits, description,
  }
}
