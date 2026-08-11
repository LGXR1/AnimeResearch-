import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

const data = [
  // ====== 某科学的超电磁炮 ======
  [13701, {
    name: '御坂美琴', anime_title: '某科学的超电磁炮',
    description: '学园都市仅有的7名超能力者(Level 5)中排名第三，被称为"超电磁炮"。就读于常盘台中学，能力是电击使——可以自由操控电力。性格好胜直率，但对可爱的东西（尤其是呱太）毫无抵抗力。口头禅是"Biri-Biri"。',
    traits: ['棕发', '棕色眼瞳', '傲娇', '好胜', '直率', '呱太控', '电击使', '超电磁炮', 'Level 5', '常盘台中学', '学园都市最强电击使'],
    nicknames: ['Mikoto Misaka', '御坂美琴', '美琴', 'Biri-Biri', '超电磁炮', 'Railgun', '常盘台的王牌'],
    vas: [['佐藤利奈', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95241-4XvR64oguxwS.png']]
  }],
  [17017, {
    name: '白井黑子', anime_title: '某科学的超电磁炮',
    description: '常盘台中学一年级学生，风纪委员第177支部成员。能力是空间移动(Level 4)，可将任意物体瞬间传送到触碰过的地方。对御坂美琴有着近乎偏执的仰慕和爱恋，称呼其为"姐姐大人"。性格认真但面对美琴时会变得异常变态。',
    traits: ['棕发', '棕色眼瞳', '双马尾', '认真', '百合', '变态', '空间移动', 'Level 4', '常盘台中学', '风纪委员', '姐姐大人控'],
    nicknames: ['Kuroko Shirai', '白井黑子', '黑子', 'Shirai', '空间移动', '风纪委员'],
    vas: [['新井里美', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95124-8C0BORTX7Bfd.jpg']]
  }],
  [20622, {
    name: '初春饰利', anime_title: '某科学的超电磁炮',
    description: '栅川中学一年级学生，风纪委员第177支部成员。能力是定温保存(Level 1)，战斗力不高但拥有顶尖的电脑黑客技术。头上总是戴着花饰，性格温柔害羞但关键时刻非常可靠。是白井黑子的搭档和好友。',
    traits: ['黑发', '棕色眼瞳', '花饰', '温柔', '害羞', '黑客', '定温保存', 'Level 1', '栅川中学', '风纪委员', '电脑高手'],
    nicknames: ['Kazari Uiharu', '初春饰利', '饰利', 'Uiharu', '风纪委员', '黑客'],
    vas: [['丰崎爱生', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95599-XDGiluZB7IXL.png']]
  }],
  [20626, {
    name: '佐天泪子', anime_title: '某科学的超电磁炮',
    description: '栅川中学一年级学生，初春饰利的好友。无能力者(Level 0)，但拥有极强的行动力和好奇心。擅长掀裙子（尤其针对初春），性格开朗活泼。对都市传说有着异常的热爱，经常因此卷入各种事件中。',
    traits: ['黑发', '棕色眼瞳', '开朗', '活泼', '掀裙魔', 'Level 0', '无能力者', '栅川中学', '都市传说爱好者', '行动力强'],
    nicknames: ['Ruiko Saten', '佐天泪子', '泪子', 'Saten', '掀裙狂魔', 'Level 0'],
    vas: [['伊藤加奈惠', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95762-qhWmwni3TT6Y.png']]
  }],

  // ====== 蜡笔小新 ======
  [2951, {
    name: '野原新之助', anime_title: '蜡笔小新',
    description: '蜡笔小新的主角，5岁的幼儿园儿童。性格调皮捣蛋，喜欢漂亮大姐姐，经常做出各种荒唐搞笑的举动。最讨厌吃青椒，最爱动感超人和小葵妹妹。口头禅是"嗨，美女~"。虽然顽皮但内心善良。',
    traits: ['黑发', '短眉', '调皮', '好色', '善良', '5岁', '幼儿园', '动感超人迷', '讨厌青椒', '马铃薯头', '搞怪'],
    nicknames: ['Shinnosuke Nohara', '小新', 'Shin-chan', '野原新之助', '蜡笔小新'],
    vas: [['矢岛晶子', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95148-JiNi79wg9ScS.png']]
  }],
  [7854, {
    name: '野原美冴', anime_title: '蜡笔小新',
    description: '野原家的母亲，29岁的全职主妇。性格火爆，经常用拳头痛扁调皮的小新。虽然嘴上唠叨但对家庭充满爱，擅长精打细算和抢购打折商品。年轻时是不良少女，偶尔会展现出惊人的战斗力。',
    traits: ['棕发', '主妇', '暴力妈妈', '精打细算', '29岁', '前不良少女', '暴躁', '爱家庭', '打折达人'],
    nicknames: ['Misae Nohara', '野原美冴', '美冴', 'Misae', '美冴妈妈'],
    vas: [['楢桥美纪', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n96600-v6elhY0JP2iR.png']]
  }],
  [33466, {
    name: '野原广志', anime_title: '蜡笔小新',
    description: '野原家的父亲，35岁的上班族。在双叶商事工作，背负着32年房贷。脚臭是全世界最恐怖的生化武器之一。虽然平时懦弱但关键时刻是可靠的父亲和丈夫。深爱妻子美冴和两个孩子。',
    traits: ['黑发', '上班族', '脚臭', '35岁', '32年房贷', '懦弱', '可靠', '爱家庭', '双叶商事', '课长'],
    nicknames: ['Hiroshi Nohara', '野原广志', '广志', 'Hiroshi', '脚臭之王'],
    vas: [['藤原启治', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95063-xAsEUzspuLMG.jpg']]
  }],
  [7855, {
    name: '野原向日葵', anime_title: '蜡笔小新',
    description: '野原家最小的女儿，小新的妹妹。虽然还是婴儿但展现出超乎寻常的智慧和对帅哥钻石的痴迷。喜欢闪闪发光的东西和美男子。与小新经常争夺妈妈的注意力。',
    traits: ['棕发', '婴儿', '早熟', '帅哥控', '钻石油控', '聪慧', '小新妹妹', '闪闪发光控'],
    nicknames: ['Himawari Nohara', '野原向日葵', '小葵', 'Himawari', '向日葵'],
    vas: [['兴梠里美', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95470-xZYG14WGMlmS.png']]
  }],

  // ====== 名侦探柯南 ======
  [1742, {
    name: '江户川柯南', anime_title: '名侦探柯南',
    description: '名侦探柯南的主角。真实身份是高中生侦探工藤新一，被黑衣组织灌下APTX4869后身体缩小为小学生。化名江户川柯南寄住在毛利侦探事务所，一边解决各种案件一边追查黑衣组织的下落。名言是"真相只有一个"。',
    traits: ['黑发', '蓝色眼瞳', '小学生外表', '天才', '冷静', '推理狂', '足球高手', '变声蝴蝶结', '麻醉手表', '黑衣组织追踪者', '平成福尔摩斯'],
    nicknames: ['Conan Edogawa', '江户川柯南', '柯南', '工藤新一', 'Shinichi Kudo', '平成年代的福尔摩斯', '银色子弹'],
    vas: [['高山南', '']]
  }],
  [1748, {
    name: '毛利兰', anime_title: '名侦探柯南',
    description: '毛利小五郎的女儿，工藤新一的青梅竹马。帝丹高中空手道部主将，实力极强。性格温柔善良但有些天然呆，一直在等待新一回来。直觉非常敏锐，多次怀疑柯南的真实身份。',
    traits: ['黑发', '蓝色眼瞳', '长发', '温柔', '善良', '空手道高手', '天然呆', '直觉敏锐', '帝丹高中', '等待新一'],
    nicknames: ['Ran Mouri', '毛利兰', '小兰', 'Ran', '空手道主将', 'Angel'],
    vas: [['山崎和佳奈', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95496-PAwWafRnHtEf.png']]
  }],
  [1746, {
    name: '毛利小五郎', anime_title: '名侦探柯南',
    description: '毛利兰的父亲，私家侦探。平时一副好酒好色的大叔模样，但在关键时刻会展现出惊人的推理能力。经常被柯南用麻醉针射晕后成为"沉睡的小五郎"进行推理。前警察，柔道高手，极度疼爱女儿。',
    traits: ['黑发', '大叔', '好酒', '好色', '私家侦探', '沉睡小五郎', '柔道', '前警察', '疼爱女儿', '搞笑担当'],
    nicknames: ['Kogorou Mouri', '毛利小五郎', '小五郎', 'Kogoro', '沉睡的小五郎'],
    vas: [['小山力也', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95113-z9eyYjTKSTX4.png']]
  }],
  [9177, {
    name: '工藤优作', anime_title: '名侦探柯南',
    description: '工藤新一的父亲，世界知名的推理小说家，创造了畅销角色"暗夜男爵"。推理能力远超新一，是第一个看穿黑衣组织存在的人。性格沉稳洒脱，与妻子有希子定居美国。',
    traits: ['黑发', '中年', '沉稳', '天才', '推理小说家', '暗夜男爵', '新一父亲', '世界级', '有希子丈夫'],
    nicknames: ['Yusaku Kudo', '工藤优作', '优作', '暗夜男爵作者'],
    vas: [['田中秀幸', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95234-YAu7XmoSIIS7.png']]
  }],

  // ====== JOJO的奇妙冒险 ======
  [4003, {
    name: '空条承太郎', anime_title: 'JOJO的奇妙冒险',
    description: 'JOJO系列第三部《星尘斗士》的主角。高中生，身高195cm，拥有替身"白金之星"——速度和精度在替身中名列前茅，最终觉醒时停能力。性格冷酷寡言但内心正义。名言是"呀嘞呀嘞打贼"。',
    traits: ['黑发', '绿色眼瞳', '195cm', '高中生', '冷酷', '沉默寡言', '正义', '替身使', '白金之星', '时停', '海洋学家', 'JOJO'],
    nicknames: ['Joutarou Kuujou', '空条承太郎', '承太郎', 'Jotaro', 'JOJO', '卖鱼强'],
    vas: [['小野大辅', '']]
  }],
  [6356, {
    name: '约瑟夫·乔斯达', anime_title: 'JOJO的奇妙冒险',
    description: 'JOJO系列第二部《战斗潮流》的主角，承太郎的外公。拥有替身"隐者之紫"以及波纹气功。年轻时性格狡黠机敏、擅长智斗，老年依然活力十足。名言是"接下来你会说…"以及各种经典逃跑宣言。',
    traits: ['棕发', '蓝色眼瞳', '高挑', '狡黠', '机智', '波纹气功', '替身使', '隐者之紫', 'JOJO', '年轻时帅爆'],
    nicknames: ['Joseph Joestar', '约瑟夫·乔斯达', '二乔', 'Joseph', 'JOJO', '老东西'],
    vas: [['杉田智和', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95002-nDIvHaynicEg.png']]
  }],
  [8945, {
    name: '花京院典明', anime_title: 'JOJO的奇妙冒险',
    description: 'JOJO第三部《星尘斗士》中承太郎的伙伴。拥有替身"绿色法皇"，可以伸长的绿色人形替身，擅长远距离攻击和结界。性格冷静沉着、观察力极强，是队伍中的智谋担当。爱吃樱桃的独特方式成为名场面。',
    traits: ['红发', '冷静', '沉着', '观察力极强', '替身使', '绿色法皇', '高中生', '智谋', '樱桃名场面'],
    nicknames: ['Noriaki Kakyouin', '花京院典明', '花京院', 'Kakyoin', '绿色法皇'],
    vas: [['平川大辅', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95183-5C42gbrKIP7L.png']]
  }],
  [4368, {
    name: '简·皮耶尔·波鲁纳雷夫', anime_title: 'JOJO的奇妙冒险',
    description: 'JOJO第三部中承太郎的伙伴，法国人。拥有替身"银色战车"——持剑的银白骑士替身，速度极快。性格热血冲动但重情重义，是队伍中的活跃气氛者。背负着妹妹被杀害的过去，为了复仇而踏上旅途。',
    traits: ['银发', '高挑', '热血', '冲动', '重情义', '法国人', '替身使', '银色战车', '复仇', '气氛活跃'],
    nicknames: ['Jean-Pierre Polnareff', '波鲁纳雷夫', 'Polnareff', '银色战车', '法国人'],
    vas: [['小松史法', 'https://s4.anilist.co/file/anilistcdn/staff/medium/12524.jpg']]
  }],
  [8946, {
    name: '穆罕默德·阿布德尔', anime_title: 'JOJO的奇妙冒险',
    description: 'JOJO第三部中承太郎的伙伴，埃及占卜师。拥有替身"红色魔术师"——操控火焰的替身。性格沉稳可靠、富有智慧，是乔斯达家族的老朋友。对替身和DIO的了解帮助团队多次化险为夷。',
    traits: ['黑发', '埃及人', '沉稳', '智慧', '占卜师', '替身使', '红色魔术师', '火焰', '可靠', '乔斯达家族旧友'],
    nicknames: ['Mohammed Avdol', '阿布德尔', 'Avdol', '红色魔术师', '占卜师'],
    vas: [['三宅健太', 'https://s4.anilist.co/file/anilistcdn/staff/medium/n95720-enxx6kZKuwGi.jpg']]
  }],
]

let count = 0
for (const [id, d] of data) {
  const { error } = await supabase.from('characters').upsert({
    id, name: d.name, anime_title: d.anime_title,
    description: d.description, traits: d.traits, nicknames: d.nicknames,
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b' + id + '.jpg',
  }, { onConflict: 'id' })

  // Insert VAs
  if (d.vas) {
    await supabase.from('voice_actors').delete().eq('character_id', id)
    for (const [name, img] of d.vas) {
      await supabase.from('voice_actors').insert({ character_id: id, name, image: img, language: '日语' })
    }
  }

  process.stdout.write(error ? '❌' : '+')
  count++
}

// Rebuild search_text
console.log('\n重建 search_text...')
const { data: chars } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)')
for (const c of chars || []) {
  const st = [c.name, c.anime_title||'', ...(c.nicknames||[]), ...(c.traits||[]), ...(c.voice_actors||[]).map(v=>v.name)].join(' ')
  await supabase.from('characters').update({ search_text: st }).eq('id', c.id)
}

console.log('✅', count, '个角色入库')
