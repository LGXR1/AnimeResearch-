import fs from 'node:fs'
const ids = process.argv.slice(2).map(Number)
const fields = `id title{english romaji native} status countryOfOrigin characters(sort:FAVOURITES_DESC,page:1,perPage:50){edges{node{id name{full}description image{large}}voiceActors(language:JAPANESE){id image{large}}}}`
const query = `query{${ids.map((id,i)=>`m${i}:Media(id:${id}){${fields}}`).join('\n')}}`
const response=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})})
if(!response.ok)throw new Error(await response.text())
const body=await response.json();if(body.errors)throw new Error(JSON.stringify(body.errors))
const known=new Set(JSON.parse(fs.readFileSync('data/characters_full.json','utf8')).map(x=>x.id))
for(let i=0;i<ids.length;i++){
 const m=body.data[`m${i}`];if(!m)continue
 const fresh=m.characters.edges.filter(e=>!known.has(e.node.id)&&e.node.image?.large&&e.voiceActors.some(v=>v.image?.large))
 const bios=fresh.filter(e=>(e.node.description||'').replace(/<[^>]*>/g,'').length>=40)
 console.log(m.id,m.title.english||m.title.romaji,m.title.native,m.status,`fresh=${fresh.length}`,`bio=${bios.length}`)
 for(const e of bios.slice(0,15))console.log(e.node.id,e.node.name.full,(e.node.description||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,160))
}
