import fs from 'node:fs'

const selectionPath = 'data/anime_update_drafts/batch41-selection.json'
const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf8'))
const knownIds = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => row.id))
const selectedIds = new Set()
const candidates = []
const normalize = value => String(value || '').toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const allTitles = new Map()

for (const anime of selection.anime) {
  const source = JSON.parse(fs.readFileSync(anime.snapshotPath, 'utf8'))
  if (source.id !== anime.mediaId || source.countryOfOrigin !== 'JP' || source.status !== 'FINISHED') {
    throw new Error(`作品资料不符：${anime.mediaId}/${source.status}/${source.countryOfOrigin}`)
  }
  anime.titleAliases = [...new Set([source.title.english, source.title.romaji, source.title.native, ...(source.synonyms || []), ...(anime.titleAliases || [])].filter(Boolean))]
  for (const title of [anime.title, ...anime.titleAliases]) {
    const key = normalize(title)
    const previous = allTitles.get(key)
    if (previous && previous !== anime.mediaId) throw new Error(`本批作品名/别名重复：${title}（媒体${previous}/${anime.mediaId}）`)
    allTitles.set(key, anime.mediaId)
  }
  const eligible = source.characters.filter(edge => !knownIds.has(edge.node.id) && !selectedIds.has(edge.node.id)
    && edge.node.image?.large && edge.voiceActors.some(va => va.image?.large)
    && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
  const main = eligible.filter(edge => edge.role === 'MAIN')
  if (eligible.length < 5 || !main.length) throw new Error(`${anime.title} 资料完整的新角色不足5位或缺少主角：${eligible.length}位`)
  const chosen = [...main, ...eligible.filter(edge => edge.role !== 'MAIN').slice(0, Math.max(0, 5 - main.length))]
  if (chosen.length < 5) throw new Error(`${anime.title} 新角色仅${chosen.length}位`)
  chosen.forEach(edge => selectedIds.add(edge.node.id))
  candidates.push({ mediaId: anime.mediaId, title: anime.title, characters: chosen.map(edge => ({
    id: edge.node.id, role: edge.role, full: edge.node.name.full, native: edge.node.name.native,
    aliases: edge.node.name.alternative || [], gender: edge.node.gender, age: edge.node.age,
    description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    image: edge.node.image.large,
    voiceActors: edge.voiceActors.filter(va => va.image?.large).map(va => ({ id: va.id, full: va.name.full, native: va.name.native, image: va.image.large })),
  })) })
  console.log(`${anime.mediaId}\t${anime.title}\t${chosen.length} 位（主角 ${main.length} 位）\t${chosen.map(c => c.node.name.full).join('、')}`)
}

if (selection.anime.length !== 30 || candidates.some(group => group.characters.length < 5)) throw new Error('作品或人物数量不合格')
selection.selectedAt = new Date().toISOString()
fs.writeFileSync(selectionPath, JSON.stringify(selection, null, 2))
fs.writeFileSync('data/anime_update_drafts/batch41-candidates.json', JSON.stringify(candidates, null, 2))
console.log(`共${candidates.length}部作品、${selectedIds.size}位不重复新角色；包含资料完整的AniList主角与重要配角`)
