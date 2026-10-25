import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const reportPath = 'data/anime_update_drafts/library-audit-2026-10-13/batch2-audit-report.json'
const profilePath = 'data/anime_update_drafts/library-audit-2026-10-13/anilist-character-profiles.json'
const profilesDoc = JSON.parse(fs.readFileSync(profilePath, 'utf8'))

const fixes = {
  235: {
    description: '四月一日君寻自幼失去双亲，常被只有他能看见的妖怪纠缠。他偶然进入壹原侑子经营的愿望商店，以在店里工作的时间作为实现愿望的代价。君寻负责协助侑子接待客人，性格敏感而热心；在一次次帮人完成心愿的过程中，他逐渐理解妖异、命运与人心之间的联系。',
  },
  236: {
    description: '壹原侑子是经营愿望商店的魔女，能替来访者实现愿望，但必须收取相应代价。她知识渊博、实力强大，也热爱饮酒和美食，常带着四月一日君寻外出处理委托。侑子看似随性戏谑，关键时刻却会以隐晦的话提醒君寻避开危险，并在背后保护他。',
  },
  227: {
    nicknames: ['小叽', 'Chii', 'ちぃ', 'Elda', '艾尔达'],
  },
  241: {
    traits: ['狼群领袖之一', '凭本能追寻乐园', '故乡森林被贾卡拉军队焚毁', '父母与同伴在袭击中遇害', '不信任人类', '起初不愿变成人类外貌', '相信自己肩负寻找乐园的使命', '与切扎有深厚羁绊', '在旅途中逐渐接纳同伴'],
    description: '牙是追寻乐园的狼群领袖之一，习惯凭本能判断方向。他出生的森林被贾卡拉军队焚毁，家人与同伴也在袭击中丧生；当地居民告诉他，自己被森林留下是因为肩负使命。牙因此踏上旅程，起初不信任人类，也不愿变成人类外貌；他与切扎的羁绊，使他始终相信乐园就在前方。',
  },
  242: {
    traits: ['曾属于遭袭的狼群', '因逃离战斗而被同伴逐出', '胸口留有X形伤疤', '性格粗犷而独立', '起初不相信乐园传说', '经常与牙争执', '会保护并关心啸', '擅长战斗且观察敏锐', '逐渐重新接纳狼群同伴'],
    description: '爪曾属于一支遭贾卡拉军队袭击的狼群。逃离战斗后，他因抛下同伴而遭群体逐出，胸口留下醒目的X形伤疤。此后爪长期独自行动，粗犷而自立，起初并不相信乐园传说。他经常与牙争执，却会保护啸，并逐渐接受同伴，重新将自己视作狼群的一员。',
  },
  243: {
    traits: ['最善于在人类社会中行动的狼', '颈上的项圈是追踪标记', '习惯凭直觉判断', '伙伴中嗅觉最灵敏', '贪吃，常因食物分心', '外向健谈', '喜欢搭讪女性', '加入牙等人寻找乐园', '逐渐珍视狼群伙伴'],
    description: '啃最善于在人类社会中行动，颈上的项圈后来被揭示为追踪标记。他习惯凭直觉判断，嗅觉在伙伴中最灵敏，也常因贪吃而分心。啃性格外向，喜欢搭讪女性，擅长与人打交道；他加入牙等人的旅程，逐步从享乐主义的狼变成珍视同伴、共同追寻乐园的一员。',
  },
  244: {
    traits: ['四狼中年纪最小的一位', '常表现得像幼犬', '曾被年长女性当作宠物养大', '对人类怀有亲近感', '珍惜老妇赠予的银色手镯', '仰慕爪', '队伍分开时常跟随爪', '伙伴中听力敏锐', '加入寻找乐园的旅程'],
    description: '啸是四狼中年纪最小的一位，常表现得像幼犬。他曾被一位年长女性当作宠物养大，对人类怀有其他同伴难以理解的亲近感。她送给啸的银色手镯一直被他珍惜。啸仰慕爪，队伍分开时常跟着他；他的听力在伙伴中十分敏锐，也最终加入寻找乐园的旅程。',
  },
  254: {
    description: '古泉一树是凉宫春日招入SOS团的转学生，同时也是机关派来观察春日、维持其情绪稳定的超能力者。他总挂着礼貌的微笑，说话客气，喜欢对团内事件作长篇解释，也常与阿虚下棋。春日情绪波动产生闭锁空间时，古泉会进入其中与神人战斗。',
  },
  267: {
    description: '草壁皋月随父亲和妹妹搬到乡下生活，是懂事的小学生姐姐。母亲住院期间，她承担起照看小梅的责任，也尽力保持乐观。一次等待父亲回家的雨夜，她把伞借给只用树叶挡雨的龙猫；后来小梅走失，皋月向龙猫求助并乘猫巴士寻找妹妹。',
  },
  268: {
    description: '草壁梅是四岁的小女孩，也是皋月的妹妹。她在乡间新家附近最先遇见龙猫，并很快与它成为朋友。得知母亲可能病情加重后，梅独自步行前往医院，中途迷路；皋月向龙猫求助，最终通过猫巴士找到她。梅精力充沛、好奇心强，常凭直觉追逐新奇事物。',
  },
  272: {
    name: '千鸟要',
    nicknames: ['千鸟要', 'Kaname Chidori', '千鳥かなめ', 'Kana'],
    traits: ['身高166厘米', '日本高中生', '“低语者”之一', '潜藏着先进技术知识', '曾在美国留学', '性格直率大胆', '常用折扇敲打相良宗介', '责备宗介把军事习惯带进校园', '由宗介受命保护', '与宗介逐渐发展为恋人'],
    description: '千鸟要是身高166厘米的日本高中生，也是“低语者”之一，潜藏着先进技术知识。她曾在美国留学，性格直率大胆，常用折扇敲打相良宗介，并责备他把军事习惯带进校园。宗介受命保护她，两人从互相斗嘴逐渐发展为恋人关系。',
  },
  305: {
    description: '文斯莫克·山治是草帽海贼团的厨师，擅长以双腿施展踢技，以保护料理用的双手。他由巴拉蒂主厨哲夫教授厨艺与战斗技巧，梦想找到汇集四海鱼类的传说之海“All Blue”。山治珍惜食材、不让任何人挨饿，并以骑士道保护女性，常因好色而陷入喜剧场面。',
  },
  309: {
    description: '托尼托尼·乔巴是一只误食人人果实的驯鹿，加入草帽海贼团后担任船医。果实使他能够思考、说话并有限度地变成人形；蓝波球还能改变他的形态。乔巴天真而容易相信别人，听到赞美时常嘴上否认、行动却明显开心，同时仍因童年遭遇而对人类抱有戒心。',
  },
  311: {
    description: '流川枫是湘北高中一年级的王牌小前锋，身高187厘米，拥有出色的得分能力和全面的篮球技巧。他性格冷淡，除打球外常在睡觉，甚至会骑车时睡着。流川把樱木花道视为笨蛋，两人经常争吵；但他也逐渐认可樱木的球场潜力，并立志成为日本第一高中生球员。',
  },
  312: {
    description: '宫城良田是湘北高中二年级的控球后卫，身高168厘米，凭速度和突破组织球队进攻。他加入篮球队源于热爱这项运动，也因为倾慕经理彩子而更加投入。宫城性格急躁、常与人打架，却只在彩子面前显得温柔；他拒绝陵南的邀请，选择留在湘北追随安西教练。',
  },
  313: {
    description: '三井寿是湘北高中三年级的得分后卫，初中时期曾获MVP。左膝训练受伤后，他过早复出导致伤势加重，长期离开篮球并一度成为不良少年；再次见到安西教练后，他回归球队。三井以精准三分球著称，体能是短板，却常凭强烈意志在关键比赛中坚持作战。',
  },
  314: {
    description: '赤木刚宪是湘北篮球队队长和中锋，身高197厘米，是晴子的哥哥。他严肃自律、成绩优秀，梦想带领球队夺得全国冠军。赤木依靠身高、力量和防守能力支撑球队内线，也逐渐看见樱木花道的篮球天赋；在与山王工业的比赛中，他面对强敌重新振作，带队赢下关键对抗。',
  },
  356: {
    description: '山田亚由美是美术大学的陶艺学生，身材高挑、外貌出众，也在商店街工作。她深深爱着真山巧，却长期得不到回应，即使被劝去寻找别的对象，仍难以放下这段感情。亚由美与花本育关系亲近，像照顾妹妹一样关心她；她对单恋的执着也让自己经历持续的挣扎。',
  },
  378: {
    name: '水无灯里',
    nicknames: ['水无灯里', 'Akari Mizunashi', '水無灯里', 'Momiko', 'Miss Expert of Happiness'],
    traits: ['来自Man-Home', 'Aria公司的见习领航员', '性格开朗随和', '富有浪漫气息', '乐于从日常小事中发现乐趣', '很容易与陌生人成为朋友', '喜欢记录Aqua上的见闻', '划船技术不及爱丽丝', '倒着划船尤其拿手', '后来晋升Prima并获称号“遥远的蓝”'],
    description: '水无灯里来自Man-Home，在新威尼斯担任Aria公司的见习领航员。她性格开朗随和、富有浪漫气息，乐于从平常小事中发现乐趣，也很容易与陌生人成为朋友。灯里常写信记录自己在Aqua的见闻；划船技术未必胜过爱丽丝，但她倒着划船时尤其拿手。',
  },
  379: {
    nicknames: ['艾莉西亚·弗洛伦斯', 'Alicia Florence', 'アリシア・フローレンス', 'Snow White', '白雪'],
    traits: ['Aria公司的Prima领航员', '新威尼斯三大水妖精之一', '称号为“白雪”', '十五岁晋升Prima', '以优雅的划船姿态闻名', '性格温和随和', '是新威尼斯最受欢迎的领航员之一', '喜欢逗弄童年好友晃', '曾推迟晋升考试以继续指导灯里'],
    description: '艾莉西亚·弗洛伦斯是新威尼斯三大水妖精之一，任职于Aria公司，称号为“白雪”。她十五岁便晋升为Prima，是当时最年轻的领航员，以优雅的划船姿态和温和随和的待人方式闻名。艾莉西亚偶尔会逗弄童年好友晃；她原计划通过晋升考试后退休，转任贡多拉协会的管理职务。',
  },
  380: {
    name: '蓝华·S·格兰切斯塔',
    nicknames: ['蓝华·S·格兰切斯塔', 'Aika Granzchesta', '藍華・S・グランチェスタ', 'Gatchapen', '蓝华'],
    traits: ['姬屋公司的见习领航员', '姬屋经营者的独生女与继承人', '灯里在Aqua结交的第一位朋友', '说话直率', '性格好胜', '以领航员技能为傲', '崇拜艾莉西亚', '常说“禁止害羞的台词”', '后来晋升Prima并获称号“蔷薇女王”'],
    description: '蓝华·S·格兰切斯塔是姬屋公司的见习领航员，也是公司继承人。她是灯里在Aqua结交的第一位朋友，性格直率、好胜，常用“禁止害羞的台词”打断灯里的感性发言。蓝华崇拜艾莉西亚，对自己的领航员技术很自豪；后来晋升Prima并获得“蔷薇女王”的称号。',
  },
  381: {
    name: '晃·E·法拉利',
    nicknames: ['晃·E·法拉利', 'Akira Ferrari', '晃・E・フェラーリ', 'Crimson Rose', '真红之玫瑰'],
    traits: ['姬屋公司的Prima领航员', '蓝华的导师', '绰号“恶魔教官”', '训练要求严格', '说话直率且嗓门大', '熟悉新威尼斯的景点', '擅长与顾客交流', '拥有许多女性崇拜者', '与艾莉西亚是童年好友', '曾因艾莉西亚先晋升Prima而不甘'],
    description: '晃·E·法拉利是姬屋公司的Prima领航员，也是蓝华的导师，绰号“恶魔教官”。她训练严格、说话直率，但真心看重蓝华的潜力。晃熟悉新威尼斯景点，擅长与顾客交流，拥有许多女性崇拜者；她与艾莉西亚自幼相识，因艾莉西亚更早晋升Prima而一度心有不甘。',
  },
  382: {
    nicknames: ['爱丽丝·卡罗尔', 'Alice Carroll', 'アリス・キャロル', 'Kohai-chan', '后辈酱'],
    traits: ['Orange Planet的见习领航员', '身高145厘米', '年纪轻轻便显露划船天赋', '因天赋被Orange Planet提早招募', '初登场时冷淡而不易亲近', '说话常带平板语气', '常使用“dekkai”（巨大）一词', '会与灯里和蓝华共同练习', '被蓝华亲昵称为“后辈酱”'],
    description: '爱丽丝·卡罗尔是Orange Planet所属的见习领航员，身高145厘米。她年纪尚轻便展现出卓越的划船天赋，甚至被公司提早招募。爱丽丝初登场时冷淡而高傲，说话常带平板语气，也经常使用“dekkai”（巨大）一词；与灯里、蓝华共同练习后，她逐渐享受这段友情。',
  },
  383: {
    nicknames: ['雅典娜·格洛瑞', 'Athena Glory', 'アテナ・グローリィ', 'Siren', 'Seiren', '天籁之声'],
    traits: ['Orange Planet的Prima领航员', '新威尼斯三大水妖精之一', '爱丽丝的导师', '性格安静天然', '真心关心爱丽丝', '拥有优美的歌喉', '会为顾客演唱', '曾与艾莉西亚和晃一起接受训练', 'Prima称号为“Seiren”（天籁之声）'],
    description: '雅典娜·格洛瑞是Orange Planet所属的Prima领航员，也是爱丽丝的导师，称号为“Seiren”，意为“天籁之声”。她性格安静天然，偶尔因走神闹出小糊涂，却真心关心爱丽丝。雅典娜拥有优美歌喉，会在工作中为顾客演唱，也曾用歌声帮助陷入困境的后辈。',
  },
  385: {
    description: '赈早见琥珀主以“白龙”身份在汤屋侍奉汤婆婆，是千寻进入神灵世界后结识的第一个朋友。他会使用魔法，指导千寻在汤屋生存，却因失去名字而忘记了自己的来历。琥珀主真正来自琥珀川，曾在千寻幼年落水时救过她；千寻帮助他重新想起了原名。',
  },
  392: {
    description: '风是把无幻和仁带上旅途的少女。她的母亲已去世，失踪多年的父亲被称为“有向日葵气味的武士”；茶馆被烧毁后，风将此视为启程信号，雇两人陪她寻找父亲。她勇敢坚韧，遇事善于随机应变，衣服里还藏着宠物飞鼠毛毛，常在危急时帮上忙。',
  },
}

