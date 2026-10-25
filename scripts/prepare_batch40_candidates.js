import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch40-selection.json', 'utf8'))
const knownIds = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => row.id))
const selectedIds = new Set()
const candidates = []

for (const anime of selection.anime) {
  const source = JSON.parse(fs.readFileSync(anime.snapshotPath, 'utf8'))
  if (source.id !== anime.mediaId || source.countryOfOrigin !== 'JP' || source.status !== 'FINISHED') throw new Error(`作品资料不符：${anime.mediaId}/${source.status}/${source.countryOfOrigin}`)
  anime.titleAliases = [...new Set([source.title?.english, source.title?.romaji, source.title?.native, ...(source.synonyms || [])].filter(Boolean))]
  const eligible = source.characters.filter(edge => !knownIds.has(edge.node.id) && !selectedIds.has(edge.node.id)
    && edge.node.image?.large && edge.voiceActors.some(va => va.image?.large)
    && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
  const main = eligible.filter(edge => edge.role === 'MAIN')
  if (eligible.length < 5 || !main.length) throw new Error(`${anime.title} 资料完整的角色不足：${eligible.length} 位，主角 ${main.length} 位`)
  const chosen = [...main, ...eligible.filter(edge => edge.role !== 'MAIN').slice(0, Math.max(0, 5 - main.length))]
  chosen.forEach(edge => selectedIds.add(edge.node.id))
  candidates.push({ mediaId: anime.mediaId, title: anime.title, characters: chosen.map(edge => ({
    id: edge.node.id, role: edge.role, full: edge.node.name.full, native: edge.node.name.native,
    aliases: edge.node.name.alternative || [], gender: edge.node.gender, age: edge.node.age,
    description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    image: edge.node.image.large, voiceActors: edge.voiceActors.filter(va => va.image?.large).map(va => ({
      id: va.id, full: va.name.full, native: va.name.native, image: va.image.large,
    })),
  })) })
  console.log(`${anime.mediaId}\t${anime.title}\t${chosen.length} 位（主角 ${main.length} 位）\t${chosen.map(c => c.full).join('、')}`)
}

if (candidates.length !== 30 || candidates.some(group => group.characters.length < 5)) throw new Error('本批作品或人物数量不足')
selection.selectedAt = new Date().toISOString()
fs.writeFileSync('data/anime_update_drafts/batch40-selection.json', JSON.stringify(selection, null, 2))
fs.writeFileSync('data/anime_update_drafts/batch40-candidates.json', JSON.stringify(candidates, null, 2))
console.log(`共 ${candidates.length} 部作品、${selectedIds.size} 位新角色；含全部可核实主角及重要配角`)
