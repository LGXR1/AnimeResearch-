import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch42-selection.json', 'utf8'))
const knownIds = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => row.id))
const ids = new Set()
const candidates = []
const normalize = value => String(value || '').toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const allTitles = new Map()
for (const anime of selection.anime) {
  const source = JSON.parse(fs.readFileSync(anime.snapshotPath, 'utf8'))
  if (source.id !== anime.mediaId || source.countryOfOrigin !== 'JP' || source.status !== 'FINISHED') throw new Error(`作品资料不符：${anime.mediaId}`)
  anime.titleAliases = [...new Set([source.title.english, source.title.romaji, source.title.native, ...(source.synonyms || []), ...(anime.titleAliases || [])].filter(Boolean))]
  for (const title of [anime.title, ...anime.titleAliases]) {
    const key = normalize(title)
    const old = allTitles.get(key)
    if (old && old !== anime.mediaId) throw new Error(`本批作品名/别名重复：${title} (${old}/${anime.mediaId})`)
    allTitles.set(key, anime.mediaId)
  }
  const eligible = source.characters.filter(edge => !(anime.mediaId === 142849 && edge.node.id === 5516)
    && !knownIds.has(edge.node.id) && !ids.has(edge.node.id)
    && edge.node.image?.large && edge.voiceActors.some(va => va.image?.large)
    && (edge.node.description || '').replace(/<[^>]*>/g, '').length >= 40)
  const main = eligible.filter(edge => edge.role === 'MAIN')
  if (eligible.length < 5 || !main.length) throw new Error(`${anime.title} 资料完整的新角色不足5位或缺少主角：${eligible.length}位`)
  const chosen = [...main, ...eligible.filter(edge => edge.role !== 'MAIN').slice(0, Math.max(0, 5 - main.length))]
  for (const edge of chosen) {
    if (ids.has(edge.node.id)) throw new Error(`批内角色ID重复：${edge.node.id}/${edge.node.name.full}`)
    ids.add(edge.node.id)
  }
  candidates.push({ mediaId: anime.mediaId, title: anime.title, characters: chosen.map(edge => ({
    id: edge.node.id, role: edge.role, full: edge.node.name.full, native: edge.node.name.native,
    aliases: edge.node.name.alternative || [], gender: edge.node.gender, age: edge.node.age,
    description: (edge.node.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    image: edge.node.image.large,
    voiceActors: edge.voiceActors.filter(va => va.image?.large).map(va => ({ id: va.id, full: va.name.full, native: va.name.native, image: va.image.large })),
  })) })
  console.log(`${anime.mediaId}\t${anime.title}\t${chosen.length}人（主角${main.length}）\t${chosen.map(c => `${c.node.name.full}[${c.node.id}]`).join('、')}`)
}
if (selection.anime.length !== 50 || candidates.some(group => group.characters.length < 5)) throw new Error('作品或人物数量不合格')
selection.selectedAt = new Date().toISOString()
fs.writeFileSync('data/anime_update_drafts/batch42-selection.json', JSON.stringify(selection, null, 2))
fs.writeFileSync('data/anime_update_drafts/batch42-candidates.json', JSON.stringify(candidates, null, 2))
console.log(`共${candidates.length}部作品、${ids.size}位不重复新角色；完整纳入AniList主角及最低限度重要配角`)
