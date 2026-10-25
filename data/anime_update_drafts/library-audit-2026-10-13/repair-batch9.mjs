import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const profileDoc = JSON.parse(fs.readFileSync(`${root}/anilist-character-profiles.json`, 'utf8'))
const startIndex = local.findIndex((row) => Number(row.id) === 2767)
if (startIndex < 0) throw new Error('找不到上批最后一位角色 ID 2767')
const batch = local.slice(startIndex + 1).filter((row) => Number(row.id) < 990000000).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const ids = batch.map((row) => Number(row.id))

const fixes = {
  2769: {
    traits: ['西浦高中一年级学生', '西浦棒球队的投手', '身高约165厘米', '曾是三桥中学棒球队的王牌投手', '投球控球精准但球速不快', '性格紧张且极度缺乏自信', '容易因他人的反应而自责', '在新队友支持下逐渐建立信心', '将投手丘视为自己必须守住的位置'],
    description: '三桥廉是西浦高中一年级学生，也是棒球队的投手，身高约165厘米。他曾是三桥中学棒球队的王牌投手，却因队友认为教练偏袒而变得紧张自卑。廉的球速不快，但控球精准；在捕手阿部与队友的支持下，他逐渐建立信心并学会信任团队。',
  },
  2802: {
    traits: ['虾夷族的年轻首领', '为保护村庄而与邪神化的野猪神交战', '右臂因此受到诅咒', '离开故乡寻找诅咒根源', '擅长使用弓箭', '骑乘红色麋鹿亚克路', '努力以不偏不倚的眼光理解冲突', '希望阻止森林与人类互相毁灭', '与白狼神养女珊建立联系'],
    description: '阿席达卡是虾夷族的年轻首领，为保护村庄与邪神化的野猪神交战后，右臂受到诅咒。他离开故乡寻找诅咒根源，擅长使用弓箭，并骑乘麋鹿亚克路。他试图以不偏不倚的眼光理解森林与人类的冲突，也与白狼神养女珊建立联系。',
  },
  2815: {
    traits: ['深阳学园的学生', '是《幻影死神》早期事件的关键人物', '成为螳螂人主要协力者', '参与校园内的超自然事件', '善于隐瞒真实想法', '与宫下藤花等学生有关联', '其行动使事件威胁扩大', '是故事中的反派角色之一'],
    description: '早乙女正美是深阳学园的学生，也是《幻影死神》早期事件中的关键人物。他成为螳螂人的主要协力者，参与校园内的超自然事件，并善于隐藏自己的真实想法。正美与宫下藤花等学生的命运产生交集，其行动让事件的危险进一步扩大。',
  },
  2819: {
    traits: ['秋名山脚下豆腐店老板藤原文太的儿子', '驾驶父亲的Toyota AE86送豆腐', '最初对赛车兴趣不大', '长期山路驾驶练出高超技术', '擅长下坡赛', '常显得冷静少言', '与好友武内树关系亲近', '后来加入高桥凉介创建的Project D', '是群马县知名街头赛车手'],
    description: '藤原拓海是秋名山脚下豆腐店老板藤原文太的儿子，长期驾驶父亲的Toyota AE86送豆腐，因而练出出色的山路技术。拓海最初对赛车兴趣不大，却擅长下坡赛，性格冷静少言。他与好友武内树一起接触街头赛车，后来加入高桥凉介创建的Project D。',
  },
  2820: {
    traits: ['秋名山藤原豆腐店的老板', '藤原拓海的父亲', '年轻时是秋名山著名下坡车手', '曾被称为秋名山最快车手', '拥有Toyota AE86并让拓海送豆腐', '后来驾驶Subaru Impreza WRX STI', '驾驶技术高超且判断精准', '话少而习惯用实际方法训练儿子', '暗中关注拓海的赛车成长'],
    description: '藤原文太经营秋名山脚下的豆腐店，也是藤原拓海的父亲。他年轻时是当地著名下坡车手，曾被称为秋名山最快车手。文太让拓海驾驶Toyota AE86送豆腐，以日常工作磨练车技；之后自己驾驶Subaru Impreza WRX STI，仍保持高超判断力，并暗中关注儿子的成长。',
  },
  2821: {
    traits: ['赤城Red Suns车队的队长', '高桥启介的哥哥', '驾驶Mazda RX-7 FC3S', '群马县顶尖街头车手之一', '擅长分析赛道与对手驾驶习惯', '会依据数据制定比赛策略', '性格冷静而有条理', '后组建Project D指导拓海与启介', '大学主修医学'],
    description: '高桥凉介是赤城Red Suns车队队长，也是高桥启介的哥哥，驾驶Mazda RX-7 FC3S。他是群马县顶尖街头车手之一，擅长分析赛道与对手习惯，并据此制定比赛策略。凉介性格冷静有条理，后来组建Project D，指导拓海与启介参加远征赛；他也在大学主修医学。',
  },
  2822: {
    traits: ['赤城Red Suns车队的第二号车手', '高桥凉介的弟弟', '驾驶黄色Mazda RX-7 FD3S', '擅长高速公路与山路竞速', '驾驶技术仅次于哥哥凉介', '性格急躁且好胜', '不甘心输掉比赛', '比赛时容易受情绪影响', '后来成为Project D的下坡赛主力'],
    description: '高桥启介是赤城Red Suns车队的第二号车手，也是高桥凉介的弟弟，驾驶黄色Mazda RX-7 FD3S。他技术仅次于哥哥，擅长高速公路和山路竞速，但性格急躁好胜，无法轻易接受失败。启介后来加入哥哥创建的Project D，成为队伍的下坡赛主力。',
  },
  2865: {
    traits: ['四处旅行的神秘除魔师', '以卖药郎的身份示人', '随身携带装有药物和法器的木箱', '持有斩杀物怪的退魔之剑', '拔剑前必须查明物怪的形、真、理', '能辨认并追查物怪', '外表妆容与服饰带有异国感', '常在怪异事件发生后现身', '真实身份与来历未明'],
    description: '卖药郎是一名四处旅行的神秘除魔师，常以卖药人的身份出现，随身带着装有药物和法器的木箱。他持有能够斩杀物怪的退魔之剑，但必须先查明物怪的“形、真、理”才能拔剑。卖药郎擅长追查怪异事件，真实身份和来历始终未明。',
  },
  2866: {
    traits: ['佐藤达广高中时期的学弟', '身高约169厘米', '曾在中学遭同学欺负', '佐藤曾出面帮助过他', '因此十分尊敬佐藤', '是热衷动画与游戏的御宅族', '曾与佐藤加入同一文学社', '梦想参与美少女游戏制作', '会为游戏剧本与制作投入精力'],
    description: '山崎薰是佐藤达广高中时期的学弟，身高约169厘米。他曾在中学遭同学欺负，佐藤出面帮助后便十分尊敬对方。山崎是热衷动画与游戏的御宅族，曾和佐藤加入同一文学社，也梦想参与美少女游戏制作，并投入剧本与企划工作。',
  },
  2897: {
    traits: ['库洛·里德创造的守护兽', '负责守护封印库洛牌的书', '被任命挑选下一任库洛牌主人', '真身是长有翅膀的狮形灵兽', '失去魔力时维持小型形态', '常被木之本樱称作小可', '喜欢甜食与电子游戏', '说话带有关西腔', '会为樱提供库洛牌相关知识'],
    description: '可鲁贝洛斯是库洛·里德创造的守护兽之一，负责守护封印库洛牌的书，并受命挑选下一任主人。它的真身是长有翅膀的狮形灵兽，失去魔力时会维持小型形态，常被木之本樱称作“小可”。它喜欢甜食和电子游戏，说话带有关西腔，也会指导樱使用库洛牌。',
  },
  2925: {
    traits: ['勇者王GaoGaiGar的主人公', '曾任太空飞行员与试飞员', '在实验航天飞机事故中遭遇外星生命体', '接受赛博化改造后生还', '能与狮子型机器人Galeon合体', '成为勇者机器人GaoGaiGar的驾驶者', '勇气充沛且不轻言放弃', '为保护生命愿意承担危险', '担任GGG特别任务队的重要战力'],
    description: '狮子凯曾任太空飞行员与试飞员，在实验航天飞机事故中遭遇外星生命体后，经赛博化改造而生还。他能与狮子型机器人Galeon合体，驾驶勇者机器人GaoGaiGar作战。凯勇气充沛、不轻言放弃，愿为保护生命承担危险，是GGG特别任务队的重要战力。',
  },
  2934: {
    traits: ['《斗牌传说》的主人公', '以麻将博弈闻名', '初登场时年仅十三岁', '少年时期便在地下赌场声名大噪', '曾消失五年后再次现身', '读牌与心理判断能力惊人', '面对高风险赌局仍异常冷静', '善于利用对手心理制造压力', '对死亡与危险显得毫不畏惧'],
    description: '赤木茂是《斗牌传说》的主人公，以麻将博弈闻名。初登场时他只有十三岁，却已在地下赌场声名大噪；消失五年后再次现身，成为日本传奇赌徒。赤木读牌与心理判断能力惊人，面对高风险赌局仍异常冷静，善于利用对手心理，也几乎不畏惧死亡。',
  },
  3052: {
    traits: ['大蛇丸麾下音忍四人众成员', '队伍中唯一的女性忍者', '精通幻术与笛子演奏', '以笛声操纵三个咒印傀儡', '擅长远距离战斗', '能够进入咒印第二状态', '说话粗鲁且好斗', '曾轻视奈良鹿丸的指挥能力', '与木叶忍者在追击佐助时交战'],
    description: '多由也是大蛇丸麾下音忍四人众的女性忍者，精通幻术与笛子演奏，能以笛声操纵三个咒印傀儡，擅长远距离战斗。她可以进入咒印第二状态，说话粗鲁且好斗，曾轻视奈良鹿丸的指挥能力，并在木叶追击佐助时与忍者小队交战。',
  },
  3065: {
    traits: ['鲁索家族的职业杀手', '以残忍和嗜杀闻名', '享受杀害自以为不会死的人的过程', '擅长徒手格斗与拳击', '熟练使用枪械', '与卢瓦·克莱因订有婚约', '在飞行船“飞翔的普西芬妮”号上参与杀戮', '深爱未婚妻卢瓦', '曾承诺有一天会亲手杀死卢瓦'],
    description: '拉德·鲁索是鲁索家族的职业杀手，以残忍嗜杀闻名，尤其享受杀害那些自以为不会死的人的过程。他擅长徒手格斗、拳击和枪械，与卢瓦·克莱因订有婚约。拉德深爱未婚妻，却用“有一天会亲手杀了她”的方式表达爱意，并在飞行船事件中大开杀戒。',
  },
  3094: {
    traits: ['高中英语教师兼班主任', '担任三年级班级的导师', '教学方式不拘常规', '与学生关系亲近到被直呼名字', '性格懒散且有些自我中心', '经常冲动行事而不考虑后果', '驾驶技术很差', '与同事黑泽美奈茂互相较劲', '能活跃校园日常气氛'],
    description: '谷崎由佳里是高中英语教师兼班主任，负责三年级班级。她教学方式不拘常规，与学生关系亲近到被直呼名字；性格懒散、自我中心，有时冲动行事而不顾后果。由佳里驾驶技术很差，也常与同事黑泽美奈茂互相较劲，为校园日常带来混乱与笑料。',
  },
  3105: {
    traits: ['身高约160厘米的少女', '拥有直死之魔眼', '能看见事物与生命的“死之线”', '沿死线攻击可令目标失去存在', '车祸后昏迷两年', '苏醒后失去一个人格', '仍保留两仪式与织的记忆', '常穿和服外搭皮夹克', '与黑桐干也关系密切'],
    description: '两仪式身高约160厘米，是拥有直死之魔眼的少女，能看见事物与生命的“死之线”，沿线攻击可令目标走向死亡。她曾因车祸昏迷两年，苏醒后失去一个人格，却仍承载两仪式与织的记忆。式常穿和服搭配皮夹克，并与黑桐干也关系密切。',
  },
  3120: {
    traits: ['大道寺财团千金', '身高约136厘米', '木之本樱最亲密的朋友', '发现樱成为捕获者后担任她的助手', '为樱设计并缝制战斗服', '常用摄像机记录樱的行动', '擅长歌唱', '对樱怀有深厚而特别的感情', '性格温柔体贴并支持樱'],
    description: '大道寺知世是大道寺财团千金，身高约136厘米，也是木之本樱最亲密的朋友。发现樱成为捕获者后，她主动担任助手，为樱设计并缝制战斗服，还常用摄像机记录她的行动。知世擅长歌唱，性格温柔体贴，对樱怀有深厚而特别的感情。',
  },
  3133: {
    traits: ['琪琪的黑猫伙伴', '作为魔女的使魔陪琪琪旅行', '能与琪琪交谈直至琪琪失去魔法沟通能力', '说话尖锐并带有讽刺感', '常用悲观幽默提醒琪琪', '本质上温柔善良', '喜欢与琪琪一起生活', '后来与白猫莉莉建立伴侣关系', '在琪琪成长过程中逐渐拥有自己的生活'],
    description: '吉吉是琪琪的黑猫伙伴，作为魔女使魔陪她离家旅行。它说话尖锐、带有讽刺感，常用悲观幽默提醒琪琪，但本质温柔善良。琪琪一度失去听懂猫语的能力后，吉吉不再能与她交谈；后来它与白猫莉莉建立伴侣关系，也逐渐拥有自己的生活。',
  },
  3199: {
    traits: ['本名天泽勇子，绰号伊佐子', '精通电脑空间的黑客', '属于罕见的“编码者”', '能直接侵入电脑空间的代码与基础结构', '借助增强现实眼镜中的脑机接口进入电脑空间', '追逐体内带有钥匙孔的特殊活体元虫', '寻求力量与元虫', '性格傲慢且不善社交', '倾向把人际关系理解为权力等级'],
    description: '天泽勇子绰号伊佐子，是擅长侵入电脑空间代码与基础结构的“编码者”。她利用增强现实眼镜中的脑机接口进入电脑空间，追逐体内带有钥匙孔的特殊活体元虫，以获取力量。伊佐子性格傲慢、不善社交，常把人际关系理解为权力等级。',
  },
  3203: {
    traits: ['北川高中女生', '能看见他人颈部象征死亡的黑色圆环', '这种能力被称为死神之眼', '曾因看见父母颈上的圆环而痛苦', '父母后来在事故中去世', '性格内向且缺乏自信', '被赤月知佳与橘思徒卷入僵尸事件', '加入Z-Loan协助追捕僵尸', '逐渐学会表达自己的意愿'],
    description: '纪多满是北川高中女生，拥有“死神之眼”，能看见他人颈部象征死亡的黑色圆环。她曾因看见父母颈上的圆环而痛苦，后来父母在事故中去世。满起初内向缺乏自信，之后被赤月知佳与橘思徒卷入僵尸事件，并加入Z-Loan协助追捕欠债僵尸。',
  },
  3204: {
    traits: ['北川高中男生', '与橘思徒在同一事故中丧生', '复活后成为僵尸', '右手在事故中失去', '与思徒由灵性锁链连接', '锁链使两人能够交换右手', '性格活跃而容易急躁', '在Z-Loan追捕欠债僵尸', '与满一起调查僵尸事件'],
    description: '赤月知佳是北川高中男生，与橘思徒在同一事故中丧生后复活为僵尸。两人都失去右手，并被灵性锁链连接，因此能交换右手。知佳性格活跃而容易急躁，在Z-Loan工作，负责追捕欠债僵尸，也与满一起调查相关事件和谜团。',
  },
  3205: {
    traits: ['北川高中男生', '与赤月知佳在同一事故中丧生', '复活后成为僵尸', '右手在事故中失去', '在新闻报道中被称为“少年A”', '因此在学校被秘密称作“A君”', '与知佳由灵性锁链连接', '锁链让两人能够交换右手', '聪明冷静但偶尔显得脱线'],
    description: '橘思徒是北川高中男生，与赤月知佳在同一事故中丧生后复活为僵尸。两人都失去右手，并被灵性锁链连接，能够交换右手。思徒曾在新闻中被称作“少年A”，因此在学校有“A君”这个秘密外号；他聪明冷静，却偶尔显得脱线。',
  },
  3275: {
    traits: ['早濑海军上将的独生女', '自幼立志投身军队', '在太空要塞Macross担任舰桥军官', '后成为Macross舰长', '作风严谨且责任感强', '拥有丰富的军事知识', '与克劳迪娅·拉萨尔是好友', '与一条辉和林明美形成感情三角', '常在战事与私人情感间作出抉择'],
    description: '早濑未沙是海军上将早濑隆司的独生女，自幼立志从军，在太空要塞Macross担任舰桥军官，后来成为舰长。她作风严谨、责任感强，拥有丰富军事知识，与克劳迪娅·拉萨尔是好友。未沙也与一条辉、林明美形成感情三角，常在战事和私人情感间作出抉择。',
  },
  3345: {
    traits: ['西浦高中棒球队的监督', '身高约163厘米', '热爱棒球并全力支持球队', '曾是西浦高中垒球队的经理', '会把兼职积蓄投入球队用品', '负责训练安排和比赛指导', '相信队员能通过练习成长', '与捕手阿部讨论投捕策略', '不是球员，也不是投手'],
    description: '百枝玛丽亚是西浦高中棒球队的监督，身高约163厘米，十分热爱棒球并全力支持球队。她曾担任西浦高中垒球队经理，会把兼职积蓄投入球队用品，并负责训练安排与比赛指导。玛丽亚相信队员能通过练习成长，也会与阿部讨论投捕策略；她不是球员或投手。',
  },
  3383: {
    traits: ['著名文乐大师橘左卫门的孙子', '性格害羞且缺乏自信', '是文乐人形净琉璃的操纵者', '擅长腹语术', '和右近搭档调查案件', '操纵人偶时能集中注意力', '具备敏锐的观察与推理能力', '常与右近一同旅行', '协助警方破解凶案'],
    description: '橘左近是著名文乐大师橘左卫门的孙子，性格害羞而缺乏自信。他擅长操纵文乐人形净琉璃，也精通腹语术；与人偶右近搭档时能集中注意力，发挥观察和推理能力。左近常带着右近四处旅行，协助警方调查并破解离奇凶案谜团。',
  },
  3384: {
    traits: ['名为右近的文乐人形', '相传于1870年制作', '传说由人形师小泉宇之助三世制作', '由橘左近操纵并以腹语术发声', '性格大胆、粗鲁且自我中心', '常表现得轻浮而爱调情', '与左近形成鲜明反差', '作为搭档参与推理与案件调查', '擅长直接指出左近的犹豫'],
    description: '右近是橘左近操纵的文乐人形，相传制作于1870年，由人形师小泉宇之助三世打造。左近以腹语术让它发声；与传统人形端庄安静的形象不同，右近大胆粗鲁、自我中心，甚至有些轻浮。它与左近形成鲜明反差，也是共同调查案件的重要搭档。',
  },
  3385: {
    traits: ['身高约165厘米', '长发和毛毯常遮住面容', '被称作引きこもり的家里蹲', '是糸色望班上的学生', '不愿与外界接触', '风浦可符香误以为她是座敷童子', '常躲在房间或被子里', '外表被遮挡但实际相貌出众', '在老师帮助下尝试面对校园生活'],
    description: '小森雾身高约165厘米，长发和常披的毛毯遮住面容，是一名家里蹲学生。她在糸色望任教的班级就读，习惯躲在房间或被子里，不愿接触外界；风浦可符香甚至把她误认为座敷童子。雾外表被遮挡，但实际相貌出众，也在老师帮助下尝试面对校园生活。',
  },
  3439: {
    traits: ['卫宫凛所在班级的班主任', '任职于穗群原学园', '主要教授世界史', '也讲授伦理学', '身材健壮并戴棱角眼镜', '教学严格而不苟言笑', '深受校内教职员尊重', '接受柳洞寺的美狄亚留宿', '与美狄亚保持低调的同居关系'],
    description: '葛木宗一郎是穗群原学园教师，也是远坂凛所在班级的班主任，主要教授世界史，也讲授伦理学。他身材健壮、戴棱角眼镜，教学严格而不苟言笑，深受教职员尊重。宗一郎允许美狄亚暂住柳洞寺，两人保持低调的同居关系与往来。',
  },
}

