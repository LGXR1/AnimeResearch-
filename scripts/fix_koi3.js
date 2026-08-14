import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const APPEND = {
  8029: '她的爽朗，是这部忧伤青春剧里难得的明亮色彩。',
  8030: '他的陪伴，让真一郎沉重的心事有了安放之处。',
  48391: '她与乐从互相讨厌到真心相爱的过程令人心动。',
  52723: '她的纯真，让这段围绕约定的恋爱更加动人。',
  58885: '她的忠诚与少女心，让这个角色格外有魅力。',
  66597: '她的执着追求，为这段多角恋带来了无数笑料。',
  73065: '她的柔弱与善良，牵动着身边每一个人的心。',
  73067: '他从冲动少年到成熟守护者的成长令人动容。',
  86225: '他的沉稳与光的热血形成了鲜明的对比。',
  86227: '她多年隐忍的爱意，让人既心疼又敬佩。',
  86313: '他的克制与守护，是这段青春最温柔的底色。',
  88070: '她藏在心底的喜欢，最终化作了勇敢的告白。',
  88071: '她的元气，为这部忧伤的物语带来了一丝亮色。',
  120992: '她的温柔与隐忍，让这份不能言说的爱格外动人。',
  120990: '他在扭曲的关系里，与花火一起寻找着救赎。',
  120991: '她的存在，撕开了所有人伪装之下的真实欲望。',
  120993: '他的正直，是这部作品里难得的清醒与温暖。',
  139159: '她的陪伴，是花火灰暗青春里的一缕微光。',
  121471: '她的热情，为这对兄妹封闭的生活带来了阳光。',
  121472: '她的可靠，是正宗创作路上最安心的后盾。',
  121475: '她的古风与害羞，让她显得格外可爱动人。',
  122964: '他的直球告白，为毕业前夕的青春注入了勇气。',
  125599: '她的毒舌与可爱，为这部喜剧增添了无数欢乐。',
  125600: '她冷艳外表下隐藏的温柔，令人心动不已。',
  141290: '她对自我认同的探寻，温柔而令人心疼。',
  141296: '他的理解与包容，让这部作品多了一份温暖。',
}

async function main() {
  let n = 0
  for (const [id, extra] of Object.entries(APPEND)) {
    const { data: ch } = await supabase.from('characters').select('description').eq('id', Number(id)).single()
    if (!ch) continue
    await supabase.from('characters').update({ description: (ch.description || '') + extra }).eq('id', Number(id))
    n++
  }
  console.log(`description 补足 ${n} 个`)
  const ids = Object.keys(APPEND).map(Number)
  const { data } = await supabase.from('characters').select('name, description').in('id', ids)
  const short = data.filter(c => !c.description || c.description.length < 100)
  console.log('仍不足100字:', short.length ? short.map(c => c.name + '(' + c.description.length + ')').join('、') : '✅ 无')
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
