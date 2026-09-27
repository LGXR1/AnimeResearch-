import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const animeTitle = '斩！赤红之瞳'

const records = [
  {
    id: 63351,
    name: '赤瞳',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b63351-0WmsDENpiscp.png',
    nicknames: ['Akame', 'Akame ga Kill!', '斩赤红之瞳', '赤瞳', '赤目', '黑瞳的姐姐', '村雨使', 'アカメ'],
    traits: ['黑发', '红色眼瞳', '黑色制服', '冷静', '寡言', '帝具村雨', '居合斩', '夜袭成员', '帝国暗杀者', '剑术高手', '重视同伴'],
    description: '赤瞳是革命组织夜袭的核心成员，曾在帝国培养的暗杀部队接受严酷训练，后来认清帝国的腐败而转向反抗。她使用帝具村雨作战，刀刃只要划伤目标便能以咒毒致死，因此每次出手都必须精准果断。赤瞳平日沉默冷静，偶尔也会显露喜欢吃肉的一面；她把夜袭伙伴视为家人，并背负着与过去诀别的决心。',
    voiceActor: { name: '雨宫天', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n116517-xjN5V1jMc443.jpg' },
  },
  {
    id: 65239,
    name: '艾斯德斯',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b65239-2S3t2vSyUew9.png',
    nicknames: ['Esdeath', '斩赤红之瞳', '艾斯德斯将军', '艾斯', 'エスデス', '帝国最强将军', '冰之女王'],
    traits: ['浅蓝长发', '蓝色眼瞳', '高挑', '将军', '帝具魔神显现', '冰系能力', '战斗狂', '强势', '冷酷', '喜欢塔兹米', '帝国军人'],
    description: '艾斯德斯是帝国最强将军之一，出身北方狩猎民族，凭借残酷战场磨炼出强大的实力与支配欲。她持有帝具魔神显现·恶魔之粹，可以操纵冰雪并制造大范围攻击，战斗中冷静而好战。艾斯德斯将弱肉强食视为世界法则，对敌人毫不留情，却对塔兹米产生了真挚而强烈的感情；她的个人信念也与夜袭的革命理想正面冲突。',
    voiceActor: { name: '明坂聪美', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95723-bV625Jngt5o6.png' },
  },
  {
    id: 65229,
    name: '玛茵',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b65229-hYOZtUlIpd5G.png',
    nicknames: ['Mine', '斩赤红之瞳', '玛茵', '粉红枪手', '狙击手', 'マイン', '浪漫炮台南瓜'],
    traits: ['粉色双马尾', '粉红发', '蓝色眼瞳', '傲娇', '狙击手', '浪漫炮台南瓜', '帝具使', '夜袭成员', '远程攻击', '自尊心强', '革命军'],
    description: '玛茵是夜袭的远程战斗成员，拥有帝具浪漫炮台·南瓜，能将精神能量转化为威力强大的光束，危机越大火力越强。她擅长狙击与掩护，粉色双马尾和娇小外表下有着好胜又敏锐的判断力。玛茵说话直接、容易与人争执，常被看作傲娇，但她十分珍惜同伴，也愿意为革命承担危险任务；与塔兹米逐渐建立的信任让她展现出柔软的一面。',
    voiceActor: { name: '田村由香里', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95027-Zm9onZDUN7ih.jpg' },
  },
  {
    id: 65227,
    name: '雷欧奈',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b65227-PWmfiEVJbCwQ.png',
    nicknames: ['Leone', '斩赤红之瞳', '雷欧奈', '大姐头', '狮子王使', 'レオーネ', '夜袭大姐姐'],
    traits: ['金色长发', '金色眼瞳', '兽耳', '开朗豪爽', '力量型战士', '帝具狮子王', '野性因子', '夜袭成员', '近身格斗', '情报收集', '照顾后辈'],
    description: '雷欧奈是夜袭中爽朗可靠的姐姐型成员，熟悉帝都贫民区，也常负责招募、联络和收集情报。她使用帝具狮子王·狮子永不死，能够变身为力量与感官大幅强化的兽化形态，擅长近身搏斗。雷欧奈表面上爱开玩笑、举止随意，关键时刻却十分沉着，尤其关照塔兹米等新人。她对帝都底层生活有切身体会，因此坚定支持推翻腐败统治。',
    voiceActor: { name: '浅川悠', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95119-ExV6YzTBbIZE.png' },
  },
  {
    id: 64749,
    name: '塔兹米',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/64749-a2ZdRWW1D5TR.jpg',
    nicknames: ['Tatsumi', '斩赤红之瞳', '塔兹米', '塔滋米', 'タツミ', '帝具恶鬼缠身使', '夜袭新人'],
    traits: ['棕发', '红棕色眼瞳', '少年', '正直', '热血', '村庄出身', '恶鬼缠身', '帝具使', '近战剑士', '夜袭成员', '重视伙伴'],
    description: '塔兹米来自偏远村庄，为了拯救家乡而前往帝都，却亲眼见识贵族与权势者的残酷，最终加入夜袭。他起初使用普通长剑，后来继承帝具恶鬼缠身·入侵，获得强韧铠甲与惊人的战斗能力。塔兹米性格正直热血，愿意相信他人，也会在残酷现实中不断成长。他与赤瞳、玛茵等伙伴并肩作战，逐渐理解革命所需付出的代价。',
    voiceActor: { name: '齐藤壮马', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n113227-x0UXLNL6v08X.png' },
  },
  {
    id: 65231,
    name: '拉伯克',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/65231-2QpM2yw2X86k.png',
    nicknames: ['Lubbock', '斩赤红之瞳', '拉伯克', '拉伯', 'ラバック', '千变万化交叉之尾', '夜袭情报员'],
    traits: ['绿发', '绿色眼瞳', '轻浮外表', '机敏', '帝具千变万化', '线操纵', '陷阱专家', '夜袭成员', '情报分析', '忠诚', '暗恋娜洁希坦'],
    description: '拉伯克是夜袭成员，出身富裕商人家庭，却自愿追随首领娜洁希坦投身革命。他使用帝具千变万化·交叉之尾操纵坚韧丝线，可布置陷阱、束缚敌人、切割目标，也能制作防护与感知装置。拉伯克平时言行轻佻，喜欢幻想与调侃，实际头脑灵活、临场应变出色，对组织十分忠诚。他长期暗恋娜洁希坦，却将这份心意藏在玩笑背后。',
    voiceActor: { name: '松冈祯丞', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n106817-mioGQjbTWWQ6.png' },
  },
  {
    id: 65237,
    name: '切尔茜',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b65237-6r8wMUJ6pCOF.png',
    nicknames: ['Chelsea', '斩赤红之瞳', '切尔茜', '切尔西', 'チェルシー', '变身刺客', '盖亚粉底使'],
    traits: ['红棕色短发', '红色眼瞳', '冷静', '毒舌', '帝具盖亚粉底', '变身能力', '暗杀专家', '狙击', '夜袭成员', '擅长伪装', '棒棒糖'],
    description: '切尔茜是加入夜袭的刺客，擅长观察目标习惯并寻找一击制胜的机会。她的帝具盖亚粉底能改变外貌，使她伪装成其他人或动物，从而接近敌人完成暗杀。切尔茜头脑冷静、说话犀利，常以现实判断提醒伙伴不要鲁莽，也喜欢嚼棒棒糖。她并不崇尚正面决斗，而是将情报、耐心和伪装结合起来，在任务中发挥独特作用。',
    voiceActor: { name: '名冢佳织', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95078-tMm7zdlRNZ3P.jpg' },
  },
  {
    id: 65233,
    name: '希尔',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b65233-f8RXB4LQiNh0.png',
    nicknames: ['Sheele', '斩赤红之瞳', '希尔', '席拉', 'シェーレ', '万物两断使', '夜袭眼镜娘'],
    traits: ['紫色长发', '紫色眼瞳', '眼镜', '温柔', '天然呆', '帝具万物两断', '巨型剪刀', '夜袭成员', '暗杀者', '近身战斗', '重视朋友'],
    description: '希尔是夜袭的暗杀者，外表文静温柔，平时有些迷糊，却拥有强大的战斗意志。她使用帝具万物两断·消魂，外形是一把巨型剪刀，能够剪断几乎任何目标，也可用来防御和近身攻击。希尔加入夜袭前曾因笨拙而无法适应普通工作，但她始终珍惜帮助过自己的人。她与玛茵情同姐妹，在组织中以体贴和坚定支持着伙伴。',
    voiceActor: { name: '能登麻美子', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95040-hSONMMOAmiJ6.jpg' },
  },
]

function buildSearchText(character, voiceActor) {
  return [character.name, character.anime_title, ...character.nicknames, ...character.traits, voiceActor.name].join(' ')
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。')
  }

  for (const record of records) {
    if (record.traits.length < 8 || record.nicknames.length === 0 || record.description.length < 100 || record.description.length > 200) {
      throw new Error(`${record.name} 不符合角色数据规范：${record.description.length} 字简介。`)
    }
  }

  const { data: existing, error: lookupError } = await supabase
    .from('characters')
    .select('id, name, anime_title')
    .eq('anime_title', animeTitle)
  if (lookupError) throw new Error(`查重失败：${lookupError.message}`)
  const expectedIds = new Set(records.map((record) => record.id))
  const unexpected = (existing || []).filter((character) => !expectedIds.has(character.id))
  if (unexpected.length) {
    throw new Error(`数据库中存在本脚本未覆盖的《${animeTitle}》角色：${unexpected.map((character) => character.name).join('、')}；为避免误改，已停止写入。`)
  }

  const characters = records.map((record) => {
    const character = {
      id: record.id,
      name: record.name,
      image: record.image,
      description: record.description,
      anime_title: animeTitle,
      nicknames: record.nicknames,
      traits: record.traits,
    }
    return { ...character, search_text: buildSearchText(character, record.voiceActor) }
  })
  const voiceActors = records.map((record) => ({
    character_id: record.id,
    name: record.voiceActor.name,
    image: record.voiceActor.image,
    language: '日语',
  }))

  const { error: characterError } = await supabase.from('characters').upsert(characters, { onConflict: 'id' })
  if (characterError) throw new Error(`角色写入失败：${characterError.message}`)
  const ids = characters.map((character) => character.id)
  const { error: deleteError } = await supabase.from('voice_actors').delete().in('character_id', ids)
  if (deleteError) throw new Error(`旧声优数据清理失败：${deleteError.message}`)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (voiceActorError) throw new Error(`声优写入失败：${voiceActorError.message}`)

  console.log(`已同步《${animeTitle}》${characters.length} 个角色及 ${voiceActors.length} 位日语声优。`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
