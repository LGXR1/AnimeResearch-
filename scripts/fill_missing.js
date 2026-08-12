import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const data = [
  // ====== 海贼王 ======
  [40, { name:'蒙奇·D·路飞', anime_title:'海贼王', image:'https://s4.anilist.co/file/anilistcdn/character/large/b40-MNypXsxSRb1R.png',
    description:'草帽海贼团船长，橡胶果实能力者。梦想成为海贼王，性格天真热血、重视伙伴胜过一切。拥有霸王色霸气，悬赏金30亿贝利。东海风车村出身，爷爷是海军英雄卡普，父亲是革命军首领龙。',
    traits:['黑发','黑色眼瞳','热血','天真','吃货','橡胶果实','霸王色霸气','四皇','悬赏金30亿','D之一族','船长','肉食系'],
    nicknames:['Monkey D Luffy','蒙奇·D·路飞','路飞','草帽小子','橡胶人','海贼王'],
    vas:[['田中真弓','']] }],
  [305, { name:'文斯莫克·山治', anime_title:'海贼王', image:'https://s4.anilist.co/file/anilistcdn/character/large/b305-6lisPmHtCnLT.png',
    description:'草帽海贼团厨师，踢技高手。金发、卷眉毛、永远叼着烟。绅士风度，绝不踢女人。梦想找到传说之海All Blue。出身于杰尔马66暗杀家族，但逃离了那个冷酷的家庭。悬赏金10亿3200万贝利。',
    traits:['金发','卷眉毛','绅士','烟不离口','厨师','踢技','黑脚','悬赏金10亿','All Blue','杰尔马66','好色','骑士道'],
    nicknames:['Sanji','Vinsmoke Sanji','山治','香吉士','黑足山治','Mr. Prince'],
    vas:[['平田广明','']] }],

  // ====== 进击的巨人 ======
  [45627, { name:'利威尔·阿克曼', anime_title:'进击的巨人', image:'https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png',
    description:'调查兵团特别作战班班长，人类最强士兵。阿克曼一族后裔，拥有远超常人的战斗力和反应速度。身高160cm但气场两米八，有严重洁癖。对部下看似冷酷实则极度珍视。名言是"无悔的选择"。',
    traits:['黑发','灰色眼瞳','160cm','冷酷','洁癖','人类最强','阿克曼','士兵长','调查兵团','立体机动','无悔的选择','红茶党'],
    nicknames:['Levi Ackerman','Levi','利威尔','兵长','人类最强','一米六'],
    vas:[['神谷浩史','']] }],
  [71121, { name:'韩吉·佐耶', anime_title:'进击的巨人', image:'https://s4.anilist.co/file/anilistcdn/character/large/b71121-7R7CnQd3lHgt.png',
    description:'调查兵团分队长，后来成为第14代调查兵团团长。对巨人有近乎狂热的科研兴趣，性格古怪但极有才华。研究出多种对抗巨人的战术和武器，是调查兵团不可或缺的智囊。',
    traits:['棕发','棕色眼瞳','科学狂人','巨人爱好者','调查兵团','团长','眼镜','怪人','智囊','性别模糊'],
    nicknames:['Hange Zoe','韩吉·佐耶','韩吉','Hange','科学狂人'],
    vas:[['朴璐美','']] }],
  [46496, { name:'埃尔文·史密斯', anime_title:'进击的巨人', image:'https://s4.anilist.co/file/anilistcdn/character/large/b46496-Mu86MENd5wNB.png',
    description:'第13代调查兵团团长，被誉为最有能力的团长。具有超越时代的远见和牺牲精神，为了人类的真相不惜付出任何代价。一手策划了夺回玛利亚之墙的作战，是调查兵团的灵魂人物。',
    traits:['金发','蓝色眼瞳','高挑','领袖魅力','战略天才','牺牲精神','调查兵团','团长','远见','人类最强指挥官'],
    nicknames:['Erwin Smith','埃尔文·史密斯','埃尔文','Erwin','团长','恶魔指挥官'],
    vas:[['小野大辅','']] }],

  // ====== 咒术回战 ======
  [133699, { name:'夏油杰', anime_title:'咒术回战', image:'https://s4.anilist.co/file/anilistcdn/character/large/b133699-FCnXaISgazAi.png',
    description:'特级咒术师，咒灵操术的使用者。曾是五条悟的挚友和同期，后来因理念不同走向对立。能够操控大量咒灵，建立了以咒术师统治世界的宏大计划。是咒术回战前传故事的核心反派。',
    traits:['黑发','长发','特级咒术师','咒灵操术','反派','五条悟同期','理想主义者','教祖','袈裟','心机深沉'],
    nicknames:['Suguru Getou','夏油杰','Geto','Suguru','最恶诅咒师'],
    vas:[['樱井孝宏','']] }],
  [129571, { name:'乙骨忧太', anime_title:'咒术回战', image:'https://s4.anilist.co/file/anilistcdn/character/large/b129571-GHJk7gviHOOw.jpg',
    description:'特级咒术师，咒术高专二年级学生。体内寄宿着特级过怨咒灵——青梅竹马折本里香。原本是个胆小善良的少年，为了保护同伴逐渐成长为能独当一面的强大咒术师。被称为仅次于五条悟的天才。',
    traits:['黑发','特级咒术师','过怨咒灵','天才','胆小','善良','咒术高专','里香','五条悟后第一人'],
    nicknames:['Yuuta Okkotsu','乙骨忧太','Yuta','Okkotsu','特级'],
    vas:[['绪方惠美','']] }],

  // ====== 我的英雄学院 ======
  [89220, { name:'轰焦冻', anime_title:'我的英雄学院', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89220-KNBwaVFAR8FD.png',
    description:'雄英高中英雄科一年级学生，No.2英雄安德瓦之子。拥有半冷半燃的双重个性——左半身冰、右半身火。因父亲的家庭暴力而长期拒绝使用火焰能力，后在绿谷的鼓励下解开心结。实力极强，目标是成为不靠父亲的英雄。',
    traits:['双色发','异色瞳','半冷半燃','冰与火','天才','高冷','家庭创伤','安德瓦之子','雄英高中','推荐入学'],
    nicknames:['Shouto Todoroki','轰焦冻','Shoto','Todoroki','半冷半燃'],
    vas:[['梶裕贵','']] }],
  [89223, { name:'蛙吹梅雨', anime_title:'我的英雄学院', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89223-5762vburxnlz.png',
    description:'雄英高中英雄科一年级学生，个性是"蛙"——拥有青蛙的各种能力，包括超长舌头、水面跳跃和出色的水中机动性。性格冷静成熟，说话时会加"呱"口癖。虽然在班级中不显眼但极有判断力。',
    traits:['绿发','蛙个性化','长舌','冷静','成熟','水中战','雄英高中','口癖呱','判断力强'],
    nicknames:['Tsuyu Asui','蛙吹梅雨','Tsuyu','蛙吹','梅雨ちゃん'],
    vas:[['悠木碧','']] }],
  [89225, { name:'相泽消太', anime_title:'我的英雄学院', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89225-XBgvUhI9naVI.png',
    description:'雄英高中英雄科一年A班的班主任，职业英雄名"消除英雄Eraser Head"。个性是"消除"——注视目标时可以暂时消除对方的个性。平时以睡袋示人，对学生极为严格但内心十分关心他们。',
    traits:['黑发','长发','倦怠','严格','内热','消除个性','Eraser Head','雄英教师','睡袋','绷带','红眼'],
    nicknames:['Shouta Aizawa','相泽消太','Aizawa','Eraser Head','橡皮头','相泽老师'],
    vas:[['諏访部顺一','']] }],
  [89226, { name:'死柄木弔', anime_title:'我的英雄学院', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89226-qGXqFthO4SM3.jpg',
    description:'敌联合的首领，个性是"崩坏"——任何被他五指触碰的东西都会粉碎。全身覆盖着被自己抓伤的伤痕，被All For One收为弟子和继承人。内心对英雄社会充满仇恨，真实身份隐藏着重大秘密。',
    traits:['白发','红色眼瞳','干枯皮肤','崩坏个性','敌联合','首领','疯狂','游戏宅','All For One弟子','反派','伤痕'],
    nicknames:['Tomura Shigaraki','死柄木弔','Shigaraki','志村转弧','敌联合首领'],
    vas:[['内山昂辉','']] }],

  // ====== JOJO ======
  [4004, { name:'迪奥·布兰度', anime_title:'JOJO的奇妙冒险', image:'https://s4.anilist.co/file/anilistcdn/character/large/b4004-w0OtWuvjhftG.png',
    description:'JOJO系列最经典的反派，贯穿多部作品。从贫民窟少年成为吸血鬼，最终获得替身"世界"——能暂停时间数秒。野心极度膨胀，追求支配一切。名言是"没用没用没用没用！"和"你记得你至今为止吃了多少片面包吗？"。',
    traits:['金发','红色眼瞳','吸血鬼','时停','世界','替身使','JOJO宿敌','傲慢','野心家','贫民窟出身','石鬼面'],
    nicknames:['Dio Brando','迪奥·布兰度','DIO','Dio','世界的支配者'],
    vas:[['子安武人','']] }],
  [8087, { name:'乔纳森·乔斯达', anime_title:'JOJO的奇妙冒险', image:'https://s4.anilist.co/file/anilistcdn/character/large/b8087-GTrObHQvujB5.png',
    description:'JOJO第一部《幻影之血》的主角，JOJO家族的初代。以绅士精神面对一切挑战，修炼波纹气功对抗吸血鬼迪奥。虽然最终在爆炸中与迪奥同归于尽，但他的精神传承给了后代所有JOJO。',
    traits:['蓝发','蓝色眼瞳','高挑','绅士','正义','波纹气功','JOJO初代','贵族','勇敢','自我牺牲'],
    nicknames:['Jonathan Joestar','乔纳森·乔斯达','大乔','Jonathan','JOJO'],
    vas:[['兴津和幸','']] }],
  [10529, { name:'乔鲁诺·乔巴纳', anime_title:'JOJO的奇妙冒险', image:'https://s4.anilist.co/file/anilistcdn/character/large/b10529-AloL8jjZwjsg.png',
    description:'JOJO第五部《黄金之风》的主角，DIO与日本女性所生的儿子。15岁加入意大利黑帮"热情"，梦想成为黑帮明星来改变腐败的那不勒斯。拥有替身"黄金体验"——能赋予物品生命，后期进化为"黄金体验镇魂曲"。',
    traits:['金发','卷发','15岁','冷静','正义','黑帮明星','黄金体验','替身使','DIO之子','意大利'],
    nicknames:['Giorno Giovanna','乔鲁诺·乔巴纳','茸茸','Giorno','GIOGIO'],
    vas:[['小野贤章','']] }],
  [11222, { name:'空条徐伦', anime_title:'JOJO的奇妙冒险', image:'https://s4.anilist.co/file/anilistcdn/character/large/b11222-Se9QoJHDSeYY.png',
    description:'JOJO第六部《石之海》的主角，空条承太郎的女儿。被陷害入狱后在监狱中觉醒替身"石之自由"——可将身体化作线状。性格叛逆倔强但继承了乔斯达家族的正义之血，是第一位女性JOJO主角。',
    traits:['黑发','绿色眼瞳','叛逆','倔强','正义','替身使','石之自由','女JOJO','监狱','承太郎女儿'],
    nicknames:['Jolyne Kuujou','空条徐伦','Jolyne','JoJo','徐伦'],
    vas:[['菲鲁兹·蓝','']] }],

  // ====== 电锯人 ======
  [144596, { name:'姬野', anime_title:'电锯人', image:'https://s4.anilist.co/file/anilistcdn/character/large/b144596-kvL6SD2litJu.png',
    description:'公安对魔特异4课的恶魔猎人，早川秋的前辈和搭档。与幽灵恶魔签订契约，用一只眼睛的代价换取力量。性格豪爽，喜欢照顾新人，是淀治和秋加入公安后的重要引导者。烟酒不忌的大姐头。',
    traits:['黑发','眼罩','豪爽','大姐头','恶魔猎人','幽灵恶魔契约','独眼','公安','抽烟','喝酒','秋的前辈'],
    nicknames:['Himeno','姬野','幽灵恶魔契约者'],
    vas:[['伊濑茉莉也','']] }],
  [148740, { name:'蕾塞', anime_title:'电锯人', image:'https://s4.anilist.co/file/anilistcdn/character/large/b148740-ceAibPxLW8rR.png',
    description:'在咖啡店打工的美丽少女，与淀治短暂交往。真实身份是苏联培养的恶魔人——炸弹恶魔，奉命夺取淀治的心脏。虽然任务在身但真心喜欢上了淀治。摘下颈环即可引爆自身，实力极为恐怖。',
    traits:['紫发','美丽','温柔表象','炸弹恶魔','苏联','恶魔人','暗杀者','咖啡店员','颈环','自爆'],
    nicknames:['Reze','蕾塞','Reze','炸弹恶魔','炸弹女'],
    vas:[['上田丽奈','']] }],

  // ====== 葬送的芙莉莲 ======
  [184311, { name:'辛美尔', anime_title:'葬送的芙莉莲', image:'https://s4.anilist.co/file/anilistcdn/character/large/b184311-wQFySqYXEqf1.png',
    description:'十年前击败魔王的勇者小队中的勇者。性格温柔正直、自恋但不讨人厌，喜欢在每个城镇留下自己的雕像。虽然已经去世十年，但芙莉莲踏上旅程后才真正开始了解他的心意和对自己的深情。是芙莉莲心中永远的勇者。',
    traits:['蓝发','蓝色眼瞳','高挑','温柔','正直','自恋','勇者','勇者小队','已故','喜欢芙莉莲','雕像','传奇'],
    nicknames:['Himmel','辛美尔','勇者辛美尔'],
    vas:[['冈本信彦','']] }],
  [184310, { name:'海塔', anime_title:'葬送的芙莉莲', image:'https://s4.anilist.co/file/anilistcdn/character/large/b184310-tiXvrq4FINXP.jpg',
    description:'勇者小队中的僧侣，使用女神魔法。嗜酒如命的好色大叔，但作为僧侣极为优秀。是勇者小队中最年长的成员，在芙莉莲面前自称大哥哥。勇者死后收养了战灾孤儿菲伦并培养她成为魔法使。',
    traits:['绿发','好酒','好色','僧侣','女神魔法','勇者小队','年长者','菲伦养父','可靠','大叔'],
    nicknames:['Heiter','海塔','僧侣海塔','酒鬼僧侣'],
    vas:[['东地宏树','']] }],

  // ====== 命运石之门 ======
  [30919, { name:'漆原琉华', anime_title:'命运石之门', image:'https://s4.anilist.co/file/anilistcdn/character/large/b30919-5PjiA4ucfuuJ.png',
    description:'柳林神社的独生子，未来道具研究所成员LabMem No.006。外表比女性还美丽，性格温柔羞怯。使用妖刀·五月雨修行剑术。在不同的世界线中性别会发生变化，是整个故事中最具戏剧性的伏笔之一。',
    traits:['黑发','长发','伪娘','温柔','羞怯','剑道','妖刀五月雨','LabMem No.006','神社之子','性别变更'],
    nicknames:['Luka Urushibara','漆原琉华','琉华子','Ruka','Luka'],
    vas:[['小林优','']] }],
  [35256, { name:'菲利斯·喵喵', anime_title:'命运石之门', image:'https://s4.anilist.co/file/anilistcdn/character/large/b35256-A729dmHEgSYQ.png',
    description:'秋叶原女仆咖啡厅的看板娘，本名秋叶留未穗。未来道具研究所成员LabMem No.007。用猫娘口吻说话，每句话结尾加"喵"。看似天真可爱但实际上是秋叶原大地主家的千金，在D-Mail事件中改变了关键过去。',
    traits:['棕发','猫耳','猫娘','女仆','大小姐','秋叶原','LabMem No.007','喵口癖','可爱','隐藏千金'],
    nicknames:['Rumiho Akiha','Faris Nyannyan','秋叶留未穗','菲利斯·喵喵','Faris','菲莉斯'],
    vas:[['桃井晴子','']] }],

  // ====== 名侦探柯南 ======
  [1743, { name:'灰原哀', anime_title:'名侦探柯南', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1743-yw1FloPUI7jO.png',
    description:'原黑衣组织科学家宫野志保，代号雪莉。因姐姐被组织杀害而试图逃离，服下APTX4869后身体缩小为小学生。寄住在阿笠博士家，与柯南合作对抗黑衣组织。性格冷静傲娇，擅长化学和医学，是柯南最重要的搭档。',
    traits:['棕发','小学生外表','傲娇','冷静','科学家','化学','医学','黑衣组织','雪莉','APTX4869','柯南搭档'],
    nicknames:['Ai Haibara','灰原哀','小哀','宫野志保','雪莉','Sherry','Haibara Ai'],
    vas:[['林原惠美','']] }],
  [1745, { name:'服部平次', anime_title:'名侦探柯南', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1745-EleoviDvO7qh.jpg',
    description:'关西高中生侦探，与工藤新一齐名。大阪府警本部长之子，擅长剑道。肤色黝黑，性格热情豪爽。是新一/柯南最好的朋友和竞争对手，多次协助柯南解决棘手案件。称柯南为"工藤"，是少数知道柯南真实身份的人。',
    traits:['黑发','肤色黝黑','关西腔','高中生侦探','剑道','热情','豪爽','大阪','警长之子','柯南挚友'],
    nicknames:['Heiji Hattori','服部平次','平次','Heiji','关西侦探','西之服部'],
    vas:[['堀川亮','']] }],
  [1747, { name:'怪盗基德', anime_title:'名侦探柯南', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1747-LYyYIvIZIdnE.jpg',
    description:'活跃于夜空的怪盗，真实身份是高中生黑羽快斗。白色礼服加单片眼镜是他的标志，擅长魔术和易容术。每次行动前发出预告函，以华丽的表演戏弄警方。对柯南/新一有着亦敌亦友的关系。招牌台词是"Ladies and Gentlemen！"。',
    traits:['棕发','单片眼镜','白色礼服','怪盗','魔术师','易容','天才','滑翔翼','魔术快斗','预告函','亦敌亦友'],
    nicknames:['Kaito Kuroba','Kaito Kid','KID','怪盗基德','黑羽快斗','月光下的魔术师','平成鲁邦'],
    vas:[['山口胜平','']] }],

  // ====== 鬼灭之刃 ======
  [129132, { name:'鬼舞辻无惨', anime_title:'鬼灭之刃', image:'https://s4.anilist.co/file/anilistcdn/character/large/b129132-4nIZakUZ1o8W.jpg',
    description:'鬼之始祖，所有鬼的创造者。存活超过千年的究极生物，拥有多重心脏和大脑。以人类形态混迹社会中，追求永生不死和克服阳光。残忍冷酷，容不下任何失败，是所有鬼杀队剑士的最终敌人。',
    traits:['黑发','红色眼瞳','鬼之始祖','千年不死','多重心脏','残忍','冷酷','克服阳光','究极生物','最终BOSS','迈克杰克逊发型'],
    nicknames:['Muzan Kibutsuji','鬼舞辻无惨','无惨','鬼之始祖','千年的鬼王'],
    vas:[['关俊彦','']] }],
  [137774, { name:'不死川实弥', anime_title:'鬼灭之刃', image:'https://s4.anilist.co/file/anilistcdn/character/large/b137774-O1iYrnGLB71l.png',
    description:'鬼杀队的风柱，满身伤痕的硬汉。使用风之呼吸，性格极端暴躁但对弟弟玄弥怀有深深的爱和保护欲。因稀血体质对鬼有天然优势。脸上和身上布满战斗留下的伤痕，是九柱中最凶暴的存在。',
    traits:['白发','伤痕满身','暴躁','风柱','风之呼吸','九柱','稀血','硬汉','弟弟保护者','鬼杀队'],
    nicknames:['Sanemi Shinazugawa','不死川实弥','Sanemi','风柱','不死川','伤疤柱'],
    vas:[['关智一','']] }],
  [136072, { name:'甘露寺蜜璃', anime_title:'鬼灭之刃', image:'https://s4.anilist.co/file/anilistcdn/character/large/b136072-xVwyRUKdpybi.png',
    description:'鬼杀队的恋柱，使用恋之呼吸。粉绿相间的彩色长发和丰满身材是她的标志。肌肉密度是常人的八倍但外表看不出来。性格天真浪漫，加入鬼杀队的原因是想找到比自己更强的人结婚。食量惊人。',
    traits:['粉绿发','彩色长发','丰满','天真','浪漫','恋柱','恋之呼吸','九柱','肌肉密度8倍','大食量','求偶目的'],
    nicknames:['Mitsuri Kanroji','甘露寺蜜璃','Mitsuri','恋柱','蜜璃'],
    vas:[['花泽香菜','']] }],
  [129133, { name:'炼狱杏寿郎', anime_title:'鬼灭之刃', image:'https://s4.anilist.co/file/anilistcdn/character/large/b129133-VlTPowwt68rJ.png',
    description:'鬼杀队的炎柱，使用炎之呼吸。性格热血开朗，说每句话都充满激情和活力。在无限列车篇以一人之力保护了所有乘客，展现出炎柱的终极奥义。虽然最终战死但精神震撼了所有观众。名言是"燃烧心臓！"。',
    traits:['金发','红色眼瞳','热血','开朗','炎柱','炎之呼吸','九柱','无限列车','燃烧心脏','牺牲','饭量超大'],
    nicknames:['Kyoujurou Rengoku','炼狱杏寿郎','Rengoku','炎柱','大哥'],
    vas:[['日野聪','']] }],
  [136071, { name:'宇髄天元', anime_title:'鬼灭之刃', image:'https://s4.anilist.co/file/anilistcdn/character/large/b136071-99Kexnnn2PiV.png',
    description:'鬼杀队的音柱，使用音之呼吸。曾是忍者，以华丽为人处世的信条。有三个妻子，身上戴着大量华丽的珠宝装饰。拥有超凡的听力和节奏感，能通过声音判断地形和敌人位置。性格张扬但实力极强。',
    traits:['白发','肌肉发达','高挑','华丽','忍者出身','音柱','音之呼吸','九柱','三个妻子','超常听觉','珠宝装饰'],
    nicknames:['Tengen Uzui','宇髄天元','Uzui','音柱','宇髄','华丽之神'],
    vas:[['小西克幸','']] }],
  [136069, { name:'时透无一郎', anime_title:'鬼灭之刃', image:'https://s4.anilist.co/file/anilistcdn/character/large/b136069-6PLglx4tETUX.png',
    description:'鬼杀队的霞柱，年仅14岁的天才剑士。使用霞之呼吸，在两个月内从握刀到成为柱。因过去的创伤而丧失大部分记忆，性格淡漠像空气一样。拥有日之呼吸剑士的血脉，潜力无人能及。',
    traits:['黑发','淡色眼瞳','14岁','天才','淡漠','失忆','霞柱','霞之呼吸','九柱','日之呼吸血脉','两个月成柱'],
    nicknames:['Muichirou Tokitou','时透无一郎','Muichiro','霞柱','无一郎','天才少年'],
    vas:[['河西健吾','']] }],
]

let count = 0
for (const [id, d] of data) {
  const { error } = await supabase.from('characters').upsert({
    id, name: d.name, anime_title: d.anime_title, image: d.image,
    description: d.description, traits: d.traits, nicknames: d.nicknames,
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
for (const c of chars||[]) {
  const st = [c.name, c.anime_title||'', ...(c.nicknames||[]), ...(c.traits||[]), ...(c.voice_actors||[]).map(v=>v.name)].join(' ')
  await supabase.from('characters').update({ search_text: st }).eq('id', c.id)
}
console.log('✅', count, '个角色')
