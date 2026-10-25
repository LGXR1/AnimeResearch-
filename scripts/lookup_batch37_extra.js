const titles = ['TRILLION GAME']
for (const title of titles) {
  const query = `query($search:String){Media(search:$search,type:ANIME){id title{english romaji native}status countryOfOrigin characters(page:1,perPage:25){pageInfo{total}edges{node{id name{full native}description image{large}}voiceActors(language:JAPANESE){id image{large}}}}}}`
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { search: title } }),
  })
  if (!response.ok) throw new Error(`${title}: AniList HTTP ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(JSON.stringify(payload.errors))
  const media = payload.data.Media
  console.log(JSON.stringify({ searched: title, id: media?.id, title: media?.title, status: media?.status,
    total: media?.characters.pageInfo.total,
    withVoiceImage: media?.characters.edges.filter(e => e.node.image?.large?.includes('anilistcdn') && e.voiceActors.some(v => v.image?.large?.includes('anilistcdn'))).length,
    withBio: media?.characters.edges.filter(e => (e.node.description || '').replace(/<[^>]+>/g, '').length >= 40).length }))
  await new Promise(resolve => setTimeout(resolve, 900))
}