const localById = new Map(local.map((row) => [Number(row.id), row]))
for (const [idText, fix] of Object.entries(fixes)) {
  const row = localById.get(Number(idText))
  if (!row || !ids.includes(Number(idText))) throw new Error(`修正目标 ${idText} 不在本批中`)
  Object.assign(row, fix)
}

for (const id of Object.keys(fixes).map(Number)) {
  const row = localById.get(id)
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map((actor) => actor.name)].join(' ')
  if (row.traits.length < 8) throw new Error(`角色 ${id} 特征少于8条`)
  if (row.description.length < 100 || row.description.length > 200) throw new Error(`角色 ${id} 简介长度不合格：${row.description.length}`)
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的 search_text 包含简介`)
}

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
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of local) lines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${lines.join('\n')}\n`)

const missingProfiles = ids.filter((id) => !profileDoc.profiles[id])
const colorRegex = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛|眼瞳)/
const report = {
  checkedAt: new Date().toISOString(),
  checkedCount: batch.length,
  profileSnapshotVerifiedCount: batch.length - missingProfiles.length,
  checkedIds: ids,
  checkedRange: { firstId: ids[0], lastId: ids.at(-1) },
  modifiedIds: Object.keys(fixes).map(Number),
  source: {
    name: '本地 AniList 角色资料快照与本地人物记录比对；实时外网 DNS 不可用',
    fetchedAt: profileDoc.fetchedAt,
    records: ids.filter((id) => profileDoc.profiles[id]).map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
  },
  pendingExternalVerificationIds: missingProfiles,
  pendingVisualVerificationIds: batch.filter((row) => (row.traits || []).some((trait) => colorRegex.test(trait))).map((row) => Number(row.id)),
  verifiedCorrections: Object.keys(fixes).map((idText) => ({
    id: Number(idText),
    url: `https://anilist.co/character/${idText}`,
    note: profileDoc.profiles[idText]?.description ? '按缓存AniList角色资料核对身份、经历或能力。' : '依据可确认的作品资料修正；该ID缺少本地AniList资料，待实时来源恢复后复核。',
  })),
  networkAttempts: {
    anilistGraphQL: 'failed: DNS ENOTFOUND graphql.anilist.co',
    browserSearch: 'failed: browser automation timed out while reading the open Google results tab',
  },
  note: '本批100位逐项审阅，28位已修正。缓存资料覆盖82位；18位及发色、瞳色项目仍待外部或目视复核。实时网络不可用，尚未同步Supabase。',
}
fs.writeFileSync(`${root}/batch9-audit-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, profileSnapshotVerified: report.profileSnapshotVerifiedCount, modified: report.modifiedIds, pendingExternal: missingProfiles.length, pendingVisual: report.pendingVisualVerificationIds.length, reportPath: `${root}/batch9-audit-report.json` }, null, 2))
