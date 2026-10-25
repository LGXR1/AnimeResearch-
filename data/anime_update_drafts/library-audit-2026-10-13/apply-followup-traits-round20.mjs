import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const updates = {
  28074: ['旧家居住的灰羽儿童', '在旧家与其他灰羽共同生活', '在茧中梦见短蛋糕', '因茧中梦境中的短蛋糕而得名', '参与旧家的日常生活', '与旧家孩子们一起适应新生活', '是旧家群像中的年幼成员', '其梦境与灰羽取名习俗相关'],
  28166: ['又称凯介', '金田所率暴走族的高阶成员', '早期戏份较少', '随着故事推进变得更重要', '与金田一行有旧日交情', '熟悉暴走族团体生活', '支持金田一方的行动', '在东京超能力事件中面对危险'],
  28381: ['柚木加菜子的生母', '对外以加菜子的姐姐身份出现', '属于柚木家', '加菜子在车站出事后牵涉其家庭线', '关心加菜子的安危', '加菜子失踪及后续调查影响其家庭', '是加菜子最亲近的家人之一', '其真实亲子关系构成案件相关人物背景'],
  28382: ['年轻记者', '关口巽的朋友', '主动调查肢解案件', '通过记者工作接触案件相关人物', '向调查者提供新闻线索', '会整理采访所得资料', '并非专业侦探', '以记者身份参与京极堂一行的调查'],
  29055: ['CMAP成员', '是CMAP中的长发成员', '参与面包对决', '从事面包与料理制作', '对对手会说出“我有点想让你去死”', '也会把这句夸张话说给队友听', '以直白言行形成喜剧反差', '与坪塚拓美等CMAP成员共同参赛'],
  29486: ['天野草莓的妹妹', '擅长钢琴演奏', '拥有音乐方面的天赋', '母亲经常称赞她的音乐能力', '与草莓关系亲近', '在草莓进入圣玛丽学园后仍是其家人', '以钢琴专长与姐姐的糕点专长形成对照', '是草莓回忆家庭生活时的重要家人'],
  29487: ['甜点精灵王国的女王', '统治甜点精灵王国', '负责收集蛋糕卡', '负责保护圣玛丽学园', '掌管精灵世界的秩序', '会关注人类搭档与甜点精灵的合作', '与草莓一行的糕点活动有关', '以女王身份为学园故事带来任务与规则'],
  30106: ['黑道成员', '赤木茂早期遇到的赌徒', '与赤木进行过麻将对局', '是赤木最初的麻将对手之一', '登场于作品早期', '其牌局引出赤木进入地下赌博世界', '在牌局中面对赤木冷静大胆的打法', '是仓田组相关地下麻将事件的人物'],
  30107: ['仓田组首领', '负责管理仓田组成员', '参与地下麻将活动', '涉及赤木茂早期参与的赌局', '以黑道团体领导者身份登场', '需要处理赌局结果与组织利益', '其组织构成作品早期地下社会背景', '是赤木早期对局相关势力的负责人'],
  30579: ['作品中的无名男大学生', '在作品中以“我”自称', '就读于京都的大学', '回顾大学前两年的生活', '憧憬理想中的校园生活', '曾考虑加入社团并结识黑发少女', '不同故事路线呈现不同社团选择', '与小津交往后计划常被打乱'],
  31648: ['克里修纳的重型骑士', '25岁', '一级重型骑士', '纳尔维·斯特莱兹的哥哥', '隶属妹妹带领的部队', '是军队成员', '驾驶重型机甲参与军事行动', '与纳尔维既是同僚也是兄妹'],
  31649: ['男性', '28岁', '来自克里修纳', '上级一级重型骑士', '擅长机甲狙击', '以远距离火力支援部队', '使用机甲参与战斗', '与纳尔维等克里修纳军人并肩作战'],
  31650: ['克里修纳女性军方教官', '身材高挑', '擅长近距离格斗', '负责训练军人', '教授徒手战斗技巧', '有实战经验', '能在不驾驶机甲时应对战斗', '会参与一线军事任务'],
  31651: ['男性雅特涅斯军人', '杰斯的部下', '担任杰斯的第二指挥', '协助杰斯管理部队', '负责传达部队命令', '参与雅特涅斯对克里修纳的军事行动', '在战场上服从杰斯指挥', '是杰斯精锐部队的副官'],
  31652: ['杰斯精锐部队成员', '雅特涅斯军人', '参与过入侵克里修纳的行动', '以机甲驾驶员身份执行任务', '听从杰斯指挥', '在战场上与克里修纳军队交战', '属于雅特涅斯军事部队', '是侵略行动中的基层机师'],
  32556: ['京都大学生“我”的朋友', '性格顽皮', '会怂恿“我”做出不靠谱的选择', '常提到“黑色命运之线”', '与“我”关系亲近又互相捉弄', '让“我”的校园计划偏离预期', '在《春宵苦短，少女前进吧！》以童年形象出现', '是《四叠半神话大系》的主要人物之一'],
  32794: ['法国专业糕点师', '擅长法式糕点制作', '指导小城美夜一行制作皮埃斯蒙泰', '在动画第31集登场', '传授法式大型装饰蛋糕技法', '皮埃斯蒙泰使用层叠糖艺结构', '该技法重视造型与稳定性', '以海外糕点导师身份指导学生'],
  35168: ['天水馆的Amars成员', '与月海等人同住天水馆', '特别迷恋成熟年长的男性', '常对有魅力的中年男性表现激动', '会和天水馆住户谈论自己的喜好', '参与天水馆的日常生活', '与月海等人共同守护天水馆', '以鲜明的年长男性偏好制造喜剧桥段'],
  35470: ['性格活泼', '能理解樱田麻音的口哨表达', '会把麻音的口哨意思转述给其他人', '喜欢热闹', '愿意主动结识新朋友', '与泽渡枫、塙薰和麻音共同活动', '是竹原少女群像的主要成员', '常帮助伙伴沟通交流'],
  35472: ['职业摄影师', '泽渡枫仰慕她的摄影作品', '也欣赏枫捕捉日常情感的照片', '枫曾把自己拍的照片寄给她', '邀请枫参加摄影展', '鼓励枫继续摄影创作', '以成熟摄影师身份指导年轻摄影爱好者', '与泽渡枫建立摄影交流关系'],
  35474: ['天水馆Amars成员', '热爱《三国志》', '谈到三国人物和故事时格外投入', '与月海等人同住天水馆', '参与保护天水馆免遭开发商收购', '对朋友忠诚', '平时有些神经质', '三国志兴趣是其日常互动与笑料来源'],
  36372: ['生活在竹原的猫', '是动物角色而非人类少女', '泽渡枫很想拍下它', '枫多次举起相机却没能拍到它', '相关情节是作品反复出现的轻松桥段', '常在竹原街道与居民生活场景中出现', '与枫的摄影兴趣相关', '为伙伴们的日常增添亲切感'],
  36373: ['塙薰的姐姐', '以家人身份出现在薰的故事中', '关心薰的学校生活', '会关心薰与朋友的交往', '补充塙薰的家庭背景', '与薰处于不同生活阶段', '是薰熟悉的家人', '在作品中属于登场较少的配角'],
  37249: ['南十字学园学生', '是和子与拓人的同班同学', '是和子的亲密朋友', '擅长烹饪', '会与同学分享料理', '陪伴和子参与校园生活', '与戏剧社成员有日常往来', '以友善和料理为同学提供交流机会'],
  37430: ['山岸柠檬的甜点精灵搭档', '名为薄荷', '擅长薄荷口味甜点', '协助柠檬设计糕点', '协助柠檬准备糕点比赛', '与草莓团队的甜点精灵有来往', '连接柠檬在巴黎学园的经历与圣玛丽学园', '属于甜点精灵角色群'],
  39196: ['喜翠庄的资深服务员', '熟悉旅馆接待工作', '会教导绪花等新人接待客人', '喜欢打听旅馆里的人际关系', '常谈论旅馆员工与客人的恋爱话题', '看到年轻女生有男朋友时容易嫉妒', '性格直率', '以八卦言行给旅馆日常带来笑料'],
  39203: ['作家', '曾入住喜翠庄', '会观察周围人物', '写作灵感不足时会求助', '经济困难时曾寻求帮助', '与绪花等旅馆员工有接触', '与莲二等员工的互动引发误会', '其故事呈现旅馆接待客人的日常'],
  39204: ['喜翠庄经营者', '是松前皋月的母亲', '是松前绪花的外祖母', '要求绪花到旅馆工作', '认为年轻人应通过劳动学会独立', '对员工和客人要求严格', '曾独自支撑喜翠庄多年', '与皋月关系紧张但承担家族责任'],
  40668: ['16岁', '身高160厘米', '生日为7月11日', '血型为B型', '来自冲绳', '与三名冲绳童年好友一同来到圣玛丽学园', '专长是舞蹈', '能够为团队表演和糕点展示提供舞蹈演出'],
  41030: ['恐怖组织A21成员', '以A21组织人员身份登场', '参与A21的组织行动', '与宗介及米斯里鲁部队发生冲突', '属于《全金属狂潮》的敌对势力', '其角色身份与A21相关', '在作品相关军事冲突中出现', '已知资料主要确认其组织归属'],
  41902: ['女子学校保健教师', '性格软弱', '对百木伦的额头有异常执着', '会借健康检查等校园接触观察伦', '与鬼头纪美子是同事', '会与纪美子发生争执', '其言行制造校园尴尬场面', '是教师群像中的喜剧角色'],
  41906: ['学校教师', '精力旺盛', '喜欢写诗', '会把诗句带进日常对话', '似乎喜欢同事佐藤幸世', '与佐藤幸世经常争吵', '会在课堂和校园活动中接触学生', '是作品教师群像中的常驻人物'],
  43445: ['大杉高中学生', '是丸尾荣一郎的朋友', '是荣一郎最好的朋友之一', '常与佐佐木结伴观看荣一郎的网球比赛', '关注好友的训练与比赛', '本人并非网球队选手', '所属学校将棋社', '会倾听荣一郎的想法并给予支持'],
  43448: ['南部网球俱乐部教练', '负责基础热身训练', '在荣一郎开始打网球时指导过他', '指导俱乐部的年轻球员', '帮助球员提升网球技术', '参与球员日常训练', '为俱乐部训练提供专业支持', '与荣一郎和鷹崎奈津等球员有训练关系'],
  43846: ['美食会成员', '负责美食竞技场事件中的GT机器人袭击', '参与美食会争夺食材的行动', '参与破坏对手的组织行动', '与IGO局长曼萨姆有接触', '以美食会成员身份执行任务', '出现在特瑞科与美食会交锋剧情中', '其行动体现美食会的幕后攻击体系'],
  43847: ['美食会部下', '属于美食会敌对势力', '是“王者猛犸象”篇章的主要敌方人物之一', '参与争夺猛犸象体内的珍贵食材', '与特瑞科一行发生冲突', '听从美食会组织命令', '属于美食会的基层战斗人员', '为获取食材参与强硬行动'],
}
const descriptionUpdates = {
  28381: '柚木阳子是柚木加菜子的生母，在外界以加菜子的姐姐身份出现。加菜子在车站出事后，阳子和柚木家一同面对她的失踪与后续调查。她关心加菜子的安危；这段隐瞒的亲子关系也是案件相关人物背景的一部分。',
}

