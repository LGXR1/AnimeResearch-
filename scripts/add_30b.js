import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const D=[
// ALDNOAH.ZERO(4)
[88173,{n:'界冢伊奈帆',a:'ALDNOAH.ZERO',img:'https://s4.anilist.co/file/anilistcdn/character/large/88173-9ahmvKutxcVO.jpg',dsc:'冷静到极致的战术天才高中生——在火星骑士入侵地球时驾驶训练机甲击坠了无数敌机。没有感情波动的"面瘫"用最精准的计算把每一个对手拆解。他的每一步棋都是预判——"我只是选择了最优解而已。"',tr:['黑发','高中生','战术天才','面瘫','最优解','机甲'],nk:['Inaho Kaizuka','界冢伊奈帆','Inaho']}],
[88174,{n:'斯雷因·特洛耶特',a:'ALDNOAH.ZERO',img:'https://s4.anilist.co/file/anilistcdn/character/large/88174-QRY3Ayq8xVvZ.jpg',dsc:'在火星长大的地球人——为了公主可以背叛任何人。在火星与地球的战争中在两个世界之间反复横跳。他的每一步选择都充满了矛盾和痛苦——"我到底是谁——地球人还是火星人？"',tr:['金发','火星','地球人','矛盾','背叛','公主至上'],nk:['Slaine Troyard','斯雷因','Slaine']}],
[88175,{n:'艾瑟依拉姆·薇瑟·艾莉欧斯亚',a:'ALDNOAH.ZERO',img:'https://s4.anilist.co/file/anilistcdn/character/large/88175.jpg',dsc:'火星公主——为了地球与火星的和平不惜假死。温柔的理想主义者面对残酷的战争仍然坚持寻求和平解决之道。伊奈帆和斯雷因两个人的命运都因她而改变。"我只想要——两个星球都能和平相处的世界。"',tr:['金发','公主','和平','理想主义','假死'],nk:['Asseylum Vers Allusia','公主','アセイラム']}],

// 四月一日灵异事件簿(4)
[236,{n:'壹原侑子',a:'四月一日灵异事件簿',img:'https://s4.anilist.co/file/anilistcdn/character/large/b236-xWbhQJYxYn2P.png',dsc:'实现愿望的魔女——"次元的魔女"。黑长直的绝美女性经营着一家只要付出代价就能实现任何愿望的店。蝴蝶、烟斗和华丽的和服是她的标志。知道所有世界的事——包括她自己的结局。"这世上没有偶然——只有必然。"',tr:['黑发','长直','魔女','蝴蝶','烟斗','和服','必然','代价'],nk:['Yuuko Ichihara','壹原侑子','Yuuko','侑子']}],
[235,{n:'四月一日君寻',a:'四月一日灵异事件簿',img:'https://s4.anilist.co/file/anilistcdn/character/large/b235-TUmZb6fdlJmL.png',dsc:'拥有吸引妖怪体质的少年——父母双亡后在侑子的店里打工来偿还"看见妖怪"的代价。家务全能但每天都在抱怨侑子使唤他。在帮助客人实现愿望的过程中逐渐看到了世界的真相。"侑子小姐——我还有多少时间？"',tr:['黑发','见妖','家务','打工','代价','侑子店员'],nk:['Kimihiro Watanuki','四月一日君寻','Watanuki']}],
[567,{n:'百目鬼静',a:'四月一日灵异事件簿',img:'https://s4.anilist.co/file/anilistcdn/character/large/b567-9LpNHHz8K9SW.jpg',dsc:'四月一日的同班同学——弓箭名家。沉默寡言但每次四月一日遇到危险他都在场。对妖怪免疫所以看不到四月一日能看到的东西——但他从不怀疑四月一日说的话。用最沉默的方式做最忠诚的守护。',tr:['黑发','弓箭','沉默','守护','四月一日的保护者'],nk:['Shizuka Doumeki','百目鬼静','Doumeki']}],
[568,{n:'九轩葵',a:'四月一日灵异事件簿',img:'https://s4.anilist.co/file/anilistcdn/character/large/568.jpg',dsc:'四月一日的同班同学——笑容温柔的少女。但她身边的人总是不幸——她拒绝四月一日靠近她因为害怕他也变得不幸。在侑子的帮助下正视了自己的命运。',tr:['棕发','不幸','温柔','自卑','命运'],nk:['Himawari Kunogi','九轩葵']}],

// 言叶之庭(2)
[79463,{n:'秋月孝雄',a:'言叶之庭',img:'https://s4.anilist.co/file/anilistcdn/character/large/79463.jpg',dsc:'15岁的高中生——梦想是成为制鞋师。下雨的早晨逃课到新宿御苑的庭院里画鞋子的设计图。在那里遇到了一个喝着啤酒看着天空的神秘女性。在雨声中他为她做了一双鞋——"我想为你做一双能让你走得更远的鞋。"那个梅雨季的庭院成了两人唯一的避难所。',tr:['黑发','15岁','制鞋','下雨','庭院','逃课'],nk:['Takao Akizuki','秋月孝雄','Takao']}],
[79465,{n:'雪野百香里',a:'言叶之庭',img:'https://s4.anilist.co/file/anilistcdn/character/large/n79465-9RmwiUdbYlo9.png',dsc:'27岁的高中古文教师——因为被学生霸凌而失去了味觉和继续教书的勇气。下雨的早晨独自躲在公园庭院里喝啤酒吃巧克力。遇到了那个问她"我们是否在哪里见过"的少年。《万叶集》中的短歌是她唯一能表达心情的方式——"隐约雷鸣阴霾天空但盼风雨来能留你在此。"',tr:['黑发','27岁','教师','被霸凌','失味','巧克力','万叶集'],nk:['Yukari Yukino','雪野百香里','Yukino']}],

// 穿越时空的少女(2)
[2530,{n:'绀野真琴',a:'穿越时空的少女',img:'https://s4.anilist.co/file/anilistcdn/character/large/b2530-cQj2vyKexS4n.png',dsc:'普通的女高中生——在理科教室意外获得了穿越时间的能力。最初只是用来多吃几次布丁和考试作弊。直到她最好的朋友对她说"我喜欢你"——她才开始一次次往回跳想要回到那天之前。"Time waits for no one——时间不等人。"',tr:['棕发','短发','时间穿越','布丁','友情','后悔'],nk:['Makoto Konno','绀野真琴','Makoto']}],
[2531,{n:'间宫千昭',a:'穿越时空的少女',img:'https://s4.anilist.co/file/anilistcdn/character/large/b2531-sTqtJZK2Hty5.jpg',dsc:'真琴的同班同学和最好的朋友——来自未来的时间旅行者。他来到这个时代只是为了看一幅画。但在那个夏天爱上了真琴。最后的告别——"我会在未来等你"——让无数人在电影院泪崩。',tr:['黑发','时间旅行者','未来人','暗恋','告别'],nk:['Chiaki Mamiya','间宫千昭','Chiaki']}],

// 夏日大作战(3)
[22808,{n:'小矶健二',a:'夏日大作战',img:'https://s4.anilist.co/file/anilistcdn/character/large/b22808-8VdmJYOZqVrg.png',dsc:'数学天才的高中生——被学姐骗去外婆家假扮男友。结果在虚拟世界OZ中意外破解了密码被全世界当成黑客通缉。在即将毁灭整个网络世界的AI面前他用数学和外婆教给他的"家人"一起战斗。"这个世界的密码——就是爱。"',tr:['黑发','数学天才','黑客','夏希','OZ','外婆家'],nk:['Kenji Koiso','小矶健二','Kenji']}],
[22809,{n:'篠原夏希',a:'夏日大作战',img:'https://s4.anilist.co/file/anilistcdn/character/large/b22809-QgxOpNswhCup.png',dsc:'把健二骗回家假扮男友的学姐——阵内家的长女。当AI开始瘫痪整个世界时她坐在奶奶的牌桌前用花牌和AI一决胜负。她的那个"来打花牌吧——KOI KOI！"让全世界玩家给她刷了数亿的虚拟Avatar。"这是奶奶教我的——不管对手是谁都不能认输。"',tr:['黑发','学姐','花牌','阵内家','骗男友','强大'],nk:['Natsuki Shinohara','篠原夏希','Natsuki']}],
[22810,{n:'阵内荣',a:'夏日大作战',img:'https://s4.anilist.co/file/anilistcdn/character/large/b22810-HC8H0n9y3iKD.png',dsc:'阵内家的第十六代当主——90岁的老太太。在虚拟世界OZ被AI攻击时用一台老式电话给全日本各行各业的人打电话下达命令。她一个人就比整个政府更有行动力。在所有人都快放弃的时候——"慌什么——我还活着呢。"',tr:['白发','90岁','当主','电话','领导','家人','最强的奶奶'],nk:['Sakae Jinnouchi','阵内荣','奶奶']}],

// 狼的孩子雨与雪(3)
[60279,{n:'花',a:'狼的孩子雨与雪',img:'https://s4.anilist.co/file/anilistcdn/character/large/b60279-1DRIDCpJZ9SD.png',dsc:'与狼人相爱的大学生——生下两个"狼的孩子"后在爱人意外去世后独自搬到乡下抚养两个孩子。从城市女孩到田间农妇——她用双肩扛起了全部的生活。看着两个孩子一个选择了做人一个选择了做狼——"妈妈永远爱你们——不管是做人还是做狼。"',tr:['黑发','母亲','狼人妻子','坚强','乡间','养育'],nk:['Hana','花','はな']}],
[60281,{n:'雪',a:'狼的孩子雨与雪',img:'https://s4.anilist.co/file/anilistcdn/character/large/b60281-QaCr9FOcsIOQ.png',dsc:'狼人混血的姐姐——在乡下山林中选择了以狼的形态奔跑。活泼倔强的少女从小就以"野兽"的方式面对世界。在学校被同学视为异类但她学会了用人性和狼性的两面生活。最终选择了人类社会的道路。"妈妈——我决定做一个人。"',tr:['棕发','狼人','混血','活泼','选择人类'],nk:['Yuki','雪','ユキ']}],
[60283,{n:'雨',a:'狼的孩子雨与雪',img:'https://s4.anilist.co/file/anilistcdn/character/large/b60283-1oOCO9yq7ymy.png',dsc:'狼人混血的弟弟——从小体弱安静但在山林中找到了自己的归属。被一只老狐狸收养后选择了继承山林的守护者——完全作为狼生存下去。"妈妈——我要去山里了——替我告诉姐姐——"那个雨天的告别是全片最痛的一幕。',tr:['黑发','狼人','混血','安静','选择做狼','山林'],nk:['Ame','雨','あめ']}],

// 怪物之子(2)
[122894,{n:'莲',a:'怪物之子',img:'https://s4.anilist.co/file/anilistcdn/character/large/b122894-rFWo7TcWiVPV.png',dsc:'在涩谷街头流浪的9岁孤儿——无意中闯入"兽界"被熊人族剑豪捡回收为弟子。在两个世界中成长——涩谷的废墟里藏着失去母亲的伤痛，兽界的道场中他在无数次的摔倒中学会了挥剑。长大后的他必须在人类和兽之间做出最终的选择。"剑在心里——不在手中。"',tr:['黑发','孤儿','双世界','剑术','熊人弟子'],nk:['Ren','莲','九太']}],
[122871,{n:'熊铁',a:'怪物之子',img:'https://s4.anilist.co/file/anilistcdn/character/large/122871-u6DZDugTDraW.jpg',dsc:'兽界的剑豪——粗鲁暴躁的熊人族大叔。在涩谷街头捡到莲后不情不愿地收他为弟子。教剑先教做人——虽然他的"教育方式"是把莲往死里揍。但在莲最需要的时候他会用最笨拙的方式站在他身后。"臭小子——剑不是用来杀人的！"',tr:['熊','剑豪','大叔','师父','粗鲁','温柔'],nk:['Kumatetsu','熊铁','クマテツ']}],

// 少女与战车(3)
[62939,{n:'西住美穗',a:'少女与战车',img:'https://s4.anilist.co/file/anilistcdn/character/large/b62939-WXOAXdfAhHrF.png',dsc:'大洗女子学园战车道队长——曾经因在比赛中弃车救人而被家人和战车道界唾弃。转学后被朋友拉回了坦克里。从Pz.Kpfw.IV到虎式——她指挥着这个全是门外汉的队伍一路打进了全国大赛。"我不再逃了——这次我要和我的朋友们一起赢。"',tr:['棕发','战车道','队长','不再逃','指挥','温柔'],nk:['Miho Nishizumi','西住美穗','Miho']}],
[62941,{n:'武部沙织',a:'少女与战车',img:'https://s4.anilist.co/file/anilistcdn/character/large/b62941-zuJumccZ2I1q.png',dsc:'美穗的同班同学——加入战车道是为了找男朋友。负责通信的她总能在最危急的时刻联系上队长。性格开朗的少女证明了坦克里面也能找到最美的友情。',tr:['棕发','通信','开朗','找男友'],nk:['Saori Takebe','武部沙织','Saori']}],
[62945,{n:'秋山优花里',a:'少女与战车',img:'https://s4.anilist.co/file/anilistcdn/character/large/b62945-X9Y608pYoTZK.png',dsc:'战车道的狂热军事宅——对坦克的一切了如指掌。加入战车道后终于可以名正言顺地穿上德军军服。战斗时的狂热和日常时的反差萌是全队的最大笑点。"角度！速度！距离！"——她闭着眼睛都能算出弹道。',tr:['黑发','军事宅','坦克','军服','狂热','反差萌'],nk:['Yukari Akiyama','秋山优花里','Yukari']}],

// 赛博朋克边缘行者(3)
[284158,{n:'大卫·马丁内斯',a:'赛博朋克边缘行者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b284158-z1uGKC3IYVa1.png',dsc:'夜之城最年轻的边缘行者——17岁的街头少年。从母亲的医疗费开始一步步踏入义体改造的深渊。在曼恩死后独自撑起整个团队。但每一个义体都在吞噬他的人性——直到最后站在夜之城最高楼上。"Lucy——我终于带你去看月亮了——对不起我不能陪你到那里了。"',tr:['棕发','17岁','义体','夜之城','边缘行者','牺牲','月球'],nk:['David Martinez','大卫','David','デイビッド']}],
[284157,{n:'露西',a:'赛博朋克边缘行者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b284157-cqYawN7XCNJx.jpg',dsc:'从荒坂逃出来的黑客——白发的沉默少女。在大卫最崩溃的时候对他伸出了手。她的梦想只是去月球——但在她和大卫之间那个梦想从月亮变成了一个更小的东西——"我只想和你在一起。"最后一个人站在月球上看着大卫没能看到的光芒。"大卫——我看到了——月亮——好美。"',tr:['白发','黑客','荒坂','逃犯','月球','沉默','爱'],nk:['Lucy','露西','ルーシー']}],
[284165,{n:'法拉第',a:'赛博朋克边缘行者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b284165-sQpdUhtcWquN.jpg',dsc:'夜之城的中间人——把大卫拉入边缘行者世界的幕后推手。永远穿着一身西装的面无表情的阴影。他的手伸向了每一个能给他带来利益的边缘行者包括大卫。',tr:['黑发','中间人','西装','夜之城','幕后'],nk:['Faraday','法拉第','ファラデー']}],

// 明日方舟(2)
[174801,{n:'阿米娅',a:'明日方舟',img:'https://s4.anilist.co/file/anilistcdn/character/large/b174801-TMQak4mRHb1p.jpg',dsc:'罗德岛的公开领袖——兔耳少女。在战争中失去了一切被博士和凯尔希捡到。外表年幼但内心承受着感染者与正常人之间最深重的仇恨。左手无名指上的戒指——是继承"特蕾西亚意志"的证明。"博士——你不记得我了吗——没关系——我会一直在你身边。"',tr:['棕发','兔耳','罗德岛','领袖','感染者','特蕾西亚'],nk:['Amiya','阿米娅','アーミヤ']}],
[182729,{n:'博士',a:'明日方舟',img:'https://s4.anilist.co/file/anilistcdn/character/large/b182729-1uJe1ghqllBs.png',dsc:'罗德岛的战术指挥官——失去了所有记忆但战术头脑完好无损。从切尔诺伯格的石棺中被阿米娅救出后重新执掌罗德岛的指挥权。每天的工作就是吃饭睡觉和打源石虫。但博士的每一个决策都决定了无数干员的生死。"不要怕——我会带你们回家的。"',tr:['兜帽','失忆','指挥官','罗德岛','战术','博士'],nk:['Doctor','博士','ドクター']}],

// 云之彼端(3)
[3902,{n:'泽渡佐由理',a:'云之彼端约定的地方',img:'https://s4.anilist.co/file/anilistcdn/character/large/3902.jpg',dsc:'消失在"那座塔"里的少女——两个少年约定要造一架飞机飞到塔那边去看她。在病房里陷入沉睡的三年她唯一的声音是一遍又一遍在梦境中呼唤——"浩纪——拓也——我在云的那边等你们。"',tr:['黑发','沉睡','塔','约定','等待'],nk:['Sayuri Sawatari','泽渡佐由理']}],
[3903,{n:'藤泽浩纪',a:'云之彼端约定的地方',img:'https://s4.anilist.co/file/anilistcdn/character/large/3903.jpg',dsc:'与拓也一起造飞机的少年——在佐由理消失后独自扛起了那架被遗弃的飞机继续造下去。"我答应过要带她飞到那座塔那里——这个约定我一个人也要完成。"',tr:['黑发','造飞机','约定','坚持','不放弃'],nk:['Hiroki Fujisawa','藤泽浩纪']}],
[3904,{n:'白川拓也',a:'云之彼端约定的地方',img:'https://s4.anilist.co/file/anilistcdn/character/large/3904.jpg',dsc:'浩纪的朋友——后来成为了研究"那座塔"的科学家。他选择了用物理学解释那个吞噬了佐由理的塔——放弃了自己曾经最想相信的东西。因为他太痛苦了——"那座塔的存在本身就是一个错误。"',tr:['黑发','科学家','放弃','痛苦','塔'],nk:['Takuya Shirakawa','白川拓也']}],

// 夏目友人帐 补1 + 其他
[22812,{n:'阵内侘助',a:'夏日大作战',img:'https://s4.anilist.co/file/anilistcdn/character/large/b22812-vTb7wX7NsKwQ.png',dsc:'阵内家被收养的孩子——计算机天才。在美国开发了军事AI"Love Machine"后回家探望奶奶。他的AI意外失控开始摧毁整个网络世界——然后他用自己的方式赎罪。"奶奶——对不起——这次我会把事情解决掉。"',tr:['黑发','计算机','AI','收养','悔过'],nk:['Wabisuke Jinnouchi','阵内侘助']}],
]
let c=0
for(const[id,o]of D){
  const{error}=await supabase.from('characters').upsert({id,name:o.n,anime_title:o.a,image:o.img,description:o.dsc,traits:o.tr,nicknames:o.nk},{onConflict:'id'})
  if(o.v){await supabase.from('voice_actors').delete().eq('character_id',id);for(const[nm,im]of o.v)await supabase.from('voice_actors').insert({character_id:id,name:nm,image:im||'',language:'日语'})}
  process.stdout.write(error?'❌':'+');c++
}
// Also add the quick ones
const Q=[['星之声',3532,'长峰美加子',['Mikako Nagamine','美加子'],'https://s4.anilist.co/file/anilistcdn/character/large/b3532-aonFV30zlWHg.png'],['星之声',3531,'寺尾升',['Noboru Terao','升'],'https://s4.anilist.co/file/anilistcdn/character/large/b3531-8KiZJ6esFz7D.png'],['她和她的猫',10126,'她',['She','彼女'],'https://s4.anilist.co/file/anilistcdn/character/large/10126.jpg'],['她和她的猫',7801,'卓比',['Chobi','チョビ'],'https://s4.anilist.co/file/anilistcdn/character/large/7801.jpg'],['恋爱研究所',74269,'仓桥莉子',['Riko Kurahashi','莉子'],'https://s4.anilist.co/file/anilistcdn/character/large/b74269-bzZOUwBQ2IUt.png'],['恋爱研究所',74271,'真木夏绪',['Natsuo Maki','夏绪'],'https://s4.anilist.co/file/anilistcdn/character/large/b74271-8AGO0Hs5h56X.png'],['高校舰队',89347,'岬明乃',['Akeno Misaki','明乃'],'https://s4.anilist.co/file/anilistcdn/character/large/b89347-GoywqgrgjD9U.png'],['高校舰队',89730,'知床铃',['Rin Shiretoko','铃'],'https://s4.anilist.co/file/anilistcdn/character/large/b89730-G6qXjTgoiB7q.png'],['强袭魔女',7630,'夏洛特·E·叶格',['Charlotte E Yeager','夏洛特'],'https://s4.anilist.co/file/anilistcdn/character/large/b7630-0eFrsfxcae2L.png'],['强袭魔女',7632,'弗朗西斯卡·鲁基尼',['Francesca Lucchini','鲁基尼'],'https://s4.anilist.co/file/anilistcdn/character/large/b7632-5jni7LSAZbP4.png'],['犬王',175675,'犬王',['Inu-Oh','犬王'],'https://s4.anilist.co/file/anilistcdn/character/large/b175675-lsqrA2TUd2hk.png'],['犬王',175676,'友鱼',['Tomona','友魚'],'https://s4.anilist.co/file/anilistcdn/character/large/b175676-hJ6V1P3wU2Tj.png'],['怪物之子',131779,'枫',['Kaede','楓'],'https://s4.anilist.co/file/anilistcdn/character/large/b131779-i9x91xvL7LcH.jpg'],['未来的未来',130646,'未来',['Mirai','ミライ'],'https://s4.anilist.co/file/anilistcdn/character/large/n130646-hJBvo3nZL1TQ.jpg'],['未来的未来',130645,'小君',['Kun','くんちゃん'],'https://s4.anilist.co/file/anilistcdn/character/large/n130645-yV9zzZONnf7R.jpg']]
for(const[a,id,name,nk,img]of Q){
  const{error}=await supabase.from('characters').upsert({id,name,anime_title:a,image:img,nicknames:nk,traits:[],description:''},{onConflict:'id'})
  process.stdout.write(error?'❌':'+');c++
}
console.log('\n重建search_text...')
const{data:chs}=await supabase.from('characters').select('id,name,anime_title,nicknames,traits,voice_actors(name)')
for(const x of chs||[]){const s=[x.name,x.anime_title||'',...(x.nicknames||[]),...(x.traits||[]),...(x.voice_actors||[]).map(v=>v.name)].join(' ');await supabase.from('characters').update({search_text:s}).eq('id',x.id)}
console.log('✅',c)
