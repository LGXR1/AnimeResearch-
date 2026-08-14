import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const ANI_LIST_API = 'https://graphql.anilist.co'
const ANIME_TITLE = '咒术回战'

const records = {
  '伏黒恵': {
    name: '伏黑惠', nicknames: ['Megumi Fushiguro', '伏黑', '惠', 'Megumi', '伏黒恵', '十种影法术', '式神使'],
    traits: ['黑发', '蓝色眼瞳', '冷静', '理智', '自我牺牲', '十种影法术', '咒术高专', '禅院血脉', '式神', '领域展开', '天才咒术师'],
    description: '伏黑惠是东京都立咒术高等专门学校一年级学生，也是禅院家流落在外的血脉。他使用十种影法术召唤玉犬、鵺等式神作战，判断冷静且行动果断。表面上不善言辞、对自己要求严苛，实际上非常重视同伴与自己认可的人；为了守护他人，他常会做出近乎牺牲自己的选择。',
  },
  '虎杖悠仁': {
    name: '虎杖悠仁', nicknames: ['Yuuji Itadori', '虎杖', '悠仁', 'Itadori', '虎杖悠仁', '宿傩容器'],
    traits: ['粉棕发', '棕色眼瞳', '正义感', '善良', '身体素质极强', '宿傩容器', '咒术高专', '诅咒之王', '径庭拳', '黑闪', '重视同伴'],
    description: '虎杖悠仁是《咒术回战》的主角，因吞下两面宿傩的手指而成为诅咒之王的容器，随后进入咒术高专学习。他拥有远超常人的身体能力，并能在战斗中使出径庭拳与黑闪。虎杖性格坦率善良，始终希望让人能得到正确的死亡，也因此会为了同伴和陌生人承担极沉重的代价。',
  },
  '五条悟': {
    name: '五条悟', nicknames: ['Satoru Gojou', '五条', '悟', 'Gojo', '五条悟', '最强咒术师', '六眼'],
    traits: ['白发', '蓝色眼瞳', '高挑', '最强', '随性', '护短', '六眼', '无下限咒术', '咒术高专', '教师', '领域无量空处', '五条家主'],
    description: '五条悟是东京都立咒术高等专门学校教师，也是现代公认最强的咒术师。他同时拥有六眼与无下限咒术，能够展开无量空处领域，实力足以改变咒术界的力量平衡。他平日说话轻佻、行事随性，常以玩笑掩饰严肃判断，却极其重视学生，并试图培养能够改变旧有制度的新一代咒术师。',
  },
  '乙骨憂太': {
    name: '乙骨忧太', nicknames: ['Yuuta Okkotsu', '乙骨', '忧太', 'Yuta', 'Okkotsu', '乙骨憂太', '特级咒术师'],
    traits: ['黑发', '黑色眼瞳', '特级咒术师', '过怨咒灵', '天才', '内向', '善良', '咒术高专', '里香', '模仿术式', '剑术'],
    description: '乙骨忧太是咒术高专二年级学生与特级咒术师，幼年好友祈本里香死后化为特级过怨咒灵并一直附在他身边。他起初因害怕伤害他人而十分自卑，后来在高专同伴的帮助下逐渐学会战斗与承担责任。乙骨拥有庞大的咒力和模仿术式的才能，被五条悟视为极具潜力的咒术师。',
    voiceActor: { name: '绪方惠美', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95287-3moX16xmYedv.png' },
  },
  '夏油傑': {
    name: '夏油杰', nicknames: ['Suguru Getou', '夏油', '杰', 'Geto', 'Suguru', '夏油傑', '最恶诅咒师'],
    traits: ['黑发', '长发', '特级咒术师', '咒灵操术', '反派', '五条悟同期', '理想主义者', '教祖', '袈裟', '心机深沉'],
    description: '夏油杰曾是咒术高专的特级咒术师，与五条悟同为同期挚友。他的术式是咒灵操术，能够收服并驱使大量咒灵。经历任务与理念上的接连冲击后，夏油逐渐否定非术师，走向以咒术师为中心的极端道路。他既是《咒术回战0》的关键反派，也是理解五条悟过去与咒术界矛盾的重要人物。',
  },
  '釘崎野薔薇': {
    name: '钉崎野蔷薇', nicknames: ['Nobara Kugisaki', '钉崎', '野蔷薇', 'Nobara', '釘崎野薔薇', '锤子咒术师'],
    traits: ['橙发', '棕色眼瞳', '豪爽', '自信', '不服输', '钉子咒术', '锤子', '稻草人术式', '咒术高专', '共鸣', '东京梦想'],
    description: '钉崎野蔷薇是从乡下来到东京的咒术高专一年级学生，使用铁钉、锤子和稻草人发动芻灵咒法。她喜欢漂亮衣服与繁华都市，却从不把这些愿望当成软弱的理由。钉崎性格强势直接、好胜且自信，在面对诅咒与敌人时毫不退缩；她坚持以自己的方式活着，也十分珍惜虎杖和伏黑等同伴。',
  },
  '七海建人': {
    name: '七海建人', nicknames: ['Kento Nanami', '七海', 'Nanami', '七海建人', '上班族咒术师', '一级咒术师'],
    traits: ['金发', '棕色眼瞳', '高挑', '认真', '理性', '批判加班', '比率术式', '一级咒术师', '原上班族', '咒术高专', '面冷心热'],
    description: '七海建人是一级咒术师，曾因厌倦咒术界而进入普通公司工作，后来认识到劳动环境同样残酷，最终回归咒术师身份。他以比率术式在目标身上制造弱点，战斗风格精准、克制且高效。七海说话严肃，明确反对无意义加班，却并非冷漠；他始终把保护年轻人和普通人视为自己的职责。',
  },
  '宿儺': {
    name: '两面宿傩', nicknames: ['Sukuna', '宿傩', '两面宿傩', 'Ryomen Sukuna', '両面宿儺', '诅咒之王'],
    traits: ['粉色短发', '红色眼瞳', '诅咒之王', '特级咒物', '虎杖容器', '反派', '残酷', '领域展开', '伏魔御厨子', '斩击术式', '强者至上'],
    description: '两面宿傩是千年前令人闻风丧胆的诅咒之王，其遗留的二十根手指化为无法毁坏的特级咒物。虎杖悠仁吞下手指后，宿傩寄宿于他的身体中，并不断寻找夺回自由的机会。宿傩拥有压倒性的咒力、斩击术式与伏魔御厨子领域，对他人的生命毫无怜悯，只认可绝对的力量与自身的欲望。',
  },
  '真人': {
    name: '真人', nicknames: ['Mahito', '真人', 'Mahito', '呪霊', '无为转变'],
    traits: ['蓝灰发', '异色瞳', '特级咒灵', '反派', '无为转变', '灵魂', '残酷', '狡猾', '缝合线', '变形', '领域展开'],
    description: '真人是由人类对彼此的负面情感诞生的特级咒灵，也是虎杖悠仁的重要敌人。他的无为转变能够直接触碰并改造灵魂，使肉体随之扭曲变形。真人对人类的痛苦没有共情，将杀戮和实验当作成长过程的一部分；他外表像少年般轻佻，实则观察敏锐，能够在战斗中迅速进化并展开自闭圆顿裹领域。',
  },
  '禪院真希': {
    name: '禅院真希', nicknames: ['Maki Zenin', '真希', 'Maki', '禅院真希', '禪院真希', '眼镜学姐'],
    traits: ['黑绿发', '绿色眼瞳', '眼镜', '咒具', '天与咒缚', '咒术高专', '二年级', '近战', '长枪', '要强', '御姐'],
    description: '禅院真希是咒术高专二年级学生，出身重视术式的禅院家，却因几乎没有咒力而长期受到轻视。她依靠天与咒缚带来的优秀身体能力、咒具和刻苦训练与咒灵战斗。真希性格强硬、目标明确，始终想以实力成为禅院家的家主来证明自己。她与妹妹真依复杂的关系，也构成了其成长的重要部分。',
  },
  '狗巻棘': {
    name: '狗卷棘', nicknames: ['Toge Inumaki', '狗卷', '棘', 'Toge', '狗巻棘', '咒言师'],
    traits: ['白发', '紫色眼瞳', '高领制服', '咒言', '咒术高专', '二年级', '饭团语', '寡言', '近战', '反噬', '温柔'],
    description: '狗卷棘是咒术高专二年级学生，继承了狗卷家的咒言术式。他说出口的话会带有强制效果，因此日常只能用饭团馅料词汇与同伴交流，以免无意伤人。战斗时他会用咒言命令敌人行动，但术式强度越高，对自身喉咙的反噬也越明显。狗卷寡言却很会照顾同伴，饭团语也成为其最鲜明的记忆点。',
  },
  'パンダ': {
    name: '熊猫', nicknames: ['Panda', '熊猫', 'パンダ', '突然变异咒骸'],
    traits: ['熊猫', '咒骸', '咒术高专', '二年级', '夜蛾正道', '大猩猩核心', '姐姐核心', '格斗', '可靠', '吐槽役'],
    description: '熊猫是咒术高专二年级学生，也是校长夜蛾正道制作的突然变异咒骸。虽然外形是熊猫，他拥有独立人格与三枚核心，能够切换为力量强大的大猩猩形态等战斗模式。熊猫性格开朗、擅长缓和气氛，也很在意同伴的感受。他并非普通傀儡，而是在夜蛾赋予的生命与自我之间不断确认自身存在的角色。',
  },
  '東堂葵': {
    name: '东堂葵', nicknames: ['Aoi Toudou', '东堂', '葵', 'Todo', '東堂葵', '不义游戏', '虎杖挚友'],
    traits: ['棕发', '棕色眼瞳', '高大', '肌肉', '京都校', '一级咒术师', '不义游戏', '拍手', '战斗狂', '高情商', '偶像高田'],
    description: '东堂葵是京都咒术高专学生，体格魁梧、战斗直觉出色，并在学生时期就达到一级咒术师实力。他的术式不义游戏能通过拍手交换目标位置，使战斗节奏难以预测。东堂以询问他人喜欢的女性类型作为判断标准，言行夸张却有独特的价值观；认可虎杖后，他把对方视为挚友，并在实战中展现出极强的协作与判断能力。',
  },
  '漏瑚': {
    name: '漏瑚', nicknames: ['Jogo', '漏瑚', 'Jougo', '呪霊', '火山头'],
    traits: ['火山头', '独眼', '特级咒灵', '反派', '火焰', '领域展开', '盖棺铁围山', '高温', '咒灵阵营', '急躁'],
    description: '漏瑚是以人类对大地与火山的恐惧为源头诞生的特级咒灵，头部形似火山，能够操纵高温火焰与熔岩。他主张咒灵才是真正的人类，并为此与五条悟等咒术师正面冲突。漏瑚性格急躁、自尊极高，虽然常被最强者压制，但其战斗力并不弱；他展开的盖棺铁围山领域足以在瞬间制造致命高温。',
  },
  '脹相': {
    name: '胀相', nicknames: ['Choso', '胀相', 'Choso', '脹相', '九相图', '赤血操术'],
    traits: ['黑发', '紫色眼瞳', '受肉体', '咒胎九相图', '赤血操术', '穿血', '血液', '兄长', '冷静', '近战', '反派转向同伴'],
    description: '胀相是由咒灵与人类血脉结合而诞生的咒胎九相图受肉体，能够使用赤血操术控制自身血液进行攻击。他起初为替弟弟坏相和血涂复仇而追杀虎杖悠仁，之后因血脉记忆确认虎杖是自己的弟弟，转而以兄长身份守护对方。胀相外表冷峻、战斗方式凶狠，却对家人与手足有极深的执念和责任感。',
  },
  '家入硝子': {
    name: '家入硝子', nicknames: ['Shouko Ieiri', '家入', '硝子', 'Shoko', '家入硝子', '反转术式医生'],
    traits: ['棕发', '棕色眼瞳', '医生', '反转术式', '咒术高专', '五条悟同期', '夏油杰同期', '冷静', '成熟', '烟瘾', '医疗忍者'],
    description: '家入硝子是咒术高专的校医，也是少数能够熟练使用反转术式治疗他人的咒术师。她与五条悟、夏油杰同届，见证了两人从学生时代到分道扬镳的过程。硝子平日神情慵懒、说话冷静，常负责处理咒术师在任务中留下的伤势与遗体。她的医疗能力和稳重判断，是高专体系中不可替代的后方支撑。',
  },
  '冥冥': {
    name: '冥冥', nicknames: ['Mei Mei', '冥冥', 'Meimei', '一级咒术师', '乌鸦操术'],
    traits: ['银发', '棕色眼瞳', '长发', '一级咒术师', '乌鸦操术', '黑鸟操术', '斧头', '金钱至上', '强大', '御姐', '弟控'],
    description: '冥冥是独立行动的一级咒术师，擅长操纵乌鸦进行侦察与攻击，并能以黑鸟操术发动威力极高的舍身一击。她看重报酬与契约，常以直接的金钱标准衡量任务价值，因此给人精明现实的印象。冥冥的战斗经验十分丰富，面对高风险局面仍能保持冷静；她与弟弟忧忧的行动组合也颇具辨识度。',
  },
}

const fallbackVoiceActors = {
  '乙骨憂太': { name: '绪方惠美', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95287-3moX16xmYedv.png' },
}

function buildSearchText(character, voiceActors) {
  return [character.name, character.anime_title, ...character.nicknames, ...character.traits, ...voiceActors.map((v) => v.name)].join(' ')
}

async function fetchAnimeCharacters() {
  const query = `query { Media(id: 113415, type: ANIME) { characters(page: 1, perPage: 50) { edges { node { id name { full native } image { large } } voiceActors(language: JAPANESE) { name { native } image { large } } } } } }`
  const response = await fetch(ANI_LIST_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
  if (!response.ok) throw new Error(`AniList request failed: ${response.status}`)
  const payload = await response.json()
  if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join(', '))
  return payload.data.Media.characters.edges
}

async function main() {
  const source = await fetchAnimeCharacters()
  const sourceByNativeName = new Map(source.map((edge) => [edge.node.name.native, edge]))
  const characters = []
  const voiceActors = []

  for (const [nativeName, details] of Object.entries(records)) {
    const edge = sourceByNativeName.get(nativeName)
    if (!edge) throw new Error(`AniList did not return ${nativeName}; available names: ${[...sourceByNativeName.keys()].join('、')}`)
    const actor = details.voiceActor || edge.voiceActors[0] && { name: edge.voiceActors[0].name.native, image: edge.voiceActors[0].image.large }
    const fallback = fallbackVoiceActors[nativeName]
    const actorData = actor || fallback
    if (!actorData?.name || !actorData?.image) throw new Error(`${details.name} has no verified Japanese voice actor image.`)

    const character = {
      id: edge.node.id,
      name: details.name,
      image: edge.node.image.large,
      description: details.description,
      anime_title: ANIME_TITLE,
      nicknames: details.nicknames,
      traits: [...new Set(details.traits)],
    }
    if (character.description.length < 100 || character.description.length > 200 || character.traits.length < 8 || character.nicknames.length === 0) {
      throw new Error(`${character.name} does not meet the data specification.`)
    }
    const va = { character_id: character.id, name: actorData.name, image: actorData.image, language: '日语' }
    characters.push({ ...character, search_text: buildSearchText(character, [va]) })
    voiceActors.push(va)
  }

  const ids = characters.map((character) => character.id)
  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(`Character sync failed: ${characterError.message}`)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(`Voice actor cleanup failed: ${deleteError.message}`)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (voiceActorError) throw new Error(`Voice actor sync failed: ${voiceActorError.message}`)

  const { data: ayano, error: ayanoError } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits').eq('id', 35876).single()
  if (ayanoError) throw new Error(`Ayano lookup failed: ${ayanoError.message}`)
  const { data: ayanoActors, error: ayanoActorsError } = await supabase.from('voice_actors').select('name').eq('character_id', ayano.id)
  if (ayanoActorsError) throw new Error(`Ayano voice actor lookup failed: ${ayanoActorsError.message}`)
  const normalizedAyano = { ...ayano, traits: [...new Set([...ayano.traits, '学生'])] }
  const ayanoDescription = '学生会长，黑发，性格认真严肃。她是个典型的傲娇，表面上对某位元气少女百般嫌弃，实则偷偷喜欢着对方。她总是为自己的感情纠结不已，做出各种口是心非的举动。那份傲娇之下的少女心，让人忍俊不禁又倍感可爱，也让她更具亲和力。'
  const { error: ayanoUpdateError } = await supabase.from('characters').update({
    description: ayanoDescription,
    traits: normalizedAyano.traits,
    search_text: buildSearchText(normalizedAyano, ayanoActors),
  }).eq('id', ayano.id)
  if (ayanoUpdateError) throw new Error(`Ayano cleanup failed: ${ayanoUpdateError.message}`)
  const { error: ayanoVoiceActorUpdateError } = await supabase.from('voice_actors').update({ language: '日语' }).eq('character_id', ayano.id)
  if (ayanoVoiceActorUpdateError) throw new Error(`Ayano voice actor cleanup failed: ${ayanoVoiceActorUpdateError.message}`)

  console.log(`Synced ${characters.length} ${ANIME_TITLE} characters and ${voiceActors.length} Japanese voice actors; removed duplicate traits from ${ayano.name}.`)
}

main().catch((error) => { console.error(error.message); process.exit(1) })
