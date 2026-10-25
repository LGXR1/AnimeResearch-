import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch26-selection.json', 'utf8'))
const sourceCharacters = new Map()
for (const item of selection.anime) {
  const snapshot = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  for (const edge of snapshot.characters || []) sourceCharacters.set(edge.node.id, edge.node.name)
}

export const meta = id => {
  const item = selection.anime.find(x => x.mediaId === id)
  if (!item) throw new Error(`缺少作品选择记录 ${id}`)
  return { mediaId: id, title: item.title, titleAliases: item.titleAliases, references: item.references }
}

export const c = (id, name, english, traits, description) => ({
  id,
  name,
  nicknames: [...new Set([english, sourceCharacters.get(id)?.native, ...(sourceCharacters.get(id)?.alternative || [])].filter(Boolean))],
  traits,
  description,
})

export const p = (id, name, english, facts, setup) => {
  const traits = facts.split('|')
  if (traits.length !== 8) throw new Error(`${name} 必须有8项特征`)
  let description = `${name}${setup}。${traits.slice(0, 4).join('，')}；${traits.slice(4).join('，')}。`
  if (description.length < 100) description += '这些经历影响其在故事中的选择与行动。'
  if (description.length > 200) throw new Error(`${name} 简介超出200字：${description.length}`)
  return c(id, name, english, traits, description)
}
