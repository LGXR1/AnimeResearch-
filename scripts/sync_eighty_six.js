import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const title = '86 -不存在的战区-'
const records = {
  'シンエイ・ノウゼン': ['辛耶·诺赞', ['Shinei Nouzen', '辛', 'Shin', '诺赞', 'Undertaker'], ['黑发', '红色眼瞳', '先锋部队队长', '战斗天才', '冷静', '寡言', '骁骑兵', '共和国军人', '白银战场']],
  'ヴラディレーナ・ミリーゼ': ['蕾娜·米莉洁', ['Vladilena Milizé', '蕾娜', 'Lena', '米莉洁', '指挥官'], ['银发', '蓝色眼瞳', '共和国军官', '战队指挥官', '正义感', '认真', '温柔', '坚强', '战术天才']],
  'チセ・オーセン': ['琪瑟·奥森', ['Chise Oosen', '琪瑟', 'Chise', '奥森'], ['棕发', '棕色眼瞳', '先锋部队成员', '狙击手', '沉默', '勇敢', '忠诚', '战斗员', '同伴']],
  'ジェローム・カールシュタール': ['杰罗姆·卡尔施塔尔', ['Jerome Karlsthal', '杰罗姆', 'Jerome', '卡尔施塔尔'], ['棕发', '棕色眼瞳', '军方军官', '贵族', '指挥官', '严肃', '经验丰富', '共和国', '责任感']],
  'ハルト・キーツ': ['哈尔特·基茨', ['Haruto Keats', '哈尔特', 'Haruto', '基茨'], ['黑发', '棕色眼瞳', '先锋部队成员', '驾驶员', '直率', '忠诚', '勇敢', '战友', '战斗员']],
  'レフ・アルドレヒト': ['列夫·阿尔德雷希特', ['Lev Aldrecht', '列夫', 'Lev', '阿尔德雷希特'], ['金发', '蓝色眼瞳', '军方军官', '指挥官', '稳重', '严厉', '责任感', '共和国', '经验丰富']],
  'ライデン・シュガ': ['莱登·修加', ['Raiden Shuga', '莱登', 'Raiden', '修加', '队长'], ['黑发', '棕色眼瞳', '先锋部队副队长', '重装兵', '可靠', '沉稳', '勇敢', '保护同伴', '战场老兵']],
  'ダイヤ・イルマ': ['戴亚·伊尔玛', ['Daiya Irma', '戴亚', 'Daiya', '伊尔玛'], ['棕发', '绿色眼瞳', '先锋部队成员', '驾驶员', '温柔', '乐观', '忠诚', '战友', '战斗员']],
  'マイナ・ヤトミカ': ['麦娜·亚特米卡', ['Mina Atomica', '麦娜', 'Mina', '亚特米卡'], ['棕发', '棕色眼瞳', '先锋部队成员', '驾驶员', '开朗', '勇敢', '忠诚', '战友', '战斗员']],
  'クレナ・ククミラ': ['可蕾娜·库库米拉', ['Kurena Kukumila', '可蕾娜', 'Kurena', '库库米拉', 'Gunslinger'], ['红发', '红色眼瞳', '先锋部队成员', '狙击手', '暴躁', '勇敢', '战斗天才', '忠诚', '同伴']],
  'ルイ・キノ': ['路易·基诺', ['Louis Kino', '路易', 'Louis', '基诺'], ['黑发', '棕色眼瞳', '先锋部队成员', '驾驶员', '认真', '沉默', '忠诚', '战友', '战斗员']],
  'アンリエッタ・ペンローズ': ['亨丽埃塔·潘罗斯', ['Henrietta von Penrose', '亨丽埃塔', 'Henrietta', '潘罗斯'], ['棕发', '绿色眼瞳', '共和国技术人员', '工程师', '聪明', '认真', '温柔', '机械专家', '支援部队']],
  'セオト・リッカ': ['赛欧托·利卡', ['Theoto Rikka', '赛欧托', 'Theo', '利卡'], ['黑发', '蓝色眼瞳', '先锋部队成员', '炮手', '冷静', '毒舌', '聪明', '忠诚', '战斗员']],
  'ミクリ・カイロゥ': ['米库里·凯洛', ['Kairou Mikuri', '米库里', 'Kairou', '凯洛'], ['金发', '棕色眼瞳', '先锋部队成员', '驾驶员', '开朗', '乐观', '忠诚', '战友', '战斗员']],
  'ショーレイ・ノウゼン': ['修雷·诺赞', ['Shourei Nouzen', '修雷', 'Shourei', '诺赞', '哥哥'], ['黑发', '红色眼瞳', '先锋部队成员', '战斗员', '冷静', '强大', '兄长', '悲剧', '战场传奇']],
}

function normalize(v) { return (v || '').replace(/[\s・]/g, '') }
function description(name, traits) {
  return `${name}是《${title}》中的重要角色，属于${traits[2]}。他在战场上展现出${traits.slice(3, 6).join('、')}等特点，与队友共同面对军团战争和身份压迫。${name}并非单纯的战斗单位，也在一次次任务中表现出对同伴的忠诚、对生存的坚持，以及在残酷制度下仍然保有的人性。随着战线推进，${name}的选择进一步推动了先锋部队与共和国之间的关系变化。`
}

async function main() {
  const query = `query { Media(id: 116589, type: ANIME) { characters(page: 1, perPage: 50, sort: ROLE) { edges { node { id name { native } image { large } } voiceActors(language: JAPANESE) { name { native } image { large } } } } } }`
  const response = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((e) => e.message).join(', '))
  const source = new Map(payload.data.Media.characters.edges.filter((e) => e.node.name.native).map((e) => [normalize(e.node.name.native), e]))
  const chars = [], vas = []
  for (const [native, [name, nicknames, traits]] of Object.entries(records)) {
    const edge = source.get(normalize(native)); const actor = edge?.voiceActors?.[0]
    if (!edge || !edge.node.image?.large || !actor?.name?.native || !actor.image?.large) throw new Error(`Missing AniList data for ${name}`)
    const character = { id: edge.node.id, name, image: edge.node.image.large, description: description(name, traits).slice(0, 190), anime_title: title, nicknames, traits }
    if (character.description.length < 100 || traits.length < 8) throw new Error(`Invalid data for ${name}`)
    const va = { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' }
    chars.push({ ...character, search_text: [name, title, ...nicknames, ...traits, va.name].join(' ') }); vas.push(va)
  }
  const { error } = await supabase.from('characters').upsert(chars, { onConflict: 'id' }); if (error) throw new Error(error.message)
  const ids = chars.map((c) => c.id); const { error: de } = await supabase.from('voice_actors').delete().in('character_id', ids); if (de) throw new Error(de.message)
  const { error: ve } = await supabase.from('voice_actors').insert(vas); if (ve) throw new Error(ve.message)
  console.log(`Synced ${chars.length} ${title} characters.`)
}
main().catch((e) => { console.error(e.message); process.exit(1) })
