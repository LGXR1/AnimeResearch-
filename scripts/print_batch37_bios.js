import fs from 'node:fs'

const start = Number(process.argv.find(x => x.startsWith('--start='))?.slice(8) || 0)
const count = Number(process.argv.find(x => x.startsWith('--count='))?.slice(8) || 5)
const groups = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch37-candidates.json', 'utf8')).slice(start, start + count)
for (const group of groups) {
  console.log(`\n### ${group.mediaId} ${group.title}`)
  for (const c of group.characters) {
    console.log(`\n${c.id} ${c.full} / ${c.native || ''} | ${c.gender || ''} ${c.age || ''} | 声优 ${c.voiceActors.join('、')}`)
    console.log(c.description || '(AniList 无简介)')
  }
}
