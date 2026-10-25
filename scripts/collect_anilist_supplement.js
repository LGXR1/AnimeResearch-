import fs from 'node:fs'
const file = process.argv.find(x => x.startsWith('--file='))?.slice(7)
if (!file) throw new Error('请指定 --file=...（补充查询清单）')
const tasks = JSON.parse(fs.readFileSync(file, 'utf8'))
const sleep = ms => new Promise(r => setTimeout(r, ms))
const query = `query($search:String!){Page(perPage:10){characters(search:$search){
  id name{full native alternative} image{large} description(asHtml:false) gender age
  media(type:ANIME,perPage:50){edges{node{id} characterRole voiceActors(language:JAPANESE){id name{full native} image{large}}}}
}}}`
const results = []
for (const task of tasks) {
  const snapshotPath = `data/anime_update_drafts/anime-source-${task.mediaId}.json`
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
  for (const search of task.names) {
    for (let attempt = 0; attempt < 4; attempt++) {
      await sleep(800)
      const r = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { search } }) })
      if (r.status === 429 && attempt < 3) { await sleep(Math.max(60000, Number(r.headers.get('retry-after') || 60) * 1000)); continue }
      if (!r.ok) throw new Error(`AniList ${r.status}`)
      const response = await r.json()
      if (response.errors) throw new Error(JSON.stringify(response.errors))
      const matches = response.data.Page.characters.map(node => ({ node, edge: node.media.edges.find(e => e.node.id === task.mediaId) })).filter(x => x.edge)
      for (const match of matches) {
        const { media, ...node } = match.node
        if (!snapshot.characters.some(x => x.node.id === node.id)) snapshot.characters.push({ role: match.edge.characterRole, node, voiceActors: match.edge.voiceActors })
      }
      console.log(`${task.mediaId}/${search}: ${matches.map(x => `${x.node.name.full}#${x.node.id}`).join(', ') || '未找到与本作品关联的角色'}`)
      results.push({ mediaId: task.mediaId, search, characters: matches.map(x => x.node) })
      fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2))
      fs.writeFileSync(`${file}.results.json`, JSON.stringify(results, null, 2))
      break
    }
  }
}