const ids = Object.keys(updates).map(Number)
const full = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const kitsu = JSON.parse(fs.readFileSync(`${root}/trait-kitsu-sources.json`, 'utf8'))
const fullById = new Map(full.map((row) => [Number(row.id), row]))
const slimById = new Map(slim.map((row) => [Number(row.id), row]))
for (const id of ids) {
  const traits = updates[id]
  if (!fullById.has(id) || !slimById.has(id) || traits.length < 8 || new Set(traits).size !== traits.length) throw new Error(`角色 ${id} 的本地记录或特征不合格`)
}

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title,nicknames,traits,description').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw charactersResult.error
if (actorsResult.error) throw actorsResult.error
const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位角色，停止写入`)
for (const id of ids) {
  const local = fullById.get(id)
  const remote = remoteById.get(id)
  for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) if (JSON.stringify(local[key] ?? null) !== JSON.stringify(remote[key] ?? null)) throw new Error(`角色 ${id} 的本地与 Supabase ${key} 不一致，停止写入`)
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const names = actorsById.get(Number(actor.character_id)) || []
  names.push(actor.name)
  actorsById.set(Number(actor.character_id), names)
}
const payloads = ids.map((id) => {
  const row = fullById.get(id)
  const traits = updates[id]
  return { id, traits, ...(descriptionUpdates[id] ? { description: descriptionUpdates[id] } : {}), search_text: [row.name, row.anime_title, ...(row.nicknames || []), ...traits, ...(actorsById.get(id) || [])].join(' ') }
})
for (const payload of payloads) {
  const { error } = await db.from('characters').update({ traits: payload.traits, ...(payload.description ? { description: payload.description } : {}), search_text: payload.search_text }).eq('id', payload.id)
  if (error) throw new Error(`角色 ${payload.id} 写入失败：${error.message}`)
}

const readback = await db.from('characters').select('id,traits,description,search_text').in('id', ids)
if (readback.error) throw readback.error
const savedById = new Map((readback.data || []).map((row) => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const payload of payloads) {
  const saved = savedById.get(payload.id)
  const row = fullById.get(payload.id)
  if (JSON.stringify(saved.traits) !== JSON.stringify(payload.traits) || (payload.description && saved.description !== payload.description) || saved.search_text !== payload.search_text || saved.search_text.includes(saved.description || row.description)) throw new Error(`角色 ${payload.id} 回读校验失败`)
  row.traits = saved.traits
  row.description = saved.description
  row.search_text = saved.search_text
  slimById.get(payload.id).traits = saved.traits
  slimById.get(payload.id).description = saved.description
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(full, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = (value) => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) lines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${lines.join('\n')}\n`)

