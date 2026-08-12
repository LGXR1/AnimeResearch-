import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// Compact data format: [id, name, anime, image, description, traits, nicknames, [[va, vaImg]]]
const data = [
  // ====== 妖精的尾巴 (5) ======
  [5186,{name:'露西·哈特菲利亚',anime:'妖精的尾巴',image:'https://s4.anilist.co/file/anilistcdn/character/large/b5186-izgXf2S86K9u.png',desc:'妖精尾巴公会的星灵魔导士，富商千金。使用星灵钥匙召唤黄道十二宫的星灵战斗。梦想是成为小说家。性格善良但经常吐槽纳兹的莽撞。是纳兹小队中最有常识的人。' ,traits:['金发','星灵魔导士','大小姐','写小说','常识人','吐槽','纳兹搭档'],nicks:['Lucy Heartfilia','露西','Lucy'],vas:[['平野绫','']]}],
  [5189,{name:'艾尔莎·史卡雷特',anime:'妖精的尾巴',image:'https://s4.anilist.co/file/anilistcdn/character/large/b5189-GR1xdok9SFsN.jpg',desc:'妖精尾巴最强的S级魔导士之一，称号"妖精女王"。使用换装魔法，在战斗中瞬间切换各种铠甲和武器。实力恐怖但也会做出各种可爱举动——比如吃蛋糕时表情完全融化。童年从乐园之塔的奴隶中杀出来。' ,traits:['红发','S级魔导士','换装魔法','妖精女王','强大','蛋糕控','童年奴隶','铠甲'],nicks:['Erza Scarlet','艾尔莎','Erza','妖精女王'],vas:[['大原沙耶香','']]}],
  [28886,{name:'温蒂·玛贝尔',anime:'妖精的尾巴',image:'https://s4.anilist.co/file/anilistcdn/character/large/b28886-unO1rEi3zdyF.jpg',desc:'天空之灭龙魔导士，使用天空魔法进行治愈和辅助。外表娇小可爱的蓝发少女。从小被龙格兰帝列抚养长大。拥有超强的治疗能力是团队中不可或缺的后援。' ,traits:['蓝发','灭龙魔导士','天空魔法','治愈','幼女','善良','龙抚养'],nicks:['Wendy Marvell','温蒂','Wendy'],vas:[['暂未收录','']]}],
  [5188,{name:'哈比',anime:'妖精的尾巴',image:'https://s4.anilist.co/file/anilistcdn/character/large/b5188-1jTaic3aJ7Ds.jpg',desc:'纳兹的伙伴——一只蓝色有翅膀的猫（超越者）。会说人话，使用翼魔法飞行。经典台词是"爱！"总是和纳兹一起搞事然后一起被艾尔莎暴揍。全剧吉祥物兼吐槽担当。' ,traits:['蓝色','猫','超越者','会飞','爱','吉祥物','吐槽'],nicks:['Happy','哈比'],vas:[['暂未收录','']]}],
  [22723,{name:'夏露露',anime:'妖精的尾巴',image:'https://s4.anilist.co/file/anilistcdn/character/large/b22723-tAU59GCaf2H4.png',desc:'温蒂的伙伴——白色母猫（超越者），哈比的同类。性格傲娇高冷与哈比形成鲜明对比。能预知未来但大多数时候不愿意承认这个能力。' ,traits:['白色','母猫','超越者','傲娇','预知未来','高冷'],nicks:['Charlés','夏露露','Carla'],vas:[['暂未收录','']]}],
  // Natsu not in the 5 from AniList. Adding from known ID: 5187
  [5187,{name:'纳兹·多拉格尼尔',anime:'妖精的尾巴',image:'https://s4.anilist.co/file/anilistcdn/character/large/b5187-rYFIQxOOrZsd.png',desc:'妖精尾巴的灭龙魔导士，使用火之灭龙魔法。被火龙伊格尼尔抚养长大。性格热血莽撞但为了伙伴可以燃烧一切。经典台词是"我燃起来了！"。严重的交通工具晕——任何载具上去就吐。动画第一集就把整座城市炸了个洞。',traits:['粉发','灭龙魔导士','火龙之子','热血','莽撞','交通工具晕','伙伴至上'],nicks:['Natsu Dragneel','纳兹','Natsu','火龙'],vas:[['柿原彻也','']]}],

  // ====== 物语系列 (5) ======
  [22037,{name:'战场原黑仪',anime:'物语系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b22037-sY7GWSKYr2Nl.jpg',desc:'阿良良木历的同班同学和恋人。曾经被一只螃蟹夺走了体重——只有5kg的少女。对历用订书机钉嘴的告白方式成为经典。毒舌傲娇的代名词。名言是"我能给你的只有这些——我的全部"。' ,traits:['紫发','长发','傲娇','毒舌','订书机','5kg','文具武器','历的女友'],nicks:['Hitagi Senjougahara','战场原黑仪','Hitagi','荡漾'],vas:[['斋藤千和','']]}],
  [22036,{name:'阿良良木历',anime:'物语系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b22036-Ed3CjwPlDLp4.png',desc:'物语系列的男主角，吸血鬼体质的半人半妖高中生。总是在放学后遇到各种被怪异附身的少女并帮助她们。标志性的呆毛和永远长不高的身高。对妹妹有着超乎寻常的执念（变态程度）。' ,traits:['黑发','呆毛','半吸血鬼','怪异吸引体','变态绅士','妹控','不死身'],nicks:['Koyomi Araragi','阿良良木历','Koyomi','垃圾君'],vas:[['神谷浩史','']]}],
  [22055,{name:'羽川翼',anime:'物语系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b22055-EaTsy30ihdgb.png',desc:'历的同班同学和班长——"班长中的班长"。戴着眼镜的知识美女。被障猫怪异附身——源自她压抑家庭环境产生的巨大压力。历说"你什么都知道"她回答"我只知道我知道的事"。后期剪短发脱眼镜的转变令人惊艳。' ,traits:['黑发','眼镜','班长','知识渊博','障猫','压抑','短发变身','历的恩人'],nicks:['Tsubasa Hanekawa','羽川翼','Hanekawa','班长'],vas:[['堀江由衣','']]}],
  [22054,{name:'神原骏河',anime:'物语系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/22054-n6Jsvp80bUhD.jpg',desc:'历的学妹，篮球部的王牌。左手臂被猿之手怪异附身——源于她对战场原黑仪的特殊感情。开朗豪爽的百合运动少女。房间全是BL本子。' ,traits:['棕发','短发','篮球','猿之手','百合','战场原厨','运动少女','BL收藏家'],nicks:['Suruga Kanbaru','神原骏河','Kanbaru'],vas:[['暂未收录','']]}],
  [22052,{name:'八九寺真宵',anime:'物语系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b22052-beyfl4AyMGhn.png',desc:'背着大书包的小学女生幽灵——蜗牛怪异。在路口彷徨找不到回家的路。历每次遇见她都会"不小心"袭胸然后被她咬。两人的绕口令式对话是全系列最有趣的部分之一。"失礼了，咬"——"啊！又被咬了！"' ,traits:['双马尾','小学生','幽灵','蜗牛怪异','咬人','迷路','大书包'],nicks:['Mayoi Hachikuji','八九寺真宵','Hachikuji'],vas:[['加藤英美里','']]}],

  // ====== Fate/Zero + Fate/stay night (8) ======
  [497,{name:'阿尔托莉雅·潘德拉贡',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b497-Yg5pNmC8kxzs.png',desc:'以Saber职阶被召唤的从者，真实身份是亚瑟王。手持誓约胜利之剑Excalibur。忠诚、正直、强大、美丽——完美的骑士王。但在圣杯战争中与卫宫士郎相遇后开始重新审视自己的人生。"我问你——你是我的Master吗？"' ,traits:['金发','骑士王','Saber','Excalibur','呆毛','正直','忠诚','最强从者'],nicks:['Artoria Pendragon','阿尔托莉雅','Saber','吾王','呆毛王'],vas:[['川澄绫子','']]}],
  [496,{name:'卫宫士郎',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b496-GI0waavDjyk3.png',desc:'Fate/stay night的男主角，正义的伙伴——被切嗣在冬木大火中救出的孤儿。半吊子的魔术师，擅长投影和强化魔术。理想是拯救所有人，为此不惜燃烧自己的生命。Archer的真实身份是整个故事最震撼的揭示。' ,traits:['红发','正义的伙伴','投影魔术','强化魔术','家政全能','固执','幸存者','Saber的Master'],nicks:['Shirou Emiya','卫宫士郎','Shirou','士郎'],vas:[['杉山纪彰','']]}],
  [498,{name:'远坂凛',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b498-lwawtSpLyATL.png',desc:'冬木市的管理者远坂家的继承人，Archer的Master。天才魔术师使用宝石魔术。双马尾傲娇的教科书级角色。表面完美大小姐实则穷得叮当响（宝石魔术太烧钱）。每次关键时刻掉链子然后嘴硬。' ,traits:['黑发','双马尾','傲娇','宝石魔术','大小姐','穷','天才','Archer的Master'],nicks:['Rin Tohsaka','远坂凛','Rin','凛'],vas:[['植田佳奈','']]}],
  [2087,{name:'Archer',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2087-l5WP4W4vmfJJ.png',desc:'凛召唤的弓兵从者。白发黑肤的红衣骑士。擅长投影宝具和展开固有结界——无限剑制。对士郎抱着莫名的敌意，经常嘲讽他的理想。其真实身份是Fate系列最震撼的伏笔之一。最爱说"抱着理想溺死吧"。' ,traits:['白发','黑肤','Archer','红衣','无限剑制','投影','毒舌','真实身份震撼'],nicks:['Archer','弓兵','红色弓兵','Emiya'],vas:[['諏访部顺一','']]}],
  [2514,{name:'吉尔伽美什',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2514-hnE6LEdqm7Su.png',desc:'最古老的英雄王，Archer职阶——但和其他Archer不一样他拥有世间所有宝具的原型。极度傲慢，称所有人为"杂种"。"王来承认，王来允许，王来背负这个世界。"王之财宝中射出的无数宝具是Fate最震撼的画面之一。拥有乖离剑EA。' ,traits:['金发','英雄王','王之财宝','杂种','傲慢','乖离剑','半神','金闪闪'],nicks:['Gilgamesh','吉尔伽美什','金闪闪','英雄王'],vas:[['关智一','']]}],
  [15164,{name:'爱丽丝菲尔·冯·爱因兹贝伦',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b15164-BPfYcnNR3PwN.png',desc:'爱因兹贝伦家族的人造人，Saber的Master切嗣的妻子。银发红瞳的美丽女性。身为圣杯的容器却拥有比任何人都温暖的心。在第四次圣杯战争中以优雅的举止驾驶梅赛德斯进行追车战。伊莉雅的母亲。' ,traits:['银发','红瞳','人造人','人妻','圣杯容器','温柔','赛车手','切嗣妻子'],nicks:['Irisviel von Einzbern','爱丽丝菲尔','Iri'],vas:[['大原沙耶香','']]}],
  [16021,{name:'伊斯坎达尔',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b16021-w5Jn1eb807vt.png',desc:'第四次圣杯战争中被召唤的Rider从者——征服王亚历山大大帝。身材魁梧的红发巨汉。拥有EX级宝具"王之军势"——召唤数万将士的固有结界。豪爽坦荡的性格征服了所有人——包括敌人。"王是活得更真实、更热烈的那一个。"' ,traits:['红发','巨汉','征服王','Rider','王之军势','豪爽','霸气','韦伯老师'],nicks:['Iskandar','伊斯坎达尔','征服王','大帝'],vas:[['大冢明夫','']]}],
  // Add Kiritsugu Emiya for Fate/Zero
  [16018,{name:'卫宫切嗣',anime:'Fate系列',image:'https://s4.anilist.co/file/anilistcdn/character/large/b16018-krVY1LJ1EeeU.jpg',desc:'第四次圣杯战争中Saber的Master——被称为"魔术师杀手"的男人。为了拯救更多人而不断牺牲少数人，用机关枪和火箭筒猎杀魔术师。冷酷的实用主义者。在冬木大火中救出了此后成为养子的士郎。他的悲剧人生定义了整个Fate系列的基调。' ,traits:['黑发','魔术师杀手','机关枪','冷酷','实用主义','正义的伙伴','悲剧','士郎养父'],nicks:['Kiritsugu Emiya','卫宫切嗣','Kiritsugu'],vas:[['小山力也','']]}],

  // ====== 轻音少女 (5) ======
  [19565,{name:'平泽唯',anime:'轻音少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b19565-7gMiEAm7NGNK.png',desc:'轻音部的主音吉他手兼主唱，天然呆的终极形态。完全自学吉他——但她用绝对音感弥补了技术的不足。每次练习前都要吃点心，考试前总要求部员给她补习。然而一上台就变身成为真正的摇滚明星。名言是"好萌！好想带回家！"' ,traits:['棕发','天然呆','吉他手','绝对音感','贪吃','呆毛','天才','可爱的笨蛋'],nicks:['Yui Hirasawa','平泽唯','Yui','唯'],vas:[['丰崎爱生','']]}],
  [19566,{name:'秋山澪',anime:'轻音少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b19566-XKsMgf370b4m.png',desc:'轻音部的贝斯手兼作词，黑长直的害羞少女。音乐才华和学术成绩都非常优秀。极度怕生和胆小——害怕恐怖故事、害怕上台、害怕被关注。但贝斯弹得超级好。她的蓝白条纹碗事件是整个ACG圈最著名的名场面之一。' ,traits:['黑发','长直','贝斯手','害羞','胆小','作词','蓝白条纹','天才贝斯'],nicks:['Mio Akiyama','秋山澪','Mio','澪'],vas:[['日笠阳子','']]}],
  [19567,{name:'田井中律',anime:'轻音少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b19567-ztMNJBxTNqmZ.png',desc:'轻音部的部长兼鼓手，短发的元气少女。性格大大咧咧经常忘记提交社团申请表导致险些废部。最著名的特征是——每次打鼓时额头上那道闪亮的汗珠。虽然看起来粗心但作为部长非常可靠。' ,traits:['棕发','短发','鼓手','部长','元气','健忘','可靠'],nicks:['Ritsu Tainaka','田井中律','Ritsu','律'],vas:[['佐藤聪美','']]}],
  [19568,{name:'琴吹䌷',anime:'轻音少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b19568-pF5UBfB6U8G2.png',desc:'轻音部的键盘手，来自超级富豪家庭的大小姐。粗眉毛是她的标志。每天带各种高级点心和红茶来部室——"这是我家的别墅里种的茶叶"。虽然家境极其富有但对普通女高中生的日常充满好奇和向往。看她被打工工资惊讶到的表情是经典。' ,traits:['金发','粗眉毛','大小姐','键盘手','红茶','点心','富可敌国','好奇'],nicks:['Tsumugi Kotobuki','琴吹䌷','Mugi','䌷'],vas:[['寿美菜子','']]}],
  [21173,{name:'中野梓',anime:'轻音少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b21173-0RB5dOJdGt9y.png',desc:'轻音部的节奏吉他手，比其他人小一年级的学妹。戴着一对猫耳般的黑发双马尾。被唯强行戴上了猫耳后——"喵~"。从此以后再也摘不下来了。认真勤奋但在前辈们的"茶会"面前毫无抵抗力。昵称是"Azu喵"。' ,traits:['黑发','双马尾','猫耳','吉他手','后辈','认真','Azunyan','喵'],nicks:['Azusa Nakano','中野梓','Azusa','梓喵'],vas:[['竹达彩奈','']]}],

  // ====== 辉夜大小姐想让我告白 (5) ======
  [120649,{name:'四宫辉夜',anime:'辉夜大小姐想让我告白',image:'https://s4.anilist.co/file/anilistcdn/character/large/b120649-NPaWaIpWy60E.png',desc:'秀知院学园高中部学生会副会长，四宫财阀的大小姐。智商顶尖、容貌出众——却陷入了"如何让会长向我告白"的恋爱头脑战。每天和会长在学生会室里斗智斗勇，互相设计让对方先表白。她的内心是一个渴望恋爱却羞于表达的少女。口头禅是"哦卡哇伊口多"。' ,traits:['黑发','大小姐','副会长','天才','傲娇','恋爱头脑战','冰辉夜','反差萌'],nicks:['Kaguya Shinomiya','四宫辉夜','Kaguya','辉夜大小姐'],vas:[['古贺葵','']]}],
  [121101,{name:'白银御行',anime:'辉夜大小姐想让我告白',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121101-Q8HzKP15At2d.png',desc:'秀知院学园高中部学生会会长，通过努力从外部考入的天才。每天都在想"如何让辉夜向我告白"。虽然偏执地维持完美会长形象但私下是个打三份工养活家庭的穷学生。泡咖啡技术一绝。熬夜太多导致严重黑眼圈——"这是努力的证明"。' ,traits:['黄发','会长','穷学生','努力家','咖啡','黑眼圈','恋爱头脑战','天才'],nicks:['Miyuki Shirogane','白银御行','Shirogane','会长'],vas:[['古川慎','']]}],
  [121103,{name:'藤原千花',anime:'辉夜大小姐想让我告白',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121103-UGLxT8utLPnq.png',desc:'秀知院学园高中部学生会书记，永远开心的粉色少女。政治家的女儿有着谜一般的交际圈。她的存在本身就是混沌——总是在关键时刻拆掉辉夜和白银精心设计的恋爱陷阱。是被辉夜在脑内杀死了无数次的女人。但没有人能真正讨厌她。"地球之癌"——石上的评价。' ,traits:['粉发','学生会书记','混沌','开朗','天然黑','政治世家','桌游爱好者','被暗杀'],nicks:['Chika Fujiwara','藤原千花','Chika','书记','地球之癌'],vas:[['小原好美','']]}],
  [121102,{name:'石上优',anime:'辉夜大小姐想让我告白',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121102-tiQFxnSEIAwm.png',desc:'秀知院学园高中部学生会会计，阴沉系的游戏宅。总是独自在角落里玩掌机。曾因保护被欺负的同学而被全校误解和孤立——是辉夜和白银帮助他走出了阴影。虽然是个悲观厌世的死宅但心地善良。见到女生就脸红。' ,traits:['黑发','死宅','会计','阴沉','善良','被误解','游戏','应援团篇封神'],nicks:['Yuu Ishigami','石上优','Ishigami','石上'],vas:[['铃木崚汰','']]}],
  [125886,{name:'伊井野弥子',anime:'辉夜大小姐想让我告白',image:'https://s4.anilist.co/file/anilistcdn/character/large/b125886-TQbmqAaSgBLS.png',desc:'秀知院学园高中部学生会会计监察，风纪委员的正义少女。矮个子双马尾，对校规有着近乎偏执的执着。"这是违反校规的！"——口头禅。和石上是死对头但互怼中暗藏甜蜜。内心深处渴望被认可和需要。' ,traits:['棕发','双马尾','矮个子','风纪委员','正义感','死板','石上死对头'],nicks:['Miko Iino','伊井野弥子','Iino','小弥子'],vas:[['富田美忧','']]}],

  // ====== 古见同学有交流障碍症 (3) ======
  [121956,{name:'古见硝子',anime:'古见同学有交流障碍症',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121956-5FbIbcd6gAZW.png',desc:'被誉为"校内第一美少女"的完美少女——但她有严重的交流障碍症。无法主动和人说话。她的目标是交到100个朋友。每天用笔记本写字和只野同学交流。虽然不说话但每一个微小的进步都让人从心底为她加油。' ,traits:['黑发','长发','美少女','交流障碍','笔记本交流','100个朋友','猫耳','社交恐惧'],nicks:['Shouko Komi','古见硝子','Komi','古见同学'],vas:[['古贺葵','']]}],
  [78093,{name:'只野仁人',anime:'古见同学有交流障碍症',image:'https://s4.anilist.co/file/anilistcdn/character/large/b78093-QnJ9wDICvhSR.png',desc:'古见同学的同班同学，全校最普通的少年——"只野"谐音"普通人"。是第一个读懂古见笔记本交流方式的人。用极致的普通和极致的温柔帮古见完成交100个朋友的梦想。他的普通就是他最棒的超能力。' ,traits:['黑发','普通人','温柔','读心翻译官','超普通','古见第一个朋友'],nicks:['Hitohito Tadano','只野仁人','Tadano'],vas:[['暂未收录','']]}],
  [126825,{name:'长名奈津美',anime:'古见同学有交流障碍症',image:'https://s4.anilist.co/file/anilistcdn/character/large/b126825-J4GTiz4OHDa5.png',desc:'性别是"奈津美"的神秘存在——有时是男生有时是女生？完美的社交达人，全校所有人的朋友（自称）。性格奔放无法预判，是古见的第X个朋友。' ,traits:['性别未知','社交达人','奔放','无法预判'],nicks:['Najimi Osana','长名奈津美','Najimi'],vas:[['暂未收录','']]}],

  // ====== 堀与宫村 (2) ======
  [66171,{name:'堀京子',anime:'堀与宫村',image:'https://s4.anilist.co/file/anilistcdn/character/large/b66171-o2vk3689wWFK.png',desc:'在学校是完美的优等生美人——在家里是穿家居服照顾弟弟的不修边幅姐姐。被宫村发现了她的双重生活后两人的关系开始改变。她喜欢宫村戴耳钉穿唇钉的"校外模式"。甜到炸裂的校园恋爱天花板。' ,traits:['棕发','优等生','双面生活','姐代母职','温柔','恋爱','家事万能'],nicks:['Kyouko Hori','堀京子','Hori','堀'],vas:[['户松遥','']]}],
  [66173,{name:'宫村伊澄',anime:'堀与宫村',image:'https://s4.anilist.co/file/anilistcdn/character/large/b66173-g8eU1LGWPB8O.png',desc:'在学校是阴郁的长袖长裤眼镜男——在校外是全身穿环的帅气不良美少年。被堀发现他的"校外模式"后开始帮堀照顾弟弟并渐渐融入了堀的生活。温柔体贴到犯规的完美男友。和堀的日常甜到让人想去打胰岛素。' ,traits:['黑发','双面生活','穿环','美少年','温柔','完美男友','反差','甜'],nicks:['Izumi Miyamura','宫村伊澄','Miyamura','宫村'],vas:[['内山昂辉','']]}],

  // ====== 五等分的花嫁 (5) ======
  [126371,{name:'中野一花',anime:'五等分的花嫁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b126371-0KQpl80s8kXQ.png',desc:'五姐妹的长女，短发成熟。梦想成为女演员。性格慵懒经常穿着内衣在家里晃。作为大姐习惯性地把妹妹们的幸福放在第一位——包括把喜欢的人也推给妹妹。' ,traits:['棕发','短发','长女','女演员','慵懒','内衣','让爱','大姐'],nicks:['Ichika Nakano','中野一花','Ichika','一花'],vas:[['花泽香菜','']]}],
  [126372,{name:'中野二乃',anime:'五等分的花嫁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b126372-DtorHRgQaYUJ.png',desc:'五姐妹的次女，长发的傲娇女王。厨艺巅峰——世界第一。最初对风太郎极度抗拒甚至下药但后来爱上了他并成为最主动的追求者。"我喜欢你"是她最先说出口。长发双蝴蝶结是标志。' ,traits:['粉发','长发','傲娇','厨艺','蝴蝶结','傲转娇','直球','恋爱暴走'],nicks:['Nino Nakano','中野二乃','Nino','二乃'],vas:[['竹达彩奈','']]}],
  [126373,{name:'中野三玖',anime:'五等分的花嫁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b126373-CWeyXb822uDN.png',desc:'五姐妹的三女，内向的耳机历史宅。最喜欢战国武将，玩战国游戏玩到全服第一。用耳机把自己和世界隔开。喜欢风太郎后鼓起勇气向他表露心声。"我不会输给姐姐们"——最令人心疼的一花党震怒的一集。' ,traits:['棕发','长发','历史宅','耳机','内向','战国武将','料理进步','三玖天下第一'],nicks:['Miku Nakano','中野三玖','Miku','三玖'],vas:[['伊藤美来','']]}],
  [126374,{name:'中野四叶',anime:'五等分的花嫁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b126374-Aal36iSQ5nKz.png',desc:'五姐妹的四女，运动万能元气少女。总是笑嘻嘻的兔子头饰。运动社团的救火队员——每天被各个社团借来借去。但她灿烂的笑容下隐藏着最深的心事：她是在五年前就与风太郎相遇过的人。' ,traits:['棕发','短发','元气','兔耳头饰','运动万能','隐藏心事','五年前','风太郎初恋'],nicks:['Yotsuba Nakano','中野四叶','Yotsuba','四叶'],vas:[['佐仓绫音','']]}],
  [126375,{name:'中野五月',anime:'五等分的花嫁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b126375-dEe9IyQ9By09.png',desc:'五姐妹的幺女，认真严肃的吃货。头顶一根呆毛。对风太郎的态度最为抗拒——但其实最喜欢吃他做的饭。每次出场基本都在吃——肉包、咖喱、拉面、汉堡肉。是五姐妹里最有常识的人但在食物面前毫无抵抗力。' ,traits:['红发','呆毛','吃货','认真','幺女','肉包','常识人'],nicks:['Itsuki Nakano','中野五月','Itsuki','五月'],vas:[['水濑祈','']]}],

  // ====== 日常 (4) ======
  [10418,{name:'相生祐子',anime:'日常',image:'https://s4.anilist.co/file/anilistcdn/character/large/b10418-nDUxYpR4dpmA.png',desc:'时定高校的普通女高中生。短发的吐槽役，每次考试都试图作弊然后被抓。和美绪、麻衣组成了整个动画界最魔性的元气三人组。她的日常就是被各种奇奇怪怪的日常碾过去然后一脸懵逼地吐槽。' ,traits:['棕发','短发','吐槽役','考试作弊','日常','搞笑'],nicks:['Yuuko Aioi','相生祐子','Yuuko'],vas:[['暂未收录','']]}],
  [40081,{name:'长野原美绪',anime:'日常',image:'https://s4.anilist.co/file/anilistcdn/character/large/b40081-dGRecovyuQMo.png',desc:'蓝发双马尾的少女，喜欢画BL漫画的隐藏腐女。在教室里被祐子发现BL本子后疯狂抢回来的追击战是全剧最经典的场景之一——那场追逐的作画经费能烧掉一部剧场版。运动能力爆表但在关键时刻总是摔倒。' ,traits:['蓝发','双马尾','BL漫画家','腐女','运动全能','隐藏属性','追捕战'],nicks:['Mio Naganohara','长野原美绪','Mio'],vas:[['暂未收录','']]}],
  [10421,{name:'水上麻衣',anime:'日常',image:'https://s4.anilist.co/file/anilistcdn/character/large/b10421-gPMhyPdWOxiu.png',desc:'眼镜娘，永远面无表情的天才。用最平淡的表情做着最离谱的事。把佛头戴在头上、用钓鱼竿玩同学——她的不以为然的恶作剧是整个日常中最令人猝不及防的笑点。"没什么~"——她总是这么说。' ,traits:['黑发','眼镜','无表情','天才','恶作剧','佛头','钓鱼竿','面无表情'],nicks:['Mai Minakami','水上麻衣','Mai'],vas:[['暂未收录','']]}],
  [41055,{name:'东云博士',anime:'日常',image:'https://s4.anilist.co/file/anilistcdn/character/large/b41055-RZH1b5am1LvO.png',desc:'8岁的小博士，创造了机器人少女——名乃。极度爱吃零食和被名乃当猫一样照顾。虽然是天才但日常生活完全躺平——整天吃零食打游戏让名乃替她做一切。最喜欢鲨鱼图案的东西。' ,traits:['棕发','8岁','天才博士','零食控','鲨鱼','创造机器人','废柴大人'],nicks:['Hakase Shinonome','东云博士','Hakase'],vas:[['暂未收录','']]}],

  // ====== 白箱 (3) ======
  [88651,{name:'宫森葵',anime:'白箱',image:'https://s4.anilist.co/file/anilistcdn/character/large/88651-QkCydMZc7HyK.jpg',desc:'武藏野动画公司的制作进行。梦想是在动画业界工作——现在已经实现了但每天都被截稿日期追着跑。开着Toyota AE86奔波于各个制作环节之间。她的奋斗故事是所有在动画业界干活的人的真实写照。"我今天一定要拿到原画！"' ,traits:['棕发','制作进行','AE86','动画业界','奋斗','努力','职场新人'],nicks:['Aoi Miyamori','宫森葵','Aoi','喵森'],vas:[['暂未收录','']]}],
  [88653,{name:'安原绘麻',anime:'白箱',image:'https://s4.anilist.co/file/anilistcdn/character/large/88653-M6AsX8k4aEM6.jpg',desc:'新人原画师，葵的高中同学。性格认真害羞，每天在作画桌前和原画战斗。"画不出想要的表情"——年轻的动画师的苦恼。在杉江先生的指导下逐渐成长为优秀的原画师。' ,traits:['黑发','原画师','认真','害羞','作画','成长','动画师'],nicks:['Ema Yasuhara','安原绘麻','Ema'],vas:[['暂未收录','']]}],
  [88657,{name:'今井绿',anime:'白箱',image:'https://s4.anilist.co/file/anilistcdn/character/large/88657-I3Acgj8ktl6J.png',desc:'立志成为脚本家的女大学生，葵的高中同学之一。在课余时间为动画公司打工积累经验。天然呆的文学少女，梦想写出一部属于自己的动画剧本。' ,traits:['棕发','脚本家','大学生','文学','天然呆','梦想'],nicks:['Midori Imai','今井绿'],vas:[['暂未收录','']]}],

  // ====== 比宇宙更远的地方 (4) ======
  [124545,{name:'玉木麻理',anime:'比宇宙更远的地方',image:'https://s4.anilist.co/file/anilistcdn/character/large/b124545-qwgoxY241muu.png',desc:'普通的女子高中生。厌倦了平淡无奇的日常——"青春就应该拿去冒险！"。偶然听到了关于南极科考队的消息后决心去南极——"去比宇宙更远的地方！"。从零开始规划这个疯狂的计划，在这个过程中收获了最珍贵的友情和成长。' ,traits:['棕发','高中生','南极','冒险','青春','行动力','成长'],nicks:['Mari Tamaki','玉木麻理','Mari','小决'],vas:[['暂未收录','']]}],
  [124546,{name:'小渊泽报濑',anime:'比宇宙更远的地方',image:'https://s4.anilist.co/file/anilistcdn/character/large/b124546-m2grkrB5gfCJ.png',desc:'为了寻找在南极失踪的母亲而决心去南极的黑发少女。被全校嘲笑为"南极同学"但她从不动摇。在遇到麻理之前独自攒了一百万日元的打工钱。把自己的所有积蓄拍在桌上——"这就是我决定的青春"。那一幕令人热泪盈眶。' ,traits:['黑发','南极','寻找母亲','一百万日元','坚强','不被理解','执着'],nicks:['Shirase Kobuchizawa','小渊泽报濑','Shirase'],vas:[['暂未收录','']]}],
  [124547,{name:'三宅日向',anime:'比宇宙更远的地方',image:'https://s4.anilist.co/file/anilistcdn/character/large/n124547-6nbhiholxEve.jpg',desc:'开朗的关西腔少女，便利店打工仔。被前辈欺负后退学决意重新开始。她在南极的暴风雪中对麻里和报濑说出了全剧最燃的台词——"我绝对不会放弃，因为现在的我已经不是以前那个我了！"' ,traits:['棕发','关西腔','便利店','被欺负','退学','重新开始','燃'],nicks:['Hinata Miyake','三宅日向','Hinata'],vas:[['暂未收录','']]}],
  [124548,{name:'白石结月',anime:'比宇宙更远的地方',image:'https://s4.anilist.co/file/anilistcdn/character/large/b124548-ukuGnwrtMPoT.png',desc:'童星出身的艺人，被经济公司要求去南极拍摄纪录片。从小在娱乐圈长大，从来没有过真正的朋友。第一次和同龄人交朋友的她笨拙地想把人当"业务伙伴"处理。那句"我想和你们成为朋友——不是工作关系"是她人生第一次说真话。' ,traits:['黑发','童星','艺人','孤独','没有朋友','第一次真诚','成长'],nicks:['Yuzuki Shiraishi','白石结月','Yuzuki'],vas:[['暂未收录','']]}],

  // ====== 佐贺偶像是传奇 (3) ======
  [127540,{name:'源樱',anime:'佐贺偶像是传奇',image:'https://s4.anilist.co/file/anilistcdn/character/large/b127540-H1wiC6lu34WT.jpg',desc:'出门就被卡车撞死的倒霉少女——然后被神秘制作人变成了僵尸偶像。团队中最没特长但最有热情的人。作为Franchouchou的中心成员为了拯救佐贺县而高歌。虽然是僵尸但梦想比任何人都鲜活。' ,traits:['粉发','僵尸','偶像','卡车','倒霉','热情','Franchouchou'],nicks:['Sakura Minamoto','源樱','Sakura'],vas:[['暂未收录','']]}],
  [127538,{name:'二阶堂沙希',anime:'佐贺偶像是传奇',image:'https://s4.anilist.co/file/anilistcdn/character/large/n127538-z0mYekgT8d5P.png',desc:'前不良少女暴走族总长，死后成为僵尸偶像。打架超强的传奇太妹但在台上是帅气的团队Leader。口头禅超级凶但做的饭意外地好吃。每次看到摩托车零件都想骑上去。' ,traits:['金发','不良少女','暴走族','僵尸','偶像','Leader','做饭'],nicks:['Saki Nikaidou','二阶堂沙希'],vas:[['暂未收录','']]}],
  [127539,{name:'水野爱',anime:'佐贺偶像是传奇',image:'https://s4.anilist.co/file/anilistcdn/character/large/b127539-u9SPsvkHmgCf.png',desc:'前超人气偶像组合成员——在演唱会上被雷劈死后变成了僵尸。曾经是演艺圈的顶流偶像，变成僵尸后重新以Franchouchou成员身份出道。舞蹈和歌唱能力是所有僵尸中最强的。' ,traits:['蓝发','前顶流偶像','被雷劈','僵尸','舞蹈','歌唱','Franchouchou'],nicks:['Ai Mizuno','水野爱'],vas:[['暂未收录','']]}],

  // ====== 少女终末旅行 (2) ======
  [120889,{name:'千户',anime:'少女终末旅行',image:'https://s4.anilist.co/file/anilistcdn/character/large/120889-o9uGSBNtqgJ8.png',desc:'在文明崩坏的末日世界中与尤莉驾驶半履带摩托车旅行的黑发少女。理性冷静，负责导航和记录。喜欢读书和写日记。虽然世界已经毁灭但她和尤莉的平淡日常却有着奇异的治愈感。"活着就是不断地与绝望和平共处。"' ,traits:['黑发','末日','旅行','理性','书','日记','半履带摩托','治愈'],nicks:['Chito','千户','Chii-chan'],vas:[['暂未收录','']]}],
  [120890,{name:'尤莉',anime:'少女终末旅行',image:'https://s4.anilist.co/file/anilistcdn/character/large/b120890-pu5qO3xxvvcx.png',desc:'金发少女，千户的旅伴。负责骑车和战斗。性格天真贪吃，和理性的千户形成完美互补。在这个什么都已经毁灭了的世界里她依然能为一碗热饭开心地笑出来。在终末的绝境中是最亮的光。' ,traits:['金发','末日','旅行','吃货','天真','骑车','治愈','最后的笑容'],nicks:['Yuuri','尤莉','Yuu'],vas:[['暂未收录','']]}],

  // ====== 小魔女学园 (3) ======
  [81645,{name:'亚可·卡嘉莉',anime:'小魔女学园',image:'https://s4.anilist.co/file/anilistcdn/character/large/81645-dvD1Ac67IkpJ.png',desc:'从日本来到新月学园学习魔法的元气少女。她并非魔法世家出身——她的魔法梦想源于小时候看的一场闪亮夏莉欧的魔法秀。虽然天赋为零但用超强的意志和行动力弥补一切。口头禅是"相信的心就是魔法！"' ,traits:['棕发','魔女学徒','元气','0天赋','100意志','闪亮夏莉欧粉丝'],nicks:['Atsuko Kagari','亚可·卡嘉莉','Akko','亚可'],vas:[['暂未收录','']]}],
  [81709,{name:'戴安娜·卡文迪什',anime:'小魔女学园',image:'https://s4.anilist.co/file/anilistcdn/character/large/81709-N5Yff4r6geiM.png',desc:'新月学园最优秀的魔女，来自英国最古老魔法世家。天才中的天才。最初看不起亚可的零天赋但逐渐被她的执着所打动。蓝色丝带和白色长袍是她的标志。其实她小时候也看过同一场夏莉欧的魔法秀。' ,traits:['金发','天才魔女','精英','傲慢','被打动','隐藏夏莉欧粉','蓝色丝带'],nicks:['Diana Cavendish','戴安娜','Diana'],vas:[['暂未收录','']]}],
  [81699,{name:'苏西·曼巴巴兰',anime:'小魔女学园',image:'https://s4.anilist.co/file/anilistcdn/character/large/81699-mAzqlNupKWOB.jpg',desc:'新月学园最奇怪的魔女。擅长调配各种诡异毒药和蘑菇——经常拿亚可当实验品。对毒蘑菇的狂热超越了一切。虽然外表恐怖但其实是个可靠的朋友。总是在亚可需要帮助时递上最奇怪的"解药"。' ,traits:['紫发','毒药','蘑菇','疯狂','朋友','可靠','实验狂'],nicks:['Sucy Manbavaran','苏西','Sucy'],vas:[['暂未收录','']]}],

  // ====== 斩服少女 (4) ======
  [83797,{name:'缠流子',anime:'斩服少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b83797-ix0Cl5OMfV22.png',desc:'转学到本能字学园的少女，手持一半的巨大剪刀。寻找杀害父亲的另一半剪刀的持有者。身穿鲜血——用神衣战斗，但神衣的\"羞耻度\"是最大的武器和代价。热血、暴躁、永不放弃。和鲜血（会说话的水手服）的羁绊令人泪目。' ,traits:['黑发','红挑染','巨大剪刀','神衣鲜血','热血','暴躁','复仇','姊妹对决'],nicks:['Ryuuko Matoi','缠流子','Ryuuko'],vas:[['暂未收录','']]}],
  [83799,{name:'鬼龙院皐月',anime:'斩服少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b83799-oPxSwMA9XAvu.png',desc:'本能字学园的学生会长，用绝对的实力和恐怖支配着整个学校。身穿纯白神衣"纯洁"。她的野心是推翻母亲鬼龙院罗晓统治的整个体制——但她用的手段是成为体制本身。和流子是宿命的姐妹。"我问你——人的可能性是什么？"' ,traits:['黑发','学生会长','纯白神衣','女王','野心','姐妹','绝对统治'],nicks:['Satsuki Kiryuuin','鬼龙院皐月','Satsuki'],vas:[['暂未收录','']]}],
  [87511,{name:'满舰饰真子',anime:'斩服少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b87511-T8lwlQKd6SoK.png',desc:'流子的同班同学和最好的朋友——全剧的搞笑担当和良心担当。无论流子变成什么样子她都会无条件支持。每次的自言自语吐槽速度突破人类极限。"流子酱！"——只要听到她喊这个名字就知道一切都会好起来。' ,traits:['棕发','搞笑','良心','流子挚友','超语速','无条件支持'],nicks:['Mako Mankanshoku','满舰饰真子','Mako'],vas:[['暂未收录','']]}],
  [87510,{name:'鲜血',anime:'斩服少女',image:'https://s4.anilist.co/file/anilistcdn/character/large/b87510-ZH2qoBYc6XNH.jpg',desc:'会说话的神衣——流子的战斗伙伴。外表是水手服——但被流子穿上后能让流子变身成超强战斗形态。羞耻心是发动神衣的代价（露越多越强）。和流子的对话是全剧最暖心的部分。"穿上我，流子！"' ,traits:['水手服','神衣','说话','流子搭档','羞耻','变身','核心','羁绊'],nicks:['Senketsu','鲜血','センケツ'],vas:[['暂未收录','']]}],

  // ====== 天元突破 (4) ======
  [2257,{name:'西蒙',anime:'天元突破红莲螺岩',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2257-jnalsdnIX1vN.jpg',desc:'地下村的挖洞少年。胆小懦弱但拥有一颗比任何人都大的心。在大哥卡米那的引领下钻出了地面看见了天空。在失去大哥后独自成长为超越所有前人的最强螺旋战士。名言是"你以为我是谁？！"——而从西蒙口中说出的这句话比任何人的都更震撼人心。"钻头就是我的灵魂！"' ,traits:['蓝发','钻头','螺旋力','挖洞','成长','大哥的最强继任者','钻破天际'],nicks:['Simon','西蒙','シモン'],vas:[['柿原彻也','']]}],
  [2075,{name:'卡米那',anime:'天元突破红莲螺岩',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2075-sWb5Xz76JWdX.png',desc:'大红莲团的初代领袖，西蒙的大哥。他没有任何特殊能力——只有一把日本刀和无人能敌的气魄。他的每一句话都是名言——"相信你自己，不是相信那个相信我的你，也不是相信那个相信你的我——相信那个相信你自己的你！"。他的死让整个团队真正觉醒。' ,traits:['蓝发','大哥','大红莲团','气魄','名言制造机','日本刀','牺牲','精神领袖'],nicks:['Kamina','卡米那','カミナ','大哥'],vas:[['小西克幸','']]}],
  [2063,{name:'优子·利坦拿',anime:'天元突破红莲螺岩',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2063-7BKqQbrhtDD2.png',desc:'大红莲团的狙击手，来自地面的火辣御姐。手持一把超长的狙击步枪。是卡米那和后来的西蒙最重要的伙伴。她的吻有着"大哥杀手"的诅咒——但也是将整个团队凝聚在一起的最温暖的力量。' ,traits:['红发','狙击手','火辣','比基尼','大哥杀手','温暖','大红莲团'],nicks:['Youko Littner','优子','Yoko'],vas:[['暂未收录','']]}],
  [2761,{name:'尼亚·特佩林',anime:'天元突破红莲螺岩',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2761-FmSJGaW9WzYZ.png',desc:'螺旋王罗杰诺姆的女儿，被西蒙从封印中释放的不可思议少女。纯粹天真如同白纸。与西蒙的相遇改变了两人的命运。当整个银河都要被反螺旋族毁灭时——她的婚礼是这部燃到天际的作品中最温柔的一笔。"我爱你，西蒙。"' ,traits:['金发','公主','纯真','短发','西蒙恋人','婚礼','最后温柔'],nicks:['Nia Teppelin','尼亚','Nia'],vas:[['暂未收录','']]}],

  // ====== 剑风传奇 (3) ======
  [422,{name:'格斯',anime:'剑风传奇',image:'https://s4.anilist.co/file/anilistcdn/character/large/b422-XTaiTuvRohsV.png',desc:'黑色剑士——从死尸堆中出生，在佣兵团长大的男人。背着比人还大的巨剑"龙杀"狩猎使徒。身上被刻上了牺牲烙印——每晚都会被恶魔追杀。为了复仇和找回所爱之人卡思嘉而进行无尽的战斗。动漫史上最黑暗也最坚强的男主角。' ,traits:['黑发','黑色剑士','巨剑龙杀','佣兵','烙印','复仇','断臂','最强'],nicks:['Guts','格斯','Guts','黑色剑士'],vas:[['暂未收录','']]}],
  [424,{name:'格里菲斯',anime:'剑风传奇',image:'https://s4.anilist.co/file/anilistcdn/character/large/b424-Jfrsf8I7zBps.png',desc:'鹰之团的团长——所有追随他的人都被他不可抗拒的魅力和野心所吸引。白鹰般优雅完美的外表下隐藏着任何人都无法想象的黑暗。为了实现"拥有自己的王国"的梦想牺牲了整个鹰之团成为神之手的一员。格斯的挚友和宿敌。' ,traits:['银发','白鹰','鹰之团','神之手','野心','背叛','完美','格斯宿敌'],nicks:['Griffith','格里菲斯','グリフィス','白鹰'],vas:[['暂未收录','']]}],
  [423,{name:'卡思嘉',anime:'剑风传奇',image:'https://s4.anilist.co/file/anilistcdn/character/large/b423-AmVFCaJJOBsc.png',desc:'鹰之团的女战士，千骑长。最初崇拜并爱慕格里菲斯。在格斯加入后两人从互看不顺眼到产生了最真挚的感情。在日蚀事件中遭受了难以承受的创伤而精神崩溃。格斯踏上复仇之路的全部理由——为了找回那个曾经的她。' ,traits:['黑发','女战士','鹰之团','千骑长','精神崩溃','格斯所爱','日蚀'],nicks:['Casca','卡思嘉','キャスカ'],vas:[['暂未收录','']]}],

  // ====== 黑礁 (3) ======
  [458,{name:'莱薇',anime:'黑礁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b458-tlKqPcuR287U.png',desc:'黑礁商会的双枪女枪手——"Two-Hands Revy"。从小在暴力中长大的华裔美国人。用两把Beretta 92F解决一切问题。脏话连篇、喝酒打架、看谁不爽就开枪——但她对洛克有种她自己都不理解的温柔。短发背心的造型是经典。' ,traits:['黑发','短发','双枪','华裔','暴力','脏话','伯莱塔','黑礁商会'],nicks:['Revy','莱薇','Two-Hands','レヴィ'],vas:[['丰口惠美','']]}],
  [459,{name:'洛克',anime:'黑礁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b459-QsGmozEvK0jM.png',desc:'原名冈岛绿郎——一个被公司出卖的普通日本上班族。被黑礁商会俘虏后选择加入他们。在这群亡命之徒中他是唯一用脑子和谈判解决问题的人。普通人视角见证了黑色世界的一切疯狂。虽然不会用枪但他是整个团队最危险的人。' ,traits:['黑发','上班族','普通人','谈判','黑礁商会','不能用枪最危险'],nicks:['Rokuro Okajima','洛克','Rock'],vas:[['暂未收录','']]}],
  [457,{name:'达奇',anime:'黑礁',image:'https://s4.anilist.co/file/anilistcdn/character/large/b457-BdoXIN7tNvoz.png',desc:'黑礁商会的船长，黑色光头大汉。参加过越战的老兵。作为这群疯子的首领用铁腕和幽默维持着黑色鱼雷艇的秩序。是所有混乱中唯一的稳定锚点。' ,traits:['光头','船长','越战老兵','黑礁','铁腕','老大哥'],nicks:['Dutch','达奇','ダッチ'],vas:[['暂未收录','']]}],

  // ====== 混沌武士 (3) ======
  [390,{name:'无幻',anime:'混沌武士',image:'https://s4.anilist.co/file/anilistcdn/character/large/b390-30DZg8NvIrVk.png',desc:'琉球群岛出身的狂野武士——用街舞的节奏挥刀的战斗天才。被救后与仁和风结伴寻找向日葵武士。穿着随意像个流浪汉，剑法却充满Hip-hop的节奏和野性。每次打架前都会先来一段freestyle般的挑衅——然后就砍翻所有人。' ,traits:['黑发','武士','Hip-hop','街舞','琉球','野性','剑豪','搞笑'],nicks:['Mugen','无幻','ムゲン'],vas:[['暂未收录','']]}],
  [391,{name:'仁',anime:'混沌武士',image:'https://s4.anilist.co/file/anilistcdn/character/large/b391-f9fHDJEEFzn1.png',desc:'传统道场出身的冷静武士，戴眼镜的剑豪。与无幻相反——他的一切都是精确计算的。用最正统的居合术战斗。与无幻从死斗到同伴。总是面无表情但偶尔说出的冷笑话能噎死无幻。没有他，无幻早就死了十次——反过来也一样。' ,traits:['黑发','眼镜','居合','冷静','剑豪','传统','死鱼眼','冷笑话'],nicks:['Jin','仁','ジン'],vas:[['暂未收录','']]}],
  [392,{name:'风',anime:'混沌武士',image:'https://s4.anilist.co/file/anilistcdn/character/large/b392-wcJS9OT2xfvC.png',desc:'从茶馆救下无幻和仁后雇佣两人去寻找"有向日葵味道的武士"的少女。实际上是幕府高官的女儿。虽然不会剑术但用智慧和善良让两个最危险的浪人变成了最可靠的伙伴。飞天松鼠毛毛是她的宠物。' ,traits:['棕发','少女','向日葵武士','寻找父亲','坚强','飞天松鼠','善良'],nicks:['Fuu Kasumi','风','フウ'],vas:[['暂未收录','']]}],

  // ====== 悠哉日常大王 (3) ======
  [54151,{name:'宫内莲华',anime:'悠哉日常大王',image:'https://s4.anilist.co/file/anilistcdn/character/large/b54151-V8Qh2l2gTxvH.jpg',desc:'小学一年级的乡村少女。用一把笛子吹着"喵帕斯"成为ACG界的传奇。生活在偏僻到连便利店都没有的乡下——每天去学校要骑车数公里。用最纯真的视角看这个小小的世界。名言是"喵帕斯~"。' ,traits:['紫发','小学生','喵帕斯','乡村','纯真','哲学','天才'],nicks:['Renge Miyauchi','宫内莲华','Renge','莲华'],vas:[['暂未收录','']]}],
  [54149,{name:'越谷小鞠',anime:'悠哉日常大王',image:'https://s4.anilist.co/file/anilistcdn/character/large/b54149-JsepdZLKa9BP.jpg',desc:'初中二年级但身材娇小像小学生——这是她一辈子都无法释怀的痛点。每次被夸"可爱"就像被暴击。努力在学妹面前维护学姐的威严但每次都失败。养着一只名叫"小凑"的狸猫。' ,traits:['棕发','萝莉学姐','娇小','可爱','威严0','初二','狸猫'],nicks:['Komari Koshigaya','越谷小鞠','Komari'],vas:[['暂未收录','']]}],
  [54145,{name:'一条萤',anime:'悠哉日常大王',image:'https://s4.anilist.co/file/anilistcdn/character/large/b54145-x14HGjjIhdpi.jpg',desc:'小学五年级的转学生，从东京搬到乡下。外表成熟但内心是普通的小学生。对莲华抱有一种纯粹的仰慕——到了想要把莲华照片贴满房间的程度。手工达人，给莲华做了无数手工艺品。' ,traits:['棕发','转学生','东京','仰慕莲华','手工','小学生'],nicks:['Hotaru Ichijou','一条萤','Hotaru'],vas:[['暂未收录','']]}],

  // ====== 吹响吧上低音号 (3) ======
  [88708,{name:'黄前久美子',anime:'吹响吧上低音号',image:'https://s4.anilist.co/file/anilistcdn/character/large/b88708-ZiVPl8LjIjaK.jpg',desc:'北宇治高中吹奏乐部的上低音号手。一年级时是个没什么干劲的半吊子——但在丽奈的影响下逐渐开始真正爱上了吹奏。和丽奈的关系是整部作品最核心的羁绊。"我想变得更好"——从这句话开始她的成长。第三年是吹奏乐部部长。' ,traits:['棕发','上低音号','吹奏乐部','成长','丽奈的羁绊','部长','普通少女'],nicks:['Kumiko Oumae','黄前久美子','Kumiko'],vas:[['暂未收录','']]}],
  [88710,{name:'高坂丽奈',anime:'吹响吧上低音号',image:'https://s4.anilist.co/file/anilistcdn/character/large/b88710-cFbSW1ga7Uax.png',desc:'北宇治高中吹奏乐部的小号手。从小就立志成为最优秀的小号手。黑长直的高冷美人。对久美子有着超越友情的感情——"我想和你一起吹"。在县祭的夜晚穿着白衣站在久美子面前说出了最温柔的话。"久美子——你是特别的。"' ,traits:['黑发','长直','小号','天才','高冷','对久美子的感情','白衣','特别的人'],nicks:['Reina Kousaka','高坂丽奈','Reina'],vas:[['暂未收录','']]}],
  [88707,{name:'加藤叶月',anime:'吹响吧上低音号',image:'https://s4.anilist.co/file/anilistcdn/character/large/b88707-zzEOe2FDSdlv.jpg',desc:'久美子的同班同学和好友，大号手。元气满满的短发少女。虽然初学大号但热情不输任何人。暗恋同乐队的塚本秀一。是全剧中最温暖最普通的好朋友担当。' ,traits:['棕发','短发','大号','元气','好友','暗恋'],nicks:['Hazuki Katou','加藤叶月'],vas:[['暂未收录','']]}],

  // ====== 花开伊吕波 (2) ======
  [36184,{name:'松前绪花',anime:'花开伊吕波',image:'https://s4.anilist.co/file/anilistcdn/character/large/b36184-ylcMtZPMm1cB.png',desc:'东京的女高中生——因母亲逃债被送到外婆经营的温泉旅馆"喜翠庄"打工。从抱怨一切到逐渐爱上这个充满了奇怪同事和挑剔客人的地方。她用自己的方式面对每一个挑战，认真到令人敬佩。口头禅是"我要闪闪发光！"' ,traits:['棕发','女高中生','温泉旅馆','打工','闪闪发光','成长','认真'],nicks:['Ohana Matsumae','松前绪花','Ohana'],vas:[['暂未收录','']]}],
  [37212,{name:'鹤来民子',anime:'花开伊吕波',image:'https://s4.anilist.co/file/anilistcdn/character/large/n37212-ftcw7899GuzY.png',desc:'喜翠庄的板前见习生，比绪花早一年开始工作的前辈厨师。面无表情说话刻薄——"去死"。但其实非常可靠勤奋。每天凌晨四点起来准备厨房。一开始和绪花不对付但后来成为她最好的工作伙伴和朋友。' ,traits:['黑发','厨师','板前','毒舌','去死','努力','前辈'],nicks:['Minko Tsurugi','鹤来民子'],vas:[['暂未收录','']]}],

  // ====== 乒乓 (2) ======
  [20325,{name:'月本诚',anime:'乒乓',image:'https://s4.anilist.co/file/anilistcdn/character/large/b20325-gRzQsYJxpQ6A.png',desc:'被称为"微笑"的乒乓球天才少年。总是微笑着用最冷静的球风打败所有对手。最大的天赋是对旋转的绝对控制——能把球变得像有生命的蝴蝶一样。但他其实并不热爱乒乓球——他只是一个想让大家都开心的温柔孩子。' ,traits:['黑发','微笑','乒乓球天才','蝴蝶','旋转','不热爱','温柔'],nicks:['Makoto Tsukimoto','月本诚','Smile','微笑'],vas:[['暂未收录','']]}],
  [20326,{name:'星野裕',anime:'乒乓',image:'https://s4.anilist.co/file/anilistcdn/character/large/b20326-OgUY6upSqUv3.jpg',desc:'微笑的青梅竹马和最好的对手。外号"Peco"——中国乒乓球选手般的快攻型天才。极度自信但输了后也会极度消沉。对乒乓球的热爱超乎所有人——"我爱乒乓球！"——从这句话开始他的浴火重生。从低谷爬起来战胜微笑的那一战是动画史上的巅峰。' ,traits:['金发','快攻','乒乓','自信','低谷','浴火重生','热爱'],nicks:['Yutaka Hoshino','星野裕','Peco'],vas:[['暂未收录','']]}],

  // ====== 阿基拉 (2) ======
  [2588,{name:'金田正太郎',anime:'阿基拉',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2588-OfACKXYm2lkV.png',desc:'新东京暴走族少年，红色摩托车的拥有者。当他最好的朋友铁雄被政府改造成恐怖的存在后——金田骑着那辆标志性的红色摩托回来拯救或毁灭一切。赛博朋克动画的标杆角色，影响了整整一代日本动画。"铁雄——！！！"' ,traits:['黑发','暴走族','红色摩托','新东京','赛博朋克','铁雄挚友','KANEDAAA'],nicks:['Shoutarou Kaneda','金田','Kaneda'],vas:[['暂未收录','']]}],
  [2589,{name:'岛铁雄',anime:'阿基拉',image:'https://s4.anilist.co/file/anilistcdn/character/large/b2589-HR4oPhkLGq6q.png',desc:'金田的挚友，在逃避暴走族追捕时被政府抓去进行生化改造——成为了拥有毁灭性超能力的"阿基拉"般的恐怖存在。从一个胆小的少年变成了可以吞噬整个城市的怪物。他的悲剧是整个故事的引擎。' ,traits:['黑发','生化改造','超能力','阿基拉','悲剧','吞噬','金田挚友'],nicks:['Tetsuo Shima','岛铁雄','Tetsuo','铁雄'],vas:[['暂未收录','']]}],

  // ====== 未麻的部屋 (1) ======
  [4866,{name:'雾越未麻',anime:'未麻的部屋',image:'https://s4.anilist.co/file/anilistcdn/character/large/b4866-IRnTqmFeMoly.png',desc:'前偶像歌手转型为演员的少女。从一个清纯偶像变成了在镜头前被毁掉一切的"女人"。今敏用她的故事编织了一个关于身份、现实和疯狂的网络——到底发生了什么？谁是真的？她自己也不确定了。这是心理学恐怖动画的巅峰。' ,traits:['棕发','偶像','演员','身份危机','心理学恐怖','今敏','幻象','崩溃'],nicks:['Mima Kirigoe','雾越未麻','Mima'],vas:[['暂未收录','']]}],

  // ====== Re:CREATORS (3) ======
  [121561,{name:'阿尔泰尔',anime:'Re:CREATORS',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121561-rYgIQOeHzR63.png',desc:'从同人创作中诞生的"被造物"——超越所有虚构作品的终极存在。白色军服的她将所有创作者召唤到"鸟笼"中——目的是毁灭创造了她又抛弃了她的世界。拥有Holopsicon——操控万物法则的能力。她的悲愿是整个故事的核心。"这个世界——是错误的。"' ,traits:['白发','军服','被造物','终极反派','同人创作','Holopsicon','复仇','悲愿'],nicks:['Altair','阿尔泰尔','軍服姫'],vas:[['暂未收录','']]}],
  [121560,{name:'塞蕾西娅·尤比蒂利亚',anime:'Re:CREATORS',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121560-6hSONiUnrHnb.jpg',desc:'从轻小说《精灵机想曲》中来到现实世界的精灵骑士。发现自己的一切都是被一个作者写出来的——包括痛苦和失去。但她选择了接受这个事实并作为"被造物"活出自己的意志。"我的故事——由我自己来续写。"' ,traits:['红发','精灵','被造物','骑士','接受自我','继续前进','强大'],nicks:['Selesia Upitiria','塞蕾西娅','セレジア'],vas:[['暂未收录','']]}],
  [121563,{name:'米特奥拉·艾斯特莱希',anime:'Re:CREATORS',image:'https://s4.anilist.co/file/anilistcdn/character/large/b121563-jJjOltETxJ9D.png',desc:'从RPG游戏中来到现实世界的贤者。冷静理性地分析了"被造物"的本质。用游戏中的魔法和智慧辅助所有被造物理解自己在现实世界的处境。灰发蓝袍的知性美少女。"我只是一串代码——但代码也能改变世界。"' ,traits:['灰发','贤者','被造物','RPG角色','理性','分析','魔法'],nicks:['Meteora Österreich','米特奥拉','メテオラ'],vas:[['暂未收录','']]}],

  // ====== 悠哉日常大王补 (1) ======
  [54147,{name:'越谷夏海',anime:'悠哉日常大王',image:'https://s4.anilist.co/file/anilistcdn/character/large/b54147-Su4AgvqzRG68.jpg',desc:'小鞠的妹妹，小学六年级的淘气包。每天恶作剧整蛊姐姐小鞠然后把锅甩给莲华。是悠哉日常中最闹腾的存在但也最接地气。每次闯祸后逃跑的速度令世界冠军汗颜。' ,traits:['棕发','小学生','淘气','恶作剧','姐姐杀手','逃跑冠军'],nicks:['Natsumi Koshigaya','越谷夏海'],vas:[['暂未收录','']]}],
]

let count = 0
for (const [id, d] of data) {
  const { error } = await supabase.from('characters').upsert({
    id, name: d.name, anime_title: d.anime, image: d.image,
    description: d.desc, traits: d.traits, nicknames: d.nicks,
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
