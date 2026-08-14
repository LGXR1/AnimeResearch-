import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const APPEND = {
  209: '他与透之间温柔又别扭的感情，令人心动不已。',
  366: '她的反差与痴情，为作品带来了无数欢笑。',
  3461: '他的爽朗，让有马的世界多了一份温暖。',
  3464: '她的真诚，为这段细腻的恋爱增添了一抹活力。',
  3467: '她的支持，是雪野最温暖的后盾。',
  11864: '他的可爱，为这对欢喜冤家增添了温馨。',
  24202: '他的吐槽，是这个小团体里不可或缺的乐趣。',
  24204: '他的慵懒，与哥哥的温柔形成有趣的反差。',
  24206: '他的活力，为平淡的日常带来欢笑。',
  48221: '他的恶趣味，为这部作品增添了紧张与趣味。',
  73655: '他的执着，是巴卫与奈奈生恋爱路上最大的阻碍。',
  128652: '她与花子之间温暖的羁绊令人心动。',
  137221: '他与花子的复杂关系，是作品最沉重的谜团。',
  137222: '他的正义与善良，是主角团可靠的支柱。',
  137223: '她的神秘，为作品增添了更多悬念。',
  206: '他复杂的心思，让这部作品充满了耐人寻味之处。',
  3519: '他的痛苦与深情，令人既心疼又着迷。',
  3594: '她的细腻感情，是这部作品温柔的一笔。',
  24203: '他的治愈，是这部作品最温暖的底色。',
  32392: '她的纯真，是这部作品里最治愈人心的存在。',
  208: '他走出阴影的成长，是作品最动人的部分之一。',
  373: '他的存在，折射出草摩家沉重的阴影。',
  3520: '他与优姬深刻的羁绊，贯穿了整个故事。',
  3592: '他的忠诚，为这部阴暗的作品增添了一抹华丽。',
  3595: '他的神秘气质，为夜间部增添了独特魅力。',
  12653: '他的温柔，是琴子追爱路上可靠的支持。',
  28947: '她的呆萌，为作品增添了一抹轻松治愈。',
  32391: '她的反差，让这条路线格外有魅力。',
  32394: '她的成长，为这条路线增添了治愈与温馨。',
  32393: '她的爽朗，是这部作品里最温暖的一条路线。',
  32395: '她外冷内热的反差，令人印象深刻。',
  37871: '他的指引，是奈奈生成长路上重要的明灯。',
  32396: '她的梦幻气质，让这条路线格外令人心动。',
  37876: '她的爽朗，为这部奇幻恋爱剧增添了不少热闹。',
  47007: '他的专一与深情，令人心动又心疼。',
  48201: '他的守护，是妖馆里令人安心的存在。',
  62407: '她的温柔，为凛凛蝶孤独的心带来慰藉。',
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
