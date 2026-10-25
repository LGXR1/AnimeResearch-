import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-selection.json', 'utf8')).anime
const knownIds = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(x => x.id))
const usableImage = url => typeof url === 'string' && url.includes('anilistcdn') && !url.includes('/default.')
const proposals = []
const selectedIds = new Set()
const preferred = new Map([
  [177937, [184936, 169679, 283261, 213881, 278821]],
])

for (const anime of selection) {
  const source = JSON.parse(fs.readFileSync(anime.snapshotPath, 'utf8'))
  const usable = source.characters.filter(edge => !knownIds.has(edge.node.id) && usableImage(edge.node.image?.large) && edge.voiceActors.some(va => usableImage(va.image?.large)))
  const withBio = usable.filter(edge => (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
  const order = preferred.get(anime.mediaId)
  const chosen = order
    ? order.map(id => usable.find(edge => edge.node.id === id)).filter(Boolean)
    : [...withBio, ...usable.filter(edge => !withBio.includes(edge))].filter(edge => !selectedIds.has(edge.node.id)).slice(0, 5)
  if (chosen.length < 5) throw new Error(`${anime.title} 可核实角色只有 ${chosen.length} 位`)
  chosen.forEach(edge => selectedIds.add(edge.node.id))
  proposals.push({ mediaId: anime.mediaId, title: anime.title, characters: chosen.map(edge => ({
    id: edge.node.id, role: edge.role, full: edge.node.name.full, native: edge.node.name.native,
    aliases: edge.node.name.alternative, gender: edge.node.gender, age: edge.node.age,
    description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    voiceActors: edge.voiceActors.map(va => va.name.native || va.name.full),
  })) })
}
fs.writeFileSync('data/anime_update_drafts/batch37-candidates.json', JSON.stringify(proposals, null, 2))
console.log(`初选 ${proposals.length} 部动漫 / ${selectedIds.size} 位新角色`)
for (const group of proposals) console.log(`${group.mediaId}\t${group.title}\t${group.characters.map(x => `${x.full}#${x.id}${x.description ? '' : '!'}`).join(', ')}`)
