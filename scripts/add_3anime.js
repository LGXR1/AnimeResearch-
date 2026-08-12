import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const data = [
  // ====== 命运石之门 ======
  [35252, {
    name: '冈部伦太郎', anime_title: '命运石之门', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b35252-DY9TW6pusqeh.png',
    description: '东京电机大学一年级学生，自称"疯狂科学家凤凰院凶真"。创立了未来道具研究所，性格中二但本质善良。偶然间发明了可以向过去发送邮件的时间机器——电话微波炉。为了拯救重要的人反复穿越世界线。',
    traits: ['棕发', '中二病', '疯狂科学家', '时间机器', '世界线', 'LabMem No.001', '白大褂', '大学生', '凤凰院凶真', '正义感'],
    nicknames: ['Rintarou Okabe', '冈部伦太郎', '凤凰院凶真', 'Okarin', 'Hououin Kyouma'],
    vas: [['宫野真守', '']]
  }],
  [34470, {
    name: '牧濑红莉栖', anime_title: '命运石之门', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b34470-Jw2LXZBL5R8i.png',
    description: '年仅18岁的天才少女，维克多·康多利亚大学脑科学研究所研究员。被称为"实验控"，对未知事物有强烈的好奇心。虽然自称傲娇但性格严谨理性，帮助冈部伦太郎完善了时间旅行理论。口头禅是"我不是实验品！"。',
    traits: ['红发', '长发', '傲娇', '天才', '18岁', '脑科学研究', '大学研究员', 'LabMem No.004', '助手', '实验控'],
    nicknames: ['Kurisu Makise', '牧濑红莉栖', '克里斯蒂娜', '助手', 'Christina', '天才少女'],
    vas: [['今井麻美', '']]
  }],
  [35253, {
    name: '椎名真由理', anime_title: '命运石之门', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b35253-u6QVgLLyHq2W.png',
    description: '冈部伦太郎的青梅竹马，私立花浅葱大学附属高中二年级学生。性格天真烂漫，口头禅是"嘟嘟噜~"。喜欢制作Cosplay服装，是未来道具研究所的气氛担当。她的命运是整个故事最关键的转折点。',
    traits: ['黑发', '短发', '天真', '开朗', '嘟嘟噜', 'Cosplay', '高中生', '青梅竹马', 'LabMem No.002', '气氛担当'],
    nicknames: ['Mayuri Shiina', '椎名真由理', '真由理', 'Mayushii', '嘟嘟噜'],
    vas: [['花泽香菜', '']]
  }],
  [35258, {
    name: '桥田至', anime_title: '命运石之门', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b35258-FeTGR4LEUNvt.png',
    description: '东京电机大学一年级学生，冈部伦太郎的同学和好友。重度网络宅男，黑客技术一流。同时也是超级黑客"桶子"，在2ch上被称为传说级人物。虽然满嘴黄段子但内心善良，对未来妻子和女儿有着深深的爱。',
    traits: ['黑发', '肥胖', '宅男', '黑客', '超级黑客', '2ch传说', '大学生', 'LabMem No.003', '黄段子', '桶子'],
    nicknames: ['Itaru Hashida', '桥田至', '桶子', 'Daru', '超级厨客'],
    vas: [['关智一', '']]
  }],
  [35255, {
    name: '阿万音铃羽', anime_title: '命运石之门', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b35255-Ra9Aq5Kn9lYq.png',
    description: '在秋叶原遇到的元气少女，热爱骑自行车。真实身份是从未来2036年穿越回来的时间旅行者，代号"约翰·泰塔"。她回到过去的使命是寻找失落的IBN5100电脑以改变绝望的未来。',
    traits: ['黑发', '马尾', '元气', '活泼', '时间旅行者', '2036年', '自行车', '未来人', '军人', 'LabMem No.008'],
    nicknames: ['Suzuha Amane', '阿万音铃羽', '铃羽', '约翰·泰塔', '打工战士'],
    vas: [['田村由香里', '']]
  }],

  // ====== 叛逆的鲁鲁修 ======
  [417, {
    name: '鲁鲁修·兰佩路基', anime_title: '叛逆的鲁鲁修', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b417-gVLmIJu9phcK.png',
    description: '神圣不列颠帝国第11皇子，被父亲流放到日本后隐姓埋名。拥有极高的智慧和战略天赋，在遇到C.C.后获得了绝对服从的Geass能力。化身为Zero领导黑色骑士团对抗不列颠帝国，为了实现妹妹娜娜莉能幸福生活的世界而不惜一切代价。',
    traits: ['黑发', '紫瞳', '高挑', '天才', '腹黑', '战略家', 'Zero', 'Geass', '皇子', '复仇', '妹控'],
    nicknames: ['Lelouch Lamperouge', '鲁鲁修', 'Zero', 'Lelouch vi Britannia', '黑色王子'],
    vas: [['福山润', '']]
  }],
  [559, {
    name: '枢木朱雀', anime_title: '叛逆的鲁鲁修', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b559-KRvTdc6zdCuU.jpg',
    description: '日本最后的首相之子，鲁鲁修的童年好友。驾驶兰斯洛特成为不列颠的圆桌骑士，坚信从体制内部改变才是正确之道。虽然心地善良但理想主义过头，与选择革命道路的鲁鲁修成为宿命的对立面。体力怪物级别的战斗力。',
    traits: ['棕发', '绿色眼瞳', '体力怪物', '善良', '理想主义', '圆桌骑士', '兰斯洛特', '日本人', '首相之子', '矛盾体'],
    nicknames: ['Suzaku Kururugi', '枢木朱雀', '朱雀', '白色骑士', '兰斯洛特驾驶员'],
    vas: [['樱井孝宏', '']]
  }],
  [1111, {
    name: 'C.C.', anime_title: '叛逆的鲁鲁修', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b1111-UhmlFtRFrnWa.png',
    description: '拥有不老不死之力的神秘少女，被称为"魔女"。与鲁鲁修签订契约赋予他Geass的力量。真实身份跨越数百年历史，经历过无数孤独和背叛。喜欢吃披萨，尤其是必胜客。口头禅是"男人真是愚蠢"。',
    traits: ['绿发', '金色眼瞳', '不老不死', '魔女', 'Geass契约者', '披萨控', '神秘', '孤独', '数百年阅历', 'Code持有者'],
    nicknames: ['C.C.', 'C2', '魔女', '披萨女', '不老不死的魔女'],
    vas: [['ゆかな', '']]
  }],
  [558, {
    name: '卡莲·修坦费尔德', anime_title: '叛逆的鲁鲁修', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b558-8tSMZ4a0LWrn.jpg',
    description: '不列颠与日本混血儿，在校身份是不列颠贵族学生实为黑色骑士团王牌驾驶员。驾驶红莲贰式战斗力极强，对Zero(鲁鲁修)忠诚且爱慕。性格火爆冲动，是黑色骑士团最强的战斗力之一。',
    traits: ['红发', '混血', '王牌驾驶员', '红莲贰式', '黑色骑士团', '火爆', '忠诚', '贵族学生伪装', '强大战力'],
    nicknames: ['Kallen Stadtfeld', '卡莲', '红莲', '黑骑士王牌'],
    vas: [['小清水亚美', '']]
  }],

  // ====== 死亡笔记 ======
  [80, {
    name: '夜神月', anime_title: '死亡笔记', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b80-26EhwSsSqQ50.png',
    description: '天才高中生，在全国统考中排名第一。捡到死神琉克故意丢到人间的死亡笔记后，化名"基拉"开始制裁罪犯。拥有超凡的智慧和冷静的判断力，在追求成为"新世界的神"的过程中逐渐堕入黑暗。名言是"计划通り"。',
    traits: ['棕发', '棕色眼瞳', '天才', '冷静', '腹黑', '基拉', '死亡笔记', '高中生', '全国第一', '新世界的神'],
    nicknames: ['Light Yagami', '夜神月', '基拉', 'Kira', '新世界的神', 'Light'],
    vas: [['宫野真守', '']]
  }],
  [71, {
    name: 'L', anime_title: '死亡笔记', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b71-1W4panC53vfs.png',
    description: '世界最顶尖的侦探，真实姓名L·Lawliet。用超凡的推理能力追查基拉的真实身份。习惯蹲坐在椅子上，极度爱吃甜食。赤脚走路，黑眼圈极重。虽然外表古怪但智力不输夜神月，两人的智斗是整个故事的核心。',
    traits: ['黑发', '黑眼圈', '甜食控', '蹲坐', '侦探', '世界第一', '推理', '赤脚', '孤僻', '正义'],
    nicknames: ['L Lawliet', 'L', 'L·Lawliet', '世界第一侦探', '龙崎'],
    vas: [['山口胜平', '']]
  }],
  [835, {
    name: '弥海砂', anime_title: '死亡笔记', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b835-CiZa8y2z2gCz.png',
    description: '人气偶像模特和歌手，拥有另一本死亡笔记。对基拉极度崇拜和迷恋，用死神之眼的能力换取了一半寿命来帮助夜神月。性格天真冲动，虽然智商不如夜神月和L，但死神之眼的特殊能力使她成为关键人物。',
    traits: ['金发', '偶像', '模特', '歌手', '死亡笔记', '死神之眼', '迷恋基拉', '天真', '冲动', 'Gothic Lolita'],
    nicknames: ['Misa Amane', '弥海砂', 'Misa', 'Misa Misa', '第二基拉'],
    vas: [['平野绫', '']]
  }],
  [75, {
    name: '琉克', anime_title: '死亡笔记', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b75-IkEpzO21LgFy.jpg',
    description: '死神界的死神，因为无聊故意将自己的死亡笔记丢到人间。喜欢吃苹果，声称苹果对死神来说就像人类的烟酒一样。以旁观者姿态观察夜神月使用死亡笔记，但偶尔也会给予关键提示。外表恐怖但性格随性。',
    traits: ['死神', '苹果控', '旁观者', '随性', '恐怖外表', '死亡笔记原持有者', '翅膀', '死神之眼'],
    nicknames: ['Ryuk', '琉克', 'Ryuk', '死神', '苹果死神'],
    vas: [['中村狮童', '']]
  }],
]

let count = 0
for (const [id, d] of data) {
  const { error } = await supabase.from('characters').upsert({
    id, name: d.name, anime_title: d.anime_title,
    description: d.description, traits: d.traits, nicknames: d.nicknames,
    image: d.image,
  }, { onConflict: 'id' })
  if (d.vas) {
    await supabase.from('voice_actors').delete().eq('character_id', id)
    for (const [name, img] of d.vas) {
      await supabase.from('voice_actors').insert({ character_id: id, name, image: img || '', language: '日语' })
    }
  }
  process.stdout.write(error ? '❌' : '+')
  count++
}

console.log('\n重建 search_text...')
const { data: chars } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)')
for (const c of chars || []) {
  const st = [c.name, c.anime_title||'', ...(c.nicknames||[]), ...(c.traits||[]), ...(c.voice_actors||[]).map(v=>v.name)].join(' ')
  await supabase.from('characters').update({ search_text: st }).eq('id', c.id)
}
console.log('✅', count, '个角色入库')
