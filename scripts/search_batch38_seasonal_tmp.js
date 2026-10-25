const query = `query { Page(page:1,perPage:50) { media(season:FALL,seasonYear:2026,type:ANIME,countryOfOrigin:JP,sort:POPULARITY_DESC) { id title { english romaji native } synonyms format status startDate { year month day } genres } } }`
const response = await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})})
if(!response.ok)throw new Error(await response.text())
const body=await response.json();if(body.errors)throw new Error(JSON.stringify(body.errors))
for(const m of body.data.Page.media)console.log(JSON.stringify({id:m.id,title:m.title.english||m.title.romaji,native:m.title.native,synonyms:m.synonyms.slice(0,3),format:m.format,status:m.status,date:m.startDate,genres:m.genres}))
