import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const api = 'https://graphql.anilist.co'

const groups = [
  { id: 20464, title: '排球少年', names: {
    '月島蛍': ['月岛萤', ['Kei Tsukishima', '月岛', '萤', 'Kei'], ['金发', '眼镜', '副攻手', '毒舌', '冷静', '分析型', '乌野高中', '排球部', '傲娇']],
    '山口忠': ['山口忠', ['Tadashi Yamaguchi', '山口', '忠', 'Tadashi'], ['棕发', '发球高手', '跳飘球', '乌野高中', '排球部', '努力', '胆怯', '成长', '月岛的朋友']],
    '田中龍之介': ['田中龙之介', ['Ryuunosuke Tanaka', '田中', '龙之介', 'Tanaka'], ['黑发', '强攻手', '乌野高中', '排球部', '热血', '直率', '前辈', '可靠', '精神支柱']],
    '西谷夕': ['西谷夕', ['Yu Nishinoya', '西谷', '夕', 'Noya'], ['黑发', '自由人', '乌野高中', '排球部', '防守天才', '元气', '勇敢', '前辈', '守护者']],
    '澤村大地': ['泽村大地', ['Daichi Sawamura', '泽村', '大地', 'Daichi'], ['黑发', '队长', '主攻手', '乌野高中', '排球部', '稳重', '责任感', '可靠', '团队核心']],
    '菅原孝支': ['菅原孝支', ['Koshi Sugawara', '菅原', '孝支', 'Suga'], ['灰发', '二传手', '乌野高中', '排球部', '温柔', '乐观', '替补队长', '观察力', '前辈']],
    '及川徹': ['及川彻', ['Toru Oikawa', '及川', '彻', 'Oikawa'], ['棕发', '二传手', '青叶城西', '排球部', '天才', '努力型', '人气', '自信', '主将']],
    '黒尾鉄朗': ['黑尾铁朗', ['Tetsuro Kuroo', '黑尾', '铁朗', 'Kuroo'], ['黑发', '队长', '拦网手', '音驹高中', '排球部', '狡猾', '聪明', '可靠', '研磨的朋友']],
  } },
  { id: 269, title: '死神', names: {
    '浦原喜助': ['浦原喜助', ['Kisuke Urahara', '浦原', '喜助', 'Urahara'], ['金发', '前十二番队队长', '发明家', '地下商店', '死神', '聪明', '神秘', '斩魄刀', '幕后支援']],
    '日番谷冬獅郎': ['日番谷冬狮郎', ['Toshiro Hitsugaya', '日番谷', '冬狮郎', 'Hitsugaya'], ['白发', '十番队队长', '冰轮丸', '死神', '天才', '冷静', '责任感', '少年外表', '护廷十三队']],
    '朽木白哉': ['朽木白哉', ['Byakuya Kuchiki', '朽木', '白哉', 'Byakuya'], ['黑发', '六番队队长', '千本樱', '死神', '贵族', '冷静', '严肃', '露琪亚的哥哥', '护廷十三队']],
    '更木剣八': ['更木剑八', ['Kenpachi Zaraki', '更木', '剑八', 'Kenpachi'], ['黑发', '十一番队队长', '战斗狂', '死神', '强大', '豪放', '野性', '剑术', '护廷十三队']],
    '涅マユリ': ['涅茧利', ['Mayuri Kurotsuchi', '涅', '茧利', 'Mayuri'], ['蓝发', '十二番队队长', '技术开发局', '死神', '科学家', '疯狂', '毒素', '改造', '天才']],
    '藍染惣右介': ['蓝染惣右介', ['Sosuke Aizen', '蓝染', '惣右介', 'Aizen'], ['棕发', '前五番队队长', '镜花水月', '死神', '反派', '天才', '操纵', '野心', '神秘']],
    '石田雨竜': ['石田雨龙', ['Uryuu Ishida', '石田', '雨龙', 'Uryu'], ['黑发', '灭却师', '弓箭', '学生', '冷静', '认真', '一护的伙伴', '医疗知识', '骄傲']],
    '阿散井恋次': ['阿散井恋次', ['Renji Abarai', '阿散井', '恋次', 'Renji'], ['红发', '六番队副队长', '蛇尾丸', '死神', '热血', '直率', '露琪亚的青梅竹马', '忠诚', '成长']],
  } },
  { id: 918, title: '银魂', names: {
    '桂小太郎': ['桂小太郎', ['Kotarou Katsura', '桂', '小太郎', 'Zura'], ['黑发', '攘夷志士', '长发', '剑术', '革命家', '天然', '认真', '假发', '银时的朋友']],
    '高杉晋助': ['高杉晋助', ['Shinsuke Takasugi', '高杉', '晋助', 'Takasugi'], ['紫发', '鬼兵队首领', '攘夷志士', '剑术', '反派', '野心', '冷酷', '三味线', '银时的宿敌']],
    '土方十四郎': ['土方十四郎', ['Toshiro Hijikata', '土方', '十四郎', 'Hijikata'], ['黑发', '真选组副长', '剑术', '副长', '严厉', '责任感', '蛋黄酱控', '冷静', '可靠']],
    '沖田総悟': ['冲田总悟', ['Sougo Okita', '冲田', '总悟', 'Okita'], ['红发', '真选组一番队队长', '剑术', '天才', '腹黑', '毒舌', '危险', '懒散', '土方的对手']],
    '近藤勲': ['近藤勋', ['Isao Kondo', '近藤', '勋', 'Kondo'], ['棕发', '真选组局长', '剑术', '武士', '热血', '善良', '执着', '可靠', '大猩猩']],
    '志村妙': ['志村妙', ['Tae Shimura', '志村', '妙', 'Otae'], ['黑发', '剑术', '道场', '新八的姐姐', '强大', '温柔', '暴力', '坚强', '料理灾难']],
    '柳生九兵衛': ['柳生九兵卫', ['Kyuubei Yagyuu', '柳生', '九兵卫', 'Kyubei'], ['蓝发', '剑术天才', '柳生家', '武士', '认真', '忠诚', '中性气质', '阿妙的朋友', '强大']],
    '神威': ['神威', ['Kamui', '神威', '夜兔', 'Kamui'], ['橙发', '夜兔族', '宇宙海盗', '战斗狂', '强大', '冷酷', '兄控', '速度快', '神乐的哥哥']],
  } },
  { id: 1575, title: '叛逆的鲁鲁修', names: {
    'ナナリー・ランペルージ': ['娜娜莉·兰佩路基', ['Nunnally Lamperouge', '娜娜莉', 'Nunnally', '鲁鲁修的妹妹'], ['白发', '紫色眼瞳', '皇女', '失明', '温柔', '善良', '和平主义', '鲁鲁修的妹妹', '坚强']],
    'ジェレミア・ゴットバルト': ['杰雷米亚·戈特巴尔特', ['Jeremiah Gottwald', '杰雷米亚', 'Orange', 'Jeremiah'], ['橙发', '圆桌骑士', 'Geass Canceler', '忠诚', '骑士', '改造人', '严肃', '鲁鲁修的部下', '战斗力强']],
    '枢木スザク': ['枢木朱雀', ['Suzaku Kururugi', '枢木', '朱雀', 'Suzaku'], ['棕发', '兰斯洛特驾驶员', '圆桌骑士', '日本人', '理想主义', '善良', '体术强', '鲁鲁修的朋友', '矛盾']],
    'ミレイ・アッシュフォード': ['米蕾·阿什福德', ['Milly Ashford', '米蕾', 'Milly', '学生会长'], ['金发', '学生会长', '贵族', '开朗', '恶作剧', '体贴', '阿什福德家', '朋友很多', '组织能力']],
    'ユーフェミア・リ・ブリタニア': ['尤菲米娅·li·布里塔尼亚', ['Euphemia li Britannia', '尤菲', 'Euphy', 'Euphemia'], ['粉发', '皇女', '温柔', '善良', '和平主义', '理想', '鲁鲁修的妹妹', '政治家', '悲剧']],
    'ロロ・ランペルージ': ['罗洛·兰佩路基', ['Rolo Lamperouge', '罗洛', 'Rolo', 'Geass使用者'], ['棕发', 'Geass使用者', '时间停止', '弟弟身份', '冷酷', '依赖鲁鲁修', '杀手', '孤独', '忠诚']],
  } },
  { id: 20755, title: '暗杀教室', names: {
    '赤羽業': ['赤羽业', ['Karma Akabane', '赤羽', '业', 'Karma'], ['红发', 'E班学生', '天才', '暗杀', '不良少年', '聪明', '好胜', '战斗力强', '潮田渚的朋友']],
    '茅野カエデ': ['茅野枫', ['Kaede Kayano', '茅野', '枫', 'Kaede'], ['绿发', 'E班学生', '伪装高手', '暗杀', '演技', '温柔', '坚强', '朋友很多', '料理']],
    '中村莉桜': ['中村莉樱', ['Rio Nakamura', '中村', '莉樱', 'Rio'], ['金发', 'E班学生', '英语高手', '开朗', '毒舌', '恶作剧', '暗杀', '聪明', '运动能力']],
    '神崎有希子': ['神崎有希子', ['Yukiko Kanzaki', '神崎', '有希子', 'Yukiko'], ['黑发', 'E班学生', '温柔', '优等生', '游戏高手', '安静', '暗杀', '人气', '责任感']],
    '奥田愛美': ['奥田爱美', ['Manami Okuda', '奥田', '爱美', 'Manami'], ['黑发', 'E班学生', '化学', '药剂', '认真', '内向', '暗杀', '善良', '努力']],
    '磯貝悠馬': ['矶贝悠马', ['Yuuma Isogai', '矶贝', '悠马', 'Isogai'], ['棕发', 'E班班长', '剑术', '领导力', '温柔', '可靠', '贫困', '暗杀', '责任感']],
    '片岡メグ': ['片冈惠', ['Meg Kataoka', '片冈', '惠', 'Meg'], ['棕发', 'E班学生', '游泳', '运动', '认真', '责任感', '暗杀', '温柔', '班级干部']],
    '前原陽斗': ['前原阳斗', ['Hiroto Maehara', '前原', '阳斗', 'Maehara'], ['棕发', 'E班学生', '运动', '足球', '开朗', '恋爱高手', '暗杀', '朋友多', '直率']],
  } },
]

