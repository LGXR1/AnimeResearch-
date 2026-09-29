import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const animeTitle = '尼古喵喵'

// Character and cast references were checked against the official anime site
// (https://yanineko-anime.com/#anchor-chara) and AniList media 207141.
const records = [
  {
    id: 389131,
    name: '佐藤烟子',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389131-HmFZFXwbZs50.png',
    nicknames: ['Yaniko Satou', 'Yaniko', 'Yani Neko', '烟猫', '尼古喵喵', 'ヤニねこ', '佐藤ヤニ子', 'ヤニ子'],
    traits: ['猫兽人', '女性', '21岁', '重度烟民', '烟瘾强烈', '生活懒散', '家务能力差', '公寓住户', '反复戒烟失败', '颓废系主角'],
    description: '佐藤烟子是《尼古喵喵》的主角，一名二十一岁的猫兽人，重度依赖香烟，常把抽烟放在生活其他事情之前。她住在杂乱的公寓里，生活懒散，戒烟念头总被烟瘾很快击败；面对劝她改变的妹妹和邻居，她也常因缺乏生活能力闹出麻烦。外表可爱，却以邋遢、冲动又难以讨厌的颓废日常成为故事中心。',
    voiceActor: { name: '夏吉优子', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n136272-mAV4SN9bQbHl.png' },
  },
  {
    id: 389132,
    name: '佐藤妹子',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389132-3ciM70jgfTcZ.png',
    nicknames: ['Imoko Satou', 'Imoko', '妹子', '佐藤妹子', 'イモ子', '烟子的妹妹'],
    traits: ['猫兽人', '女性', '高中生', '认真可靠', '成绩优秀', '自律', '责任感强', '照顾姐姐', '生活能力强', '公寓住户'],
    description: '佐藤妹子是烟猫的妹妹，一名认真可靠的高中生，在学校受到尊敬，也常替姐姐照料饮食起居与健康状况。面对烟瘾深重、家务一团乱的烟子，妹子说话直接、管教严格，却始终放不下姐姐；她的责任感与踏实性格和姐姐形成鲜明对照，也是两人日常喜剧的重要来源。',
    voiceActor: { name: '本泉莉奈', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n125577-f48HE13krNVR.jpg' },
  },
  {
    id: 389134,
    name: '越司丸益子',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389134-cmsTQZh1Ekar.png',
    nicknames: ['Yakuko Etsushimaru', 'Yakuko', 'Yakuneko', '药猫', 'ヤクねこ', '越司丸益子'],
    traits: ['猫兽人', '女性', '20岁', '烟猫的后辈', '仰慕烟猫', '称烟猫前辈', '表面乖巧', '私藏过往', '使用违禁药物', '公寓常客'],
    description: '越司丸益子以药猫身份生活，是二十岁的猫兽人，也是烟猫的后辈。她仰慕并称烟猫为前辈，常到公寓串门；表面温顺乖巧，私下却有一段不愿提起的过往，还会在家中使用比香烟更强烈的违禁药物。她与烟猫相处时既依赖又崇拜，隐藏的一面让角色带有危险感，也推动作品以荒唐方式描绘邻里生活。',
    voiceActor: { name: '松冈美里', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n149680-3Rfw8Ji2wyHo.jpg' },
  },
  {
    id: 389135,
    name: '哈梅猫',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389135-w33Gl8bGuqYz.png',
    nicknames: ['Hameko Yurufuwa Anal Tenshi', 'Hameneko', '哈梅子', '哈梅猫', 'ハメねこ', 'ゆるふわ＊天使 ハメ子'],
    traits: ['猫兽人', '女性', '高中生同学', '格斗游戏玩家', '游戏直播主', '视频创作者', '经营哈梅频道', '容易急躁', '情绪外露', '公寓邻居'],
    description: '哈梅子是猫兽人，和烟猫住在同一社区，也曾是药猫的高中同学。她喜欢格斗游戏，经营名为“哈梅频道”的视频账号并进行直播，性格容易急躁，事情不顺时会慌张或发火。她的本名与登记过程围绕星号误读形成尴尬笑点；虽然表面大大咧咧，仍是公寓邻里间经常来往的朋友。',
    voiceActor: { name: '船户由利绘', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n162029-D8keureDZn4D.png' },
  },
  {
    id: 389136,
    name: '西薰子',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389136-SO4zlVFO4WOM.png',
    nicknames: ['Kaoruko Nishi', 'Kansai Neko', '关西猫', 'カンサイねこ', '西薫子', '薰子'],
    traits: ['猫兽人', '女性', '大学生', '关西出身', '关西腔', '业余搞笑艺人', '穿着时髦', '外貌出众', '执着搞笑', '公寓邻居'],
    description: '西薰子是来自关西地区的猫兽人大学生，平时用关西腔说话。她外形漂亮、穿着时髦，安静时给人沉稳印象，开口后却格外执着于搞笑，常因笑点不够好而冷场。薰子与烟猫等邻居来往密切，既想靠喜剧获得认可，也愿意参与朋友间的荒唐生活；她认真追求幽默的反差感构成角色的主要魅力。',
    voiceActor: { name: '清水彩香', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n104108-UXiBJxnycHhL.png' },
  },
  {
    id: 389137,
    name: '酒井阿尔子',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389137-3EDDgqQLXy2g.png',
    nicknames: ['Aruko Sakai', 'Aruneko', 'Al Neko', 'アルねこ', '酒猫', '酒井アル子', '阿尔子'],
    traits: ['猫兽人', '女性', '24岁', '大学生', '外貌娇小', '多次留级', '大酒豪', '嗜酒', '醉后迷路', '公寓邻居'],
    description: '酒井阿尔子是一名二十四岁的猫兽人女大学生，外表娇小，乍看像小学生，却已经多次留级。她嗜酒如命，经常把自己灌醉，外出喝酒时还可能走到很远的地方才回家。大学生身份与稚气外形、酗酒后的失控行为形成强烈反差；她是烟猫公寓里最让人担心的邻居之一，也常在醉酒状态下制造意外。',
    voiceActor: { name: '井泽诗织', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n111453-7fe0B5uogy3Z.png' },
  },
  {
    id: 389139,
    name: '辰野沙织',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b389139-jGpBJK5sMtj9.png',
    nicknames: ['Saori Tatsuno', 'Ochinpo Tatsuo', 'Mankasu', '辰野沙織', 'おちんぽ達郎', 'マンカス', '沙织'],
    traits: ['人类', '女性', '32岁', '漫画家', '笔名おちんぽ達郎', '重度烟民', '公寓住户', '烟猫邻居', '作品销量不佳', '请兽人协助创作'],
    description: '辰野沙织是三十二岁的人类女性，住在烟猫所在公寓，是楼里少见的人类住户。她以笔名“おちんぽ達郎”创作漫画，也是一名重度烟民；作品销量不理想时，她会找烟猫或其他兽人帮忙，结果往往不如预期。沙织性格现实，和邻居们保持松散又古怪的联系，在这群生活脱线的猫兽人中扮演吐槽者与合作伙伴的角色。',
    voiceActor: { name: '明智璃子', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n343492-H8BJ2U2MfAGV.png' },
  },
  {
    id: 395258,
    name: '大谷欧也',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b395258-AJOxvZ46N2Fm.png',
    nicknames: ['Ouya Ootani', 'Ooya', '大家', '房东', '大谷おう也', '大谷欧也'],
    traits: ['人类', '男性', '45岁', '公寓房东', '公寓管理员', '外表威严', '性格讲理', '常识派', '处理住户纠纷', '照顾公寓住户'],
    description: '大谷欧也是四十五岁的人类男性，负责管理烟猫等角色居住的公寓。虽然外表看起来凶狠，他实际上是有耐心、讲道理的房东，常被烟猫的懒散和邻居们的混乱生活拖累。他熟悉公寓住户各自的问题，在关键时候会出面维持秩序、处理麻烦；外表与内在形成反差，是住户们日常冲突中的常识派和可靠成年人。',
    voiceActor: { name: '稻田彻', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95395-HpxLuh4ysrzJ.png' },
  },
]

function buildSearchText(character, voiceActor) {
  return [character.name, character.anime_title, ...character.nicknames, ...character.traits, voiceActor.name].join(' ')
}

function validateRecords() {
  const ids = new Set()
  for (const record of records) {
    if (ids.has(record.id)) throw new Error(`重复角色 ID：${record.id}`)
    ids.add(record.id)
    if (record.traits.length < 8 || record.nicknames.length === 0 || record.description.length < 100 || record.description.length > 200) {
      throw new Error(`${record.name} 不符合角色数据规范：${record.description.length} 字简介。`)
    }
    if (!/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/character\/large\/b\d+-[\w-]+\.(png|jpe?g)$/i.test(record.image)) {
      throw new Error(`${record.name} 的角色图片不是带 hash 的 AniList CDN 地址。`)
    }
    if (!/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/staff\/large\/n\d+-[\w-]+\.(png|jpe?g)$/i.test(record.voiceActor.image)) {
      throw new Error(`${record.name} 的日语声优图片不是带 hash 的 AniList CDN 地址。`)
    }
  }
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    throw new Error('需要 SUPABASE_URL 和 SUPABASE_SECRET_KEY 环境变量。')
  }
  validateRecords()

  const { data: existingTitle, error: titleError } = await supabase
    .from('characters')
    .select('id, name, anime_title')
    .eq('anime_title', animeTitle)
  if (titleError) throw new Error(`查重失败：${titleError.message}`)
  if (existingTitle?.length) {
    throw new Error(`数据库已存在《${animeTitle}》角色：${existingTitle.map((character) => character.name).join('、')}；已停止写入。`)
  }

  const ids = records.map((record) => record.id)
  const { data: existingIds, error: idError } = await supabase
    .from('characters')
    .select('id, name, anime_title')
    .in('id', ids)
  if (idError) throw new Error(`AniList ID 查重失败：${idError.message}`)
  if (existingIds?.length) {
    throw new Error(`AniList ID 已被其他角色占用：${existingIds.map((character) => `${character.id} ${character.name}（${character.anime_title}）`).join('、')}；已停止写入。`)
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

  const { error: characterError } = await supabase.from('characters').insert(characters)
  if (characterError) throw new Error(`角色写入失败：${characterError.message}`)
  const { error: voiceActorError } = await supabase.from('voice_actors').insert(voiceActors)
  if (voiceActorError) throw new Error(`声优写入失败：${voiceActorError.message}`)

  console.log(`已新增《${animeTitle}》${characters.length} 个角色及 ${voiceActors.length} 位日语声优。`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
