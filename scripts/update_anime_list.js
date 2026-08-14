import fs from 'fs'

const characters = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const byAnime = new Map()
for (const character of characters) {
  const list = byAnime.get(character.anime_title) || []
  list.push(character.name)
  byAnime.set(character.anime_title, list)
}

const lines = [...byAnime.entries()]
  .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-CN'))
  .map(([title, names], index) => `| ${index + 1} | ${title} | ${names.length} | ${names.join('、')} |`)

const content = ['# 已添加动漫列表', `**总计: ${characters.length} 个角色 / ${byAnime.size} 部动漫**`, '', '| # | 动漫 | 角色数 | 角色 |', '|---|------|--------|------|', ...lines, ''].join('\n')
fs.writeFileSync('ANIME_LIST.md', content)
console.log(`Updated ANIME_LIST.md: ${characters.length} characters / ${byAnime.size} anime.`)
