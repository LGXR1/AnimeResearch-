import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-selection.json', 'utf8')).anime
const existing = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const ids = new Set(existing.map(x => x.id))
const titles = new Set(existing.map(x => x.anime_title))

for (const item of selection) {
  const source = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  const newEdges = source.characters.filter(x => !ids.has(x.node.id))
  const usable = newEdges.filter(x => /anilistcdn\/character\/large\//.test(x.node.image?.large || '') && x.voiceActors.some(v => /anilistcdn\/staff\/large\//.test(v.image?.large || '')))
  const bio = usable.filter(x => (x.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
  const main = usable.filter(x => x.role === 'MAIN')
  const names = usable.slice(0, 8).map(x => `${x.node.name.full}#${x.node.id}`).join(', ')
  console.log(`${item.mediaId}\tnew=${usable.length}\tbio=${bio.length}\tmain=${main.length}\tlocalTitle=${titles.has(item.title)}\t${item.title}\t${names}`)
}
