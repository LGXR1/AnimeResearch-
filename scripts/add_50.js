import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const D=[
// 笨蛋测验召唤兽(4)
[27362,{n:'吉井明久',a:'笨蛋测验召唤兽',img:'https://s4.anilist.co/file/anilistcdn/character/large/b27362-kLtwXx5tKrAE.png',dsc:'文月学园F班的学生——全校公认的笨蛋。但在这个按成绩召唤战斗的学校里他有着意外的战斗天赋。每次被召唤兽被击倒就要参加补习的惩罚让他的校园生活充满血泪。与F班的同伴们在最底层搞出了最离谱的逆袭。',tr:['棕发','笨蛋','F班','召唤兽','意外天赋','搞笑'],nk:['Akihisa Yoshii','吉井明久','Akihisa'],v:[['暂未收录','']]}],
[27363,{n:'姬路瑞希',a:'笨蛋测验召唤兽',img:'https://s4.anilist.co/file/anilistcdn/character/large/b27363-xzKVhaeG4Tym.png',dsc:'F班的优等生——因为考试当天发烧被分到最差班级的全校第一名。暗恋明久。温柔可爱但做的料理是生化武器级别——一口就能让人看到三途川。她的召唤兽是最强的——只要明久别碰她的料理。',tr:['粉发','优等生','暗恋','料理杀手','召唤兽','F班'],nk:['Mizuki Himeji','姬路瑞希','Himeji'],v:[['暂未收录','']]}],
[20181,{n:'木下秀吉',a:'笨蛋测验召唤兽',img:'https://s4.anilist.co/file/anilistcdn/character/large/b20181-fevqFB7qOiK9.jpg',dsc:'F班的戏剧部成员——全校公认的"美少女"但他是个男的。拥有独立的"秀吉"性别标识——学校特设秀吉专用更衣室和厕所。性格温柔可爱比任何女生都像女生。明久的好友兼被误会的CP对象。"老夫是男的！"' ,tr:['棕发','伪娘','秀吉性别','戏剧部','可爱','F班'],nk:['Hideyoshi Kinoshita','木下秀吉','Hideyoshi','秀吉'],v:[['暂未收录','']]}],
[29563,{n:'岛田美波',a:'笨蛋测验召唤兽',img:'https://s4.anilist.co/file/anilistcdn/character/large/b29563-Xw9okgsUzmA6.png',dsc:'F班的德国混血少女——归国子女。数学极好但日语烂到写字像虫子爬。单恋明久。每次明久提到姬路就会不由自主地给他一记铁拳。是F班为数不多的战斗力担当。"明久——你这笨蛋！"（一拳）',tr:['金发','混血','数学','日语苦手','暴力','暗恋'],nk:['Minami Shimada','岛田美波','Minami'],v:[['暂未收录','']]}],

// 来自深渊(4)
[122443,{n:'莉可',a:'来自深渊',img:'https://s4.anilist.co/file/anilistcdn/character/large/b122443-Md7TtolADEJh.png',dsc:'住在深渊边缘孤儿院的12岁少女——母亲是传说中的白笛探窟家"歼灭卿"。为了寻找母亲独自向深渊底层出发。在深渊第三层被血涂鸟攻击后被机器人少年雷格所救。以"绝界行"的决心踏上了有去无回的旅途。',tr:['金发','12岁','探窟家','深渊','寻找母亲','勇敢','决绝'],nk:['Riko','莉可','リコ'],v:[['暂未收录','']]}],
[122444,{n:'雷格',a:'来自深渊',img:'https://s4.anilist.co/file/anilistcdn/character/large/b122444-9rGUpcjwygHD.png',dsc:'在深渊中被莉可唤醒的机器人少年——失去了所有记忆。右手装有能发射"火葬炮"的强力武器。发誓保护莉可一起前往深渊底层。虽然身体是机器人但他的心和所有的疑问都在问——"我到底是什么？"' ,tr:['机器人','失忆','火葬炮','保护莉可','深渊','少年','身份'],nk:['Reg','雷格','レグ'],v:[['暂未收录','']]}],
[123145,{n:'马璐璐库',a:'来自深渊',img:'https://s4.anilist.co/file/anilistcdn/character/large/123145-wWYcJ3SOF426.png',dsc:'深渊第二层监视基地的"深渊小偷"——实际是奥森的白笛弟子。穿着蓬松的可爱服装戴着花哨的头饰。在奥森的严酷训练下成为了出色的探窟家。是莉可和雷格在深渊中遇到的第一位朋友也是最有用的盟友。',tr:['可爱','白笛弟子','探窟家','奥森弟子','朋友','蓬松'],nk:['Marulk','马璐璐库','マルルク'],v:[['暂未收录','']]}],
[123185,{n:'哈勃洛克',a:'来自深渊',img:'https://s4.anilist.co/file/anilistcdn/character/large/b123185-lOJJvAS0tqF0.jpg',dsc:'深渊第二层的资深探窟家。在监视基地中协助奥森管理着基地的日常运作。对新人探窟家既严厉又关怀。',tr:['探窟家','监视基地','前辈','严厉'],nk:['Hablog','哈勃洛克'],v:[['暂未收录','']]}],

// 碧蓝之海(4)
[123182,{n:'北原伊织',a:'碧蓝之海',img:'https://s4.anilist.co/file/anilistcdn/character/large/b123182-tuQ2yf5IEx02.jpg',dsc:'考上伊豆大学的普通大学生——搬进叔叔家的潜水店后人生彻底被毁了。被潜水社的裸男们拉入了一个80%是喝酒裸奔20%是潜水的社团。每次开学都在课堂上看自己全裸喝酒被灌醉的视频。但当他真正潜入水下那一刻——"潜水真的好美"。',tr:['黑发','大学生','潜水','喝酒','裸奔','被迫','搞笑'],nk:['Iori Kitahara','北原伊织','Iori'],v:[['暂未收录','']]}],
[123181,{n:'古手川千纱',a:'碧蓝之海',img:'https://s4.anilist.co/file/anilistcdn/character/large/b123181-t0pV6LtaDUf6.png',dsc:'伊织的表妹——从小在潜水店长大的少女。对潜水有着纯真的热爱。伊织的裸奔和喝酒行为让她对大学生这个物种产生了极大的偏见（很合理）。但在水下她是最优秀的潜水员和最耐心的导师。伊织在水下那个最美的瞬间是她教出来的。',tr:['黑发','表妹','潜水','纯真','鄙视裸男','导师'],nk:['Chisa Kotegawa','古手川千纱','Chisa'],v:[['暂未收录','']]}],
[125917,{n:'今村耕平',a:'碧蓝之海',img:'https://s4.anilist.co/file/anilistcdn/character/large/b125917-FBK4DlUGycsr.jpg',dsc:'伊织的同级生兼宿友——重度宅男。梦想是变成二次元美少女。每次喝酒都被扒光然后摆出最夸张的姿势。和伊织是难兄难弟——一起喝酒一起裸奔一起被千纱鄙视。但真正的友谊就是在裸奔的时候建立的。',tr:['金发','宅男','声优控','二次元','喝酒','裸奔','损友'],nk:['Kouhei Imamura','今村耕平','Kouhei'],v:[['暂未收录','']]}],
[127420,{n:'吉原爱菜',a:'碧蓝之海',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127420-ssYIvTQrmliT.jpg',dsc:'潜水社少有的正常人——被拉来凑数的女生。喜欢耕平但每次表白都说错话变成了恐怖现场。化妆技术一流——从不化妆到化妆的反差令所有裸男闭嘴。是潜水社中唯一的良心。',tr:['棕发','化妆','暗恋','正常','吐槽','良心'],nk:['Aina Yoshiwara','吉原爱菜','Aina'],v:[['暂未收录','']]}],

// MEGALO BOX(3)
[125369,{n:'乔',a:'MEGALO BOX',img:'https://s4.anilist.co/file/anilistcdn/character/large/125369-uVnKfLJKTI4K.jpg',dsc:'地下MEGALO拳击场的无名拳手——只用肉身对抗机械拳套的野狗。在唯一能使自己摆脱底层命运的MEGALONIA大赛中一路血战。他没有任何科技辅助——只有这双拳头。被称为"Gearless Joe"的男人用最原始的拳击挑战整个科技世界。"我的名字是乔——记好了。"',tr:['黑发','拳击','Gearless','野狗','底层','热血','机械拳击'],nk:['Joe','乔','Gearless Joe'],v:[['暂未收录','']]}],
[127574,{n:'勇利',a:'MEGALO BOX',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127574-lxBOWzqmNRlY.png',dsc:'白都财团培养的完美拳手——将最先进的MEGALO装备和天赋结合在一起的冠军。在MEGALONIA大赛中与乔展开了最激烈的对决。他看到了乔眼中那头不服输的野狗——然后明白了自己也渴望像他那样用最纯粹的方式战斗。',tr:['白发','冠军','MEGALO','白都财团','乔的宿敌','纯粹'],nk:['Yuuri','勇利','ユーリ'],v:[['暂未收录','']]}],
[173544,{n:'Sugar',a:'MEGALO BOX',img:'https://s4.anilist.co/file/anilistcdn/character/large/b173544-xzh7ettJ0FUp.jpg',dsc:'乔的少年助手——在贫民窟中长大的孤儿。帮乔修理装备安排比赛。是乔最忠实的伙伴和粉丝。',tr:['少年','孤儿','助手','乔的伙伴','修理'],nk:['Sugar','Sugar'],v:[['暂未收录','']]}],

// SSSS.GRIDMAN(4)
[127592,{n:'古立特',a:'SSSS.GRIDMAN',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127592-jwbMj8dEB59O.jpg',dsc:'来自异世界的巨大英雄——寄宿在响裕太体内。当怪兽出现在城市中时变身与怪兽战斗。需要裕太和同伴们在电脑前的支援。经典的"Access Flash！"变身场景完美致敬了原版特摄。"照亮世界——Gridman！"' ,tr:['巨人','英雄','特摄','变身','电脑世界','守护'],nk:['Gridman','古立特','グリッドマン'],v:[['暂未收录','']]}],
[127585,{n:'宝多六花',a:'SSSS.GRIDMAN',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127585-3lGc9BytiXjZ.png',dsc:'裕太的同班同学——慵懒系的短发美少女。被卷入Gridman与怪兽的战斗后成为了支援队的一员。总是在关键时刻用最平静的表情做出最勇敢的决定。"我只是觉得应该这样做。"——不需要任何热血台词她的行动比语言更有力。',tr:['黑发','短发','慵懒','支援','冷静','勇敢'],nk:['Rikka Takarada','宝多六花','Rikka','六花'],v:[['暂未收录','']]}],
[127587,{n:'新条茜',a:'SSSS.GRIDMAN',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127587-DZBuSJgxunUq.jpg',dsc:'被全班同学喜爱的完美少女——但她也是制造怪兽的元凶。用自己创造的怪兽一次次摧毁城市因为"这个世界本来就是我的游戏"。她的孤独和扭曲背后的真相是整个故事最令人心碎的部分。粉发可爱的外表下是无尽的寂寞。',tr:['粉发','双面','怪兽制造者','孤独','扭曲','完美外表'],nk:['Akane Shinjou','新条茜','Akane'],v:[['暂未收录','']]}],
[127584,{n:'内海将',a:'SSSS.GRIDMAN',img:'https://s4.anilist.co/file/anilistcdn/character/large/n127584-JBxvtPDCJpZt.png',dsc:'裕太的好友——特摄狂热粉丝。对Gridman和怪兽的知识储备使他成为了支援队的核心。"我就是为了这一刻才看了这么多特摄的！"——热血搞笑的支援担当。',tr:['眼镜','特摄宅','支援','好友','热血','搞笑'],nk:['Shou Utsumi','内海将','Utsumi'],v:[['暂未收录','']]}],

// SSSS.DYNAZENON(3)
[169409,{n:'麻中蓬',a:'SSSS.DYNAZENON',img:'https://s4.anilist.co/file/anilistcdn/character/large/b169409-qxaOR6fYkf1F.png',dsc:'DYNAZENON的驾驶员之一——普通的高中生。在遇见失忆的怪兽使后获得了操控巨大机器人的力量。与南梦芽等同伴一起对抗来袭的怪兽。他的成长是所有队员中最明显的——从一个普通的少年到真正的英雄。',tr:['黑发','驾驶员','高中生','DYNAZENON','成长','普通少年'],nk:['Yomogi Asanaka','麻中蓬','Yomogi'],v:[['暂未收录','']]}],
[169411,{n:'南梦芽',a:'SSSS.DYNAZENON',img:'https://s4.anilist.co/file/anilistcdn/character/large/b169411-8gM6Cukk0KGP.jpg',dsc:'DYNAZENON的驾驶员之一——蓝色的短发少女。她与姐姐的过去是整个故事的核心伤痛。用操控机器的专注来逃避现实但在同伴的陪伴下逐渐打开了心扉。"我不是一个人——对吧？"' ,tr:['蓝发','短发','驾驶员','过去伤痛','成长','同伴'],nk:['Yume Minami','南梦芽','Yume'],v:[['暂未收录','']]}],
[169410,{n:'失马',a:'SSSS.DYNAZENON',img:'https://s4.anilist.co/file/anilistcdn/character/large/b169410-1OPVzoQRlDqk.png',dsc:'自称"怪兽使"的神秘青年——失去了一切记忆。唯一记得的只有操控怪兽战斗的本能。与蓬和梦芽一起成为了DYNAZENON的核心。他的过去是整个故事最大的谜团。',tr:['白发','失忆','怪兽使','谜团','DYNAZENON'],nk:['Gauma','失马','ガウマ'],v:[['暂未收录','']]}],

// 奇诺之旅(2)
[87,{n:'奇诺',a:'奇诺之旅',img:'https://s4.anilist.co/file/anilistcdn/character/large/b87-1sKGYKWY8EHQ.jpg',dsc:'骑着摩托车在各个国家间旅行的旅人。在每个国家只停留三天——不多也不少。用手中的枪和冷静的头脑解决旅途中遇到的各种事态。中性打扮的短发少年（女）——性别不重要因为奇诺就是奇诺。"世界并不美丽——但正因为如此才美丽。"',tr:['短发','中性','旅人','枪手','三天','摩托车','冷静','哲学家'],nk:['Kino','奇诺','キノ'],v:[['暂未收录','']]}],
[88,{n:'汉密斯',a:'奇诺之旅',img:'https://s4.anilist.co/file/anilistcdn/character/large/n88-yhTNhq67e5U2.png',dsc:'奇诺的摩托车——会说话的Brough Superior。奇诺唯一的旅伴和最好的朋友。总是用最毒舌的方式吐槽奇诺的各种决定但也是最可靠的伙伴。"我觉得这是个坏主意"——他每次都会这么说而奇诺每次都会继续前进。',tr:['摩托车','会说话','毒舌','伙伴','Brough Superior'],nk:['Hermes','汉密斯','エルメス'],v:[['暂未收录','']]}],

// 少女革命(4)
[747,{n:'天上欧蒂娜',a:'少女革命',img:'https://s4.anilist.co/file/anilistcdn/character/large/b747-tnzOfpAZuIEo.jpg',dsc:'穿着男生制服的少女——为了找到小时候给她一枚蔷薇戒指的"王子"而进入凤学园。但她在学园的决斗中不知不觉变成了保护蔷薇新娘的"王子"本身。"我不要再当等着被王子拯救的公主了——我要自己成为王子。"1997年至今仍是百合动画的巅峰。',tr:['粉发','男装','王子','决斗','蔷薇','不等待被救','经典','百合'],nk:['Utena Tenjou','天上欧蒂娜','Utena','ウテナ'],v:[['暂未收录','']]}],
[748,{n:'姬宫安希',a:'少女革命',img:'https://s4.anilist.co/file/anilistcdn/character/large/b748-UNeH8rLT7LbH.jpg',dsc:'蔷薇新娘——被决斗胜利者"拥有"的神秘少女。黑皮肤戴眼镜的温柔外表下是被整个世界欺骗和伤害的千年魔女。最初只是被动地接受一切但在欧蒂娜的坚持下第一次发出了自己的声音。"欧蒂娜——你真的是我的王子吗？"',tr:['黑肤','眼镜','蔷薇新娘','魔女','被动','觉醒','欧蒂娜的拯救'],nk:['Anthy Himemiya','姬宫安希','Anthy','アンシー'],v:[['暂未收录','']]}],
[752,{n:'有栖川树璃',a:'少女革命',img:'https://s4.anilist.co/file/anilistcdn/character/large/b752-yiBtyANT48mG.png',dsc:'凤学园剑道部主将——蔷薇决斗者之一。性格高傲孤冷但对学妹薰有着无法言说的感情。她佩戴的橙色蔷薇代表她无法得到回报的暗恋。每次决斗时的剑法是全剧最华丽的场面。',tr:['棕发','剑道','高傲','暗恋','蔷薇决斗者','华丽'],nk:['Juri Arisugawa','有栖川树璃','Juri'],v:[['暂未收录','']]}],
[13130,{n:'风见达也',a:'少女革命',img:'https://s4.anilist.co/file/anilistcdn/character/large/b13130-8PiNicINEmb7.png',dsc:'欧蒂娜的好友——学生会成员。在蔷薇决斗的疯狂中保持着普通人的视角。喜欢欧蒂娜但知道她在追寻的是他无法成为的"王子"。是整个故事中少有的温暖和理性的声音。',tr:['棕发','学生会','普通人','暗恋','温暖','理性'],nk:['Tatsuya Kazami','风见达也'],v:[['暂未收录','']]}],

// 浪客剑心(4)
[147,{n:'绯村剑心',a:'浪客剑心',img:'https://s4.anilist.co/file/anilistcdn/character/large/b147-miunGYp6fkzb.png',dsc:'明治时代的流浪剑客——曾经的"刽子手拔刀斋"。在幕末时期是令人闻风丧胆的最强杀手。新时代他发誓不再杀任何人改用逆刃刀流浪。红色头发和十字伤疤是标志。在神谷道场找到了新的归宿——"为了保护身边的人而挥剑。"' ,tr:['红发','十字疤','逆刃刀','流浪','前杀手','不杀','明治','飞天御剑流'],nk:['Kenshin Himura','绯村剑心','Kenshin','拔刀斋','剣心'],v:[['暂未收录','']]}],
[148,{n:'神谷薰',a:'浪客剑心',img:'https://s4.anilist.co/file/anilistcdn/character/large/b148-4FiP3CHKw8IM.png',dsc:'神谷活心流道场的师范代——独自苦苦支撑着父亲留下的道场。遇到剑心后给了他一个可以停留的地方。性格坚强直率是剑心新时代的第一个支撑。"这里是你的家——不管你过去是谁。"' ,tr:['黑发','道场','师范代','坚强','剑心的归宿','直率'],nk:['Kaoru Kamiya','神谷薰','Kaoru','薫'],v:[['暂未收录','']]}],
[149,{n:'相乐左之助',a:'浪客剑心',img:'https://s4.anilist.co/file/anilistcdn/character/large/b149-YxCJj4qtMUzB.jpg',dsc:'前赤报队队员——用拳头和斩马刀战斗的豪爽汉子。最初找剑心打架打输了反而成了最好的朋友和战友。背后大大的"恶"字代表了他对所有不公的反抗。虽然外表粗犷但会为了保护小孩不惜拼命。',tr:['黑发','斩马刀','恶字','豪爽','打架','战友','前赤报队'],nk:['Sanosuke Sagara','相乐左之助','Sanosuke','左之助'],v:[['暂未收录','']]}],
[150,{n:'明神弥彦',a:'浪客剑心',img:'https://s4.anilist.co/file/anilistcdn/character/large/b150-TdeyGWxyLx2l.png',dsc:'神谷道场最年轻的弟子——武士家的末裔。性格倔强好胜不服任何大人。以剑心为榜样拼命练剑。"我也要成为像剑心那样强大的剑士——保护需要保护的人。"' ,tr:['黑发','少年','武士之魂','倔强','剑心徒弟','成长'],nk:['Yahiko Myojin','明神弥彦','Yahiko','弥彦'],v:[['暂未收录','']]}],

// 超时空要塞(4)
[5301,{n:'一条辉',a:'超时空要塞',img:'https://s4.anilist.co/file/anilistcdn/character/large/5301.jpg',dsc:'骷髅小队的VF-1飞行员——被卷入与天顶星人的战争中不得不驾驶变形战斗机战斗。夹在青梅竹马明美和指挥官早濑未沙之间的三角恋是整个系列的经典。在战场上学会的不仅是如何战斗——还有如何选择。"我到底应该守护谁？"' ,tr:['黑发','飞行员','VF-1','三角恋','战争','成长'],nk:['Hikaru Ichijou','一条辉','Hikaru'],v:[['暂未收录','']]}],
[5295,{n:'林明美',a:'超时空要塞',img:'https://s4.anilist.co/file/anilistcdn/character/large/b5295-nsPBOglhRDtV.png',dsc:'用歌声结束星际战争的传奇偶像——Macross小姐冠军。在战火纷飞的太空中她的歌声是人类唯一的光芒。与辉的恋情的起起落落是系列最令人纠结的三角关系。那首《Do You Remember Love》——是整个动画史上最经典的插曲。',tr:['黑发','偶像','歌手','三角恋','Macross小姐','经典'],nk:['Minmay Lynn','林明美','Minmay','リン・ミンメイ'],v:[['暂未收录','']]}],
[3275,{n:'早濑未沙',a:'超时空要塞',img:'https://s4.anilist.co/file/anilistcdn/character/large/3275.jpg',dsc:'Macross的航空管制官——冷静干练的军人。与辉的第一次见面是在战场上大吵一架——随后在一次次配合中成为了彼此最信赖的人。成熟稳重大姐姐类型的她教会了辉什么是责任和选择。"辉——你去吧。"' ,tr:['棕发','军人','管制官','成熟','三角恋','放手'],nk:['Misa Hayase','早濑未沙','Misa'],v:[['暂未收录','']]}],
[12879,{n:'柿崎速雄',a:'超时空要塞',img:'https://s4.anilist.co/file/anilistcdn/character/large/12879.jpg',dsc:'骷髅小队成员——辉最好的战友。乐天派的他总是在战场上调节气氛。在一个普通的日子里为了保护辉被导弹击坠。"辉——替我活下去。"',tr:['棕发','飞行员','战友','牺牲','乐天'],nk:['Hayao Kakizaki','柿崎速雄'],v:[['暂未收录','']]}],

// 无限的未知(3)
[4122,{n:'小泽育美',a:'无限的未知',img:'https://s4.anilist.co/file/anilistcdn/character/large/b4122-sQmF3YQyL6hr.png',dsc:'在宇宙中被困在战舰上的女高中生之一——在没有成人的封闭空间中维持秩序的少数几个人。勇敢果断但也犯过错。在被极限环境逼疯的同学们中间努力保持着自己的人性。',tr:['棕发','战舰','被困','维持秩序','勇敢'],nk:['Ikumi Oze','小泽育美'],v:[['暂未收录','']]}],
[6211,{n:'艾尔斯·布鲁',a:'无限的未知',img:'https://s4.anilist.co/file/anilistcdn/character/large/b6211-l18j1An7BS7k.png',dsc:'战舰上的金发少女——在混乱中保持冷静的少数派。当所有人都在争吵和恐惧中失去判断力时她是最理性的提案者。与育美一起维持着这个封闭世界的平衡。',tr:['金发','理性','冷静','维持平衡','战舰'],nk:['Airs Blue','艾尔斯·布鲁'],v:[['暂未收录','']]}],
[6024,{n:'相叶祐希',a:'无限的未知',img:'https://s4.anilist.co/file/anilistcdn/character/large/b6024-auvjj5B8y89L.png',dsc:'战舰上的男学生——在封闭空间中迫不得已承担起了"大人"的责任。在极端压力下做出了他认为正确的选择但付出了被所有人误解的代价。',tr:['黑发','领导者','被误解','担当','牺牲'],nk:['Yuuki Aiba','相叶祐希'],v:[['暂未收录','']]}],

// 白兔糖(3)
[12668,{n:'河地大吉',a:'白兔糖',img:'https://s4.anilist.co/file/anilistcdn/character/large/n12668-CU0ySRvjIo2q.png',dsc:'30岁的普通上班族——在外公葬礼上看到了被家族嫌弃的外公私生女凛。在所有人都推托责任时他说出了那句——"那我来养她好了"。从此开始了一个单身大叔和6岁小女孩的同居生活。从不会换尿布到为她学会了做饭——他的成长比任何热血动画都更让人感动。',tr:['棕发','30岁','单身','收养','大叔','成长','温柔','日常'],nk:['Daikichi Kawachi','河地大吉','Daikichi'],v:[['暂未收录','']]}],
[12669,{n:'鹿贺凛',a:'白兔糖',img:'https://s4.anilist.co/file/anilistcdn/character/large/b12669-txIOgp7as6ca.png',dsc:'大吉外公6岁的私生女——被所有大人当成尴尬存在的少女。沉默寡言、不哭不笑、眼神比大人还要空。在大吉的陪伴下她的笑容从一天一次变成了一天无数次。——她叫大吉的那声"大吉"是全世界最温柔的呼唤。',tr:['黑发','6岁','孤儿','安静','被爱','微笑','成长','温暖'],nk:['Rin Kaga','鹿贺凛','Rin','りん'],v:[['暂未收录','']]}],
[40054,{n:'吉井正子',a:'白兔糖',img:'https://s4.anilist.co/file/anilistcdn/character/large/n40054-BUXIav5uFiIU.png',dsc:'凛的亲生母亲——因无法抚养凛而将她托付给外公。在故事中逐渐为自己的选择负责并尝试成为凛生活的一部分。是一个有缺陷但真实的母亲角色。',tr:['母亲','愧疚','漫画作者','成长'],nk:['Masako Yoshii','吉井正子'],v:[['暂未收录','']]}],

// 空之境界(2)
[3105,{n:'两仪式',a:'空之境界',img:'https://s4.anilist.co/file/anilistcdn/character/large/b3105-lI0m8vJ3JQK1.png',dsc:'拥有"直死之魔眼"的少女——能看到万物的死亡线。用小刀划过那条线就能杀死任何存在——包括神。在车祸昏迷两年后醒来，从此在生与死的边界行走。穿着和服和黑色皮夹克的她在夜晚的街道上斩杀超自然的威胁。"只要是活着的东西——就算是神我也杀给你看。"',tr:['黑发','和服','直死之魔眼','小刀','两仪式','空之境界','最强'],nk:['Shiki Ryougi','两仪式','Shiki','式'],v:[['暂未收录','']]}],
[5267,{n:'黑桐干也',a:'空之境界',img:'https://s4.anilist.co/file/anilistcdn/character/large/b5267-aBSt3ADW1fvW.png',dsc:'两仪式唯一的依靠——没有任何特殊能力的普通青年。但正是他的"普通"——他的善良和不放弃——让式找到了继续活着的理由。在神和魔法的世界里他用最普通的方式守护着那个能杀死神的少女。"因为我喜欢你——就这个理由够不够？"' ,tr:['黑发','普通人','善良','执着','式的依靠'],nk:['Mikiya Kokutou','黑桐干也','Mikiya','黒桐'],v:[['暂未收录','']]}],

// 蜂蜜与四叶草(3)
[354,{n:'竹本祐太',a:'蜂蜜与四叶草',img:'https://s4.anilist.co/file/anilistcdn/character/large/b354-2cjerLXRLVTE.jpg',dsc:'美术大学的学生——骑自行车从东京一路骑到了北海道只是为了想明白"什么是青春"。暗恋着花本叶久美——一个娇小的天才画家少女。他的青春是笨拙的、没有结果的但骑着自行车穿过整个日本的过程本身就是答案。"我从起点找到了终点——然后再从终点看到了新的起点。"',tr:['棕发','美术大学','暗恋','自行车','寻找青春','笨拙'],nk:['Yuuta Takemoto','竹本祐太','Takemoto'],v:[['暂未收录','']]}],
[352,{n:'森田忍',a:'蜂蜜与四叶草',img:'https://s4.anilist.co/file/anilistcdn/character/large/b352-52C4b1HNO0A8.jpg',dsc:'美术大学的传奇学长——留级8年的永远是学生。天才雕刻家——作品能卖出天价但下一秒就把钱全花光然后消失几个月去旅行。他的自由让所有人羡慕又无法成为他。"如果喜欢就去追——但我可能下一秒就骑着摩托车去印度了。"',tr:['金发','天才','雕刻','留级','自由','旅行','神秘'],nk:['Shinobu Morita','森田忍','Morita'],v:[['暂未收录','']]}],
[356,{n:'山田亚由美',a:'蜂蜜与四叶草',img:'https://s4.anilist.co/file/anilistcdn/character/large/b356-Ww7F14AJZzID.png',dsc:'美术大学的陶艺少女——身材高挑的美丽学姐。单恋着完全不在一个频率上的真山。一次次表白一次次被拒绝却还是放不下。她的单恋是所有观众心底最熟悉的那种痛。"我知道他不喜欢我——但我就是放不下啊。"',tr:['棕发','陶艺','单恋','高挑','美丽','执着','不放弃'],nk:['Ayumi Yamada','山田亚由美','Ayumi'],v:[['暂未收录','']]}],

// 交响情人梦(3)
[1184,{n:'千秋真一',a:'交响情人梦',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1184-9NagJX2u9LPN.png',dsc:'音乐大学的天才指挥——目标是成为世界级的指挥家。拥有绝对音感和完美的音乐天赋但极度恐惧飞机和船所以无法出国。遇到了一个弹钢琴像暴风雨般的少女野田惠——从此他的人生和音乐被彻底颠覆。"为什么你弹琴的时候总是能让我看到——我想看到的那个世界？"',tr:['棕发','指挥','天才','恐飞','完美主义','被颠覆'],nk:['Shinichi Chiaki','千秋真一','Chiaki','千秋'],v:[['暂未收录','']]}],
[1185,{n:'野田惠',a:'交响情人梦',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1185-1iic41JKkDab.png',dsc:'钢琴系的"变态"少女——住在垃圾堆里、三天不洗澡、用耳朵就能复制任何曲目。绰号"野田妹"。她的演奏完全无视乐谱上的所有标记——但她弹出的每一个音符都比最精确的乐谱更有灵魂。千秋说她"脏得让人无法直视"但她的钢琴让他——这个讨厌所有人的天才——第一次爱上了别人的音乐。"学长——听我弹琴！"' ,tr:['棕发','钢琴','变态','野田妹','天才','脏','自由','灵魂'],nk:['Megumi Noda','野田惠','Nodame','のだめ'],v:[['暂未收录','']]}],
[1186,{n:'多贺谷彩子',a:'交响情人梦',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1186-YeWe96ypipcM.png',dsc:'千秋在音乐学院的前女友——低音提琴手。她代表了千秋想摆脱的"完美秩序"——但也是他必须面对的过去。在千秋和野田的感情线中扮演着重要的催化剂角色。',tr:['黑发','低音提琴','前女友','催化剂'],nk:['Saiko Tagaya','多贺谷彩子'],v:[['暂未收录','']]}],

// 铃芽之旅(3)
[259510,{n:'岩户铃芽',a:'铃芽之旅',img:'https://s4.anilist.co/file/anilistcdn/character/large/b259510-59wuAsKvY2wW.png',dsc:'住在九州宫崎的17岁少女——在去学校的坡道上遇到了一个寻找"门"的青年。追随他走向废墟拉开了一扇古老的门——从此打开了通往日本各地灾难之门的旅途。用一把小小的儿童椅当武器封印灾难。从九州到东京再到故乡东北——这条路线是12年前那场地震中无数人走过的路。"我是铃芽——我回来了。"',tr:['黑发','17岁','闭门师','椅子','地震','旅程','回家'],nk:['Suzume Iwato','岩户铃芽','Suzume','鈴芽'],v:[['暂未收录','']]}],
[284260,{n:'宗像草太',a:'铃芽之旅',img:'https://s4.anilist.co/file/anilistcdn/character/large/b284260-lXeBzrA6ZchP.png',dsc:'年轻的"闭门师"——寻找废墟中通往灾难的门并将其封印。被神秘的白猫Daijin诅咒变成了一把三条腿的儿童椅。即使变成了椅子他也一刻不停地向着下一个门跑去——"我是闭门师——这是我的使命。"铃芽是唯一一个会认真听他说话的人。',tr:['黑发','闭门师','被诅咒','椅子','使命','守护'],nk:['Souta Munakata','宗像草太','Souta','草太'],v:[['暂未收录','']]}],
[284261,{n:'大臣',a:'铃芽之旅',img:'https://s4.anilist.co/file/anilistcdn/character/large/b284261-2m1iJLNCFjed.jpg',dsc:'神秘的白猫——出现在草太被封印的门前。把草太变成了椅子。它看似在制造灾难实际上是在引导铃芽走向一条更重要的道路。它的真身是整个故事最大的谜底。每一声"喵"都藏着无法言说的秘密。',tr:['白猫','神秘','封印','引导','喵','谜底'],nk:['Daijin','大臣','ダイジン'],v:[['暂未收录','']]}],

// 吉卜力系列(3+3+4+4+3+3+3+3)
[7747,{n:'波鲁克',a:'红猪',img:'https://s4.anilist.co/file/anilistcdn/character/large/b7747-AjKZjVAWSnX6.png',dsc:'前意大利空军飞行员——被诅咒变成了猪的赏金猎人。驾驶红色水上飞机在亚得里亚海上空自由飞翔。对法西斯说"我宁愿做一头猪也不愿成为你们的走狗"。表面玩世不恭但在他的墨镜和猪脸下是人类最高贵的精神。"不能飞的猪——就只是普通的猪而已。"',tr:['猪','飞行员','赏金猎人','红色飞机','墨镜','自由','反法西斯'],nk:['Porco Rosso','波鲁克','Marco'],v:[['暂未收录','']]}],
[507,{n:'哈尔',a:'哈尔的移动城堡',img:'https://s4.anilist.co/file/anilistcdn/character/large/b507-g9yz1GTLtPla.jpg',dsc:'住在移动城堡里的魔法师——英俊得让所有少女尖叫但也虚荣到浴室里的金色染发剂被换掉就会崩溃大喊"我的人生完蛋了"。因为与火魔卡西法的契约而不断逃避国王的征召。但当一个变成老太婆的少女走进他的城堡后他不能再逃了——"苏菲——我终于找到你了。"',tr:['金发','魔法师','移动城堡','虚荣','逃避','卡西法','找到苏菲'],nk:['Howl','哈尔','ハウル'],v:[['暂未收录','']]}],
[508,{n:'苏菲',a:'哈尔的移动城堡',img:'https://s4.anilist.co/file/anilistcdn/character/large/b508-ONXMgE281eHe.png',dsc:'制帽店的少女——被荒野女巫诅咒变成90岁的老太婆。独自闯入哈尔的移动城堡当起了清洁工。她不在乎自己变成了什么样子因为"人老了唯一的优点就是能说自己想说的话"——于是她开始指挥哈尔的城堡、火魔和所有人。"我想一直留在你身边——不管变成什么样子。"',tr:['棕发','被诅咒','老太婆','清洁工','勇敢','爱','不在乎外表'],nk:['Sophie Hatter','苏菲','ソフィー'],v:[['暂未收录','']]}],
[539,{n:'娜乌西卡',a:'风之谷',img:'https://s4.anilist.co/file/anilistcdn/character/large/b539-R8ZUxGrcEGGn.png',dsc:'风之谷的公主——能与巨大的王虫沟通的少女。驾驶滑翔翼在腐海上空飞翔。当整个世界的男人都在用枪炮解决腐海的威胁时她用温柔和理解化解了人类与自然之间最深的仇恨。金田伊功式的中段爆击也是为她而生的。"生命是在黑暗中闪耀的光。"',tr:['蓝发','公主','滑翔翼','王虫','和平','温柔','自然','腐海'],nk:['Nausicaä','娜乌西卡','ナウシカ'],v:[['暂未收录','']]}],
[2802,{n:'阿席达卡',a:'幽灵公主',img:'https://s4.anilist.co/file/anilistcdn/character/large/n2802-ccaKcUTJajUu.png',dsc:'被诅咒的虾夷族王子——为了寻找解除诅咒的方法踏上了前往西方的旅途。在铁镇和森林的战争之间他试图找到第三条路——共存。他的弓箭能穿透岩石但最强大的武器是他眼中不含偏见的视线。"我想以不被憎恨的眼睛看这个世界。"',tr:['黑发','王子','诅咒','弓箭','共存','不憎恨','骑羚羊'],nk:['Ashitaka','阿席达卡','アシタカ'],v:[['暂未收录','']]}],
[2727,{n:'桑',a:'幽灵公主',img:'https://s4.anilist.co/file/anilistcdn/character/large/b2727-eH2xoFpmfbS4.png',dsc:'被山犬神养大的人类少女——幽灵公主。用獠牙和鲜血对抗着破坏森林的人类。她恨人类——因为人类夺走了她的森林和母亲。但在阿席达卡眼中她除了仇恨还看到了自己。"我是山犬——不是人类！"——但她也是被阿席达卡爱上的人。',tr:['黑发','山犬','幽灵公主','森林','仇恨人类','面具','被爱'],nk:['San','桑','幽灵公主','サン'],v:[['暂未收录','']]}],
[269,{n:'龙猫',a:'龙猫',img:'https://s4.anilist.co/file/anilistcdn/character/large/b269-sbPL4w1ygjSe.jpg',dsc:'森林的精灵——只有小孩子才能看见的巨大毛茸茸的存在。在雨夜的公交站和一把伞下与小月小梅姐妹相遇。用旋转飞翔和猫巴士载着孩子们飞过乡村的夜空。没有任何反派没有任何冲突——只有最纯粹最幸福的童年魔法。"TO-TO-RO——"' ,tr:['灰色','巨大','森林精灵','毛茸茸','猫巴士','童年','魔法','纯真'],nk:['Totoro','龙猫','トトロ','多多龙'],v:[['暂未收录','']]}],
[267,{n:'草壁皋月',a:'龙猫',img:'https://s4.anilist.co/file/anilistcdn/character/large/267.jpg',dsc:'搬到乡下的小学生姐姐——在妈妈住院期间懂事地照顾着妹妹小梅。坚强倔强但当小梅失踪时她唯一求助的对象是森林里那个巨大的精灵。坐在龙猫肚子上的她终于可以放下所有的逞强做一个普通的小孩子。',tr:['棕发','姐姐','小学生','懂事','坚强','龙猫','童年'],nk:['Satsuki Kusakabe','草壁皋月','Satsuki'],v:[['暂未收录','']]}],
[268,{n:'草壁梅',a:'龙猫',img:'https://s4.anilist.co/file/anilistcdn/character/large/268.jpg',dsc:'小月的妹妹——精力旺盛的4岁小女孩。第一个发现了龙猫的踪迹然后径直追进树丛的隧道。在龙猫的肚子上一蹦一跳然后趴着睡着了——全世界最治愈的画面。走丢的那一天龙猫让猫巴士载着姐姐找到了她。',tr:['棕发','4岁','妹妹','元气','发现龙猫','走丢','纯真'],nk:['Mei Kusakabe','草壁梅','Mei','メイ'],v:[['暂未收录','']]}],
[6866,{n:'琪琪',a:'魔女宅急便',img:'https://s4.anilist.co/file/anilistcdn/character/large/b6866-Fe38ZMNvevnF.png',dsc:'13岁的小魔女——按照传统带着黑猫吉吉离家进行修行。飞到海边的城市开了一家飞行快递店。但有一天她突然失去了飞行能力——发现自己失去魔法的恐慌是每个从孩子走向大人的人都会经历的迷茫。"我只是累了——让我休息一下"——然后重新飞起来时比任何时候都更美丽。',tr:['黑发','13岁','魔女','扫帚','黑猫','快递','失飞','成长'],nk:['Kiki','琪琪','キキ'],v:[['暂未收录','']]}],
[14286,{n:'波妞',a:'悬崖上的金鱼姬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b14286-So4LWwCaE5un.png',dsc:'从海里跑出来的金鱼公主——一条红色的小鱼变成了人类小女孩。只想做一件事——和宗介在一起。她引发的海啸吞噬了半个城镇但她的愿望仅仅是——变成人类和那个5岁男孩吃一碗火腿拉面。"波妞——喜欢宗介！"' ,tr:['红发','金鱼','公主','变身','人类','海啸','爱','火腿拉面'],nk:['Ponyo','波妞','ポニョ'],v:[['暂未收录','']]}],
[15009,{n:'宗介',a:'悬崖上的金鱼姬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b15009-1FN9rnnLAinM.png',dsc:'住在海边悬崖上的5岁男孩。在礁石上发现了困在玻璃罐里的金鱼波妞。给她起名为波妞然后把她养在绿色水桶里。当波妞变成人类引发洪水时他划着玩具小船穿越整个被淹没的城镇去找她。"我会保护波妞的——因为我是男子汉。"',tr:['棕发','5岁','善良','勇敢','波妞','小船','男子汉'],nk:['Sousuke','宗介','そうすけ'],v:[['暂未收录','']]}],
[75454,{n:'堀越二郎',a:'起风了',img:'https://s4.anilist.co/file/anilistcdn/character/large/b75454-8Vk7gyp43FsF.png',dsc:'日本零式战斗机的设计师——从小就梦想造出最美的飞机。在关东大地震后的混乱中遇到了生命中最重要的人菜穗子。但他的飞机最终成为了战争中的杀人武器。"我设计的飞机中没有一架是从战场上回来的。"梦想的美丽与残酷在风中同时起飞。',tr:['黑发','飞机设计师','零式','梦想','战争','菜穗子','悲剧'],nk:['Jirou Horikoshi','堀越二郎','Jirou','二郎'],v:[['暂未收录','']]}],
[75456,{n:'里见菜穗子',a:'起风了',img:'https://s4.anilist.co/file/anilistcdn/character/large/b75456-Gygsnz7b9r9j.jpg',dsc:'二郎的妻子——患有肺结核的美丽女性。在疗养院逃出来只是为了和二郎多待一天。她知道自己时日无多但她选择了在风最大的山顶上和他一起看飞机起飞。"起风了——我们要好好活下去。"',tr:['黑发','肺结核','妻子','温柔','坚强','不放弃','风'],nk:['Nahoko Satomi','里见菜穗子','Nahoko','菜穂子'],v:[['暂未收录','']]}],
[494,{n:'清太',a:'萤火虫之墓',img:'https://s4.anilist.co/file/anilistcdn/character/large/b494-9sbHCvWiD9py.png',dsc:'14岁的少年——在二战末期的神户空袭中失去了母亲。带着4岁的妹妹节子独自在防空洞中生存。用萤火虫照亮黑暗的夜晚给妹妹讲父母的故事。最后在车站饿死时身边只有妹妹生前玩过的糖罐。"节子——哥哥在这里——不要怕。"',tr:['黑发','14岁','哥哥','孤儿','战争','萤火虫','悲剧'],nk:['Seita','清太','せいた'],v:[['暂未收录','']]}],
[495,{n:'节子',a:'萤火虫之墓',img:'https://s4.anilist.co/file/anilistcdn/character/large/b495-vzUTVQ5RMiJN.png',dsc:'清太4岁的妹妹——在战争中失去了母亲和家。她什么都不知道——只知道饿了找哥哥，怕了找哥哥，用泥巴捏饭团给哥哥吃。最后在防空洞里抱着糖罐睡去——再也没有醒来。她的死是所有反战作品中最沉默最刺骨的控诉。"哥哥——你吃——"' ,tr:['黑发','4岁','妹妹','孤儿','战争','糖罐','悲剧','无辜'],nk:['Setsuko','节子','せつこ'],v:[['暂未收录','']]}],
[89885,{n:'辉夜姬',a:'辉夜姬物语',img:'https://s4.anilist.co/file/anilistcdn/character/large/89885-ruLmoJQAQPsp.jpg',dsc:'从竹子中诞生被竹取翁夫妇养大的天女。在人间经历了成长的喜悦、被囚禁的痛苦和恋爱的无奈。当月光下的天人来接她回月亮时她拼命涂掉了前世的所有记忆——"我不想忘记——这个世上的一切——"' ,tr:['黑发','竹取','天女','公主','人间','成长','不舍'],nk:['Kaguya-hime','辉夜姬','かぐや姫'],v:[['暂未收录','']]}],
]

let c=0
for(const[id,o]of D){
  const{error}=await supabase.from('characters').upsert({id,name:o.n,anime_title:o.a,image:o.img,description:o.dsc,traits:o.tr,nicknames:o.nk},{onConflict:'id'})
  if(o.v){await supabase.from('voice_actors').delete().eq('character_id',id);for(const[nm,im]of o.v)await supabase.from('voice_actors').insert({character_id:id,name:nm,image:im||'',language:'日语'})}
  process.stdout.write(error?'❌':'+');c++
}
console.log('\n重建search_text...')
const{data:chs}=await supabase.from('characters').select('id,name,anime_title,nicknames,traits,voice_actors(name)')
for(const x of chs||[]){const s=[x.name,x.anime_title||'',...(x.nicknames||[]),...(x.traits||[]),...(x.voice_actors||[]).map(v=>v.name)].join(' ');await supabase.from('characters').update({search_text:s}).eq('id',x.id)}
console.log('✅',c)
