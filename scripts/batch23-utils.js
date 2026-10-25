import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch23-selection.json', 'utf8'))
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
