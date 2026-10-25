import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const profilePath = `${root}/anilist-character-profiles.json`
const supplementPath = `${root}/anilist-character-profiles-batch3-supplement.json`
const reportPath = `${root}/batch3-audit-report.json`
const profileDoc = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
const supplement = JSON.parse(fs.readFileSync(supplementPath, 'utf8'))
Object.assign(profileDoc.profiles, supplement.profiles)
profileDoc.supplementedAt = supplement.fetchedAt
profileDoc.supplementedIds = supplement.requestedIds

const fixes = {
  415: {
    traits: ['与哈利·麦克道尔等人一起混迹街头', '好友被杀后加入千年组织', '受训成为清道夫', '建立精英清道夫部队True Grave', '始终忠于Big Daddy', '深爱玛丽亚', '被哈利杀死后由医生T改造复活', '复活后化名Beyond the Grave', '以摧毁千年组织和背叛者为目标'],
    description: '布兰登·希特少年时与哈利·麦克道尔等人混迹街头，好友被杀后，他和哈利加入千年组织。布兰登受训成为清道夫，后来建立精英部队“True Grave”，始终忠于Big Daddy，也深爱玛丽亚。哈利叛变后杀死布兰登，医生T将他改造成“Beyond the Grave”；复活的他以摧毁千年组织和背叛者为目标。',
  },
  416: {
    traits: ['现视研第二任社长', '由初代社长亲自选为继任者', '正式接任前已主动处理社团事务', '狂热的钢弹迷', '对御宅文化十分熟悉', '投入度很高的御宅族', '常参与社团活动', '男性大学生'],
    description: '斑目晴信是现视研第二任社长，由初代社长亲自选为继任者。正式接任前，他已常主动处理社团事务；他是狂热钢弹迷，对御宅文化十分熟悉，也是社团里投入度很高的一员。他常把自己对作品的热情带进社团讨论和活动中，也乐于分享心得。',
  },
  418: {
    anime_title: '岩窟王',
    traits: ['费尔南与梅赛苔丝之子', '十五岁', '在月球殖民地卢娜结识基督山伯爵', '被伯爵的风度与神秘气质吸引', '天真单纯', '容易忽略他人的真实意图', '与弗朗兹是好友', '真诚善良，能打动身边的人'],
    description: '阿尔贝·德·莫尔塞夫是费尔南与梅赛苔丝的十五岁儿子。他在月球殖民地卢娜度假时结识基督山伯爵，被伯爵的风度和神秘气质吸引，随后成为伯爵进入巴黎社交圈的重要引路人。阿尔贝天真热忱，常看不清别人的真实意图；但他的真诚也能打动周围的人。',
  },
  419: {
    anime_title: '岩窟王',
    traits: ['身份神秘的富有贵族', '在卢娜结识并接近阿尔贝', '谋划向旧日背叛者复仇', '真实身份为水手爱德蒙·唐泰斯', '曾因冤案被囚于伊夫堡', '在伊夫堡遇见岩窟王', '擅长布局与伪装', '利用巴黎上流社会推进计划'],
    description: '基督山伯爵是一位身份神秘、生活奢华的贵族。他在月球殖民地卢娜结识阿尔贝，并借助这段友谊进入巴黎上流社会，逐步实施对旧日背叛者的复仇。伯爵原名爱德蒙·唐泰斯，曾因冤案被囚于伊夫堡，并在那里遇见岩窟王；出狱后，他以财富、耐心和周密布局追索公道。',
  },
  421: {
    anime_title: '岩窟王',
    traits: ['阿尔贝最亲密的朋友', '性格比阿尔贝成熟稳重', '在卢娜陪伴阿尔贝旅行', '察觉基督山伯爵的危险', '曾提醒阿尔贝提防伯爵', '对阿尔贝怀有深厚感情', '多次冒险救助阿尔贝', '愿意为朋友牺牲自己'],
    description: '弗朗兹·德·埃皮奈是阿尔贝最亲密的朋友，性格比阿尔贝成熟稳重。他陪阿尔贝在月球殖民地卢娜旅行，较早察觉基督山伯爵可能带来的危险，并提醒好友保持警惕。弗朗兹对阿尔贝怀有深厚感情，曾多次冒险救他；当朋友身陷危机时，他愿意把自己的安危放在一边。',
  },
  423: {
    description: '卡思嘉曾是鹰之团中唯一的女性士兵，剑术仅次于格斯与格里菲斯。格里菲斯从贵族手中救下她后，她加入鹰之团并逐渐成为千人长。她与格里菲斯关系复杂，后来爱上格斯；在格里菲斯入狱后，她带领鹰之团执行营救。日蚀事件给她造成严重创伤，成为格斯此后执着追寻她的原因之一。',
  },
  425: {
    traits: ['虫师', '四处旅行调查虫', '帮助受虫影响的人', '白发', '绿眼', '白发与绿眼源于幼年虫害事件', '冷静务实', '倾听当事人的经历', '不轻率判定虫的善恶'],
    description: '银古是一名虫师，长期独自旅行，调查被称作“虫”的生命现象，并帮助受到虫影响的人。他的白发和绿眼源于幼年与虫相关的事故。银古冷静务实，通常先倾听当事人的经历，再寻找缓解问题的方法；他不轻率地把虫视为善或恶，而是尊重人类与自然之间复杂的关系。',
  },
  429: {
    traits: ['十八岁的高中毕业班学生', '长期承受母亲安排的升学压力', '厌倦重复而空虚的生活', '被伊莎贝拉邀请成为模特', '参与Paradise Kiss品牌活动', '被实和子昵称为Caroline', '逐渐发现新的生活方向', '在恋爱与自我实现间作选择'],
    description: '早坂紫是十八岁的高中毕业班学生，长期按照严厉母亲的安排备考，对重复而空虚的生活感到厌倦。她被伊莎贝拉带到Paradise Kiss工作室，意外成为品牌模特，开始接触时装与自主选择。紫逐渐发现新的生活方向，也在与小泉让二的恋爱和自我实现之间经历挣扎。',
  },
  430: {
    traits: ['矢泽艺术学院学生', '时装设计师', '擅长高级时装设计', '外形俊美且极具魅力', '发色与瞳色为蓝色', '个性古怪而张扬', '经常提出大胆前卫的想法', '希望紫成为独立的人', '生活优渥，驾驶复古捷豹'],
    description: '小泉让二是矢泽艺术学院的学生，也是Paradise Kiss品牌的时装设计师，尤其擅长高级时装。他外形俊美、极具魅力，性格古怪张扬，常提出不合常规的设计构想。让二希望紫能成为独立、愿为选择负责的人；他推动紫接触时装，也让她重新思考自己想要的生活。',
  },
  431: {
    traits: ['矢泽艺术学院学生', 'Paradise Kiss成员', '举止优雅且气质高贵', '是团队成员的照顾者', '小时候启发让二设计第一件礼服', '常穿走让二完成的衣服', '鼓励紫坚持自己的选择', '具有独立的性别经历', '年龄十八岁'],
    description: '山本伊莎贝拉是矢泽艺术学院的学生，也是Paradise Kiss团队中优雅稳重的一员。她常像母亲一样照顾伙伴，小时候曾启发让二设计第一件礼服，也习惯穿走他完成的衣服。紫陷入犹豫时，伊莎贝拉会鼓励她面对自己的选择；她以从容和体贴成为团队可靠的支持者。',
  },
  432: {
    traits: ['矢泽艺术学院学生', 'Paradise Kiss团队成员', '朋克乐队吉他手', '实和子的男友', '出身音乐家庭', '外表粗犷且有多处面部穿孔', '性格直接', '实际很关心亲近的人', '协助经营服装品牌'],
    description: '永濑岚是矢泽艺术学院的学生、Paradise Kiss团队成员，也是朋克乐队的吉他手。他外表粗犷，有多处面部穿孔，实际上很关心亲近的人；他是实和子的男友，也协助经营服装品牌。岚出身音乐家庭，表达情绪时较为直接，在恋爱和团队合作中逐渐学习信任伙伴的选择。',
  },
  433: {
    name: '樱田实和子',
    nicknames: ['樱田实和子', 'Miwako Sakurada', '櫻田実和子', '实和子', 'Miwako'],
    traits: ['矢泽艺术学院学生', 'Paradise Kiss品牌成员', '幸田实果子的妹妹', '性格甜美可爱', '说话和行动带有孩子气', '参与服装设计与品牌经营', '岚的女友', '珍惜伙伴关系', '喜欢可爱风格的服装'],
    description: '樱田实和子是矢泽艺术学院的学生，也是Paradise Kiss品牌的成员。她性格甜美可爱，行动带着孩子气；她是Happy Berry品牌创作者幸田实果子的妹妹，也参与服装设计和品牌经营。实和子与朋克乐队吉他手永濑岚交往，珍惜团队伙伴，并在创作、恋爱与家庭关系中寻找自己的位置。',
  },
  457: {
    description: '达奇是黑礁商会的船长，驾驶前美国海军鱼雷艇“黑礁”。他曾在越战中服役，平时很少亲自参与战斗，而是负责发号施令、与客户谈判并安排任务。达奇沉稳随和、身材强壮；面对拉布雷克一行人的混乱行动，他常以冷静和幽默维持团队秩序。',
  },
  477: {
    traits: ['英雄军人阿德洛克·萨斯顿之子', '由祖父阿克塞尔抚养长大', '外向而情感丰富', '理想感强且富有同情心', '容易冲动，常先行动后理解情况', '暗恋尤蕾卡', '尼尔瓦修Type ZERO的副驾驶员', '加入月光州', '在旅途中逐渐成长'],
    description: '兰顿·萨斯顿是英雄军人阿德洛克·萨斯顿的儿子，也是由祖父阿克塞尔抚养长大的少年。他性格外向、情感丰富，理想感强却容易冲动，尚未弄清状况便会先行动。兰顿暗恋驾驶员尤蕾卡，后来加入月光州，成为尼尔瓦修Type ZERO的副驾驶员，并在旅途中逐步成长。',
  },
  494: {
    traits: ['少年', '父亲随军期间承担家中责任', '负责照顾妹妹节子', '成熟而坚韧', '自尊心强', '空袭后母亲去世', '带妹妹离开家乡寻找住处与食物', '在战争与饥荒中求生', '因判断失误使处境更艰难'],
    description: '清太在父亲随军期间承担照顾妹妹节子的责任，成熟坚韧，也因自尊心强而不愿轻易向别人求助。空袭导致母亲死亡后，他带着节子离开家乡，在战火中努力寻找住处和食物。清太与妹妹相依为命，却常因判断失误让处境更艰难；故事呈现兄妹面对战争与饥荒的日常。',
  },
  495: {
    traits: ['清太年幼的妹妹', '天真活泼', '十分依恋哥哥', '难以理解战争的恐怖', '在空袭后与清太离开家乡', '常把日常小物当成玩具', '不安时会寻找清太', '珍惜兄妹相处时光'],
    description: '节子是清太年幼的妹妹，天真活泼，十分依恋哥哥。战争中的空袭、饥饿和迁徙超出她的理解，她常把日常小物当成玩具，也会在不安时寻找清太。兄妹被迫离开家后，清太尽力照顾她；节子对哥哥的信任和依赖，构成故事重要的情感纽带。',
  },
  498: {
    description: '远坂凛是远坂家的继承人，也是冬木第五次圣杯战争中的魔术师与Master。她在学校成绩优秀、受到同学仰慕，却习惯独处；私下精通宝石魔术，并召唤Archer作为从者。凛外表冷静自信，实际很重视伙伴，常以傲娇和嘴硬掩饰关心，也会因使用宝石魔术而拮据。',
  },
  499: {
    description: '库·丘林出身爱尔兰神话中的阿尔斯特英雄传说，原名塞坦塔。传说他少年时杀死铁匠库兰的猛犬，主动代犬守卫铁匠铺，因此得名“库·丘林”。他由斯卡哈训练枪术与符文魔法，持有魔枪“Gáe Bolg”；在这部日常作品中，他以Lancer从者身份参与卫宫家的聚餐。',
  },
  500: {
    name: '间桐樱',
    nicknames: ['间桐樱', 'Sakura Matou', '間桐桜', '樱', 'Sakura'],
    traits: ['间桐慎二的妹妹', '卫宫士郎的学妹', '就读高中一年级', '性格羞怯温和', '内心坚韧', '切嗣去世后常到士郎家帮忙', '长期喜欢士郎', '擅长料理和家务', '常与卫宫家成员共享日常'],
    description: '间桐樱是间桐慎二的妹妹、卫宫士郎的学妹，性格羞怯温和，内心坚韧。卫宫切嗣去世后，她常到士郎家帮忙料理家务，也长期喜欢士郎。在《卫宫家今天的饭》中，樱经常与士郎和其他伙伴共享料理与日常；家常饭菜成为她表达关心、建立亲密关系的一种方式。',
  },
  501: {
    name: '间桐慎二',
    nicknames: ['间桐慎二', 'Shinji Matou', '間桐慎二', '慎二', 'Shinji'],
    traits: ['间桐樱的哥哥', '卫宫士郎的旧友', '弓道部副队长', '出身魔术师世家', '间桐血脉衰退后不能继承家族魔术', '自负而傲慢', '常掩饰内心不安', '有时到卫宫家参与日常聚餐'],
    description: '间桐慎二是间桐樱的哥哥、卫宫士郎的旧友，也是弓道部的副队长。他出身魔术师世家，因间桐血脉衰退而无法继承家族魔术，常以自负和傲慢掩饰不安。虽然在正篇中与士郎关系紧张，他也会到卫宫家参与日常生活与料理，是《卫宫家今天的饭》中的常客。',
  },
  502: {
    traits: ['希腊神话中的戈耳工三姐妹之一', 'Rider职阶从者', '拥有能使对手石化的魔眼', '以眼罩抑制魔眼能力', '骑乘天马珀伽索斯作战', '性格安静', '温柔体贴', '默默守护间桐樱', '参与卫宫家的餐桌日常'],
    description: '美杜莎是卫宫樱召唤的Rider从者，源自希腊神话中的戈耳工三姐妹之一。她拥有能使对手石化的魔眼，平时以眼罩抑制能力，并骑乘天马“珀伽索斯”作战。美杜莎话少而温柔，习惯默默守护樱；在《卫宫家今天的饭》中，她也会摘下眼镜、参与家中的餐桌日常。',
  },
  503: {
    traits: ['卫宫切嗣与爱丽丝菲尔的女儿', '第五次圣杯战争中担任Master', 'Berserker的御主', '来自德国的贵族少女', '居住在郊外城堡', '拥有强大的魔术能力', '性格天真而依恋亲近的人', '十分喜欢卫宫士郎', '由女仆陪伴生活'],
    description: '伊莉雅斯菲尔·冯·爱因兹贝伦是卫宫切嗣与爱丽丝菲尔的女儿，也是第五次圣杯战争中Berserker的Master。她从德国来到日本，居住在城堡中，身边有从者与女仆。伊莉雅拥有强大的魔术能力，性格天真，十分依恋士郎；在《卫宫家今天的饭》的和平世界里，她与卫宫家保持亲近。',
  },
  504: {
    traits: ['希腊神话中的大英雄', '以Berserker职阶现界', '伊莉雅斯菲尔的从者', '体格巨大且力量惊人', '挥舞巨型斧剑', '拥有“十二试炼”复活能力', '狂化后失去理性', '始终优先保护伊莉雅', '在和平日常中沉默陪伴主人'],
    description: '赫拉克勒斯是希腊神话中的大英雄，在圣杯战争中以Berserker职阶成为伊莉雅斯菲尔的从者。他体格巨大，挥舞巨型斧剑，拥有“十二试炼”赋予的复活能力；战斗时因狂化失去理性，却始终优先保护伊莉雅。平和的卫宫家日常里，他仍以沉默可靠的身影陪伴主人。',
  },
  505: {
    traits: ['卫宫士郎的英语教师', '担任士郎班级的班主任', '弓道部指导教师', '切嗣去世后成为士郎的监护人', '与士郎关系亲近', '把士郎当作弟弟照顾', '性格热情直率', '喜欢热闹与美食', '常到卫宫家参与日常聚餐'],
    description: '藤村大河是士郎的英语教师、班主任，也是弓道部的指导教师。切嗣去世后，她成为士郎的监护人，两人关系亲近，她常把士郎当作弟弟照顾。大河性格热情直率，喜欢热闹和美食；在《卫宫家今天的饭》中，她常作为熟人到卫宫家做客，参与围绕料理展开的日常。',
  },
  507: {
    traits: ['年约二十七岁的魔法师', '独自居住在移动城堡', '行踪神秘而疏离', '衣着与举止张扬', '城堡因移动而广受传闻', '传闻他会夺取年轻女性的心', '拥有强大的魔法能力', '起初习惯逃避责任', '逐渐学会承担并关心苏菲'],
    description: '哈尔是年约二十七岁的魔法师，独自住在会移动的城堡里。他行踪神秘、打扮张扬，城堡和关于他夺取年轻女性心脏的传闻令居民畏惧。哈尔其实并非传闻中那样冷酷，面对苏菲时逐渐学会承担责任；他强大的魔法与逃避束缚的性格，是故事冲突的重要来源。',
  },
  508: {
    traits: ['十八岁的帽店姑娘', '长期在帽店工作', '性格安静温柔', '不习惯成为众人目光焦点', '被荒野女巫施下衰老咒语', '进入哈尔的移动城堡', '承担城堡清洁工作', '逐渐变得坦率坚强', '开始主动选择自己的人生'],
    description: '苏菲·哈特是十八岁的帽店姑娘，长期在店里工作，性格安静温柔，不习惯成为众人目光焦点。荒野女巫对她施下衰老咒语后，苏菲离开家乡，进入哈尔的移动城堡并承担清洁工作。她在与哈尔、马鲁克和卡西法相处中逐渐变得坦率坚强，开始主动选择自己的人生。',
  },
  509: {
    traits: ['哈尔的魔法学徒', '作为孤儿住在移动城堡', '魔法修行常被安排跑腿', '负责采购与城堡杂务', '熟悉城堡的日常运作', '逐渐接纳苏菲加入生活', '与卡西法共同维持城堡日常', '努力协助哈尔处理麻烦'],
    description: '马鲁克是哈尔的魔法学徒，也是住在移动城堡里的孤儿。他的魔法修行常被哈尔安排成跑腿和购物等杂务，但他仍熟悉城堡的日常运作。苏菲到来后，马鲁克逐渐接纳她，并与卡西法一起维持城堡生活；在团队遇到麻烦时，他也努力为哈尔提供协助。',
  },
  510: {
    traits: ['强大的魔法师', '执着追逐哈尔', '能创造并驱使黑色黏团仆从', '曾试图夺取哈尔的心', '在冲突中被萨利曼夫人夺去魔力', '失去魔力后迅速衰老', '后来住进移动城堡', '逐渐依赖苏菲照料'],
    description: '荒野女巫是追逐哈尔的强大魔法师，擅长施法并驱使由魔法创造的黑色黏团仆从。她对哈尔怀有执念，曾试图带走他的心；在与苏菲和哈尔冲突后，萨利曼夫人夺走了她的魔力，使她迅速衰老。此后她留在移动城堡生活，性情逐渐从危险转为依赖照料。',
  },
  518: {
    description: '狮堂光是被艾梅洛德公主召唤到塞菲罗的三名魔法骑士之一，担任火之魔法骑士。她个子娇小、性格开朗直率，表面天真却在需要时十分勇敢强悍；同伴遇险时，她会挺身而出。光在旅途中不断磨练剑术与火焰魔法，并以保护朋友、完成任务为目标。',
  },
  519: {
    traits: ['被召唤到塞菲罗的魔法骑士之一', '水之魔法骑士', '身高158厘米', '留着蓝色长发', '剑术高超', '外表优雅', '脾气急且容易动怒', '最初对异世界抱有怀疑', '逐渐成为团队中的大姐姐', '保护光与风'],
    description: '龙咲海是被召唤到塞菲罗的三名魔法骑士之一，也是水之骑士。她身高158厘米，留着蓝色长发，外表优雅却脾气急，最初对异世界和任务抱有怀疑。旅途推进后，海逐渐成为团队中的大姐姐，常保护光和风，剑术与水系魔法是她的主要战斗方式。',
  },
  520: {
    traits: ['浅绿发', '被召唤到塞菲罗的魔法骑士之一', '风之魔法骑士', '身高156厘米', '八年级学生', '头脑聪明，书本知识丰富', '常担任团队中的理性担当', '有时怀疑自己但最终能克服', '擅长弓箭远程支援', '喜欢费里奥'],
    description: '凤凰寺风是被艾梅洛德公主召唤到塞菲罗的三名魔法骑士之一，留着浅绿发，担任风之魔法骑士。她身高156厘米，是八年级学生，聪明冷静，常充当团队中的理性担当，擅长弓箭与风系魔法；有时会怀疑自己，但总能鼓起勇气克服困难，并喜欢费里奥。',
  },
  534: {
    description: '天泽圣司是喜爱小提琴制作的少年，也是月岛雫在图书馆借阅记录中反复遇见的名字。两人初次相识时因彼此的评价发生争执，后来圣司带雫参观祖父的店，并邀请她一起演唱《乡间小路》。他立志成为专业制琴师，前往意大利学习，也促使雫认真思考自己的梦想。',
  },
  535: {
    description: '原田夕子是月岛雫最好的朋友，喜欢唱歌和聊天，也常与雫分享校园生活。她暗恋同学杉村，曾因收到不喜欢自己的男生的情书而陷入困扰；杉村代为询问答复时，她误以为对方不了解自己的心情而生气。夕子的感情经历让她在友情与恋爱间经历不少青春烦恼。',
  },
  536: {
    name: '月岛靖也',
    nicknames: ['月岛靖也', 'Seiya Tsukishima', '月島靖也', '靖也'],
    description: '月岛靖也是月岛雫的父亲，关心女儿的生活与未来。他理解雫对写作的兴趣，支持她花时间尝试创作，而不是只催促她按部就班升学。雫面对学业、梦想和自我怀疑时，父亲的尊重为她留出探索空间，体现了家庭给予年轻人自主选择的支持。',
  },
  539: {
    traits: ['风之谷的公主', '聪明机敏', '擅长剑术', '能阅读并利用风向', '驾驶滑翔机“梅贝”飞行', '能够与腐海巨虫沟通', '对生命富有同情心', '努力阻止战争中的杀戮', '探索人类与腐海共存之道'],
    description: '娜乌西卡是风之谷的公主，聪明机敏，擅长剑术，也能驾驶滑翔机“梅贝”乘风飞行。她会观察风向、理解腐海生态，甚至能与王虫等巨虫沟通。战争爆发后，娜乌西卡努力阻止杀戮，并试图让人类理解腐海和虫群的作用；她的同情心与行动力推动各方寻找共存之路。',
  },
  540: {
    traits: ['娜乌西卡的老师', '传奇剑士', '长期在各地旅行', '探寻腐海的秘密', '剑术高超', '见多识广', '判断沉稳', '在旅途中协助娜乌西卡', '受到多方尊敬'],
    description: '尤巴是娜乌西卡的老师，也是传奇剑士。他长期在各地旅行，探寻腐海的秘密及其扩张原因。尤巴见多识广、判断沉稳，既能在冲突中凭剑术保护同伴，也能向娜乌西卡传授经验。他在旅途中帮助遇到的村庄与伙伴，是连接风之谷、培吉特和多鲁美奇亚的关键人物。',
  },
  541: {
    traits: ['多鲁美奇亚帝国的公主', '瓦伊皇帝最小的女儿', '幼年时在王虫袭击中失去一臂', '对腐海巨虫怀有复仇心', '企图以武力清除腐海', '统领多鲁美奇亚军队', '行事果断强硬', '与娜乌西卡形成冲突与合作', '立场复杂，并非单纯邪恶'],
    description: '库沙娜是多鲁美奇亚帝国的公主，也是瓦伊皇帝最小的女儿。她年幼时曾在王虫袭击中失去一臂，因此对腐海和巨虫怀有复仇心，企图用武力清除腐海。她统领帝国军队，行事果断而强硬；与娜乌西卡接触后，她复杂的立场逐渐显露，并非只由仇恨驱使。',
  },
  542: {
    traits: ['库沙娜麾下的参谋军官', '协助指挥多鲁美奇亚军队', '处事精明务实', '善于观察与谋划', '在危险局势中优先考虑自保', '说话带有讽刺意味', '依靠谋略应对变化', '是军队运作中的重要副官'],
    description: '克罗托瓦是库沙娜麾下的参谋军官，负责协助她指挥多鲁美奇亚军队。他处事精明、注重现实利益，常以讽刺口吻回应局势；在充满危险的远征中，他优先考虑如何活下来，并凭观察力与谋略应对变化。克罗托瓦虽不是核心战士，却是军队运作中的重要副官。',
  },
  543: {
    traits: ['拉丝黛儿的双胞胎弟弟', '培吉特空袭后的幸存者', '憎恨库沙娜和多鲁美奇亚人', '擅长驾驶飞行器', '擅长修理机械', '精通剑术', '被娜乌西卡从腐海底部救起', '亲眼见到腐海的真实作用', '有时与娜乌西卡同行'],
    description: '阿斯贝尔是培吉特王女拉丝黛儿的双胞胎弟弟，也是空袭后培吉特仅存的幸存者。他憎恨库沙娜和多鲁美奇亚人，擅长驾驶与修理飞行器，也会剑术。娜乌西卡在腐海底部救下他后，他亲眼见到腐海的真实作用；此后他时而与娜乌西卡同行，时而独自行动。',
  },
  544: {
    traits: ['培吉特王女', '阿斯贝尔的双胞胎姐姐', '乘坐的飞船在风之谷附近坠毁', '坠机后被多鲁美奇亚人俘获', '伤重身亡', '临终请求娜乌西卡烧毁巨神兵胚胎', '她的遭遇促使阿斯贝尔行动', '死亡使风之谷卷入更大冲突'],
    description: '拉丝黛儿是培吉特王女，也是阿斯贝尔的双胞胎姐姐。她乘坐的飞船在风之谷附近坠毁，落入多鲁美奇亚人手中后伤重身亡。临终前她请求娜乌西卡烧毁船舱中的巨神兵胚胎，避免它被用于战争。她的遭遇促使阿斯贝尔踏上旅程，也让风之谷卷入更大的冲突。',
  },
  558: {
    description: '卡莲·修坦费尔德表面是阿什福德学园的贵族学生，成绩优秀并参加学生会，实际以本名红月卡莲参与反布里塔尼亚行动。她帮助组织黑色骑士团，驾驶红莲贰式作战，是团体中的王牌机师。卡莲性格火爆、意志坚定，内心认同日本人身份，对Zero既忠诚也抱有复杂情感。',
  },
  567: {
    description: '百目鬼静是四月一日君寻的同班同学，也是弓道部成员，常在学校比赛中取得好成绩。他性格沉着寡言，偶尔用冷面笑话吐槽，因冷静可靠而受女同学欢迎。静常陪四月一日处理灵异事件，虽然不像君寻那样能看见妖怪，却会用自己熟悉的民俗知识和行动帮助朋友。',
  },
  568: {
    description: '九轩葵是四月一日的同班同学，待人温柔善良，却天生会给身边的人带来严重的不幸，因此刻意与君寻保持距离。她并非有意伤害他人，甚至祖母也曾受到这种力量影响。葵对君寻抱有好感，但害怕他因靠近自己而遭遇厄运；这份隐瞒成为两人关系的重要阻碍。',
  },
  570: {
    name: '松冈美羽',
    nicknames: ['松冈美羽', 'Miu Matsuoka', '松岡美羽', 'Miu'],
    traits: ['十二岁', '性格调皮古怪', '千佳的儿时好友', '住在伊藤家隔壁', '与千佳同班', '常突然说出奇怪的话', '喜欢捉弄茉莉和安娜', '常与朋友们一起度过日常', '恶作剧被伸惠打断'],
    description: '松冈美羽是十二岁的调皮少女，和伊藤千佳从小相识，住在伊藤家隔壁并与千佳同班。她爱在毫无征兆时说出奇怪的话，也经常捉弄茉莉和安娜。美羽精力旺盛，常把日常生活变成恶作剧现场，却也与朋友们保持亲密关系，是这群少女中的麻烦制造者。',
  },
  571: {
    traits: ['十二岁', '与美羽同班', '住在美羽隔壁', '性格开朗', '比朋友们更有常识', '擅长做饭', '擅长烤饼干', '伊藤伸惠的妹妹', '常被姐姐昵称为Chi或Chi-chan'],
    description: '伊藤千佳是十二岁的女孩，与好友美羽同班，和姐姐伸惠住在隔壁。她性格开朗，常识感比朋友们强，也擅长做饭和烤饼干。千佳经常被美羽的恶作剧卷入麻烦，却仍愿意照顾身边的伙伴；姐姐伸惠常亲昵称她为“小千”或“Chi-chan”。',
  },
  572: {
    name: '伊藤伸惠',
    nicknames: ['伊藤伸惠', 'Nobue Itou', '伊藤伸恵', 'Nobue'],
    traits: ['系列中年纪最大的角色', '伊藤千佳的姐姐', '烟瘾很重', '喜欢萌文化', '常陪孩子们在千佳房间活动', '常被年幼角色当作榜样', '偶尔向千佳借钱买香烟', '性格随性贪玩'],
    description: '伊藤伸惠是系列中年纪最大的角色，也是千佳的姐姐。她常和妹妹及孩子们待在一起，充当年长者和伙伴；虽然有时会向千佳借钱买香烟，却仍是后辈们仰赖的“大姐姐”。伸惠烟瘾很重，也喜欢萌文化，随性贪玩，让她与孩子们的日常互动常带来反差笑料。',
  },
  573: {
    name: '樱木茉莉',
    nicknames: ['樱木茉莉', 'Matsuri Sakuragi', '桜木茉莉', 'Mats', '茉莉'],
    traits: ['十一岁', '戴眼镜', '养有名叫John的雪貂', '性格胆怯内向', '比千佳和美羽低一个年级', '与安娜同班', '经常被美羽捉弄', '害怕时会躲到伸惠身后', '温柔并珍惜友情'],
    description: '樱木茉莉是十一岁的戴眼镜女孩，养了一只名叫John的雪貂。她性格胆怯内向，常被美羽捉弄，遇到害怕的事情会哭着躲到伸惠身后。茉莉比千佳和美羽低一个年级，和安娜同班；她虽然容易紧张，却很温柔，也珍惜与朋友相处的时光。',
  },
  574: {
    traits: ['十一岁', '五年前从英国康沃尔来到日本', '已经忘记如何说英语', '曾假装自己只会说英语', '说一口礼貌得体的日语', '被茉莉发现其日语能力', '茉莉帮助她重新学习英语', '常被美羽拿姓氏开玩笑', '被美羽称作“柯波拉酱”'],
    description: '安娜·柯波拉十一岁，五年前从英国康沃尔来到日本。她曾假装自己只会说英语，但其实早已忘了如何说英语，能说一口礼貌得体的日语；茉莉最先发现了这件事，并试着帮她重新学习英语。美羽常拿她的姓氏开玩笑，叫她“柯波拉酱”，让安娜很苦恼。',
  },
  575: {
    description: '茶渡泰虎是黑崎一护最亲近的朋友，身高197厘米，拥有墨西哥血统，体格高大却性格安静。他平时不愿对普通人动手，只有在保护同伴或遭遇虚与死神时才会发挥力量。茶渡的完现术逐渐显现为“巨人的右臂”和“恶魔的左臂”，他把成为一护的盾牌视为自己的承诺。',
  },
  673: {
    description: '志村新八是万事屋成员，也在家族道场生活，是个努力学习武士之道的少年。他常负责为银时收拾烂摊子，并以冷静吐槽回应银时和神乐的荒唐行为。新八是寺门通的狂热粉丝，还是偶像后援会“寺门通亲卫队”的队长；他看似普通，却是团队中坚持常识的重要成员。',
  },
  674: {
    description: '神乐是来自夜兔族的少女，外表穿着中华风服装，拥有远超常人的怪力。夜兔族对阳光敏感，所以她随身带着紫色大伞；这把伞既能挡子弹，也能从伞尖发射子弹。她在万事屋工作，食量惊人，最爱腌昆布，常用“阿噜”结尾说话，毒舌又重视伙伴。',
  },
}

