import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const d=[
  // ====== 死神 (5) ======
  [5,{n:'黑崎一护',a:'死神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b5-a7bkJgjhhigE.png',dsc:'代理死神——被露琪亚的斩魄刀刺穿后获得了死神之力。橘色头发的15岁高中生。拥有虚、死神、灭却师的混合血统。卍解·天锁斩月是动漫史上最经典的变身之一。为了保护身边的人他可以砍翻尸魂界。口头禅是"我要保护——"从来不说保护谁因为太多了数不过来。',tr:['橘发','死神','斩魄刀','卍解','天锁斩月','虚化','灭却师血统','代理死神','高中生'],nk:['Ichigo Kurosaki','黑崎一护','Ichigo','一护'],v:[['森田成一','']]}],
  [6,{n:'朽木露琪亚',a:'死神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b6-25WoBeWMZXBc.png',dsc:'尸魂界四大贵族朽木家的养女，护廷十三番队副队长。将死神之力借给一护后彻底改变了两人的命运。斩魄刀·袖白雪——尸魂界最美的斩魄刀。外表娇小但气场强大。与一护是跨越生死的搭档关系。"我并不是因为你是死神才救你——而是因为你是你。"',tr:['黑发','死神','朽木家','袖白雪','副队长','娇小','一护搭档'],nk:['Rukia Kuchiki','朽木露琪亚','Rukia','露琪亚'],v:[['折笠富美子','']]}],
  [7,{n:'井上织姬',a:'死神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b7-JdR4betokDjR.jpg',dsc:'一护的同班同学和好友。拥有"盾舜六花"——拒绝神的力量，可以否定现象进行治愈和防御。温柔的治愈系少女。对一护默默喜欢。她的"拒绝神之力"是整场千年血战中扭转战局的关键——"我拒绝"。',tr:['橘发','盾舜六花','治愈','拒绝神','温柔','暗恋一护'],nk:['Orihime Inoue','井上织姬','Orihime'],v:[['松冈由贵','']]}],
  [906,{n:'阿散井恋次',a:'死神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b906-ImRjx5HFM8X6.png',dsc:'护廷六番队副队长，露琪亚的青梅竹马。特征是满身刺青和红发。斩魄刀·蛇尾丸——咆哮吧！为了追上朽木白哉而不断修行变强。性格热血莽撞但极其忠诚。在尸魂界篇一护的宿命对手——后来成为最可靠的战友。"我跪下了——求你救她。"',tr:['红发','刺青','死神','蛇尾丸','副队长','露琪亚青梅竹马','热血'],nk:['Renji Abarai','阿散井恋次','Renji','恋次'],v:[['伊藤健太郎','']]}],
  [575,{n:'茶渡泰虎',a:'死神',img:'https://s4.anilist.co/file/anilistcdn/character/large/575.jpg',dsc:'一护最好的朋友——沉默的巨人。墨西哥与日本混血，身材魁梧但心地善良。力量是"巨人的右臂"和"恶魔的左臂"——来自完现术的力量。最早发现一护变化并支持他的人。那句"我会成为你的盾牌"是说给一护的承诺。',tr:['黑发','混血','巨人','完现术','恶魔之手','坚强','沉默','一护最好的朋友'],nk:['Yasutora Sado','茶渡泰虎','Chad'],v:[['暂未收录','']]}],

  // ====== 七大罪 (4) ======
  [86683,{n:'霍克',a:'七大罪',img:'https://s4.anilist.co/file/anilistcdn/character/large/n86683-ZXPoLZnKqNtx.png',dsc:'会说话的粉红猪——七大罪的吉祥物和剩饭处理机。总是被梅利奥达斯当球踢但每次都骂骂咧咧地回来。自称"混沌之母的儿子"——这身份后来居然是真的。全剧最佳吐槽担当。',tr:['粉色','猪','会说话','吉祥物','吐槽','剩饭处理','混沌之子'],nk:['Hawk','霍克','ホーク'],v:[['暂未收录','']]}],
  [86681,{n:'伊莱恩',a:'七大罪',img:'https://s4.anilist.co/file/anilistcdn/character/large/86681-6kx3mfwNhraK.png',dsc:'妖精族的守护圣人，金的妹妹。在保护妖精王之森时牺牲。后被班用自己的部分不死之身复活。与班跨越生死的感情是七大罪中最催泪的CP之一。娇小温柔但内心极为坚强。',tr:['金发','妖精族','圣人','牺牲','复活','班恋人','温柔'],nk:['Elaine','伊莱恩','エレイン'],v:[['暂未收录','']]}],

  // ====== 暗杀教室 (4) ======
  [65643,{n:'杀老师',a:'暗杀教室',img:'https://s4.anilist.co/file/anilistcdn/character/large/b65643-jimrOw0RGtoB.png',dsc:'椚丘中学三年E班的班主任——同时也是炸掉了月球的超生物。以20马赫的速度移动。给学生一年时间暗杀他——成功者可获100亿日元。而在这一年中他用最温暖的"暗杀教学"改变了每个学生的命运。章鱼头、黄色皮肤、永远的微笑。"为师的最后一课——请你们笑着送我走。"',tr:['黄色','章鱼','20马赫','超生物','班主任','暗杀','100亿','最温暖的老师'],nk:['Koro-sensei','杀老师','殺せんせー'],v:[['福山润','']]}],
  [65645,{n:'潮田渚',a:'暗杀教室',img:'https://s4.anilist.co/file/anilistcdn/character/large/b65645-nWH4mBMW5lYw.png',dsc:'三年E班最不起眼的蓝发少年——但天生拥有职业暗杀者的才能。"对人暗杀"的杀气能让杀老师都感到恐惧。记录所有关于杀老师的弱点——是最有可能成功完成暗杀的学生。对自己的性别认同有微妙的困惑。' ,tr:['蓝发','双马尾','暗杀天赋','杀意','记录','性别困惑','E班王牌'],nk:['Nagisa Shiota','潮田渚','Nagisa'],v:[['暂未收录','']]}],

  // ====== 齐木楠雄的灾难 (3) ======
  [90107,{n:'齐木楠雄',a:'齐木楠雄的灾难',img:'https://s4.anilist.co/file/anilistcdn/character/large/b90107-ZULW5HlPX1uU.png',dsc:'拥有所有超能力的高中生——心灵感应、瞬间移动、念动力、时间回溯……他想过的是普通的生活所以每天用各种方式隐藏自己的能力。粉发绿眼镜是为了抑制石化能力。口头禅是"呀嘞呀嘞"。最爱吃咖啡果冻。他的烦恼是——"身边的人全都有问题"。',tr:['粉发','眼镜','超能力者','心灵感应','咖啡果冻','呀嘞呀嘞','想当普通人'],nk:['Kusuo Saiki','齐木楠雄','Saiki','斉木楠雄'],v:[['神谷浩史','']]}],
  [90108,{n:'燃堂力',a:'齐木楠雄的灾难',img:'https://s4.anilist.co/file/anilistcdn/character/large/b90108-BJYQbUaMLS7G.png',dsc:'齐木的同学——头脑简单四肢发达。唯一能免疫齐木心灵感应的人——因为他脑子里什么想法都没有所以无话可读。每天强行搭齐木的肩说"我们一起去吃拉面吧！"。齐木最头疼的人但慢慢也变成了他最好的朋友。',tr:['光头','肌肉','白痴','零思想','拉面','齐木的朋友'],nk:['Riki Nendou','燃堂力','Nendou'],v:[['暂未收录','']]}],
  [90109,{n:'照桥心美',a:'齐木楠雄的灾难',img:'https://s4.anilist.co/file/anilistcdn/character/large/b90109-hr98ksrKzMOe.png',dsc:'完美的美少女——这是全世界的共识。无论走到哪里都会被众人围观仰慕。唯一不被她迷惑的人是齐木楠雄——这让她无法接受并决心让他说出"哦呼"。内心吐槽之魂不亚于齐木本人。' ,tr:['蓝发','美少女','完美','被所有人喜欢','对齐木执着','哦呼'],nk:['Kokomi Teruhashi','照桥心美','Teruhashi'],v:[['暂未收录','']]}],

  // ====== 寒蝉鸣泣之时 (4) ======
  [1851,{n:'前原圭一',a:'寒蝉鸣泣之时',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1851-stMK6YF2jvhS.png',dsc:'搬到雏见泽的少年——在无尽的六月轮回中不断被杀害也成为杀害者。每一篇故事中他的命运都会以不同的方式走向地狱——但在某一条世界线中他带领所有人打破了诅咒。"不要放弃——奇迹一定会发生。"' ,tr:['棕发','转学生','轮回','悲剧','打破命运','希望'],nk:['Keiichi Maebara','前原圭一','K1'],v:[['暂未收录','']]}],
  [1612,{n:'北条沙都子',a:'寒蝉鸣泣之时',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1612-lL5sulSea1fZ.png',dsc:'雏见泽的小学生——喜欢用陷阱恶作剧整蛊所有人。被叔父虐待的过去让她变得极端依赖梨花。在寒蝉鸣泣之时业的真相中展现出了令人恐惧的爱与疯狂。"只要能和梨花在一起——我愿意无限轮回。"',tr:['金发','小学生','陷阱大师','被虐待','依赖','疯狂','轮回'],nk:['Satoko Houjou','北条沙都子','Satoko'],v:[['暂未收录','']]}],
  [1534,{n:'古手梨花',a:'寒蝉鸣泣之时',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1534-CtOvaSPOMZne.png',dsc:'雏见泽古手神社的巫女——被诅咒的六月已经轮回了超过百年。在不同世界线中一次又一次被残忍杀害的受害者。在寒蝉鸣泣之时业中做出了令所有人震惊的选择。"我已经累了——让我结束这一切吧。"',tr:['蓝发','巫女','百年轮回','悲剧','被诅咒','黑化'],nk:['Rika Furude','古手梨花','Rika'],v:[['暂未收录','']]}],
  [1313,{n:'园崎诗音',a:'寒蝉鸣泣之时',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1313-wLhW5uDxdhqA.png',dsc:'园崎家次女，魅音的孪生妹妹。从小被家族隔离在寄宿学校——对姐姐和家族的仇恨在某些世界线中化为疯狂的杀戮冲动。"我已经回不去了"——在绝望崩坏中拿起电击枪和匕首的少女。' ,tr:['绿发','双胞胎','被囚禁','黑化','电击枪','复仇'],nk:['Shion Sonozaki','园崎诗音','Shion'],v:[['暂未收录','']]}],

  // ====== 未闻花名 (5) ======
  [40591,{n:'宿海仁太',a:'未闻花名',img:'https://s4.anilist.co/file/anilistcdn/character/large/b40591-PFcHVI98QgnI.jpg',dsc:'曾经的"超和平Busters"领袖——如今是辍学的家里蹲。从十年前面码意外去世后就封闭了自己。直到那个夏天——面码以幽灵形态回来了。为了帮面码实现愿望让分散的伙伴们重新聚在一起。最后那场山坡上的告白让全日本都哭了。' ,tr:['黑发','家里蹲','前领袖','面码幽灵','成长','最后的告别'],nk:['Jinta Yadomi','宿海仁太','Jintan','仁太'],v:[['暂未收录','']]}],
  [40592,{n:'本间芽衣子',a:'未闻花名',img:'https://s4.anilist.co/file/anilistcdn/character/large/b40592-mAEyaQyJu5oc.png',dsc:'——面码。十年前溺亡的少女。在十年后的夏天以幽灵形态出现在仁太面前。白色连衣裙的银发少女。她有一个"愿望"需要仁太完成——但她自己也不知道那是什么。直到最后她在山坡上用粉笔在所有人的手心写下了——"最喜欢你们了"。那首secret base和那些眼泪成了整整一代人的青春记忆。' ,tr:['银发','幽灵','白色连衣裙','愿望','最喜欢你们','secret base','面码'],nk:['Meiko Honma','本间芽衣子','Menma','面码'],v:[['暂未收录','']]}],
  [40593,{n:'安城鸣子',a:'未闻花名',img:'https://s4.anilist.co/file/anilistcdn/character/large/b40593-3N05kRft0s8d.jpg',dsc:'曾经崇拜面码的双马尾少女。十年后变成了染发浓妆的"不良少女"。面码的死让她一直内疚——因为那天她也在场。在所有人中最先相信面码的幽灵存在。对仁太暗恋多年却被面码占据了所有位置。',tr:['金发','双马尾','不良','内疚','暗恋仁太','相信面码'],nk:['Naruko Anjou','安城鸣子','Anaru'],v:[['暂未收录','']]}],
  [40594,{n:'松雪集',a:'未闻花名',img:'https://s4.anilist.co/file/anilistcdn/character/large/b40594-ZKnNeogrL2K0.jpg',dsc:'超和平Busters中最聪明的成员——十年后是名牌高中的优等生。但也是被面码的死伤害最深的人之一。夜深人静时穿着面码的白色连衣裙在山中乱走——这是他无法说出的思念。对仁太的嫉妒和对面码的执念几乎毁了他自己。' ,tr:['黑发','优等生','面码执念','穿连衣裙','嫉妒','心理创伤'],nk:['Atsumu Matsuyuki','松雪集','Yukiatsu'],v:[['暂未收录','']]}],
  [40595,{n:'鹤见知利子',a:'未闻花名',img:'https://s4.anilist.co/file/anilistcdn/character/large/b40595-WWFvfCf4C8If.jpg',dsc:'超和平Busters中最安静的眼镜少女。十年后依然戴着一副大黑框眼镜。总是默默跟在雪集身后——因为她暗恋他。在所有人中最先看穿了雪集穿连衣裙的真正原因。安静地用她的方式守护着每一个人。' ,tr:['黑发','眼镜','安静','暗恋','守护','洞察'],nk:['Chiriko Tsurumi','鹤见知利子','Tsuruko'],v:[['暂未收录','']]}],

  // ====== 可塑性记忆 (2) ======
  [88753,{n:'艾拉',a:'可塑性记忆',img:'https://s4.anilist.co/file/anilistcdn/character/large/b88753-RO3lBZgzwdJF.jpg',dsc:'SAL终端服务部门的Giftia——即将到使用寿命的机器人少女。与司组成了回收过期Giftia的搭档。从第一次见面就笨拙地记住了司的名字。和司在一起的最后时光——每一天都是最美的回忆。"司——谢谢你。"' ,tr:['银发','Giftia','机器人','寿命将尽','回收搭档','温柔的告别'],nk:['Isla','艾拉','アイラ'],v:[['暂未收录','']]}],
  [88754,{n:'水柿司',a:'可塑性记忆',img:'https://s4.anilist.co/file/anilistcdn/character/large/88754-1r7wmZfbyqKW.png',dsc:'SAL终端服务部门的新人员工——被分配与艾拉组成了回收Giftia的搭档。面对注定会失去的恋人在最后每一天都选择了珍惜和微笑。在摩天轮上的告别——"我会永远记得艾拉。"' ,tr:['黑发','新人','回收员','珍惜当下','摩天轮','永远的约定'],nk:['Tsukasa Mizugaki','水柿司','Tsukasa'],v:[['暂未收录','']]}],

  // ====== ReLIFE (3) ======
  [89425,{n:'海崎新太',a:'ReLIFE',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89425-vLPRybM1gNa7.png',dsc:'27岁的无业青年——参加了"ReLIFE"实验回到高中重读一年。外表恢复到17岁回到校园。面对比自己小十岁的同学——他用成年人的温柔和少年人的热情重新度过青春。实验结束后所有关于他的记忆会被消除——但他无法不爱上那个叫日代千鹤的少女。' ,tr:['黑发','27岁','ReLIFE','返老还童','高中','被遗忘','恋爱'],nk:['Arata Kaizaki','海崎新太','Kaizaki'],v:[['暂未收录','']]}],
  [89426,{n:'日代千鹤',a:'ReLIFE',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89426-9VS3dWDKDs4v.jpg',dsc:'ReLIFE实验的另一个被实验者——成绩垫底、社交恐惧的面瘫少女。不会笑——但海崎教会了她。"为了不让这段记忆消失——我一定要把今天的事情记住。"当实验结束时——她选择和他一起面对那不可避免的遗忘。' ,tr:['黑发','面瘫','社交恐惧','被实验者','不会笑','学习','恋爱'],nk:['Chizuru Hishiro','日代千鹤','Hishiro'],v:[['暂未收录','']]}],
  [89428,{n:'小野屋杏',a:'ReLIFE',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89428-8UUfkFTy5jGR.png',dsc:'ReLIFE研究所的职员——在海崎的高中当保健老师监视实验进度。每天笑眯眯地给海崎发实验任务。看似轻浮但对自己的工作极其负责。是最关心海崎和千鹤的实验结果的人。' ,tr:['棕发','保健老师','研究所','监视','开朗','关心'],nk:['An Onoya','小野屋杏','An'],v:[['暂未收录','']]}],

  // ====== 男子高中生的日常 (3) ======
  [50689,{n:'忠邦',a:'男子高中生的日常',img:'https://s4.anilist.co/file/anilistcdn/character/large/n50689-6eQzVvFsHmDI.png',dsc:'真田北高中男校的普通（？）高中生。日常就是和吉竹、秀则在河边发呆讨论各种无聊至极的哲学问题——比如"今天的内裤风好强"。偶尔会在妹妹房间里穿她的衣服被当场逮到。男高三人组中唯一的常识人——但这也意味着他被整得最惨。' ,tr:['黑发','普通','吐槽','男高','河岸边','妹妹衣服'],nk:['Tadakuni','忠邦','タダクニ'],v:[['暂未收录','']]}],
  [50691,{n:'田畑秀则',a:'男子高中生的日常',img:'https://s4.anilist.co/file/anilistcdn/character/large/n50691-e9LBqPgNy6Rk.png',dsc:'真田北高中的眼镜少年——男高三人组的编剧担当。每天编各种奇怪的剧本然后拉着忠邦和吉竹即兴演出。经典场面——"今天的风儿甚是喧嚣"。文艺少女在河对面看书他在风吹草动中摆着最中二的pose。' ,tr:['黑发','眼镜','编剧','中二','文艺','今天的风儿甚是喧嚣'],nk:['Hidenori Tabata','田畑秀则','Hidenori'],v:[['暂未收录','']]}],
  [50693,{n:'田中吉竹',a:'男子高中生的日常',img:'https://s4.anilist.co/file/anilistcdn/character/large/n50693-JuansDyW7i7v.png',dsc:'真田北高中金发的阳光少年。和秀则是吐槽和搞笑的黄金搭档。总是在河岸边发起各种"我们来比赛吧"然后规则全靠胡编。看似最幼稚但偶尔说出的话会让所有人陷入沉思。' ,tr:['金发','阳光','搞笑','比赛','奇思妙想'],nk:['Yoshitake Tanaka','田中吉竹','Yoshitake'],v:[['暂未收录','']]}],

  // ====== 月刊少女野崎君 (3) ======
  [87269,{n:'野崎梅太郎',a:'月刊少女野崎君',img:'https://s4.anilist.co/file/anilistcdn/character/large/87269.jpg',dsc:'身高190cm的高中男生——著名少女漫画家"梦野咲子"。没错他是男的。画少女漫画时为了研究恋爱剧情做出各种令人窒息的操作——比如让暗恋他的佐仓千代骑双人自行车来取材。全剧的气氛毁灭者。当千代鼓起勇气说"我是你的粉丝"他送了她一张亲笔签名。' ,tr:['黑发','190cm','少女漫画家','梦野咲子','迟钝','取材狂魔','气氛毁灭者'],nk:['Umetarou Nozaki','野崎梅太郎','Nozaki'],v:[['暂未收录','']]}],
  [87271,{n:'佐仓千代',a:'月刊少女野崎君',img:'https://s4.anilist.co/file/anilistcdn/character/large/n87271-IccVl2JDURIl.jpg',dsc:'身高仅145cm的娇小少女，暗恋着身高190cm的野崎。每次试图表白——"我是你的粉丝"——"谢谢支持！"（野崎直接给了签名）。于是她成了野崎的涂黑助手兼少女漫画原型。每天在"如何让他明白我的心意"和"算了还是先帮他赶上截稿日期吧"之间反复横跳。' ,tr:['橘发','145cm','矮个子','涂黑助手','暗恋','表白失败专家','蝴蝶结'],nk:['Chiyo Sakura','佐仓千代','Chiyo'],v:[['暂未收录','']]}],
  [87267,{n:'御子柴实琴',a:'月刊少女野崎君',img:'https://s4.anilist.co/file/anilistcdn/character/large/87267.jpg',dsc:'野崎的助手——用花美男的外表说出最帅气的台词，然后立刻害羞到躲在垃圾桶里。他的台词被野崎直接搬进少女漫画——因为"这就是少女漫画男主角该有的反应"。全校女生的暗恋对象——但他本人是个看到女生就会脸红的社恐。' ,tr:['红发','花美男','害羞','垃圾桶','野崎助手','社恐','反差萌'],nk:['Mikoto Mikoshiba','御子柴实琴','Mikorin'],v:[['暂未收录','']]}],

  // ====== 美少女战士 (4) ======
  [2030,{n:'月野兔',a:'美少女战士',img:'https://s4.anilist.co/file/anilistcdn/character/large/b2030-GQvVYPEYkXCy.jpg',dsc:'爱哭爱吃的初二少女——发现自己其实是要为保护地球而战的水手月亮。遇到了黑猫露娜后在月光下变身——"代表月亮消灭你！"。和地场卫（夜礼服假面）的恋爱是所有少女漫画粉丝的童话。口头禅是"我怎么这么倒霉啊！"' ,tr:['金发','双包子头','水手服','月光','少女','魔法少女始祖','变身','代表月亮消灭你'],nk:['Usagi Tsukino','月野兔','Usagi','水手月亮','Sailor Moon'],v:[['三石琴乃','']]}],
  [2366,{n:'水野亚美',a:'美少女战士',img:'https://s4.anilist.co/file/anilistcdn/character/large/b2366-IJmfKZoSYT3N.png',dsc:'智商300的天才美少女——水手水星。使用水之力量战斗。戴眼镜的蓝发少女是队伍中最冷静的智囊。"水星的力量——赐我力量！"——最可靠的战友和美少女战士中成绩最好的成员。' ,tr:['蓝发','短发','天才','IQ300','水手水星','可靠','学霸'],nk:['Ami Mizuno','水野亚美','Ami','水手水星'],v:[['暂未收录','']]}],
  [2825,{n:'木野真琴',a:'美少女战士',img:'https://s4.anilist.co/file/anilistcdn/character/large/b2825-d7HrsHjJgixD.png',dsc:'从别校转来的高挑美少女——水手木星。拥有雷电之力和超强的格斗能力。比同龄人成熟的外表和温柔的内心形成鲜明对比。厨艺和园艺是她的隐藏技能。因为身高而被前男友嫌弃——这成为了她要证明自己的动力。' ,tr:['棕发','高挑','水手木星','雷电','格斗','厨艺','帅气'],nk:['Makoto Kino','木野真琴','Mako','水手木星'],v:[['暂未收录','']]}],
  [5407,{n:'露娜',a:'美少女战士',img:'https://s4.anilist.co/file/anilistcdn/character/large/5407.jpg',dsc:'引导月野兔成为水手月亮的黑猫——月亮王国的守护者。额头上的新月标志是她身份的象征。会用电脑分析敌情——在1990年代这可是超级高科技。所有水手战士的引导者也是她们的家人。"小兔！快变身！"' ,tr:['黑猫','新月','引导者','月亮王国','电脑','可靠'],nk:['Luna','露娜','ルナ'],v:[['暂未收录','']]}],

  // ====== 家庭教师REBORN (4) ======
  [671,{n:'里包恩',a:'家庭教师REBORN',img:'https://s4.anilist.co/file/anilistcdn/character/large/671.jpg',dsc:'世界最强杀手——外表是穿着西装的婴儿。被彭格列九代目派来日本将"废柴阿纲"训练成合格的十代目继承人。用黄色奶嘴和列恩（会变形的变色龙）教导阿纲。方式是——直接开枪。"如果你不反抗就去死吧"——他的每一枪都打出了阿纲的成长。' ,tr:['婴儿','杀手','西装','里包恩','家庭教师','彭格列','列恩','残酷训练'],nk:['Reborn','里包恩','リボーン'],v:[['暂未收录','']]}],
  [1535,{n:'狱寺隼人',a:'家庭教师REBORN',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1535-C3xPsU0krlGb.jpg',dsc:'彭格列十代目的岚之守护者——阿纲最忠诚的右手。银发的意大利裔少年。用炸弹战斗——"怒涛のボム！"最初不认可阿纲但在被打动后成为最忠心的追随者总是叫阿纲"十代目"。"我的命只属于十代目！"' ,tr:['银发','炸弹','岚之守护者','十代目狂热粉','意大利','忠诚'],nk:['Hayato Gokudera','狱寺隼人','Gokudera'],v:[['暂未收录','']]}],
  [1858,{n:'云雀恭弥',a:'家庭教师REBORN',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1858-eqEEzEUEzAkH.jpg',dsc:'并盛中学的风纪委员长——整个学校的实际统治者。最强守护者——云之守护者。使用拐子战斗。"我讨厌群聚"——然后在所有人的战斗中独自搞定最难的对手。对阿纲的态度从无视到嘴上不承认的认可——是标准的傲娇猛兽。' ,tr:['黑发','风纪委员','拐子','云之守护者','最强','独行','群聚不要'],nk:['Kyouya Hibari','云雀恭弥','Hibari','雲雀'],v:[['暂未收录','']]}],
  [1861,{n:'笹川了平',a:'家庭教师REBORN',img:'https://s4.anilist.co/file/anilistcdn/character/large/b1861-mjcnbnpixWjR.png',dsc:'并盛中学拳击部主将——彭格列晴之守护者。每天高喊着"极限！"训练——然后在被里包恩枪打中后又"极限！"变强。头脑简单但内心纯粹。口头禅除了"极限"没有第二个词。是所有守护者中最热血最直球的笨蛋。' ,tr:['白发','拳击','晴之守护者','极限','热血','笨蛋','纯粹'],nk:['Ryouhei Sasagawa','笹川了平','Ryouhei'],v:[['暂未收录','']]}],

  // ====== 食梦者 (3) ======
  [14545,{n:'真城最高',a:'食梦者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b14545-WjCGUsYLCEVn.png',dsc:'梦想和暗恋的女生亚豆美保结婚的初中生——但条件是等他的漫画动画化后让亚豆来配音。与高木秋人组成漫画组合"亚城木梦叶"向JUMP周刊发起挑战。从校园恋爱喜剧到邪道漫画——他们的成长之路就是一部JUMP编辑部的百科全书。' ,tr:['棕发','漫画家','JUMP','亚城木梦叶','作画','亚豆美保','梦想结婚'],nk:['Moritaka Mashiro','真城最高','Mashiro'],v:[['暂未收录','']]}],
  [14552,{n:'高木秋人',a:'食梦者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b14552-l5hN8i6wFfTl.png',dsc:'年级第一的学霸——同时也是立志成为漫画原作者的少年。对漫画家这个职业有着与研究同样严谨的态度。与最高搭档写出了"这个世界是靠着金钱和智慧运转的"这句最冷酷的JUMP漫画台词。每篇原案背后都藏着他对故事结构近乎偏执的追求。' ,tr:['黑发','眼镜','学霸','漫画原作者','编剧','偏执','作品至上'],nk:['Akito Takagi','高木秋人','Takagi'],v:[['暂未收录','']]}],
  [14546,{n:'亚豆美保',a:'食梦者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b14546-J1ES7lBIPEIj.png',dsc:'真城最高的同班同学——也是他从小暗恋的女生。梦想是成为声优。与最高约定——"等你的漫画动画化让我来配女主角——在那之前我们不要见面"。这个看似幼稚的约定是两个人整整十年的动力。她静静地在录音棚里等待——等待最高的漫画成为动画的那一天。' ,tr:['棕发','声优','梦境','等待十年','约定','初恋'],nk:['Miho Azuki','亚豆美保','Miho'],v:[['暂未收录','']]}],

  // ====== 魔笛MAGI (4) ======
  [41949,{n:'阿拉丁',a:'魔笛MAGI',img:'https://s4.anilist.co/file/anilistcdn/character/large/b41949-LaoaHJ2tJxBw.png',dsc:'拥有所罗门智慧的MAGI——被封印在笛子中千年的少年。被阿里巴巴从遗迹中释放。用笛声召唤火焰魔法。天真善良但拥有看透人心的智慧。他的肚子和头巾里住着精灵乌戈君。整个故事从他遇到阿里巴巴那一刻开启。' ,tr:['蓝发','MAGI','笛子','火焰魔法','千年','天真','乌戈君'],nk:['Aladdin','阿拉丁','アラジン'],v:[['暂未收录','']]}],
  [42501,{n:'阿里巴巴·沙尔贾',a:'魔笛MAGI',img:'https://s4.anilist.co/file/anilistcdn/character/large/b42501-BKURFIipvE1C.png',dsc:'被诅咒的王子——为了还清贫民窟的债务而攻略迷宫。在遗迹中释放了阿拉丁并获得了魔神之力。表面阳光但内心对自己懦弱逃避的过去充满愧疚。与阿拉丁和摩尔迦娜组成了最强的三人组。梦想是改造这个不公平的国家。"我想成为配得上这把剑的王。"' ,tr:['金发','王子','迷宫攻略','魔神','阳光','背负过去','梦想称王'],nk:['Alibaba Saluja','阿里巴巴','Alibaba'],v:[['暂未收录','']]}],
  [43121,{n:'摩尔迦娜',a:'魔笛MAGI',img:'https://s4.anilist.co/file/anilistcdn/character/large/b43121-o2KuUeEfh6AS.png',dsc:'来自黑暗大陆的战斗民族法纳利斯最后的幸存者。被当作奴隶贩卖多年后被阿里巴巴解救。戴着脚镣战斗——那是她曾经被奴役的证明和她选择继续战斗的誓言。拥有超越人类极限的腿力可以一脚踢碎岩石。忠诚、强大又温柔。"我终于找到家了——和你们在一起的地方。"' ,tr:['红发','法纳利斯','腿力','奴隶出身','被解救','忠诚','最可靠'],nk:['Morgiana','摩尔迦娜','モルジアナ'],v:[['暂未收录','']]}],
  [54599,{n:'多拉公',a:'魔笛MAGI',img:'https://s4.anilist.co/file/anilistcdn/character/large/b54599-zg31DkdPAXQj.jpg',dsc:'龙的眷属——龙人战士。被阿拉丁从迷宫释放后成为他的守护者。能够变身为龙形态战斗。外表可怕但内心对阿拉丁有着爷爷般的关怀。' ,tr:['龙人','变身','守护者','阿拉丁伙伴','战士'],nk:['Drakon','多拉公'],v:[['暂未收录','']]}],

  // ====== 迷糊餐厅 (3) ======
  [24418,{n:'小鸟游宗太',a:'迷糊餐厅',img:'https://s4.anilist.co/file/anilistcdn/character/large/b24418-HdBfdTzCL3yE.jpg',dsc:'瓦古纳利亚餐厅的男服务生——极度喜欢小型事物（萝莉控）。被前辈种岛白杨的娇小身材迷得神魂颠倒。每天一边吐槽餐厅里各种奇葩同事一边被她们整。明明是个正常人在一群怪人中显得最不正常。口头禅是"小小的好棒！"' ,tr:['黑发','服务生','小型事物控','吐槽','被整','正常?'],nk:['Souta Takanashi','小鸟游宗太','Takanashi'],v:[['暂未收录','']]}],
  [24419,{n:'伊波真昼',a:'迷糊餐厅',img:'https://s4.anilist.co/file/anilistcdn/character/large/b24419-bw1EMn37MMlf.png',dsc:'瓦古纳利亚的女服务生——极度男性恐惧症。见到男性就会不由自主地出拳暴揍——而她最常揍的人就是可怜的小鸟游。身材娇小但杀伤力惊人。"对不起！"（一拳揍飞）——每天的日常。在小鸟游的帮助下逐渐克服恐惧，两人间的互动是番剧最甜的看点。',tr:['黑发','男人恐惧','暴力','娇小','害羞','服务生','恋爱'],nk:['Mahiru Inami','伊波真昼','Inami'],v:[['暂未收录','']]}],
  [30905,{n:'轰八千代',a:'迷糊餐厅',img:'https://s4.anilist.co/file/anilistcdn/character/large/30905.jpg',dsc:'瓦古纳利亚的领班——总是带着一把日本刀上班的短发美人。暗恋着店长佐藤润——但每天见面就是砍砍砍。把所有接近店长的女性都当成了假想敌。刀法精湛但本人非常温柔——"这把刀只是以防万一。"' ,tr:['黑发','短发','日本刀','女领班','暗恋','砍人','温柔'],nk:['Yachiyo Todoroki','轰八千代','Yachiyo'],v:[['暂未收录','']]}],
]

let c=0
for(const[id,o]of d){
  const{error}=await supabase.from('characters').upsert({id,name:o.n,anime_title:o.a,image:o.img,description:o.dsc,traits:o.tr,nicknames:o.nk},{onConflict:'id'})
  if(o.v){await supabase.from('voice_actors').delete().eq('character_id',id);for(const[nm,im]of o.v)await supabase.from('voice_actors').insert({character_id:id,name:nm,image:im||'',language:'日语'})}
  process.stdout.write(error?'❌':'+');c++
}
console.log('\n重建search_text...')
const{data:chs}=await supabase.from('characters').select('id,name,anime_title,nicknames,traits,voice_actors(name)')
for(const x of chs||[]){const s=[x.name,x.anime_title||'',...(x.nicknames||[]),...(x.traits||[]),...(x.voice_actors||[]).map(v=>v.name)].join(' ');await supabase.from('characters').update({search_text:s}).eq('id',x.id)}
console.log('✅',c)
