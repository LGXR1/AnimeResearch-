import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const data = [
  // ====== 捏造陷阱 (4) ======
  [89975, {name:'冈崎由真', anime_title:'捏造陷阱', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89975-VY76MlI6YYuU.png',
    description:'普通的女高中生，有一个交往中的男朋友。与青梅竹马的水科萤重逢后，被萤以"练习"为名带入了秘密的关系中。在男友和萤之间摇摆不定，逐渐意识到自己对萤的真实感情。',
    traits:['棕发','女高中生','青梅竹马','被引导','纠结','双性恋','内向'],
    nicknames:['Yuma Okazaki','冈崎由真','Yuma'], vas:[['加隈亚衣','']] }],
  [89976, {name:'水科萤', anime_title:'捏造陷阱', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89976-BwNm1AnYeonG.png',
    description:'由真的青梅竹马，高中时重逢。表面上开朗大方但内心隐藏着复杂的感情。主动引导由真进行"秘密关系"，真实动机是想要帮助由真认清自己的感情。',
    traits:['黑发','长发','开朗','主动','秘密关系','青梅竹马','引导者'],
    nicknames:['Hotaru Mizushina','水科萤','Hotaru'], vas:[['五十岚裕美','']] }],
  [89978, {name:'武田', anime_title:'捏造陷阱', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89978-b5Vs8hiwfEdp.png',
    description:'由真的男朋友，温柔体贴的普通男高中生。虽然察觉到由真的变化但始终信任和支持她。',
    traits:['棕发','温柔','男友','理解','配角'], nicknames:['Takeda','武田'], vas:[['暂未收录','']] }],
  [89977, {name:'藤原', anime_title:'捏造陷阱', image:'https://s4.anilist.co/file/anilistcdn/character/large/b89977-k8QuN63FwLRG.png',
    description:'萤的男朋友，与由真和武田是朋友关系。对萤有着强烈的占有欲。', traits:['黑发','占有欲','男友'], nicknames:['Fujiwara','藤原'], vas:[['暂未收录','']] }],

  // ====== 少女派别 (4) ======
  [18918, {name:'内藤桃子', anime_title:'少女派别', image:'https://s4.anilist.co/file/anilistcdn/character/large/18918.jpg',
    description:'私立女校的学生会成员，性格温和善良。与学妹花苗之间产生了超越友情的情感。对自己的性取向感到困惑，在女校的封闭环境中探索着少女之间的感情。',
    traits:['黑发','学生会','温和','善良','困惑','女校','百合觉醒'], nicknames:['Momoko Naitou','内藤桃子'], vas:[['暂未收录','']] }],
  [18917, {name:'半田花苗', anime_title:'少女派别', image:'https://s4.anilist.co/file/anilistcdn/character/large/b18917-Uvo6Q979tTWh.png',
    description:'桃子的学妹，对桃子有着超越友谊的崇拜和爱恋。性格羞涩内向，在桃子的温柔对待下逐渐敢于直面自己的感情。', traits:['棕发','学妹','羞涩','崇拜','内向'], nicknames:['Shinobu Handa','半田花苗'], vas:[['暂未收录','']] }],
  [29689, {name:'狛井时雨', anime_title:'少女派别', image:'https://s4.anilist.co/file/anilistcdn/character/large/29689.jpg',
    description:'女校的神秘美少女，与多位女生有着复杂的关系。在校园中如同传说般的存在。', traits:['黑发','美少女','神秘','传说'], nicknames:['Shigure Komai','狛井时雨'], vas:[['暂未收录','']] }],
  [29690, {name:'圆城寺真弥', anime_title:'少女派别', image:'https://s4.anilist.co/file/anilistcdn/character/large/29690.jpg',
    description:'女校的教师，成熟优雅的女性。在学生的百合关系中扮演着观察者的角色。', traits:['棕发','女教师','成熟','优雅'], nicknames:['Maya Enjyoji','圆城寺真弥'], vas:[['暂未收录','']] }],

  // ====== 花吻在上 (2) ======
  [29210, {name:'泽口麻衣', anime_title:'花吻在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/29210.jpg',
    description:'温柔内向的女高中生，在校园中遇到了川村玲绪后产生了初恋般的感情。两人的初吻成为了一段美好恋情的开端。纯爱百合的代表作角色。',
    traits:['棕发','温柔','内向','初恋','纯爱','百合','女高中生'], nicknames:['Mai Sawaguchi','泽口麻衣'], vas:[['暂未收录','']] }],
  [29211, {name:'川村玲绪', anime_title:'花吻在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/29211.jpg',
    description:'麻衣的恋人，性格开朗主动。与麻衣的感情从初吻开始逐渐加深。两人在校园中进行了最纯粹的百合恋爱。', traits:['黑发','开朗','主动','恋人','初吻','纯爱'], nicknames:['Reo Kawamura','川村玲绪'], vas:[['暂未收录','']] }],

  // ====== 柑橘味香气 (5) ======
  [83367, {name:'蓝原柚子', anime_title:'柑橘味香气', image:'https://s4.anilist.co/file/anilistcdn/character/large/b83367-qOJp0tfOZf7r.jpg',
    description:'辣妹系女高中生，因母亲再婚而转学进入了一所大小姐女校。性格开朗热情但与周围格格不入。与异父异母的妹妹·学生会长蓝原芽衣从冲突开始渐渐发展出复杂的感情。',
    traits:['金发','辣妹','开朗','热情','义理姐妹','转校生','大小姐学校','柑橘味'],
    nicknames:['Yuzu Aihara','蓝原柚子','Yuzu','柚子'], vas:[['竹达彩奈','']] }],
  [83209, {name:'蓝原芽衣', anime_title:'柑橘味香气', image:'https://s4.anilist.co/file/anilistcdn/character/large/b83209-gv2ABy7LBr5x.jpg',
    description:'学生会会长，冷静严肃的黑长直美人。柚子异父异母的妹妹。表面上对所有事都完美处理，实际内心孤独且渴望被爱。在与柚子的冲突和相处中逐渐开放心扉。',
    traits:['黑发','长发','学生会长','冷静','完美主义','孤独','义理姐妹','傲娇'],
    nicknames:['Mei Aihara','蓝原芽衣','Mei','芽衣'], vas:[['津田美波','']] }],
  [83387, {name:'谷口晴美', anime_title:'柑橘味香气', image:'https://s4.anilist.co/file/anilistcdn/character/large/b83387-UImdNRsseICO.jpg',
    description:'柚子在女校的第一个朋友，性格爽朗。是学校中少有的对柚子表示友好的同学。在柚子和芽衣的关系中成为重要的支持者。', traits:['棕发','爽朗','朋友','支持者'], nicknames:['Harumi Taniguchi','谷口晴美'], vas:[['暂未收录','']] }],
  [212199, {name:'蓝原翔', anime_title:'柑橘味香气', image:'https://s4.anilist.co/file/anilistcdn/character/large/b212199-6MchfpLTKQ10.png',
    description:'柚子的父亲，再婚后成为了新家庭的连接者。工作忙碌但对女儿们充满关爱。', traits:['中年','父亲','再婚','关爱'], nicknames:['Shou Aihara','蓝原翔'], vas:[['暂未收录','']] }],
  [212201, {name:'蓝原梅', anime_title:'柑橘味香气', image:'https://s4.anilist.co/file/anilistcdn/character/large/b212201-RQkOC4hspR7M.png',
    description:'芽衣的母亲，柚子的继母。与柚子的父亲再婚后为两个家庭搭建了新的关系。是促成柚子和芽衣成为姐妹的关键人物。', traits:['棕发','母亲','再婚','温柔'], nicknames:['Ume Aihara','蓝原梅'], vas:[['暂未收录','']] }],

  // ====== 终将成为你 (5) ======
  [123529, {name:'七海灯子', anime_title:'终将成为你', image:'https://s4.anilist.co/file/anilistcdn/character/large/b123529-XSxpzTGWAq2a.png',
    description:'学生会会长，完美的优等生。所有人都认为她完美无缺但她内心空虚——因为她无法爱上任何人。直到遇见小糸侑，侑是唯一一个她可以放下伪装的人。对侑说"我不会爱上你所以请放心"却在不知不觉中越陷越深。',
    traits:['黑发','学生会长','完美主义','内心空虚','无法爱人','优等生','伪装','傲娇','深情'],
    nicknames:['Touko Nanami','七海灯子','Touko','灯子'], vas:[['寿美菜子','']] }],
  [123528, {name:'小糸侑', anime_title:'终将成为你', image:'https://s4.anilist.co/file/anilistcdn/character/large/b123528-q3SR8wyDPTCe.png',
    description:'高中一年级学生，加入了学生会。一直憧憬恋爱却从未真正心动过。被灯子表白后以"我也无法爱上任何人"为由接受了这段特殊关系。但在陪伴灯子的过程中，她发现自己才是那个正在坠入爱河的人。',
    traits:['棕发','天然','温柔','初恋','学生会','恋爱困惑','陪伴','成长'],
    nicknames:['Yuu Koito','小糸侑','Yuu','侑'], vas:[['高田忧希','']] }],
  [128561, {name:'儿玉都', anime_title:'终将成为你', image:'https://s4.anilist.co/file/anilistcdn/character/large/b128561-TWh3PyMtgBYu.jpg',
    description:'学生会的学姐成员，开朗活泼。是灯子和侑身边的重要见证人。她观察着两人的关系变化，偶尔给出不痛不痒的评论和助攻。', traits:['棕发','开朗','学生会','见证人','助攻'], nicknames:['Miyako Kodama','儿玉都'], vas:[['暂未收录','']] }],
  [128563, {name:'堂岛卓', anime_title:'终将成为你', image:'https://s4.anilist.co/file/anilistcdn/character/large/b128563-pgBXP0w8X5L4.png',
    description:'灯子的青梅竹马和同班同学。一直默默喜欢灯子但知道自己的感情不会被回应。选择以朋友的身份继续守护在灯子身边。', traits:['黑发','青梅竹马','默默喜欢','守护','配角'], nicknames:['Suguru Doujima','堂岛卓'], vas:[['暂未收录','']] }],
  [154103, {name:'市谷知雪', anime_title:'终将成为你', image:'https://s4.anilist.co/file/anilistcdn/character/large/b154103-lcYetDREdomb.jpg',
    description:'已故的七海家姐姐，灯子的精神支柱和模仿对象。灯子一直在扮演"姐姐的替身"来维持她完美的外表。是灯子性格塑造的关键人物。', traits:['已故','姐姐','精神支柱','完美','关键人物'], nicknames:['Tomoyuki Ichigaya','市谷知雪'], vas:[['暂未收录','']] }],

  // ====== 安达与岛村 (3) ======
  [144717, {name:'安达樱', anime_title:'安达与岛村', image:'https://s4.anilist.co/file/anilistcdn/character/large/b144717-wdwT0NkNmOFS.png',
    description:'高中不良少女，经常翘课在天台度过。看似冷漠但内心极度依赖岛村，无法忍受她与别人走得过近。对岛村的感情从友情逐渐变质为一心一意的独占欲。在岛村面前会展现出少见的孩子气一面。',
    traits:['黑发','不良少女','天台上','独占欲','冷漠外表','内心脆弱','翘课','孩子气'],
    nicknames:['Sakura Adachi','安达樱','Adachi','安达'], vas:[['鬼头明里','']] }],
  [144718, {name:'岛村抱月', anime_title:'安达与岛村', image:'https://s4.anilist.co/file/anilistcdn/character/large/b144718-2m6bHwgM9Rii.jpg',
    description:'温柔随和的女高中生，总是包容着安达的各种行为。似乎对安达的感情不太敏感但其实什么都看在眼里。以不紧不慢的节奏回应着安达，与安达度过一个又一个平静却温暖的日子。',
    traits:['棕发','温柔','包容','随和','天然','高中女生','淡淡的爱'],
    nicknames:['Hougetsu Shimamura','岛村抱月','Shimamura','岛村'], vas:[['伊藤美来','']] }],
  [193215, {name:'安达敦香', anime_title:'安达与岛村', image:'https://s4.anilist.co/file/anilistcdn/character/large/b193215-kOcfXvY1dGKv.png',
    description:'安达樱的母亲，理解女儿的性格并默默支持她的成长。偶尔给出恰到好处的建议。', traits:['母亲','理解','支持'], nicknames:['Atsuka Adachi','安达敦香'], vas:[['暂未收录','']] }],

  // ====== 利兹与青鸟 (4) ======
  [125960, {name:'铠冢霙', anime_title:'利兹与青鸟', image:'https://s4.anilist.co/file/anilistcdn/character/large/b125960-sUJI3F13pRyr.png',
    description:'北宇治高中吹奏乐部的双簧管手，内向寡言的音乐天才。暗恋着长笛手伞木希美，但害怕自己过度依赖希美的感情会束缚对方。以利兹的身份弹奏音乐——利兹爱上了变成人类的青鸟却选择放她自由。',
    traits:['黑发','双簧管','内向','音乐天才','暗恋','依赖','利兹','吹奏乐部'],
    nicknames:['Mizore Yoroizuka','铠冢霙','Mizore','霙'], vas:[['种崎敦美','']] }],
  [120724, {name:'伞木希美', anime_title:'利兹与青鸟', image:'https://s4.anilist.co/file/anilistcdn/character/large/b120724-RpJC4wcv8mWc.jpg',
    description:'北宇治高中吹奏乐部的长笛手，开朗阳光。是霙最好的朋友和最深的爱慕对象。象征着童话中的青鸟——自由而美丽，不由自主飞向更广阔的天空。她对霙的感情比友情更深但没有自觉。',
    traits:['棕发','长笛','开朗','阳光','青鸟','吹奏乐部','被爱慕而不自知'],
    nicknames:['Nozomi Kasaki','伞木希美','Nozomi','希美'], vas:[['东山奈央','']] }],
  [88923, {name:'中川夏纪', anime_title:'利兹与青鸟', image:'https://s4.anilist.co/file/anilistcdn/character/large/b88923-YR8ykPfq5bMV.png',
    description:'吹奏乐部的低音提琴手，在利兹与青鸟中作为希美和霙故事线的第三视角。是故事的见证者之一。', traits:['棕发','低音提琴','吹奏乐部','见证者'], nicknames:['Natsuki Nakagawa','中川夏纪'], vas:[['暂未收录','']] }],
  [129090, {name:'剑崎梨梨花', anime_title:'利兹与青鸟', image:'https://s4.anilist.co/file/anilistcdn/character/large/b129090-C7RqY9pCxzR9.png',
    description:'吹奏乐部成员，在利兹与青鸟中有少量出场。是音乐世界中又一个普通但重要的存在。', traits:['棕发','吹奏乐部','配角'], nicknames:['Ririka Kenzaki','剑崎梨梨花'], vas:[['暂未收录','']] }],

  // ====== 惊爆草莓 (5) ======
  [745, {name:'花园静马', anime_title:'惊爆草莓', image:'https://s4.anilist.co/file/anilistcdn/character/large/b745-70NKPNyV98UA.png',
    description:'圣米亚特尔女学园的明星学生，被称为"艾特瓦尔"。长发飘飘、气质高贵的白马王子型女性。全校女生的憧憬对象。与转学生苍井渚砂间产生了超越友情的羁绊。',
    traits:['银发','长发','艾特瓦尔','白马王子','全校憧憬','高贵','深情','学姐'],
    nicknames:['Shizuma Hanazono','花园静马','Shizuma','艾特瓦尔'], vas:[['生天目仁美','']] }],
  [1977, {name:'苍井渚砂', anime_title:'惊爆草莓', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1977-VsjiVlGORxDv.jpg',
    description:'转学到圣米亚特尔女学园的一年级新生。天真烂漫的少女，在入学后遇到了花园静马并被她的魅力吸引。在女校的百合世界中经历了初恋的甜蜜与苦涩。',
    traits:['棕发','转校生','天真','烂漫','一年级','初恋','百合'],
    nicknames:['Nagisa Aoi','苍井渚砂','Nagisa'], vas:[['中原麻衣','']] }],
  [1308, {name:'凉水玉青', anime_title:'惊爆草莓', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1308-KuhMOXXDYHeH.jpg',
    description:'渚砂的同班同学和好友，暗恋着渚砂。温柔体贴但内心复杂，默默守护在渚砂身边。是经典的女校三角关系中的第三者角色。',
    traits:['蓝发','温柔','暗恋','守护','同学','三角关系'], nicknames:['Tamao Suzumi','凉水玉青'], vas:[['清水爱','']] }],
  [1978, {name:'六条深雪', anime_title:'惊爆草莓', image:'https://s4.anilist.co/file/anilistcdn/character/large/1978.jpg',
    description:'圣斯皮卡女学园的学生会长，与静马是旧识。气质冷艳的知性美女。', traits:['黑发','学生会长','冷艳','知性','旧识'], nicknames:['Miyuki Rokujo','六条深雪'], vas:[['暂未收录','']] }],
  [1976, {name:'樱木花织', anime_title:'惊爆草莓', image:'https://s4.anilist.co/file/anilistcdn/character/large/1976.jpg',
    description:'圣米亚特尔的学生，活泼可爱的后辈。', traits:['棕发','活泼','可爱','后辈'], nicknames:['Kaori Sakuragi','樱木花织'], vas:[['暂未收录','']] }],

  // ====== 牵牛花与加濑同学 (2) ======
  [125397, {name:'山田结衣', anime_title:'牵牛花与加濑同学', image:'https://s4.anilist.co/file/anilistcdn/character/large/b125397-TtFXE0cUSkNl.jpg',
    description:'普通的女高中生，绿化委员。内向害羞，暗恋着同班的运动少女加濑同学。在照料学校花坛的日常中与加濑同学逐渐拉近关系。一段平凡却美好的校园百合恋情。',
    traits:['黑发','内向','绿化委员','害羞','暗恋','平凡','温柔'], nicknames:['Yui Yamada','山田结衣','Yui'], vas:[['暂未收录','']] }],
  [125398, {name:'加濑友香', anime_title:'牵牛花与加濑同学', image:'https://s4.anilist.co/file/anilistcdn/character/large/b125398-433cvbotvXxV.jpg',
    description:'田径部的运动少女，开朗帅气。对山田有着温柔的关注和喜欢。主动而体贴地接近山田，两人在校园花坛边建立了一段美好的恋情。',
    traits:['黑发','短发','田径部','帅气','开朗','主动','温柔','运动少女'],
    nicknames:['Tomoka Kase','加濑友香','加濑同学','Kase'], vas:[['暂未收录','']] }],

  // ====== 樱trick (4) ======
  [86385, {name:'高山春香', anime_title:'樱trick', image:'https://s4.anilist.co/file/anilistcdn/character/large/b86385-6Hjd2BO2tmeg.jpg',
    description:'高中女生，性格活泼。与园田优是最好的朋友，但某一天两人在意外中亲吻后关系彻底改变。以此为契机，两人开始了秘密的"接吻练习"——每次都要找出不同的接吻理由。',
    traits:['棕发','活泼','女子高中生','接吻','朋友变恋人','百合','秘密关系'],
    nicknames:['Haruka Takayama','高山春香','Haruka'], vas:[['户松遥','']] }],
  [86387, {name:'园田优', anime_title:'樱trick', image:'https://s4.anilist.co/file/anilistcdn/character/large/b86387-wmk9wtRAkJiA.jpg',
    description:'春香最好的朋友和恋人。性格内向害羞但配合春香的每一次"接吻练习"。其实非常享受与春香的亲密时刻，比春香更早意识到自己的感情。',
    traits:['黑发','内向','害羞','接吻恋人','百合','女子高中生'],
    nicknames:['Yuu Sonoda','园田优','Yuu'], vas:[['井口裕香','']] }],
  [87713, {name:'坂井理奈', anime_title:'樱trick', image:'https://s4.anilist.co/file/anilistcdn/character/large/87713.jpg',
    description:'春香和优的同班同学，察觉到两人之间特殊的关系。偶尔给予助攻或吐槽。', traits:['棕发','同学','见证者','助攻'], nicknames:['Rina Sakai','坂井理奈'], vas:[['暂未收录','']] }],
  [87706, {name:'野田琴音', anime_title:'樱trick', image:'https://s4.anilist.co/file/anilistcdn/character/large/b87706-7emA4ZvYZRUt.jpg',
    description:'春香的另一好友，活泼搞笑的存在。', traits:['棕发','搞笑','活泼','好友'], nicknames:['Kotone Noda','野田琴音'], vas:[['暂未收录','']] }],

  // ====== 砂糖的幸福生活 (4) ======
  [126754, {name:'松坂砂糖', anime_title:'砂糖的幸福生活', image:'https://s4.anilist.co/file/anilistcdn/character/large/b126754-8qXcvqW1gPNf.png',
    description:'与名为"盐"的小学女生同住的高中女生。对盐有着深入骨髓的执念和爱——称之为"幸福"。表面甜美可爱但为了守护与盐的生活会毫不犹豫地杀人。纯真与疯狂并存的病娇少女。',
    traits:['粉发','双马尾','甜美','病娇','病态之爱','为爱杀人','幸福','疯狂','单纯'],
    nicknames:['Satou Matsuzaka','松坂砂糖','Satou','砂糖'], vas:[['花泽香菜','']] }],
  [126755, {name:'神户盐', anime_title:'砂糖的幸福生活', image:'https://s4.anilist.co/file/anilistcdn/character/large/n126755-7JUcnmtvFsPU.jpg',
    description:'与砂糖同住的小学女生，纯真无暇。因家庭原因被砂糖收留保护。对砂糖有着完全的信任和依赖，是砂糖口中"最幸福的东西"。',
    traits:['蓝发','小学生','纯真','无辜','依赖','被保护','天使'],
    nicknames:['Shio Koube','神户盐','Shio','盐'], vas:[['久野美咲','']] }],
  [126756, {name:'神户朝日', anime_title:'砂糖的幸福生活', image:'https://s4.anilist.co/file/anilistcdn/character/large/b126756-qfSWWbB3IxNd.jpg',
    description:'盐的哥哥，一直在寻找失踪的妹妹。发现砂糖与盐的关系后试图将盐带回家。是故事中为数不多的正常视角。',
    traits:['黑发','哥哥','寻找妹妹','正常人视角','高中生'], nicknames:['Asahi Koube','神户朝日','Asahi'], vas:[['暂未收录','']] }],
  [174746, {name:'北埋川静香', anime_title:'砂糖的幸福生活', image:'https://s4.anilist.co/file/anilistcdn/character/large/b174746-vfKQeBDG4yOy.png',
    description:'砂糖的同班同学和朋友，对砂糖和盐的关系有所察觉。试图帮忙但往往把事情搞得更复杂。', traits:['黑发','同学','朋友','观察者'], nicknames:['Shizuka Kitaumekawa','北埋川静香'], vas:[['暂未收录','']] }],

  // ====== 莉可丽丝 (4) ======
  [260329, {name:'锦木千束', anime_title:'莉可丽丝', image:'https://s4.anilist.co/file/anilistcdn/character/large/b260329-1Z5n1QgViEBI.png',
    description:'和风咖啡厅"LycoReco"的招牌店员（Lycoris），以非致命子弹为信条的另类杀手。性格极度乐观开朗，享受每一天的生活。拥有超强的动态视力和躲避能力，任何攻击都无法击中她。与泷奈是最佳搭档。',
    traits:['金发','红色眼瞳','Lycoris','非致命弹','乐观','最强闪避','咖啡厅','开朗','元气'],
    nicknames:['Chisato Nishikigi','锦木千束','Chisato','千束'], vas:[['安济知佳','']] }],
  [260328, {name:'井之上泷奈', anime_title:'莉可丽丝', image:'https://s4.anilist.co/file/anilistcdn/character/large/b260328-GVvi4r6RKivm.png',
    description:'从DA总部被调派到LycoReco的Lycoris，性格严肃冷酷。在千束的影响下逐渐学会了享受生活和微笑。虽然一开始对千束的方式充满质疑但后来成为她最信任的伙伴。',
    traits:['黑发','Lycoris','冷酷','严肃','被千束感染','忠诚','成长','搭档'],
    nicknames:['Takina Inoue','井之上泷奈','Takina','泷奈'], vas:[['若山诗音','']] }],
  [283404, {name:'真岛', anime_title:'莉可丽丝', image:'https://s4.anilist.co/file/anilistcdn/character/large/b283404-VNfIXSv6HTe4.png',
    description:'与Lycoris对立的神秘势力成员，千束的宿敌。拥有超乎常人的战斗力和意志力。虽然立场对立但有着自己的信念和美学。', traits:['白发','反派','千束宿敌','战斗力','信念'], nicknames:['Majima','真岛'], vas:[['暂未收录','']] }],
  [283680, {name:'楠木', anime_title:'莉可丽丝', image:'https://s4.anilist.co/file/anilistcdn/character/large/b283680-beia7O4YaKLE.png',
    description:'DA组织的上级指挥官，泷奈的直属上司。对Lycoris们有着严格的要求但出发点是为了她们的安全。', traits:['黑发','指挥官','DA','严格','上司'], nicknames:['Kusunoki','楠木'], vas:[['暂未收录','']] }],

  // ====== 圣母在上 (5) ======
  [1638, {name:'小笠原祥子', anime_title:'圣母在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1638-2LNtpbMcCgCw.png',
    description:'莉莉安女学园高等部的红蔷薇花蕾。名门大小姐气质高贵，被全校学生仰慕。是莉莉安女学园"姐妹制度"中最具代表性的学姐。与妹妹福泽佑巳的关系是整个系列的核心。',
    traits:['黑发','大小姐','红蔷薇','姐妹制度','学姐','高贵','全校仰慕'],
    nicknames:['Sachiko Ogasawara','小笠原祥子','Sachiko','红蔷薇'], vas:[['伊藤美纪','']] }],
  [1644, {name:'藤堂志摩子', anime_title:'圣母在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1644-XBQm4RMxqpfM.png',
    description:'莉莉安女学园的白蔷薇花蕾。温柔文静像人偶般可爱的美少女。与佐藤圣之间有着一段令人心碎的感情过往。后来找到了一生的妹妹二条乃梨子。',
    traits:['黑发','白蔷薇','文静','人偶般','温柔','过去恋情','姐妹制度'],
    nicknames:['Shimako Toudou','藤堂志摩子','Shimako','白蔷薇'], vas:[['能登麻美子','']] }],
  [1636, {name:'水野蓉子', anime_title:'圣母在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/1636.jpg',
    description:'前红蔷薇大人，祥子的姐姐。成熟稳重，是莉莉安女学园众多学生憧憬的对象。毕业后依然关心着学校。', traits:['红发','红蔷薇','成熟','学姐','可靠'], nicknames:['Youko Mizuno','水野蓉子'], vas:[['暂未收录','']] }],
  [1640, {name:'岛津由乃', anime_title:'圣母在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/b1640-AAUH1ctNMBfs.png',
    description:'莉莉安女学园黄蔷薇花蕾的妹妹。身体虚弱但性格不服输。', traits:['棕发','体弱','黄蔷薇','不服输','姐妹制度'], nicknames:['Yoshino Shimazu','岛津由乃'], vas:[['暂未收录','']] }],
  [1628, {name:'支仓令', anime_title:'圣母在上', image:'https://s4.anilist.co/file/anilistcdn/character/large/1628.jpg',
    description:'莉莉安女学园的黄蔷薇花蕾。性格沉稳大度，妹妹是由乃。', traits:['黑发','黄蔷薇','沉稳','姐姐','姐妹制度'], nicknames:['Rei Hasekura','支仓令'], vas:[['暂未收录','']] }],

  // ====== 小龙家的女仆 (5) ======
  [120970, {name:'托尔', anime_title:'小龙家的女仆', image:'https://s4.anilist.co/file/anilistcdn/character/large/b120970-knjWLdlQIs1y.jpg',
    description:'来自异世界的龙族公主，变身女仆形态寄住在程序员小林家。对小林有着狂热的爱恋，每天用龙尾巴做菜、打扫和想尽办法追求那个冷面女。神力强大但平时只做家务和犯花痴。口头禅是"小林さん！"',
    traits:['金发','龙娘','龙角','女仆','尾巴','小林狂热粉','家务全能','混沌势力','龙族','痴情'],
    nicknames:['Tohru','托尔','托尔大人','Tohru'], vas:[['桑原由气','']] }],
  [120969, {name:'小林', anime_title:'小龙家的女仆', image:'https://s4.anilist.co/file/anilistcdn/character/large/b120969-dHJBVb3lB8iN.png',
    description:'普通（？）的程序员女性，在某天喝醉酒后救了受伤的龙托尔并稀里糊涂邀请她来当女仆。性格极度理性内敛，对托尔的疯狂示爱常年淡定无视但其实内心对托尔充满感激和温暖。标准社畜。',
    traits:['红发','眼镜','程序员','社畜','理性','面瘫','被龙喜欢','酒量差'],
    nicknames:['Kobayashi','小林','小林さん','Kobayashi'], vas:[['田村睦心','']] }],
  [120974, {name:'神奈神威', anime_title:'小龙家的女仆', image:'https://s4.anilist.co/file/anilistcdn/character/large/b120974-cZHsjS8DX9WW.png',
    description:'被放逐的龙族幼龙，寄住小林家。外表可爱小学生但真身是白龙。喜欢吃知了和各种奇怪东西。与才川同学的"一见钟情"（单方面）故事线是本作最甜的副CP。充电插尾巴。',
    traits:['白发','龙角','幼龙','小学生','贪吃','可爱','白龙','尾巴充电'],
    nicknames:['Kanna Kamui','神奈神威','Kanna','康娜'], vas:[['长绳麻理亚','']] }],
  [120978, {name:'才川莉子', anime_title:'小龙家的女仆', image:'https://s4.anilist.co/file/anilistcdn/character/large/b120978-rLBVr3LBNeul.jpg',
    description:'神奈的富家千金同学，对神奈一见钟情并展开热烈追求。每次见到神奈都会花痴到流鼻血。是幼龙×人类百合CP的人类方代表。', traits:['棕发','大小姐','痴女','神奈狂热','流鼻血','百合幼女CP'], nicknames:['Georgie Saikawa','才川莉子'], vas:[['暂未收录','']] }],
  [120971, {name:'法夫纳', anime_title:'小龙家的女仆', image:'https://s4.anilist.co/file/anilistcdn/character/large/b120971-7XdpFZNKMBuM.png',
    description:'远古的诅咒之龙，托尔的旧识。外表高冷长发美男。被安排住在小林的朋友泷谷家住下后沉迷于游戏。经典台词是"人类，这游戏真好玩"。', traits:['黑发','长发','远古之龙','诅咒','游戏宅','高冷','美男','托尔旧识'], nicknames:['Fafnir','法夫纳','Fafnir'], vas:[['暂未收录','']] }],
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