function desc(name, title, traits) {
  return `${name}是《${title}》中的重要角色，拥有${traits.slice(0, 4).join('、')}等鲜明特征。故事中，${name}凭借自己的能力与性格参与核心事件，并与主要角色建立了紧密联系。${name}并非只承担单一功能：在冲突、日常和团队合作中，${name}都会做出属于自己的选择，也因此展现出成长、责任与情感变化。随着剧情推进，${name}的经历进一步丰富了作品的世界观和人物关系。`.slice(0, 190)
}

function normalizeName(name) {
  return name.replace(/[\s・]/g, '')
}

async function main() {
  const chars = [], vas = []
  for (const group of groups) {
    const source = new Map()
    for (let page = 1; page <= 3; page += 1) {
      const query = `query { Media(id: ${group.id}, type: ANIME) { characters(page: ${page}, perPage: 50, sort: ROLE) { edges { node { id name { native } image { large } } voiceActors(language: JAPANESE) { name { native } image { large } } } } } }`
      const response = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
      const payload = await response.json()
      if (payload.errors) throw new Error(payload.errors.map((e) => e.message).join(', '))
      for (const edge of payload.data.Media.characters.edges) {
        if (edge.node.name.native) source.set(normalizeName(edge.node.name.native), edge)
      }
      await new Promise((resolve) => setTimeout(resolve, 700))
    }
    for (const [native, [name, nicknames, traits]] of Object.entries(group.names)) {
      const edge = source.get(normalizeName(native))
      if (!edge) {
        console.warn(`Skipping ${name}: AniList did not return ${native} for this season`)
        continue
      }
      const actor = edge.voiceActors[0]
      if (!actor?.name?.native || !actor.image?.large || !edge.node.image?.large) throw new Error(`${name} missing image or voice actor`)
      const character = { id: edge.node.id, name, image: edge.node.image.large, description: desc(name, group.title, traits), anime_title: group.title, nicknames, traits }
      if (character.description.length < 100 || character.description.length > 200 || traits.length < 8) throw new Error(`${name} fails data spec (${character.description.length})`)
      const va = { character_id: character.id, name: actor.name.native, image: actor.image.large, language: '日语' }
      chars.push({ ...character, search_text: [name, group.title, ...nicknames, ...traits, va.name].join(' ') })
      vas.push(va)
    }
  }
  const { error } = await supabase.from('characters').upsert(chars, { onConflict: 'id' }); if (error) throw new Error(error.message)
  const ids = chars.map((c) => c.id)
  const { error: delError } = await supabase.from('voice_actors').delete().in('character_id', ids); if (delError) throw new Error(delError.message)
  const { error: vaError } = await supabase.from('voice_actors').insert(vas); if (vaError) throw new Error(vaError.message)
  console.log(`Synced ${chars.length} characters across ${groups.length} anime.`)
}
main().catch((e) => { console.error(e.message); process.exit(1) })
