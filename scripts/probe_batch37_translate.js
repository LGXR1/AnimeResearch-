import fs from 'node:fs'

const source = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-sources/anime-source-154768.json', 'utf8'))
const bio = source.characters.find(x => x.node.id === 270817).node.description
const url = new URL('https://translate.googleapis.com/translate_a/single')
for (const [key, value] of Object.entries({ client: 'gtx', sl: 'en', tl: 'zh-CN', dt: 't', q: bio })) url.searchParams.set(key, value)
const response = await fetch(url)
console.log(response.status, (await response.text()).slice(0, 1000))