for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = ids.filter((id) => (report.checkedIds || []).map(Number).includes(id))
  if (!batchIds.length) continue
  report.pendingTraitVerificationIds = (report.pendingTraitVerificationIds || []).filter((id) => !batchIds.includes(Number(id)))
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...batchIds])]
  report.localFollowup ||= {}
  report.localFollowup.traitCorrections ||= {}
  for (const id of batchIds) report.localFollowup.traitCorrections[id] = {
    source: `https://anilist.co/character/${id}${kitsu[id]?.exact?.[0]?.url ? `; ${kitsu[id].exact[0].url}` : ''}`,
    correctedAt: new Date().toISOString(),
    readbackVerified: true,
  }
  const batchDescriptionIds = batchIds.filter((id) => descriptionUpdates[id])
  if (batchDescriptionIds.length) {
    report.localFollowup.descriptionCorrections ||= {}
    for (const id of batchDescriptionIds) report.localFollowup.descriptionCorrections[id] = {
      source: `https://anilist.co/character/${id}; ${kitsu[id]?.exact?.[0]?.url || ''}`,
      correctedAt: new Date().toISOString(),
      readbackVerified: true,
    }
  }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const evidence = {
  correctedAt: new Date().toISOString(),
  count: ids.length,
  ids,
  descriptionCorrectedIds: Object.keys(descriptionUpdates).map(Number),
  supabaseReadbackVerified: true,
  searchIndexVerifiedForAllIds: true,
  introExcludedFromSearch: true,
}
fs.writeFileSync(`${root}/followup-traits-round9.json`, JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence, null, 2))
