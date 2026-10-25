import fs from 'node:fs'

const selectionPath = 'data/anime_update_drafts/batch38-selection.json'
const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf8'))
const knownIds = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(x => x.id))
const selectedCharacterIds = new Set()
const candidates = []
for (const anime of selection.anime) {
  const source = JSON.parse(fs.readFileSync(anime.snapshotPath, 'utf8'))
  if (source.countryOfOrigin !== 'JP' || source.status === 'NOT_YET_RELEASED' || source.status === 'CANCELLED') throw new Error(`作品状态或来源不符：${anime.mediaId}/${source.status}/${source.countryOfOrigin}`)
  anime.titleAliases = [...new Set([source.title.english, source.title.romaji, source.title.native, ...(source.synonyms || [])].filter(Boolean))]
  const eligible = source.characters.filter(edge => !knownIds.has(edge.node.id) && edge.node.image?.large && edge.voiceActors.some(va => va.image?.large) && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40 && !selectedCharacterIds.has(edge.node.id))
  if (eligible.length < 5) throw new Error(`${anime.title} 资料完整的新角色不足 5 位：${eligible.length}`)
  const main = eligible.filter(edge => edge.role === 'MAIN')
  const supporting = eligible.filter(edge => edge.role !== 'MAIN')
  const chosen = [...main, ...supporting.slice(0, Math.max(0, 5 - main.length))]
  chosen.forEach(edge => selectedCharacterIds.add(edge.node.id))
  candidates.push({ mediaId: anime.mediaId, title: anime.title, characters: chosen.map(edge => ({
    id: edge.node.id, role: edge.role, full: edge.node.name.full, native: edge.node.name.native,
    aliases: edge.node.name.alternative, gender: edge.node.gender, age: edge.node.age,
    description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    voiceActors: edge.voiceActors.map(va => va.name.native || va.name.full),
  })) })
  console.log(`${anime.mediaId}\t${anime.title}\t${chosen.length} 位（主角 ${main.length} 位）\t${chosen.map(c => c.node.name.full).join('、')}`)
}
if (selection.anime.length !== 20 || candidates.some(group => group.characters.length < 5)) throw new Error('本批候选数量有误')
fs.writeFileSync(selectionPath, JSON.stringify(selection, null, 2))
fs.writeFileSync('data/anime_update_drafts/batch38-candidates.json', JSON.stringify(candidates, null, 2))
console.log(`选取 ${selection.anime.length} 部动漫 / ${selectedCharacterIds.size} 位有简介的新角色，优先收录全部可核实的主角`)