const normalizedTitles = Object.fromEntries([418, 419, 421, 2293, 2301].map((id) => [id, '岩窟王']))
const extraTitleIds = [2293, 2301]
const ids = [...new Set([...Object.keys(fixes).map(Number), ...extraTitleIds])]
const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const localById = new Map(local.map((row) => [Number(row.id), row]))
const batch = local.filter((row) => Number(row.id) > 413).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const missingProfiles = batch.map((row) => Number(row.id)).filter((id) => !profileDoc.profiles[id])

function applyToLocal() {
  for (const id of ids) {
    const row = localById.get(id)
    if (!row) throw new Error(`本地缺少角色 ${id}`)
    if (fixes[id]) Object.assign(row, fixes[id])
    if (normalizedTitles[id]) row.anime_title = normalizedTitles[id]
    const profile = profileDoc.profiles[id]
    if (profile?.name) {
      row.nicknames = [...new Set([...(row.nicknames || []), row.name, profile.name.full, profile.name.native, ...(profile.name.alternative || [])].filter(Boolean))]
    }
    const actors = row.voice_actors || []
    row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...actors.map((actor) => actor.name)].join(' ')
    if (fixes[id]) {
      if ((row.traits || []).length < 8) throw new Error(`角色 ${id} 特征少于8条`)
      if ((row.description || '').length < 100 || row.description.length > 200) throw new Error(`角色 ${id} 简介长度不合格：${row.description?.length}`)
      if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 的 search_text 包含简介`)
    }
  }
}

async function syncDatabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('同步数据库需要本地 Supabase secret 环境变量')
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  const [charactersResult, actorsResult] = await Promise.all([
    db.from('characters').select('id,anime_title').in('id', ids),
    db.from('voice_actors').select('character_id,name').in('character_id', ids),
  ])
  if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
  if (actorsResult.error) throw new Error(`读取声优失败：${actorsResult.error.message}`)
  const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
  if (remoteById.size !== ids.length) throw new Error(`Supabase 返回${remoteById.size}/${ids.length}位，停止写入`)
  for (const id of ids) {
    const remote = remoteById.get(id)
    const priorTitle = normalizedTitles[id] ? '巌窟王' : localById.get(id).anime_title
    if (remote.anime_title !== priorTitle) throw new Error(`角色${id}的作品名与预期不一致，停止写入`)
  }
  const actorNames = new Map()
  for (const actor of actorsResult.data || []) {
    const list = actorNames.get(Number(actor.character_id)) || []
    list.push(actor.name)
    actorNames.set(Number(actor.character_id), list)
  }
  for (const id of ids) {
    const row = localById.get(id)
    const searchText = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorNames.get(id) || [])].join(' ')
    const payload = { ...(fixes[id] || {}), ...(fixes[id] ? { nicknames: row.nicknames } : {}), ...(normalizedTitles[id] ? { anime_title: normalizedTitles[id] } : {}), search_text: searchText }
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
  fs.writeFileSync(profilePath, JSON.stringify(profileDoc, null, 2))
}

applyToLocal()
if (process.argv.includes('--sync')) await syncDatabase()
writeLocalExports()

const colorRegex = /(发|髮|瞳|眼|红发|棕发|黑发|金发|蓝发|绿发|紫发|银发|白发|红眼|棕眼|黑瞳|蓝瞳|绿瞳|紫瞳)/
const colorSupported = new Set([425, 430, 508, 519, 520])
const pendingVisualIds = batch.filter((row) => !colorSupported.has(Number(row.id)) && (row.traits || []).some((trait) => colorRegex.test(trait))).map((row) => Number(row.id))
const report = {
  checkedAt: new Date().toISOString(),
  checkedCount: batch.length,
  checkedRange: { firstId: batch[0].id, lastId: batch.at(-1).id },
  modifiedIds: Object.keys(fixes).map(Number),
  titleNormalizedIds: Object.keys(normalizedTitles).map(Number),
  source: {
    name: 'AniList GraphQL character profile snapshot',
    originalFetchedAt: profileDoc.fetchedAt,
    supplementedAt: supplement.fetchedAt,
    supplementedIds: supplement.requestedIds,
    records: ids.filter((id) => profileDoc.profiles[id]).map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
  },
  pendingExternalVerificationIds: missingProfiles,
  pendingVisualVerificationIds: pendingVisualIds,
  pendingVisualVerification: '本轮只按文字资料核验角色外观；未通过可靠文字或既定项目说明支持的其余发色、瞳色尚未独立确认。',
  note: process.argv.includes('--sync') ? 'Supabase已写入并回读；search_text包含姓名、作品、别名、特征和声优名，不包含简介。' : '本地导出已更新；尚未同步Supabase。',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, modified: Object.keys(fixes).length, titleNormalized: Object.keys(normalizedTitles).length, missingProfiles, descriptionLengths: Object.keys(fixes).map((id) => [Number(id), localById.get(Number(id)).description.length]), reportPath }, null, 2))
