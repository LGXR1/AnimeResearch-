import fs from 'node:fs'

const selection = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch22-selection.json', 'utf8'))
export const meta = id => {
  const item = selection.anime.find(x => x.mediaId === id)
  if (!item) throw new Error(`缺少作品选择记录 ${id}`)
  return { mediaId: id, title: item.title, titleAliases: item.titleAliases, references: item.references }
}
export const c = (id, name, english, traits, description) => ({ id, name, nicknames: [english], traits, description })