const ids = Object.keys(fixes).map(Number)
const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const localById = new Map(local.map((row) => [Number(row.id), row]))
const batch = local.filter((row) => Number(row.id) > 172).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const missingProfiles = batch.map((row) => Number(row.id)).filter((id) => !profilesDoc.profiles[id])

function applyToLocal() {
  for (const id of ids) {
    const row = localById.get(id)
    if (!row) throw new Error(`本地缺少角色 ${id}`)
    Object.assign(row, fixes[id])
    const actors = row.voice_actors || []
    row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...actors.map((actor) => actor.name)].join(' ')
    if ((row.traits || []).length < 8) throw new Error(`角色 ${id} 特征少于8条`)
    if ((row.description || '').length < 100 || row.description.length > 200) throw new Error(`角色 ${id} 简介长度不合格：${row.description?.length}`)
    if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的 search_text 包含简介`)
  }
}

async function syncDatabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('同步数据库需要本地 Supabase secret 环境变量')
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  const [charactersResult, actorsResult] = await Promise.all([
    db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', ids),
    db.from('voice_actors').select('character_id,name').in('character_id', ids),
  ])
  if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
  if (actorsResult.error) throw new Error(`读取声优失败：${actorsResult.error.message}`)
  const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
  if (remoteById.size !== ids.length) throw new Error(`Supabase 返回${remoteById.size}/${ids.length}位，停止写入`)
  const actorNames = new Map()
  for (const actor of actorsResult.data || []) {
    const list = actorNames.get(Number(actor.character_id)) || []
    list.push(actor.name)
    actorNames.set(Number(actor.character_id), list)
  }
  for (const id of ids) {
    const remote = remoteById.get(id)
    const current = localById.get(id)
    if (remote.anime_title !== current.anime_title) throw new Error(`角色${id}的作品名与本地不一致，停止写入`)
  }
  for (const id of ids) {
    const row = localById.get(id)
    const searchText = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorNames.get(id) || [])].join(' ')
    const payload = { ...fixes[id], search_text: searchText }
    const { error } = await db.from('characters').update(payload).eq('id', id)
    if (error) throw new Error(`写入角色${id}失败：${error.message}`)
  }
  const { data, error } = await db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', ids)
  if (error) throw new Error(`回读角色失败：${error.message}`)
  const readback = new Map((data || []).map((row) => [Number(row.id), row]))
  if (readback.size !== ids.length) throw new Error('数据库回读数量不符')
  for (const id of ids) {
    const got = readback.get(id)
    const row = localById.get(id)
    for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) {
      if (JSON.stringify(got[key]) !== JSON.stringify(row[key])) throw new Error(`角色${id}的 ${key} 回读不一致`)
    }
    const expectedSearchText = [got.name, got.anime_title, ...(got.nicknames || []), ...(got.traits || []), ...(actorNames.get(id) || [])].join(' ')
    if (got.search_text !== expectedSearchText || got.search_text.includes(got.description)) throw new Error(`角色${id}的 search_text 回读不一致`)
    row.search_text = got.search_text
  }
}

function writeLocalExports() {
  const slim = local.map((row) => ({
    id: row.id,
    name: row.name,
    anime_title: row.anime_title,
    image: row.image,
    description: row.description,
    nicknames: row.nicknames || [],
    traits: row.traits || [],
    voice_actors: (row.voice_actors || []).map(({ name, language, image }) => ({ name, language, image })),
  }))
  const csvField = (value) => {
    const s = String(value ?? '')
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
  for (const row of local) {
    lines.push([
      row.id,
      row.name,
      row.anime_title,
      row.image,
      row.description,
      (row.nicknames || []).join('|'),
      (row.traits || []).join('|'),
      (row.voice_actors || []).map((actor) => actor.name).join(','),
    ].map(csvField).join(','))
  }
  fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
  fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
  fs.writeFileSync(csvPath, `\uFEFF${lines.join('\n')}\n`)
}

applyToLocal()
if (process.argv.includes('--sync')) await syncDatabase()
writeLocalExports()

const report = {
  checkedAt: new Date().toISOString(),
  checkedCount: batch.length,
  checkedRange: { firstId: batch[0].id, lastId: batch.at(-1).id },
  modifiedIds: ids,
  source: {
    name: 'AniList GraphQL character profile snapshot',
    fetchedAt: profilesDoc.fetchedAt,
    records: ids.filter((id) => profilesDoc.profiles[id]).map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
  },
  pendingExternalVerificationIds: missingProfiles,
  pendingVisualVerification: '本轮没有通过角色图片验证发色、瞳色；未确认的外观描述不视为已核实。',
  note: process.argv.includes('--sync') ? 'Supabase已写入并回读；search_text包含姓名、作品、别名、特征和声优名，不包含简介。' : '本地导出已更新；尚未同步Supabase。',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, modified: ids.length, missingProfiles, descriptionLengths: ids.map((id) => [id, localById.get(id).description.length]), reportPath }, null, 2))
