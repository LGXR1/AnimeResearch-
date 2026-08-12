import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const D=[
// ====== 天国大魔境 (4) ======
[289824,{n:'真流',a:'天国大魔境',img:'https://s4.anilist.co/file/anilistcdn/character/large/b289824-7LdKeeZkpEjF.png',dsc:'拥有特殊能力的少年——用手触摸物体就能感知其"记忆"。与姐姐桐子一起在崩坏的日本寻找传说中的"天国"。外表冷酷内心温柔，对姐姐的依赖超出他自己意识到的程度。战斗能力极强，但每次使用能力都会消耗大量体力。',tr:['黑发','触摸感知','天国','寻找','战斗','外冷内热'],nk:['Maru','真流','マル'],v:[['暂未收录','']]}],
[289828,{n:'桐子',a:'天国大魔境',img:'https://s4.anilist.co/file/anilistcdn/character/large/b289828-021nDZVsvAP5.png',dsc:'真流的姐姐兼护卫——短发帅气的少女。精通枪械和格斗技术。带着弟弟在末日后的日本流浪。看似坚强独立但其实是弟弟的精神支柱。对真流的真实身世和"天国"的秘密有着无法言说的牵连。',tr:['短发','枪械','格斗','弟弟护卫','坚强','流浪'],nk:['Kiruko','桐子','キルコ'],v:[['暂未收录','']]}],
[297902,{n:'杏',a:'天国大魔境',img:'https://s4.anilist.co/file/anilistcdn/character/large/b297902-KEeb7dlu01cV.png',dsc:'在末日废土中独自生存的少女。遇到真流和桐子后加入了他们的旅途。擅长寻找食物和水源，是三人组中的生存专家。性格开朗乐观在绝望的环境中是最亮的光。',tr:['棕发','生存','少女','乐观','加入同行'],nk:['Anzu','杏','アンズ'],v:[['暂未收录','']]}],
[339524,{n:'岩',a:'天国大魔境',img:'https://s4.anilist.co/file/anilistcdn/character/large/b339524-9sA7ohsVY3wb.png',dsc:'天国设施的守护者之一，身形巨大的沉默男人。拥有超强的力量和恢复能力。守护着设施中最深处的秘密。',tr:['巨大','守护者','沉默','力量','秘密'],nk:['Iwa','岩'],v:[['暂未收录','']]}],

// ====== 蓝色监狱 (5) ======
[140856,{n:'洁世一',a:'蓝色监狱',img:'https://s4.anilist.co/file/anilistcdn/character/large/b140856-wVzKSyvU7R5B.png',dsc:'蓝色监狱的参赛者——300个前锋中最先"觉醒"的人。高中足球部默默无闻的前锋因为太自我而被队友排斥。但在蓝色监狱的残酷竞争中找到了属于自己的武器——"空间感知能力"。他的进化速度令所有人恐惧。"我要成为世界第一前锋。"',tr:['黑发','前锋','空间感知','自我','觉醒','进化','利己主义'],nk:['Yoichi Isagi','洁世一','Isagi','イサギ'],v:[['暂未收录','']]}],
[162213,{n:'蜂乐回',a:'蓝色监狱',img:'https://s4.anilist.co/file/anilistcdn/character/large/b162213-4czykzdxmWG6.png',dsc:'洁世一在蓝色监狱的第一个盟友——自由奔放的盘带天才。足球对他来说就是"和怪物们一起玩的游戏"。在场上只听自己内心的"怪物"指挥。看似疯疯癫癫但拥有无人能及的技术和创造力。',tr:['金发','盘带','自由','怪物','天才','创造力'],nk:['Meguru Bachira','蜂乐回','Bachira','バチラ'],v:[['暂未收录','']]}],
[162214,{n:'国神炼介',a:'蓝色监狱',img:'https://s4.anilist.co/file/anilistcdn/character/large/b162214-9x9Q3A9rxpx8.png',dsc:'蓝色监狱的另一个竞争者——身材高大的强力前锋。信奉"正义"足球——拒绝使用任何卑鄙手段也要堂堂正正地进球。但在蓝色监狱的残酷竞争中他被迫面对"正义"是否真的能让他成为最强的事实。',tr:['橙发','强力前锋','正义','高大','信念动摇'],nk:['Rensuke Kunigami','国神炼介','Kunigami'],v:[['暂未收录','']]}],
[167444,{n:'千切豹马',a:'蓝色监狱',img:'https://s4.anilist.co/file/anilistcdn/character/large/b167444-JTHkkJAX4E3q.png',dsc:'蓝色监狱中速度最快的男人——"音速之千切"。拥有超越级别的冲刺速度是他的唯一武器也是他全部的存在价值。因膝盖旧伤一直被前队友过度保护在蓝色监狱中终于能放开奔跑不再被任何人束缚。',tr:['红发','速度','音速','膝盖伤','自由','奔跑'],nk:['Hyouma Chigiri','千切豹马','Chigiri'],v:[['暂未收录','']]}],
[169392,{n:'久远涉',a:'蓝色监狱',img:'https://s4.anilist.co/file/anilistcdn/character/large/b169392-IWGJIFHcBsLa.png',dsc:'蓝色监狱首轮比赛中洁世一所在的Z队成员。擅长观察和分析对手动向。是最早看出洁空间感知力可怕的人之一。',tr:['黑发','分析','观察','Z队'],nk:['Wataru Kuon','久远涉'],v:[['暂未收录','']]}],

// ====== 我独自升级 (4) ======
[129928,{n:'成秦禹',a:'我独自升级',img:'https://s4.anilist.co/file/anilistcdn/character/large/b129928-BCEjVaP0AQSw.png',dsc:'人类最弱的E级猎人——"人类最弱兵器"。在一次双重地下城中被系统选中获得了"升级"的唯一能力。从此从一个连最低级魔物都打不过的废物变成了无可匹敌的S级存在。他的每一次升级都在刷新这个世界的极限。"起来——我还没死呢。"',tr:['黑发','E级猎人','系统','升级','暗影君主','最弱到最强','召唤'],nk:['Jin-U Seong','成秦禹','Sung Jin-Woo','シャドウモナーク'],v:[['暂未收录','']]}],
[136077,{n:'白允浩',a:'我独自升级',img:'https://s4.anilist.co/file/anilistcdn/character/large/b136077-IIMqRmMK5Fgs.png',dsc:'韩国S级猎人——白虎公会的会长。最早注意到成秦禹异常成长的人之一。外表是中年大叔但实力在韩国排名第一。在秦禹成长的过程中给予了最关键的指引和信任。"小子——你到底是什么人？"',tr:['金发','S级猎人','白虎公会','会长','导师','最强'],nk:['Yun-Ho Baek','白允浩','白叔叔'],v:[['暂未收录','']]}],
[136073,{n:'宋致烈',a:'我独自升级',img:'https://s4.anilist.co/file/anilistcdn/character/large/b136073-0hZNgsWB9ZLH.png',dsc:'韩国S级猎人——用火焰魔法战斗的大叔。性格豪放不羁但对后辈极为照顾。在与蚂蚁王的大战中牺牲自己为秦禹争取了关键的时间。他的死是秦禹成长中最沉重的一课。',tr:['红发','S级猎人','火焰','豪放','牺牲','大叔'],nk:['Chi-Yul Song','宋致烈'],v:[['暂未收录','']]}],
[323589,{n:'姜正浩',a:'我独自升级',img:'https://s4.anilist.co/file/anilistcdn/character/large/b323589-70NC1HRi6BKa.png',dsc:'韩国A级猎人——使用盾牌的防御型战士。最初看不起秦禹但在看到他的成长后成为了他最坚定的盟友之一。',tr:['棕发','A级猎人','盾牌','防御','盟友'],nk:['Jeong-Ho Kang','姜正浩'],v:[['暂未收录','']]}],

// ====== BLUE GIANT (3) ======
[142505,{n:'宫本大',a:'BLUE GIANT',img:'https://s4.anilist.co/file/anilistcdn/character/large/b142505-TJVBXimS9100.png',dsc:'拿起萨克斯那一刻就决定了——成为世界第一爵士乐手。从仙台独自来到东京的18岁少年。每天在河边从黄昏吹到深夜，吹到满手是血也不停。他的萨克斯声把所有人都卷入了他那蓝色的巨大梦想中。"我要用这把萨克斯——吹出整个世界的声音。"',tr:['黑发','萨克斯','爵士','世界第一','热血','少年','每天练习10小时'],nk:['Dai Miyamoto','宫本大','Dai'],v:[['暂未收录','']]}],
[262535,{n:'玉田俊二',a:'BLUE GIANT',img:'https://s4.anilist.co/file/anilistcdn/character/large/b262535-cpHvSGIQtnIv.jpg',dsc:'被大的萨克斯震撼后从零开始学鼓的青年。最初连节奏都打不稳但在大的感染下把全部生命投入了爵士乐。是大最初的伙伴和鼓手。"我的人生从遇到大那一刻才真正开始。"',tr:['黑发','鼓手','自学','被大感染','伙伴','热血'],nk:['Shunji Tamada','玉田俊二','Tamada'],v:[['暂未收录','']]}],
[262536,{n:'泽边雪祈',a:'BLUE GIANT',img:'https://s4.anilist.co/file/anilistcdn/character/large/b262536-KrTw9Doavh10.png',dsc:'出身音乐世家的天才钢琴手——从小在古典音乐中长大。第一次听到大的萨克斯后毅然决然转投爵士。古典的精准遇上爵士的自由——他的转变是三人乐队完整的关键。',tr:['黑发','钢琴','古典出身','转投爵士','天才','精准'],nk:['Yukinori Sawabe','泽边雪祈','Sawabe'],v:[['暂未收录','']]}],

// ====== 不死少女的谋杀 (2) ======
[301052,{n:'轮堂鸦夜',a:'不死少女的谋杀',img:'https://s4.anilist.co/file/anilistcdn/character/large/b301052-dCPTkqyRenCn.png',dsc:'被斩首的不死侦探——只剩一颗头装在鸟笼里被真打津轻提着走。19世纪末的欧洲，她用超常的推理和"不死"身份调查着各种离奇的怪物杀人事件。性格毒舌傲娇但推理天才。目标是找到夺走她身体的那个人。',tr:['金发','只剩头','不死','侦探','鸟笼','毒舌','推理天才'],nk:['Aya Rindou','轮堂鸦夜','Aya','鴉夜'],v:[['暂未收录','']]}],
[301053,{n:'真打津轻',a:'不死少女的谋杀',img:'https://s4.anilist.co/file/anilistcdn/character/large/b301053-cBSSf5rlEO5B.jpg',dsc:'拎着鸦夜头笼的半人半鬼青年——被称为"鬼杀"。用超人的战斗能力解决鸦夜推理不来的"物理问题"。口头禅是"真是麻烦死了"——但他的拳头从不嫌麻烦。与鸦夜是最佳搭档。',tr:['黑发','半鬼','战斗','拎鸟笼','搭档','麻烦死了'],nk:['Tsugaru Shinuchi','真打津轻','Tsugaru'],v:[['暂未收录','']]}],

// ====== 香格里拉·弗陇提亚 (3) ======
[271367,{n:'阳务乐郎',a:'香格里拉·弗陇提亚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b271367-RM6DwXf1D0gu.png',dsc:'通关了所有"垃圾游戏"的超级玩家——游戏ID"桑乐"。对神作VRMMO"香格里拉·弗陇提亚"发起了挑战。但他的玩法是——不穿任何防具、只拿双匕首、把所有技能点都加到速度和运气上。在这个所有人都追求最强装备的世界里他用最荒谬的方式打赢每一场Boss战。',tr:['白发','双匕首','垃圾游戏爱好者','速通','裸装','搞笑','战斗天才'],nk:['Rakurou Hizutome','阳务乐郎','Sunraku','桑乐'],v:[['暂未收录','']]}],
[312746,{n:'亚妮玛丽亚',a:'香格里拉·弗陇提亚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b312746-0oPN8PHs7FQM.png',dsc:'香格里拉·弗陇提亚中最强的玩家之一——兽人族的猫耳剑士。被桑乐的裸装打法震惊到无法言语——然后成为了他最忠实的"吐槽者"和战友。"你到底有没有常识啊？！"' ,tr:['猫耳','兽人','剑士','吐槽','最强玩家','战友'],nk:['Animalia','亚妮玛丽亚'],v:[['暂未收录','']]}],
[313382,{n:'阳务瑠美',a:'香格里拉·弗陇提亚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b313382-YtE6gJqqQfNT.png',dsc:'乐郎的妹妹——现实世界中唯一的亲人。对哥哥整天打游戏的生活方式充满了嫌弃但每天还是做好饭等他。其实是游戏攻略网站上粉丝无数的匿名攻略作者。',tr:['棕发','妹妹','料理','攻略作者','嫌弃哥哥','隐藏高手'],nk:['Rumi Hizutome','阳务瑠美'],v:[['暂未收录','']]}],

// ====== 黑暗集会 (3) ======
[139462,{n:'幻灯河萤太郎',a:'黑暗集会',img:'https://s4.anilist.co/file/anilistcdn/character/large/b139462-VicTVjHmpHtA.jpg',dsc:'极其胆小的大学男生——因为童年被恶灵附身的创伤对一切超自然事物恐惧到极点。被学妹夜宵强行拉入"黑暗集会"——陪着她去各种灵异地点冒险。明明怕得要死但为了保护同伴每次都会硬着头皮上。是队伍中最可靠的"普通人"。',tr:['棕发','胆小','大学','被拉下水','保护','普通人的勇气'],nk:['Keitarou Gentouga','幻灯河萤太郎','Keitarou'],v:[['暂未收录','']]}],
[139461,{n:'宝月夜宵',a:'黑暗集会',img:'https://s4.anilist.co/file/anilistcdn/character/large/b139461-AxfBBZMZjwaH.jpg',dsc:'萤太郎的学妹——对恶灵和都市传说有着异常狂热的执念。看似可爱的外表下是对灵异事物的冷静分析和不惜一切也要捕获恶灵的冷酷。收集恶灵的目的是为了找到当年杀害母亲的诅咒之灵然后亲手毁灭它。',tr:['黑发','学妹','灵异狂热','捕获恶灵','复仇','冷静','可爱外表'],nk:['Yayoi Houzuki','宝月夜宵','Yayoi'],v:[['暂未收录','']]}],
[139463,{n:'宝月咏子',a:'黑暗集会',img:'https://s4.anilist.co/file/anilistcdn/character/large/b139463-dwhPQsBaAZw5.jpg',dsc:'夜宵的姐姐——拥有强大灵力的巫女。在妹妹捕获恶灵的过程中提供灵力的支持和防护。性格温柔稳重是团队中最令人安心的存在。',tr:['黑发','巫女','灵力','温柔','姐姐','防护'],nk:['Eiko Houzuki','宝月咏子'],v:[['暂未收录','']]}],

// ====== 彻夜之歌 (3) ======
[168774,{n:'七草荠',a:'彻夜之歌',img:'https://s4.anilist.co/file/anilistcdn/character/large/b168774-zoB9InjmXYq2.png',dsc:'深夜在自动贩卖机旁遇到的吸血鬼少女——给了失眠的少年一个吻让他变成了吸血鬼的眷属。她用最慵懒的方式教会了他夜晚的乐趣。在城市的夜色中飞翔的他第一次觉得——"睡不着真是太好了"。但成为真正吸血鬼的代价是什么——她始终没有告诉他。',tr:['金发','吸血鬼','夜晚','慵懒','吻','自动贩卖机','自由'],nk:['Nazuna Nanakusa','七草荠','Nazuna','ナズナ'],v:[['暂未收录','']]}],
[168866,{n:'夜守光',a:'彻夜之歌',img:'https://s4.anilist.co/file/anilistcdn/character/large/b168866-zf5bb7rmZpxX.png',dsc:'14岁的失眠少年——对学校和生活都失去了兴趣。每次深夜独自游荡在无人的街头。被吸血鬼少女荠吻了后获得了飞行的能力但必须在一年内爱上荠才能真正变成吸血鬼——否则就会死。在夜色中他第一次找到了活着的实感。',tr:['黑发','14岁','失眠','被吸血鬼吻','飞行','寻找活着的意义'],nk:['Kou Yamori','夜守光','Kou','コウ'],v:[['暂未收录','']]}],
[269129,{n:'关真昼',a:'彻夜之歌',img:'https://s4.anilist.co/file/anilistcdn/character/large/b269129-nHJXFp7HDZBg.png',dsc:'另一个吸血鬼眷属——与光和荠在夜晚的城市中相遇的神秘少年。已经死过一次的他比光更了解"成为吸血鬼"的真正含义。是光在夜晚世界中的引导者也是警告者。',tr:['黑发','吸血鬼眷属','神秘','已死','引导者'],nk:['Mahiru Seki','关真昼','Mahiru'],v:[['暂未收录','']]}],

// ====== 东京复仇者 (5) ======
[145342,{n:'花垣武道',a:'东京复仇者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b145342-GSUutL83jGgI.png',dsc:'26岁的人生失败者——在新闻上看到中学时的前女友被东京卍会杀害。跳下月台却回到了12年前。从此开启了不断穿越回过去拯救所有人的旅程。每次回到过去都哭着跪求Mikey——"不要死了！"他是所有穿越系主角中最弱的——也是哭得最多但永远不会放弃的。',tr:['金发','穿越','无能','不放弃','哭泣','拯救','Mikey'],nk:['Takemichi Hanagaki','花垣武道','Takemichi','タケミチ'],v:[['暂未收录','']]}],
[145341,{n:'佐野万次郎',a:'东京复仇者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b145341-CuPldCLZMvvf.png',dsc:'东京卍会的总长——Mikey。身材娇小的金发少年拥有怪物级别的战斗力。标志性的"笑容"背后是从小失去所有至亲的孤独。被武道一次次穿越回来救他但命运似乎总在把他推向黑暗。"武道——你是我的英雄。"',tr:['金发','娇小','Mikey','最强','东京卍会','孤独','崩塌'],nk:['Manjirou Sano','佐野万次郎','Mikey','マイキー'],v:[['暂未收录','']]}],
[145345,{n:'龙宫寺坚',a:'东京复仇者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b145345-zyirrSsKIDCb.png',dsc:'东京卍会的副总长——Draken。身高185cm的巨型少年是Mikey最信任的左右手。背后有一条从脖子到腰的龙纹身。虽然外表凶恶但内心比谁都温柔。是武道穿越后最先成为朋友的人。"在这里——只要有我在谁都不能欺负你。"',tr:['金发','185cm','Draken','龙纹身','副总长','温柔巨人'],nk:['Ken Ryuuguji','龙宫寺坚','Draken','ドラケン'],v:[['暂未收录','']]}],
[145343,{n:'场地圭介',a:'东京复仇者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b145343-vRrkdWEUXwYM.jpg',dsc:'东京卍会一番队队长——Baji。Mikey从小的伙伴。用暴力保护着所有他想保护的东西——哪怕是背叛东京卍会。他用自己的方式把所有事情扛在一个人身上直到最后。在废车场的那一战是东京复仇者中最震撼的画面。',tr:['黑发','虎牙','Baji','一番队','牺牲','废车场'],nk:['Keisuke Baji','场地圭介','Baji','バジ'],v:[['暂未收录','']]}],
[170483,{n:'稀咲铁太',a:'东京复仇者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b170483-mXcSRDNqVwCP.png',dsc:'东京复仇者最核心的反派——拥有与武道同样的穿越能力。一次次从未来穿回过去修改历史。他操纵着东京卍会从背后把所有人推向毁灭。与武道是宿命中的对立者——一个人为了拯救一个人为了支配。',tr:['黑发','反派','穿越','操纵','宿敌','幕后黑手'],nk:['Tetta Kisaki','稀咲铁太','Kisaki','キサキ'],v:[['暂未收录','']]}],

// ====== 黄金神威 (5) ======
[124704,{n:'杉元佐一',a:'黄金神威',img:'https://s4.anilist.co/file/anilistcdn/character/large/b124704-bndQyaj7X9dv.png',dsc:'日俄战争的退伍兵——"不死身的杉元"。在战场上用肉身硬扛子弹炮弹活下来的男人。为了给死去战友的遗孀筹钱治病而踏上寻找阿伊努黄金的旅途。战斗力和生存能力无人能敌。但最令人难忘的是——他在和一只熊抢鱼的时候被甩飞的画面。"我可是不死身的杉元啊——"然后爬起来继续打。',tr:['黑发','不死身','退伍兵','黄金猎人','战斗','搞笑','阿伊努'],nk:['Saichi Sugimoto','杉元佐一','Sugimoto','不死身の杉元'],v:[['暂未收录','']]}],
[124701,{n:'阿希莉帕',a:'黄金神威',img:'https://s4.anilist.co/file/anilistcdn/character/large/b124701-PecnElfoJlP1.png',dsc:'阿伊努族少女——与杉元结盟寻找被偷走的黄金。精通阿伊努族的狩猎和生存技能。教杉元各种他闻所未闻的荒野知识。口头禅是"品那品那"和看到美食时眼睛发光的小表情。外表是可爱少女但一枪能打死一头熊。"杉元——这个是西他卡——好吃的意思。"',tr:['黑发','阿伊努','猎人','少女','生存','品那','可爱'],nk:['Asirpa','阿希莉帕','アシㇼパ'],v:[['暂未收录','']]}],
[125442,{n:'鹤见中尉',a:'黄金神威',img:'https://s4.anilist.co/file/anilistcdn/character/large/b125442-m8IVnzFOZOTS.png',dsc:'陆军第七师团的情报官——脑袋上一块金属板是为了纪念被炮弹炸掉的头骨。微笑的外表下是最危险的男人。任何人都可能被他策反——包括你最信任的同伴。为了黄金不择手段但同时又对部下有着真实的感情。是整个黄金争夺战中最复杂也最吸引人的角色。',tr:['军服','金属头盖','情报官','微笑','危险','复杂'],nk:['Tokushirou Tsurumi','鹤见中尉','鶴見'],v:[['暂未收录','']]}],
[124699,{n:'白石由竹',a:'黄金神威',img:'https://s4.anilist.co/file/anilistcdn/character/large/b124699-dcZaqPHKkT8D.png',dsc:'"越狱王"白石——从任何监狱都能逃脱的天才。全身上下刻满了逃狱用的地图纹身。性格狡猾搞笑但又非常重视伙伴。总是在最危急的时刻用最意想不到的方式出场救人。口头禅是"我可是越狱王！"但他越狱的姿势永远是最滑稽的。',tr:['棕发','越狱','地图纹身','搞笑','狡猾','可靠'],nk:['Yoshitake Shiraishi','白石由竹','白石'],v:[['暂未收录','']]}],
[129247,{n:'基罗兰克',a:'黄金神威',img:'https://s4.anilist.co/file/anilistcdn/character/large/b129247-0UERXeEojRPd.png',dsc:'阿希莉帕的叔叔——阿伊努族的猎人和革命者。在黄金争夺战中扮演着关键角色。对阿希莉帕既是保护者也是引导者。',tr:['阿伊努','猎人','叔叔','革命','引导者'],nk:['Kiroranke','基罗兰克','キロランケ'],v:[['暂未收录','']]}],

// ====== 黑之契约者 (3) ======
[2160,{n:'黑',a:'黑之契约者',img:'https://s4.anilist.co/file/anilistcdn/character/large/n2160-CbHDsANTwxg2.jpg',dsc:'代号"BK-201"——被称为"黑色死神"的契约者。平时伪装成中国留学生"李舜生"。契约能力是放电但代价是要暴饮暴食把食物塞满整个脸。戴着白色面具用钢丝战斗的身姿是动画史上最酷的画面之一。为了寻找失踪的妹妹而接下各种暗杀任务。"我是契约者——没有感情的工具。"——他每次说这句话都是在对自己撒谎。',tr:['黑发','契约者','放电','白色面具','李舜生','黑色死神','妹妹'],nk:['Hei','黑','黒','BK-201','李舜生'],v:[['暂未收录','']]}],
[2163,{n:'银',a:'黑之契约者',img:'https://s4.anilist.co/file/anilistcdn/character/large/n2163-nA1EMwU7E5oJ.png',dsc:'黑的搭档——银色长发的盲眼少女。契约能力是通过水来"观测"周围的一切——所以她并不需要眼睛。安静、温柔又神秘。在黑暗中陪伴着黑度过了每一个任务。是黑唯一信任的人也是他唯一不能失去的人。',tr:['银发','盲眼','观测','水','搭档','温柔','安静'],nk:['Yin','银','イン'],v:[['暂未收录','']]}],
[2166,{n:'雾原未咲',a:'黑之契约者',img:'https://s4.anilist.co/file/anilistcdn/character/large/n2166-WXRpwEz7S55P.png',dsc:'警视厅公安部外事四课的刑警——负责追查契约者。一直在追捕BK-201却不知道她所追查的"他"就是她生活中认识的某个人。正义感极强的警界女强人。在契约者与人类的冲突中试图找到第三条出路。',tr:['黑发','刑警','正义','追捕','干练'],nk:['Misaki Kirihara','雾原未咲','Misaki'],v:[['暂未收录','']]}],

// ====== 加速世界 (4) ======
[49637,{n:'有田春雪',a:'加速世界',img:'https://s4.anilist.co/file/anilistcdn/character/large/b49637-GlkoT7x40TAV.png',dsc:'校内被霸凌的矮胖少年——在虚拟世界中是最快的"Silver Crow"。被全校最美的学姐黑雪姬带入加速世界。在加速世界中他第一次感受到了真实的速度和自由。从最底层爬起来的少年在他的银色翅膀上铭刻了所有人的期望。"加速——到更快的世界去。"',tr:['棕发','矮胖','被霸凌','Silver Crow','银翼','加速','成长'],nk:['Haruyuki Arita','有田春雪','Haruyuki','ハルユキ'],v:[['暂未收录','']]}],
[46305,{n:'黑雪姬',a:'加速世界',img:'https://s4.anilist.co/file/anilistcdn/character/large/b46305-CiZOEqz5u1mk.png',dsc:'梅乡中学的学生会副会长——全校最美的黑长直少女。游戏ID"Black Lotus"——加速世界最强的Burst Linker之一。亲手将春雪带入加速世界。被纯色七王追杀的原因——她斩下了初代红之王的首级。"春雪——你愿意和我一起飞到更远的地方吗？"',tr:['黑发','长直','Black Lotus','副会长','最强','被追杀'],nk:['Kuroyukihime','黑雪姬','黒雪姫'],v:[['暂未收录','']]}],
[49635,{n:'仓岛千百合',a:'加速世界',img:'https://s4.anilist.co/file/anilistcdn/character/large/b49635-lDQ1nWr4gBRX.png',dsc:'春雪的青梅竹马——运动万能的开朗少女。被春雪和拓武同时暗恋的修罗场中心。知道加速世界后为了理解春雪而成为了Burst Linker。"Lime Bell"——用时间倒流的治愈能力守护着两个人。',tr:['棕发','青梅竹马','Lime Bell','治愈','修罗场','守护'],nk:['Chiyuri Kurashima','仓岛千百合','Chiyuri'],v:[['暂未收录','']]}],
[49631,{n:'黛拓武',a:'加速世界',img:'https://s4.anilist.co/file/anilistcdn/character/large/49631.jpg',dsc:'春雪从小到大的好友——剑道部的王牌。游戏ID"Cyan Pile"。同时喜欢着千百合。最初因嫉妒春雪而成为敌人后来是春雪最强有力的战友。用蓝色长枪穿刺敌人——守护他最重要的两个人。',tr:['黑发','剑道','Cyan Pile','嫉妒','朋友','蓝色长枪'],nk:['Takumu Mayuzumi','黛拓武','Takumu'],v:[['暂未收录','']]}],

// ====== 恶魔奶爸 (3) ======
[20766,{n:'男鹿辰巳',a:'恶魔奶爸',img:'https://s4.anilist.co/file/anilistcdn/character/large/b20766-cNWY0sMyC7fI.png',dsc:'石矢魔高中最强的不良少年——"暴君男鹿"。某天漂在河上的大叔裂开后蹦出了一个小婴儿——未来的魔王"小贝鲁"。从此开始了一边打架一边带娃的校园生活。每次打架小贝鲁的哭声就是最强的武器——因为他一哭男鹿就会被电到飞起来。"别哭了贝鲁！我这就去把他们全干掉！"',tr:['黑发','不良','最强','带娃','魔王','搞笑','打架'],nk:['Tatsumi Oga','男鹿辰巳','Oga','男鹿'],v:[['暂未收录','']]}],
[21153,{n:'希尔德加露达',a:'恶魔奶爸',img:'https://s4.anilist.co/file/anilistcdn/character/large/b21153-3WD7pJ03JtcW.png',dsc:'魔界最强的女仆——小贝鲁的贴身护卫。穿着哥特式女仆装的金发美女。一人可以单挑整个石矢魔高中。对任何对小贝鲁不利的人都会毫不留情地消灭。虽然一脸冷漠但在照顾贝鲁这件事上与男鹿配合得天衣无缝。',tr:['金发','女仆','魔界','最强','冷酷','护卫','哥特'],nk:['Hildegard','希尔德加露达','ヒルダ'],v:[['暂未收录','']]}],
[20769,{n:'古市贵之',a:'恶魔奶爸',img:'https://s4.anilist.co/file/anilistcdn/character/large/b20769-F1BzwqnB8RYo.png',dsc:'男鹿唯一的朋友和吐槽担当——全剧最惨的角色。没有战斗力没有女主角光环只有一个幻想被美女包围的大脑袋。每次被卷入男鹿和恶魔的事件中都会被炸飞然后一边逃跑一边大声吐槽。但男鹿打架时他永远在场边喊加油。"男鹿——你这混蛋又给我惹麻烦了！"' ,tr:['金发','吐槽','朋友','逃跑','搞笑','倒霉'],nk:['Takayuki Furuichi','古市贵之','Furuichi'],v:[['暂未收录','']]}],

// ====== 黑岩射手 (2) ======
[19706,{n:'黑岩射手',a:'黑岩射手',img:'https://s4.anilist.co/file/anilistcdn/character/large/b19706-ztCMK3WkgJtc.jpg',dsc:'左眼燃烧着蓝色火焰的战斗少女——在异世界中代表现实少女们的痛苦和战斗而存在。手持巨大的黑色枪刃Black Blade与Dead Master等对手激战。每一场战斗都是现实中少女内心挣扎的映射。外表冷酷但在最简单的互动中流露出的温柔令人心碎。',tr:['黑发','蓝焰','枪刃','战斗少女','冷酷','异世界','情感映射'],nk:['Black Rock Shooter','黑岩射手','BRS','ブラック★ロックシューター'],v:[['暂未收录','']]}],
[25034,{n:'Dead Master',a:'黑岩射手',img:'https://s4.anilist.co/file/anilistcdn/character/large/25034.jpg',dsc:'黑岩射手最经典的对手——绿发骷髅角饰的战斗少女。使用巨型镰刀和骷髅兵团战斗。代表现实世界中少女被霸凌封闭内心后产生的黑暗面。她与黑岩射手的战斗是整个系列最震撼的画面。',tr:['绿发','骷髅角','镰刀','黑暗面','霸凌','宿敌'],nk:['Dead Master','デッドマスター'],v:[['暂未收录','']]}],

// ====== 亚人 (3) ======
[89797,{n:'佐藤',a:'亚人',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89797-7FYeQEmgLdcj.png',dsc:'最危险的反派——不死之身的亚人。把游戏作为人生唯一的乐趣。用最残忍的方式测试亚人的不死极限。白发眼镜老者的微笑背后是最疯狂的战斗天才。',tr:['白发','眼镜','亚人','不死','疯狂','游戏','反派','恐怖'],nk:['Satou','佐藤','サトウ'],v:[['暂未收录','']]}],
[120726,{n:'永井圭',a:'亚人',img:'https://s4.anilist.co/file/anilistcdn/character/large/b120726-lQIFUPMKBLb7.png',dsc:'在放学路上被车撞死后复活的少年——发现自己是一个"亚人"。从此被政府当作实验对象追捕。召唤出黑色幽灵"IBM"战斗。极度理性的他拒绝成为佐藤那样的疯子但也拒绝成为政府的实验品。在逃亡和反击中寻找着属于自己的道路。',tr:['黑发','亚人','不死','理性','IBM','逃亡','学生'],nk:['Kei Nagai','永井圭','Nagai','ナガイ'],v:[['暂未收录','']]}],
[122294,{n:'户崎优',a:'亚人',img:'https://s4.anilist.co/file/anilistcdn/character/large/b122294-m0z7G4egVPaa.png',dsc:'厚生劳动省亚人管理委员会的负责人——追捕亚人的冷血官员。为了控制永井圭而不择手段。但在与佐藤的对抗中展现出了超越职责的人性。他的每一步棋都在佐藤的计算之中——直到最后他也开始作弊。',tr:['黑发','官员','追捕','冷酷','人性','策略'],nk:['Yuu Tosaki','户崎优'],v:[['暂未收录','']]}],
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
