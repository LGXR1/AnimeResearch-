const titles = [
  'Shoujo Kageki Revue Starlight', 'Dorohedoro', 'BNA', 'Deca-Dence', 'Ergo Proxy',
  '86', 'Sousei no Onmyouji', 'Charlotte', 'Death Parade', 'BEASTARS',
  'Mahoutsukai no Yome', 'Isekai Quartet', 'Canaan', 'Juushinki Pandora', 'Kekkai Sensen'
]
const query = `query ($search:String) { Page(perPage:1) { media(search:$search,type:ANIME) { id title { romaji english native } genres characters(page:1,perPage:50,sort:ROLE) { edges { node { id image { large } } } } } } }`
for (const search of titles) {
  const response = await fetch('https://graphql.anilist.co', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({query, variables:{search}}) })
  const payload = await response.json(); const media = payload.data?.Page?.media?.[0]; const edges = media?.characters?.edges || []
  console.log(JSON.stringify({search,id:media?.id,title:media?.title,count:edges.length,usable:edges.filter(e=>e.node.image?.large?.includes('anilistcdn')&&!e.node.image.large.includes('/default.')).length}))
  await new Promise(resolve=>setTimeout(resolve,750))
}
