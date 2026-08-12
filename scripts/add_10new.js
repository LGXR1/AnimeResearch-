import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// [id, {name, anime, image, desc, traits[], nicknames[], [[va, vaImg]]}]
const data = [
  // ====== 火影忍者 (6) ======
  [17,{n:'漩涡鸣人',a:'火影忍者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b17-phjcWCkRuIhu.png',
    dsc:'木叶隐村的忍者，体内封印着九尾妖狐。从小被全村孤立却从未放弃成为火影的梦想。使用多重影分身之术和螺旋丸战斗。最终实现了梦想成为第七代火影，拯救了忍者世界。口头禅是"这就是我的忍道！"。',
    tr:['金发','蓝色眼瞳','火影','九尾人柱力','螺旋丸','影分身','吊车尾','永不放弃','嘴遁','仙术'],nk:['Naruto Uzumaki','鸣人','うずまきナルト','九尾人柱力','七代目火影'],v:[['竹内顺子','']]}],
  [13,{n:'宇智波佐助',a:'火影忍者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b13-SISLEw1oAD7a.png',
    dsc:'宇智波一族的末裔，鸣人永远的对手和最好的朋友。幼时目睹全族被哥哥鼬屠杀，从此以复仇为生存意义。拥有写轮眼和千鸟。在经历了漫长的黑暗之路后最终回归木叶，成为支撑火影的"另一个火影"。',
    tr:['黑发','写轮眼','千鸟','宇智波','复仇','轮回眼','鸣人对手','叛忍','赎罪'],nk:['Sasuke Uchiha','佐助','うちはサスケ','宇智波佐助'],v:[['杉山纪彰','']]}],
  [145,{n:'春野樱',a:'火影忍者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b145-IorfpI8arxeX.png',
    dsc:'木叶的医疗忍者，第七班成员。从小暗恋佐助，后来成长为纲手亲传的顶尖医疗忍者。拥有怪力拳和百豪之术。虽然在战斗力上不如鸣人和佐助但她的医疗忍术在第四次忍界大战中拯救了无数生命。',
    tr:['粉发','医疗忍者','怪力','百豪之术','纲手弟子','暗恋佐助','第七班','成长'],nk:['Sakura Haruno','小樱','春野樱','春野サクラ'],v:[['中村千绘','']]}],
  [85,{n:'旗木卡卡西',a:'火影忍者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b85-mkVBh2yjxjmx.png',
    dsc:'木叶的精英上忍——拷贝忍者卡卡西。拥有从好友带土那里继承的写轮眼，能复制上千种忍术。第七班的导师，永远戴面罩看《亲热天堂》。名言是"不遵守规矩的人是废物，但不珍惜同伴的人连废物都不如"。第六代火影。',
    tr:['银发','面罩','写轮眼','拷贝忍者','亲热天堂','雷切','第六代火影','第七班导师'],nk:['Kakashi Hatake','卡卡西','はたけカカシ','拷贝忍者'],v:[['井上和彦','']]}],
  [81,{n:'日向雏田',a:'火影忍者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b81-t1aMk5UB6h9p.png',
    dsc:'日向一族宗家长女，拥有白眼。从小性格内向害羞但一直默默暗恋着鸣人。在佩恩入侵木叶时不顾实力差距独自冲向佩恩保护鸣人——"因为我最喜欢鸣人君了"。最终成为鸣人的妻子。',
    tr:['黑发','白眼','日向一族','内向','暗恋鸣人','柔拳','勇敢','鸣人妻子'],nk:['Hinata Hyuuga','雏田','日向雏田','ヒナタ'],v:[['水树奈奈','']]}],
  [86,{n:'自来也',a:'火影忍者',img:'https://s4.anilist.co/file/anilistcdn/character/large/b86-48VCFMvGntc5.jpg',
    dsc:'传说中的三忍之一——蛤蟆仙人自来也。鸣人的师父和最重要的精神导师。好色的大叔外表下是最疼爱弟子的人。《亲热天堂》系列的畅销作家。在雨隐村独自面对佩恩六道完成了最后的战斗——将情报传回木叶后沉入海底。"鸣人——你是预言之子。"',
    tr:['白发','三忍','蛤蟆仙人','好色仙人','作家','鸣人师父','预言之子','牺牲'],nk:['Jiraiya','自来也','ジライヤ','好色仙人','蛤蟆仙人'],v:[['大冢芳忠','']]}],

  // ====== 更衣人偶坠入爱河 (4) ======
  [133676,{n:'喜多川海梦',a:'更衣人偶坠入爱河',img:'https://s4.anilist.co/file/anilistcdn/character/large/b133676-kV2czE3C8Qls.png',
    dsc:'完美到发光的辣妹——但实际上是个狂热的Cosplay宅女。梦想是Cosplay所有自己喜欢的角色。因不擅长做衣服而找上了同班的裁缝高手新菜帮她制作Cos服装。两人的距离在一次次量尺寸和试装中越来越近。是个能把所有动漫宅的梦想穿在身上的人。',
    tr:['金发','辣妹','Cosplay','宅女','开朗','完美外貌','反差','喜欢新菜'],nk:['Marin Kitagawa','喜多川海梦','Marin','海梦'],v:[['直田姬奈','']]}],
  [133678,{n:'五条新菜',a:'更衣人偶坠入爱河',img:'https://s4.anilist.co/file/anilistcdn/character/large/b133678-IitCgjDxQGgu.png',
    dsc:'被全班孤立的"人偶宅"少年。祖传人偶职人的孙子，拥有精湛的裁缝手艺。因童年被嘲笑"男生玩人偶"而一直隐藏自己的爱好。被海梦发现手艺后成为了她的专属Cos服制作人。在制作衣服的过程中逐渐走出阴影。',
    tr:['黑发','人偶宅','裁缝','内向','被孤立','认真','手艺人','成长'],nk:['Wakana Gojou','五条新菜','Gojou','新菜'],v:[['石毛翔弥','']]}],
  [133677,{n:'乾纱寿叶',a:'更衣人偶坠入爱河',img:'https://s4.anilist.co/file/anilistcdn/character/large/b133677-PqshvUeVFB7u.jpg',
    dsc:'知名Cosplayer——JuJu。初中生但拥有超高的人气和顶尖的Cos技术。最初对海梦充满敌意但在看到新菜的手艺后态度大变。毒舌傲娇但实际上非常珍惜海梦和新菜这两个朋友。妹妹心寿是她最忠实的摄影师。',
    tr:['黑发','Cosplayer','JuJu','初中生','傲娇','毒舌','妹妹'],nk:['Sajuna Inui','乾纱寿叶','Sajuna','JuJu'],v:[['暂未收录','']]}],
  [207937,{n:'乾心寿',a:'更衣人偶坠入爱河',img:'https://s4.anilist.co/file/anilistcdn/character/large/b207937-ytYjcNtNX77K.png',
    dsc:'纱寿叶的妹妹——外表反差极大的少女。看起来比姐姐成熟许多但实际是初中生。姐姐的专属摄影师，两人是最佳搭档。对姐姐的Cos事业有着无比的支持和热爱。性格比姐姐温顺很多。',
    tr:['黑发','摄影师','妹妹','反差','温顺','Cosplay支援'],nk:['Shinju Inui','乾心寿','Shinju'],v:[['暂未收录','']]}],

  // ====== 孤独摇滚 (4) ======
  [257562,{n:'后藤独',a:'孤独摇滚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b257562-Ru35NYPfsqhY.png',
    dsc:'极度社恐的吉他少女——网名"吉他英雄"。三年前开始自学吉他梦想在文化祭上表演，但三年间一个朋友都没交到。直到被伊地知虹夏拉入结束乐队后才第一次站上舞台。每次演出前都会躲进垃圾桶或者芒果纸箱里。但拿起吉他那一刻就变成了真正的摇滚明星。',
    tr:['粉发','社恐','吉他','吉他英雄','垃圾桶','芒果箱','结束乐队','反差'],nk:['Hitori Gotou','后藤独','Bocchi','波奇','ひとりちゃん'],v:[['青山吉能','']]}],
  [261674,{n:'伊地知虹夏',a:'孤独摇滚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b261674-a8tJYvtzqWgC.png',
    dsc:'结束乐队的鼓手和队长——全队最阳光的存在。第一个发现波奇吉他才能并将她拉入乐队的人。用开朗的笑容维持着乐队的运转。姐姐星歌是Livehouse的店主。她也是结束乐队最强的凝聚力。',
    tr:['金发','鼓手','队长','阳光','凝聚力','Livehouse','把波奇拉出壳'],nk:['Nijika Ijichi','伊地知虹夏','Nijika','虹夏'],v:[['铃代纱弓','']]}],
  [264529,{n:'山田凉',a:'孤独摇滚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b264529-BvEusZnJLD2Y.png',
    dsc:'结束乐队的贝斯手——冷面酷女。外貌帅气的中性美少女，全校女生为之疯狂。但她的全部存款都拿去买贝斯和弦了以至于穷到吃草。面无表情地做出最离谱的事——是结束乐队隐藏的搞笑担当。',
    tr:['蓝发','贝斯手','中性','酷','贫穷','吃草','面瘫','帅气'],nk:['Ryou Yamada','山田凉','Ryou','凉'],v:[['水野朔','']]}],
  [266041,{n:'喜多郁代',a:'孤独摇滚',img:'https://s4.anilist.co/file/anilistcdn/character/large/b266041-1HKgjJGP2MmM.png',
    dsc:'结束乐队的主唱兼吉他手——全校最受欢迎的阳角。最初想加入乐队是假装会吉他但在波奇的帮助下真正爱上了音乐。逃跑后又被波奇拉回来成为乐队不可或缺的主唱。她的歌声是结束乐队最亮的光芒。',
    tr:['红发','主唱','吉他','阳角','万人迷','逃跑','被波奇拉回来'],nk:['Ikuyo Kita','喜多郁代','Kita','喜多'],v:[['长谷川育美','']]}],

  // ====== 地狱乐 (4) ======
  [137260,{n:'画眉丸',a:'地狱乐',img:'https://s4.anilist.co/file/anilistcdn/character/large/b137260-xmSis8FmwhEE.png',
    dsc:'被誉为"石隐村最强者"的忍者——称号"空之画眉丸"。被判处死刑后接到了幕府的任务——前往极乐净土寻找不老不死的仙药以换取无罪赦免。使用各种忍术的冷血杀手但唯一的牵挂是深爱的妻子。为了回到妻子身边愿意砍翻任何挡路的人或神。',
    tr:['白发','忍者','最强者','死刑犯','寻找仙药','深爱妻子','冷酷','空之画眉丸'],nk:['Gabimaru','画眉丸','Gabimaru'],v:[['暂未收录','']]}],
  [137263,{n:'佐切',a:'地狱乐',img:'https://s4.anilist.co/file/anilistcdn/character/large/b137263-I2krXFEFOHjL.png',
    dsc:'幕府的执刑人——山田浅右卫门家的养女。剑术精湛的少女。奉命陪同画眉丸前往极乐净土并在任务完成后亲手执行他的死刑。但在旅途中对画眉丸产生了超越任务的情感。理性与感性的冲突让她反复挣扎。',
    tr:['黑发','执刑人','剑术','山田家','监督','矛盾','正义'],nk:['Sagiri','佐切','サギリ'],v:[['暂未收录','']]}],
  [137261,{n:'杠',a:'地狱乐',img:'https://s4.anilist.co/file/anilistcdn/character/large/b137261-lWhxTwLOYLpO.png',
    dsc:'与画眉丸同行的死囚之一——使用绷带缠绕的诡异战斗方式。外表阴沉但在极乐仙乡的危机中多次出手相助。和画眉丸一行人从敌人变成了可以托付背后的战友。',
    tr:['棕发','死囚','绷带','诡异','战友','沉默'],nk:['Touma','杠','トウマ'],v:[['暂未收录','']]}],
  [306847,{n:'铁心',a:'地狱乐',img:'https://s4.anilist.co/file/anilistcdn/character/large/b306847-pTOq1RighbhL.png',
    dsc:'极乐净土探索队伍的成员，强壮的僧侣战士。以重拳和金刚不坏般的身体战斗。沉默寡言但每次关键战斗都会站在最前面。对同伴有着深厚的信任。',
    tr:['光头','僧侣','巨拳','金刚','沉默','保护者'],nk:['Tesshin','铁心'],v:[['暂未收录','']]}],

  // ====== 药屋少女的呢喃 (4) ======
  [126824,{n:'猫猫',a:'药屋少女的呢喃',img:'https://s4.anilist.co/file/anilistcdn/character/large/b126824-MqsCncTO1qpv.png',
    dsc:'在花街长大的药师少女。被拐卖到后宫当了下级宫女后本打算低调过日子，但因为对毒药和药理的狂热让她忍不住插手了后宫中接连发生的离奇事件。雀斑是为了掩盖美貌的伪装。每次见到稀有药材都会双眼放光然后被壬氏各种利用这点来雇佣她查案。',
    tr:['绿发','药师','后宫','毒物','推理','雀斑','伪装','药痴'],nk:['Maomao','猫猫','マオマオ'],v:[['悠木碧','']]}],
  [127278,{n:'壬氏',a:'药屋少女的呢喃',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127278-0qCQciTkPOMS.jpg',
    dsc:'后宫的总管太监——俊美得让所有宫女失语的美男子。真实身份和目的笼罩在迷雾之中。每次后宫出事都会以各种珍贵药材作为诱饵让猫猫出手调查。虽然表面上总是捉弄猫猫但信任她的能力到了几乎依赖的程度。',
    tr:['黑发','美男子','宦官','后宫总管','神秘','猫猫雇主'],nk:['Jinshi','壬氏','ジンシ'],v:[['暂未收录','']]}],
  [244317,{n:'高顺',a:'药屋少女的呢喃',img:'https://s4.anilist.co/file/anilistcdn/character/large/b244317-zm6LeJmLN9kZ.png',
    dsc:'壬氏的亲信和护卫，沉稳可靠的武官。在壬氏和猫猫的每次冒险中负责提供武力保障。虽然话不多但每次的评价都一针见血。是少有的几个知道壬氏秘密的人之一。',
    tr:['黑发','武官','护卫','沉稳','可靠','知情者'],nk:['Gaoshun','高顺','ガオシュン'],v:[['暂未收录','']]}],
  [274195,{n:'李白',a:'药屋少女的呢喃',img:'https://s4.anilist.co/file/anilistcdn/character/large/b274195-TyGcY0uiMpx4.png',
    dsc:'宫廷中的下级武官，性格豪爽直率的青年。对猫猫的推理能力极为佩服经常协助她调查。虽然在权谋诡计中显得有些笨拙但他的真诚赢得了猫猫的信任。',
    tr:['棕发','武官','豪爽','直率','猫猫协助者','真诚'],nk:['Lihaku','李白','リハク'],v:[['暂未收录','']]}],

  // ====== 怪兽8号 (4) ======
  [180692,{n:'日比野卡夫卡',a:'怪兽8号',img:'https://s4.anilist.co/file/anilistcdn/character/large/b180692-rPGXuxhcKw5N.png',
    dsc:'32岁的怪兽清扫员——梦想加入日本防卫队却屡考不中。在濒死时被一只小型怪兽寄生变成了能变身怪兽的人类——代号"怪兽8号"。以中年人的身体出发却获得了最强的力量。即使被防卫队当作威胁追杀也不愿放弃自己的梦想和对同伴的承诺。',
    tr:['黑发','32岁','怪兽清扫员','怪兽8号','变身','执着','中年人','梦想不灭'],nk:['Kafka Hibino','日比野卡夫卡','Kafka','卡夫卡'],v:[['暂未收录','']]}],
  [183889,{n:'四之宫奇可露',a:'怪兽8号',img:'https://s4.anilist.co/file/anilistcdn/character/large/b183889-2Ar6AHPx2mre.png',
    dsc:'防卫队最年轻的王牌队员——16岁的天才少女。解放战力46%的顶尖战士。最初极度敌视卡夫卡但逐渐认可了他的实力和人格。对待任务冷酷无情其实性格傲娇。"卡夫卡前辈——你还真是让人放心不下呢。"',
    tr:['金发','16岁','防卫队','解放战力46%','天才','傲娇','双马尾'],nk:['Kikoru Shinomiya','四之宫奇可露','Kikoru'],v:[['暂未收录','']]}],
  [180694,{n:'市川莱诺',a:'怪兽8号',img:'https://s4.anilist.co/file/anilistcdn/character/large/b180694-Q0Ocr4aqBu4k.png',
    dsc:'卡夫卡的年轻后辈——实现了两人共同的梦想成功加入防卫队。第一个发现卡夫卡变成怪兽并选择为他保密的人。在卡夫卡被追杀时不离不弃。"我永远站在卡夫卡前辈这一边。"',
    tr:['黑发','防卫队','卡夫卡后辈','忠诚','不离不弃','少年'],nk:['Reno Ichikawa','市川莱诺','Reno'],v:[['暂未收录','']]}],
  [308017,{n:'塞巴斯',a:'怪兽8号',img:'https://s4.anilist.co/file/anilistcdn/character/large/b308017-654bU7aQfcfg.png',
    dsc:'防卫队第三部队的副队长，精锐战士。性格严谨认真，在卡夫卡加入防卫队后成为他的上司和训练者。虽然严格但私下对卡夫卡的潜力有着很高的评价。',
    tr:['黑发','副队长','防卫队','严格','认真','训练者'],nk:['Sebas','塞巴斯'],v:[['暂未收录','']]}],

  // ====== 迷宫饭 (5) ======
  [126818,{n:'莱欧斯·托登',a:'迷宫饭',img:'https://s4.anilist.co/file/anilistcdn/character/large/b126818-vWeIwxSERSHd.png',
    dsc:'为了救回被红龙吞掉的妹妹法琳而重返迷宫的战士。因为没钱买食物所以决定——"那就把迷宫里的魔物做成料理吧！"从此踏上了边吃魔物边下迷宫的不归路。对魔物料理有着令人恐惧的热情和品味。是个"我可以为了妹妹死——但先让我尝尝这个史莱姆的味道"的奇人。',
    tr:['金发','战士','魔物料理','吃货','救妹妹','狂热','奇人','迷宫'],nk:['Laios Thorden','莱欧斯','Laios','ライオス'],v:[['暂未收录','']]}],
  [127292,{n:'玛露西尔·多纳托',a:'迷宫饭',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127292-MAWgxbS0Cbrs.png',
    dsc:'精灵族的魔法使——莱欧斯的青梅竹马兼队友。对吃魔物这件事极度抵触——"我不要我不要我绝对不要！"但每次都被塞进嘴里然后表情变了。擅长使用高等魔法是队伍的主要火力输出。经常因为被强迫吃奇怪东西而发出可爱的悲鸣。',
    tr:['金发','精灵','魔法使','青梅竹马','抗拒魔物料理','真香','可爱'],nk:['Marcille Donato','玛露西尔','Marcille','マルシル'],v:[['暂未收录','']]}],
  [127689,{n:'先西',a:'迷宫饭',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127689-SC65fBVrUx8v.png',
    dsc:'矮人族的迷宫厨师——整个故事的核心。在迷宫中生活了十年的烹饪大师，能用任何魔物做出令人惊叹的美食。随身携带全套厨具和调味料。将"在迷宫中好好吃饭"作为人生哲学。每次做菜前的仪式感和讲解是全剧的精髓。"吃是生命最基本也是最美好的事。"',
    tr:['矮人','厨师','魔物料理','迷宫十年','厨具','美食哲学','胡子'],nk:['Senshi','先西','センシ'],v:[['暂未收录','']]}],
  [130509,{n:'齐尔查克·蒂姆斯',a:'迷宫饭',img:'https://s4.anilist.co/file/anilistcdn/character/large/b130509-NFZ7xFt1kLqd.png',
    dsc:'半身人盗贼，队伍中的机关专家和解锁担当。小巧灵活的身材让他能进入任何地方。虽然嘴硬但对队友的关心全在行动里。每次踩陷阱都会抱怨但每次都会第一个冲上去。"我真受不了你们这帮人——但还是先把前面的陷阱拆了吧。"',
    tr:['半身人','盗贼','小巧','解锁','机关','嘴硬心软','可靠'],nk:['Chilchuck Tims','齐尔查克','チルチャック'],v:[['暂未收录','']]}],
  [239687,{n:'小黑',a:'迷宫饭',img:'https://s4.anilist.co/file/anilistcdn/character/large/b239687-R4URaC2y1cfL.png',
    dsc:'迷宫中遇到的神秘黑猫魔兽——被莱欧斯一行人救助后成为了队伍的宠物和吉祥物。虽然外表可爱但战斗力不容小觑。特别喜欢先西做的料理。',
    tr:['黑猫','魔兽','宠物','吉祥物','可爱'],nk:['Kuro','小黑','クロ'],v:[['暂未收录','']]}],

  // ====== 文豪野犬 (5) ======
  [89197,{n:'中岛敦',a:'文豪野犬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89197-vB5kP72ruckV.png',
    dsc:'被孤儿院赶出来后在河边饿得快死时遇到了正在"自杀"的太宰治——从此被拉入武装侦探社。能力"月下兽"可以变身为白虎。极度自卑但在同伴的信任中逐渐找到了自我价值。与芥川龙之介是宿命中的对手兼搭档。',
    tr:['白发','白虎','月下兽','武装侦探社','自卑','成长','太宰捡来的'],nk:['Atsushi Nakajima','中岛敦','Atsushi','敦'],v:[['暂未收录','']]}],
  [89198,{n:'太宰治',a:'文豪野犬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89198-qKmRTw4Y3PRC.png',
    dsc:'武装侦探社的核心成员——能力"人间失格"能无效化一切异能。每天乐此不疲地尝试各种自杀方式（被敦和国木田制止）。曾经是港口黑手党的最年轻干部。在轻浮迷人的外表下是无人能看透的过去和精密的大脑。全剧最大的谜团和最深的温柔。',
    tr:['棕发','人间失格','前黑手党','自杀爱好者','天才','神秘','侦探社'],nk:['Osamu Dazai','太宰治','Dazai','ダザイ'],v:[['暂未收录','']]}],
  [89199,{n:'芥川龙之介',a:'文豪野犬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89199-h8tHKG8vKPNZ.png',
    dsc:'港口黑手党的游击队队长——能力"罗生门"能将外套化为吞噬一切的黑兽。冷酷残忍的外表下是对太宰认可的病态执着。与中岛敦命中注定的战斗和合作是整部作品最燃的部分。"我是不会输给你这种人的——人虎！"',
    tr:['黑发','罗生门','黑手党','冷酷','太宰执着','敦的宿敌','黑色外套'],nk:['Ryuunosuke Akutagawa','芥川龙之介','Akutagawa'],v:[['暂未收录','']]}],
  [89200,{n:'国木田独步',a:'文豪野犬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89200-mZJo7iEwJGzg.png',
    dsc:'武装侦探社的理想主义实干派——太宰的搭档兼负责把他从河里捞上来的人。能力"独步吟客"能将笔记本上写的任何东西具现化。随身携带一本写得密密麻麻的理想笔记本。"太宰——你又去跳河了？！"' ,
    tr:['金发','眼镜','独步吟客','笔记本','太宰搭档','理想主义','捞太宰'],nk:['Doppo Kunikida','国木田独步','Kunikida'],v:[['暂未收录','']]}],
  [89196,{n:'福泽谕吉',a:'文豪野犬',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89196-E2tIf6nIPKnW.png',
    dsc:'武装侦探社的社长——传说中的银狼剑客。前政府暗杀者。用自己的能力"人上人不造"来统率和管理社员们。外表威严但对待社员如父亲般保护。是整个侦探社的脊梁。',
    tr:['银发','社长','银狼','前暗杀者','威严','父亲般','保护者'],nk:['Yukichi Fukuzawa','福泽谕吉','Fukuzawa','社长'],v:[['暂未收录','']]}],

  // ====== 实力至上主义教室 (4) ======
  [123212,{n:'绫小路清隆',a:'欢迎来到实力至上主义的教室',img:'https://s4.anilist.co/file/anilistcdn/character/large/b123212-ewZgUQr9vvEM.png',
    dsc:'D班的真正操纵者——表面上是个无表情无干劲的普通学生，但实际上是"白房子"培养出来的最强人造天才。用所有人当棋子进行着最精密的心理博弈。从不出手——但每一件事都是他设计好的。"我只是想看人类的有趣之处。"',
    tr:['棕发','无表情','白房子','天才','幕后操控','棋子','全能','最强'],nk:['Kiyotaka Ayanokouji','绫小路清隆','Ayanokouji','绫小路'],v:[['暂未收录','']]}],
  [123213,{n:'堀北铃音',a:'欢迎来到实力至上主义的教室',img:'https://s4.anilist.co/file/anilistcdn/character/large/b123213-jUfrGBXfW7BL.png',
    dsc:'D班最初的核心人物——为了追上哥哥堀北学而进入这所学校。黑长直的高冷美人。起初试图独自把D班拉到A班但在绫小路的暗中帮助下逐渐成长。"我不需要任何人的帮助"——直到她发现她每一次成功背后都有他的影子。',
    tr:['黑发','长直','高冷','D班','哥哥执念','成长','被帮助不自知'],nk:['Suzune Horikita','堀北铃音','Horikita','堀北'],v:[['暂未收录','']]}],
  [123214,{n:'栉田桔梗',a:'欢迎来到实力至上主义的教室',img:'https://s4.anilist.co/file/anilistcdn/character/large/b123214-Ym9cldopi3yR.png',
    dsc:'D班的"天使"——全校公认的最温柔女生。但这只是她精心维护的人设。真实的她是个极其自我的人，为了维持这个人设不惜一切代价。是绫小路早期最有趣的棋子之一。知道她另一面的人都被她视为必须摧毁的威胁。',
    tr:['棕发','双面人','天使人设','腹黑','威胁','伪装'],nk:['Kikyou Kushida','栉田桔梗','Kushida','栉田'],v:[['暂未收录','']]}],
  [124691,{n:'坂柳有栖',a:'欢迎来到实力至上主义的教室',img:'https://s4.anilist.co/file/anilistcdn/character/large/b124691-S9GyfwMAkkJ9.jpg',
    dsc:'A班的领袖——白色长发的娇小少女。先天性心脏病但她的大脑是整个学校最强的武器。认定绫小路是她唯一认可的对手。"你有资格做我的对手"——这句话是对绫小路最高等级的赞赏。与绫小路在运动会上的一战是全书最精彩的智斗。',
    tr:['白发','娇小','A班领袖','天才','心脏病','绫小路对手','智斗'],nk:['Arisu Sakayanagi','坂柳有栖','Arisu','坂柳'],v:[['暂未收录','']]}],

  // ====== OVERLORD (4) ======
  [89103,{n:'安兹·乌尔·恭',a:'OVERLORD',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89103-ZsnA0r77GHsR.png',
    dsc:'原名铃木悟——在游戏关服后发现自己和整个公会一起穿越到了异世界。变成了自己所创建的骷髅魔法师角色。为了寻找同伴和保护纳萨力克大坟墓开始了征服世界的旅途。外表是恐怖的骷髅王但内心还是那个普通的社畜玩家。在守护者面前被迫扮演完美的统治者。"我——安兹·乌尔·恭——绝不会让纳萨力克倒下。"',
    tr:['骷髅','魔法师','不死者之王','纳萨力克','穿越','社畜','最强统治者','演技'],nk:['Momonga','安兹·乌尔·恭','Ainz','鈴木悟','鈴木悟'],v:[['日野聪','']]}],
  [89121,{n:'夏提雅·布拉德弗伦',a:'OVERLORD',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89121-N8hzLH4nfWna.png',
    dsc:'纳萨力克地下大坟墓第一至第三层的守护者——吸血鬼真祖。拥有最强的近战能力。对安兹有着狂热的爱慕——到了听到他的名字就会变形的程度。曾被世界级道具精神控制后与安兹单挑——那一战是全系列最经典的战斗。"安兹大人——请允许我为您献上一切。"',
    tr:['银发','吸血鬼','守护者','最强近战','安兹狂热','被控制','椅子'],nk:['Shalltear Bloodfallen','夏提雅','シャルティア'],v:[['暂未收录','']]}],
  [89152,{n:'娜贝拉尔·伽玛',a:'OVERLORD',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89152-S3WrhOMakSCq.png',
    dsc:'纳萨力克的战斗女仆之一——娜贝。跟随安兹前往人类国度执行潜伏任务。外表是高冷美人但看不起除了安兹和纳萨力克同伴之外的任何生物。被安兹派到冒险者公会当冒险者。"安兹大人以外的生物都不配活着"——她真的这么想。',
    tr:['黑发','战斗女仆','魔法师','娜贝','冒险者','看不起人类','忠诚'],nk:['Narberal Gamma','娜贝拉尔','Narberal','ナーベラル'],v:[['暂未收录','']]}],
  [89154,{n:'潘多拉·亚克特',a:'OVERLORD',img:'https://s4.anilist.co/file/anilistcdn/character/large/89154-jbsFsEsjL3aS.jpg',
    dsc:'安兹亲手创造的NPC——纳萨力克的宝物殿管理者。能变身成任何见过的人并使用其能力。行为举止极度夸张——因为他被安兹设定成了"中二病全开的角色"。每次出场都是德语腔调的戏剧化表演。是安兹最不愿面对的黑历史但他也是纳萨力克不可替代的军师。',
    tr:['变形','宝物殿','中二病','德语','戏剧化','安兹的尴尬'],nk:['Pandora Actor','潘多拉·亚克特','パンドラズアクター'],v:[['暂未收录','']]}],
]

let count = 0
for (const [id, d] of data) {
  const { error } = await supabase.from('characters').upsert({
    id, name: d.n, anime_title: d.a, image: d.img,
    description: d.dsc, traits: d.tr, nicknames: d.nk,
  }, { onConflict: 'id' })
  if (d.v) {
    await supabase.from('voice_actors').delete().eq('character_id', id)
    for (const [name, img] of d.v) {
      await supabase.from('voice_actors').insert({ character_id: id, name, image: img || '', language: '日语' })
    }
  }
  process.stdout.write(error ? '❌' : '+')
  count++
}
console.log('\n重建 search_text...')
const { data: chars } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)')
for (const c of chars || []) {
  const st = [c.name, c.anime_title || '', ...(c.nicknames || []), ...(c.traits || []), ...(c.voice_actors || []).map(v => v.name)].join(' ')
  await supabase.from('characters').update({ search_text: st }).eq('id', c.id)
}
console.log('✅', count, '个角色')
