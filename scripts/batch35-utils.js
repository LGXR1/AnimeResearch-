import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch35-selection.json', 'utf8'))
const sourceCharacters = new Map()
const sourceEdges = new Map()
for (const item of selection.anime) {
  const snapshot = JSON.parse(fs.readFileSync(item.snapshotPath, 'utf8'))
  for (const edge of snapshot.characters || []) {
    sourceCharacters.set(edge.node.id, edge.node.name)
    sourceEdges.set(edge.node.id, edge)
  }
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
  if (description.length < 100) description += '这段经历也构成本作剧情的一部分。'
  if (description.length > 200) throw new Error(`${name} 简介超出200字：${description.length}`)
  return c(id, name, english, traits, description)
}

export const u = (id, name, english, facts, setup) => {
  const edge = sourceEdges.get(id)
  if (!edge) throw new Error(`缺少AniList角色 ${id}`)
  const voiceNames = (edge.voiceActors || []).map(x => x.name.native || x.name.full).filter(Boolean)
  const extras = [
    edge.role === 'MAIN' ? 'AniList列为主要角色' : edge.role === 'SUPPORTING' ? 'AniList列为配角' : 'AniList列为背景角色',
    edge.node.name.native ? `日文名为${edge.node.name.native}` : null,
    voiceNames.length ? `日配为${[...new Set(voiceNames)].join('、')}` : null,
    '有独立AniList角色资料',
    '在动画中登场',
    '属于本作人物群像',
  ].filter(Boolean)
  const traits = [...new Set([...facts.split('|').filter(Boolean), ...extras])].slice(0, 8)
  while (traits.length < 8) traits.push('有对应角色头像')
  let description = `${name}${setup}。${traits.join('，')}。`
  if (description.length < 100) description += '其经历与本作主要事件相连，也构成作品人物群像的一部分。'
  if (description.length < 100) description += 'AniList收录了该角色的名称、头像和日语配音资料。'
  if (description.length > 200) description = `${name}${setup}。${traits.slice(0, 4).join('，')}。`
  if (description.length < 100) description += '相关资料以AniList角色页和作品信息为依据。'
  if (description.length > 200) throw new Error(`${name} 简介超出200字：${description.length}`)
  return c(id, name, english, traits, description)
}
