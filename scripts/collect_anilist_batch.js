import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const pool = [
  ['边缘服务', 'THE MARGINAL SERVICE', ['边缘服务', 'THE MARGINAL SERVICE']],
  ['爆音少女！！', 'Bakuon!!', ['爆音少女！！', '爆音少女']],
  ['少女编号', 'Gi(a)rlish Number', ['少女编号', '少女号码']],
  ['女高中生的虚度日常', 'Joshikousei no Mudazukai', ['女高中生的虚度日常']],
  ['可爱过头大危机', 'Kawaisugi Crisis', ['可爱过头大危机']],
  ['江户前精灵', 'Edomae Elf', ['江户前精灵']],
  ['川越男子合唱团', 'Kawagoe Boys Sing', ['川越男子合唱团']],
  ['枪的假面舞会', 'Lance N\u2019 Masques', ['枪的假面舞会', '枪与假面舞会']],
  ['圣洁天使', 'Ange Vierge', ['圣洁天使', 'Ange Vierge']],
  ['魔法少女什么的已经够了啦。', 'Mahou Shoujo Nante Mou Ii desu kara.', ['魔法少女什么的已经够了啦。', '魔法少女什么的已经够了啦']],
  ['装神少女小缠', 'Soushin Shoujo Matoi', ['装神少女小缠']],
  ['竞女!!!!!!!!', 'Keijo!!!!!!!!', ['竞女!!!!!!!!', '竞女']],
  ['南镰仓高校女子自行车社', 'Minami Kamakura Koukou Joshi Jitensha-bu', ['南镰仓高校女子自行车社']],
  ['七美德', 'Nanatsu no Bitoku', ['七美德']],
  ['音乐少女', 'Ongaku Shoujo', ['音乐少女']],
  ['黑色推销员NEW', 'Warau Salesman NEW', ['黑色推销员NEW', '笑面推销员NEW']],
  ['猫咪日常', 'Nyanko Days', ['猫咪日常']],
  ['任性High Spec', 'Wagamama High Spec', ['任性High Spec']],
  ['恋爱研究所', 'Love Lab', ['恋爱研究所']],
  ['恋爱暴君', 'Renai Boukun', ['恋爱暴君']],
  ['星梦手记', 'Idol Memories', ['星梦手记']],
  ['月野艺能事务所', 'TSUKIPRO THE ANIMATION', ['月野艺能事务所', 'TSUKIPRO THE ANIMATION']],
  ['时间支配者', 'Chronos Ruler', ['时间支配者']],
  ['彗星路西法', 'Comet Lucifer', ['彗星路西法']],
  ['少年好莱坞', 'Shounen Hollywood: Holly Stage for 49', ['少年好莱坞']],
  ['狐狸之声', 'Kitsune no Koe', ['狐狸之声']],
  ['斯特拉的魔法', 'Stella no Mahou', ['斯特拉的魔法']],
  ['三者三叶', 'Sansha Sanyou', ['三者三叶']],
  ['拉面赤猫', 'Ramen Akaneko', ['拉面赤猫']],
  ['可爱史莱姆噗尼露', 'Puniru wa Kawaii Slime', ['可爱史莱姆噗尼露']],
  ['夜樱家的大作战', 'Yozakura-san Chi no Daisakusen', ['夜樱家的大作战']],
  ['杀手寓言', 'The Fable', ['杀手寓言']],
  ['暗杀女仆冥土小姐', 'Kimi wa Meido-sama.', ['暗杀女仆冥土小姐', '你是冥土大人']],
  ['中年大叔转生反派千金', 'Akuyaku Reijou Tensei Oji-san', ['中年大叔转生反派千金']],
  ['群花绽放、彷如修罗', 'Hana wa Saku, Shura no Gotoku', ['群花绽放、彷如修罗', '群花绽放彷如修罗']],
  ['战队红战士在异世界当冒险者', 'Sentai Red Isekai de Boukensha ni Naru', ['战队红战士在异世界当冒险者']],
  ['上班族去了异世界后成了四天王', 'Salaryman ga Isekai ni Ittara Shitennou ni Natta Hanashi', ['上班族去了异世界后成了四天王']],
  ['不幸职业【鉴定士】实则最强', 'Fuguu-shoku Kanteishi ga Jitsu wa Saikyou Datta', ['不幸职业【鉴定士】实则最强', '不幸职业鉴定士实则最强']],
  ['秘密的偶像公主', 'Himitsu no Aipri', ['秘密的偶像公主']],
  ['Wonderful光之美少女！', 'Wonderful Precure!', ['Wonderful光之美少女！', 'Wonderful光之美少女']],
  ['圣枪修女', 'Chrno Crusade', ['圣枪修女', '圣枪修女克罗诺']],
  ['废弃公主', 'Scrapped Princess', ['废弃公主', '废弃公主帕希菲卡']],
  ['潘朵拉之心', 'Pandora Hearts', ['潘朵拉之心', '潘多拉之心']],
  ['隐王', 'Nabari no Ou', ['隐王']],
  ['钢壳都市雷吉欧斯', 'Koukaku no Regios', ['钢壳都市雷吉欧斯', '钢壳都市']],
  ['漆黑的子弹', 'Black Bullet', ['漆黑的子弹', '黑色子弹']],
  ['圣剑锻造师', 'Seiken no Blacksmith', ['圣剑锻造师']],
  ['信蜂', 'Tegami Bachi', ['信蜂']],
  ['猫愿三角恋', 'Nyan Koi!', ['猫愿三角恋']],
  ['曾几何时天魔的黑兔', 'Itsuka Tenma no Kuro Usagi', ['曾几何时天魔的黑兔']],
  ['绝园的暴风雨', 'Zetsuen no Tempest', ['绝园的暴风雨']],
  ['神的记事本', 'Kamisama no Memochou', ['神的记事本']],
  ['太空丹迪', 'Space Dandy', ['太空丹迪', '宇宙浪子']],
  ['夏雪密会', 'Natsuyuki Rendezvous', ['夏雪密会']],
  ['在下坂本，有何贵干？', 'Sakamoto desu ga?', ['在下坂本，有何贵干？', '在下坂本有何贵干']],
  ['少年女仆', 'Shounen Maid', ['少年女仆']],
  ['美男高校地球防卫部LOVE！', 'Binan Koukou Chikyuu Bouei-bu LOVE!', ['美男高校地球防卫部LOVE！', '美男高校地球防卫部LOVE!']],
  ['穷神来了！', 'Binbougami ga!', ['穷神来了！', '穷神来了']],
  ['武器种族传说', 'Erementar Gerad', ['武器种族传说']],
  ['六花的勇者', 'Rokka no Yuusha', ['六花的勇者']],
  ['惊爆游戏', 'BTOOOM!', ['惊爆游戏', 'BTOOOM!']],
  ['未来都市NO.6', 'NO.6', ['未来都市NO.6', '未来都市No.6']],
  ['翼神传说', 'RahXephon', ['翼神传说']],
  ['天上天下', 'Tenjou Tenge', ['天上天下']],
  ['闪灵二人组', 'GetBackers', ['闪灵二人组']],
  ['滑头鬼之孙', 'Nurarihyon no Mago', ['滑头鬼之孙', '妖怪少爷']],
  ['传说中勇者的传说', 'Densetsu no Yuusha no Densetsu', ['传说中勇者的传说']],
  ['风之圣痕', 'Kaze no Stigma', ['风之圣痕']],
  ['机巧少女不会受伤', 'Machine-Doll wa Kizutsukanai', ['机巧少女不会受伤']],
  ['龙之界点', 'Dragon Crisis!', ['龙之界点']],
  ['龙鸣', 'Dragonaut: The Resonance', ['龙鸣']],
  ['魔法战争', 'Mahou Sensou', ['魔法战争']],
  ['空罐少女', 'Akikan!', ['空罐少女']],
  ['初恋限定。', 'Hatsukoi Limited.', ['初恋限定。', '初恋限定']],
  ['幸运逻辑', 'Luck & Logic', ['幸运逻辑', '幸运逻辑 Luck & Logic']],
  ['神样DOLLS', 'Kamisama Dolls', ['神样DOLLS', '神的玩偶']],
  ['鹡鸰女神', 'Sekirei', ['鹡鸰女神', '鹡鸰计划']],
  ['未确认进行式', 'Mikakunin de Shinkoukei', ['未确认进行式']],
  ['天体的秩序', 'Sora no Method', ['天体的秩序']],
  ['勇者赫鲁库', 'Helck', ['勇者赫鲁库', '勇者赫鲁克']],
  ['LV1魔王与独居废勇者', 'Lv1 Maou to One Room Yuusha', ['LV1魔王与独居废勇者']],
  ['魔女之旅', 'Majo no Tabitabi', ['魔女之旅']],
  ['伊甸星原', 'EDENS ZERO', ['伊甸星原', 'EDENS ZERO']],
  ['圣者无双', 'Seija Musou', ['圣者无双']],
  ['魔王军最强的魔术师是人类', 'Maougun Saikyou no Majutsushi wa Ningen datta', ['魔王军最强的魔术师是人类']],
  ['异世界自杀小队', 'Isekai Suicide Squad', ['异世界自杀小队']],
  ['战国妖狐', 'Sengoku Youko', ['战国妖狐']],
  ['僵尸借贷', 'ZOMBIE-LOAN', ['僵尸借贷']],
  ['惑星公主蜥蜴骑士', 'Hoshi no Samidare', ['惑星公主蜥蜴骑士']],
  ['国王排名', 'Ousama Ranking', ['国王排名', '王様ランキング', 'Ranking of Kings']],
  ['坂本日常', 'SAKAMOTO DAYS', ['坂本日常', '坂本デイズ', 'SAKAMOTO DAYS']],
  ['杖与剑的魔剑谭', 'Tsue to Tsurugi no Wistoria', ['杖与剑的魔剑谭', '杖と剣のウィストリア', 'Wistoria: Wand and Sword']],
  ['入间同学入魔了！', 'Mairimashita! Iruma-kun', ['入间同学入魔了！', '入間くん', 'Welcome to Demon School! Iruma-kun']],
  ['我的朋友很少', 'Boku wa Tomodachi ga Sukunai', ['我的朋友很少', '僕は友達が少ない', 'Haganai']],
  ['我不受欢迎，怎么想都是你们的错！', 'Watashi ga Motenai no wa Dou Kangaetemo Omaera ga Warui!', ['我不受欢迎，怎么想都是你们的错！', '私がモテないのはどう考えてもお前らが悪い!', 'WataMote']],
  ['宇崎学妹想要玩！', 'Uzaki-chan wa Asobitai!', ['宇崎学妹想要玩！', '宇崎ちゃんは遊びたい！', 'Uzaki-chan Wants to Hang Out!']],
  ['游戏3人娘', 'Asobi Asobase', ['游戏3人娘', 'あそびあそばせ', 'Asobi Asobase - workshop of fun -']],
  ['青春纪行', 'Golden Time', ['青春纪行', '金色时光', 'ゴールデンタイム']],
  ['掠夺者', 'Plunderer', ['掠夺者', 'プランダラ']],
  ['出包王女', 'To LOVE-Ru', ['出包王女', 'To Love Ru', 'To LOVEる -とらぶる-']],
  ['精灵幻想记', 'Seirei Gensouki', ['精灵幻想记', '精霊幻想記']],
  ['血意少年', 'Blood Lad', ['血意少年', 'ブラッドラッド']],
  ['喜欢本大爷的竟然就你一个？', 'Ore wo Suki nano wa Omae dake ka yo', ['喜欢本大爷的竟然就你一个？', '俺を好きなのはお前だけかよ']],
  ['刃牙', 'Baki', ['刃牙', 'バキ']],
  ['无彩限的怪灵世界', 'Musaigen no Phantom World', ['无彩限的怪灵世界', '無彩限のファントム・ワールド']],
  ['黑街', 'GANGSTA.', ['黑街', 'GANGSTA.', 'ギャングスタ']],
  ['网络胜利组', 'Net-juu no Susume', ['网络胜利组', '网瘾胜利组', 'ネト充のススメ']],
  ['散华礼弥', 'Sankarea', ['散华礼弥', 'さんかれあ']],
  ['漂流武士', 'DRIFTERS', ['漂流武士', 'DRIFTERS']],
  ['IS〈无限斯特拉托斯〉', 'IS: Infinite Stratos', ['IS〈无限斯特拉托斯〉', '无限斯特拉托斯', 'IS〈インフィニット・ストラトス〉']],
  ['我女友与青梅竹马的惨烈修罗场', 'Ore no Kanojo to Osananajimi ga Shuraba Sugiru', ['我女友与青梅竹马的惨烈修罗场', '俺修羅', 'Oreshura']],
  ['治愈魔法的错误使用方法', 'Chiyu Mahou no Machigatta Tsukaikata', ['治愈魔法的错误使用方法', '治愈魔法的错误用法', '治癒魔法の間違った使い方']],
  ['噬血狂袭', 'Strike the Blood', ['噬血狂袭', 'ストライク・ザ・ブラッド']],
  ['日在校园', 'School Days (TV)', ['日在校园', 'School Days', 'スクールデイズ']],
  ['笨女孩', 'Aho-Girl', ['笨女孩', 'アホガール']],
  ['十字架与吸血鬼', 'Rosario to Vampire', ['十字架与吸血鬼', 'ロザリオとバンパイア']],
  ['流汗吧！健身少女', 'Dumbbell Nan Kilo Moteru?', ['流汗吧！健身少女', 'ダンベル何キロ持てる？']],
  ['大剑', 'CLAYMORE', ['大剑', 'Claymore', 'クレイモア']],
  ['转生就是剑', 'Tensei Shitara Ken Deshita', ['转生就是剑', '转生成为魔剑', '転生したら剣でした']],
  ['诡秘之主', 'Guimi Zhi Zhu: Xiaochou Pian', ['诡秘之主', '诡秘之主 小丑篇']],
  ['寄宿学校的朱丽叶', 'Kishuku Gakkou no Juliet', ['寄宿学校的朱丽叶', '寄宿学校のジュリエット']],
  ['魔都精兵的奴隶', 'Mato Seihei no Slave', ['魔都精兵的奴隶', '魔都精兵のスレイブ']],
  ['恋爱禁止的世界', 'Koi to Uso', ['恋爱禁止的世界', '恋と嘘']],
  ['这个是僵尸吗？', 'Kore wa Zombie desu ka?', ['这个是僵尸吗？', '这是僵尸吗？', 'これはゾンビですか?']],
  ['噬神者', 'GOD EATER', ['噬神者', 'GOD EATER', 'ゴッドイーター']],
  ['前辈有够烦', 'Senpai ga Uzai Kouhai no Hanashi', ['前辈有够烦', '先輩がうざい後輩の話']],
  ['史上最强大魔王转生为村民A', 'Shijou Saikyou no Daimaou, Murabito A ni Tensei suru', ['史上最强大魔王转生为村民A', '史上最強の大魔王、村人Aに転生する']],
  ['拉撒路', 'Lazarus', ['拉撒路', 'LAZARUS', 'ラザロ']],
  ['黄金小子', 'GOLDEN BOY: Sasurai no Obenkyou Yarou', ['黄金小子', 'GOLDEN BOY']],
  ['REDLINE', 'REDLINE', ['REDLINE', 'Redline']],
  ['吊带袜天使', 'Panty & Stocking with Garterbelt', ['吊带袜天使', 'Panty & Stocking with Garterbelt']],
  ['你与我最后的战场，亦或是世界起始的圣战', 'Kimi to Boku no Saigo no Senjo, Arui wa Sekai ga Hajimaru Seisen', ['你与我最后的战场，亦或是世界起始的圣战', '你与我最后的战场']],
  ['我们的重制人生', 'Bokutachi no Remake', ['我们的重制人生', 'ぼくたちのリメイク']],
  ['通往夏天的隧道，再见的出口', 'Natsu e no Tunnel, Sayonara no Deguchi', ['通往夏天的隧道，再见的出口', '夏へのトンネル、さよならの出口']],
  ['金装的维尔梅', 'Kinsou no Vermeil', ['金装的维尔梅', '金装のヴェルメイユ']],
  ['阿兹漫画大王', 'Azumanga Daiou THE ANIMATION', ['阿兹漫画大王', 'あずまんが大王']],
  ['刺客守则', 'Assassins Pride', ['刺客守则', 'アサシンズプライド']],
  ['魔王勇者', 'Maoyuu Maou Yuusha', ['魔王勇者', 'まおゆう魔王勇者']],
  ['勇者辞职不干了', 'Yuusha, Yamemasu', ['勇者辞职不干了', '勇者、辞めます']],
  ['妄想学生会', 'Seitokai Yakuindomo', ['妄想学生会', '生徒会役員共']],
  ['普罗米亚', 'Promare', ['普罗米亚', 'プロメア']],
  ['继母的拖油瓶是我的前女友', 'Mamahaha no Tsurego ga Motokano datta', ['继母的拖油瓶是我的前女友', '継母の連れ子が元カノだった']],
  ['借东西的小人阿莉埃蒂', 'Karigurashi no Arrietty', ['借东西的小人阿莉埃蒂', '借りぐらしのアリエッティ']],
  ['鹿乃子乃子虎视眈眈', 'Shikanoko Nokonoko Koshitantan', ['鹿乃子乃子虎视眈眈', 'しかのこのこのここしたんたん']],
  ['日常系的异能战斗', 'Inou-Battle wa Nichijou-kei no Naka de', ['日常系的异能战斗', '異能バトルは日常系のなかで']],
  ['亲吻姐姐', 'kiss×sis (TV)', ['亲吻姐姐', 'kiss×sis', 'キスシス']],
  ['我太受欢迎了该怎么办', 'Watashi ga Motete Dousunda', ['我太受欢迎了该怎么办', '私がモテてどうすんだ']],
  ['转生为第七王子，随心所欲的魔法学习之路', 'Tensei Shitara Dai Nana Ouji Datta node, Kimamani Majutsu wo Kiwamemasu', ['转生为第七王子，随心所欲的魔法学习之路', '転生したら第七王子だったので']],
  ['如果有妹妹就好了。', 'Imouto sae Ireba Ii.', ['如果有妹妹就好了。', '妹さえいればいい。']],
  ['亚人酱有话要说', 'Demi-chan wa Kataritai', ['亚人酱有话要说', '亜人ちゃんは語りたい']],
  ['学园奶爸', 'Gakuen Babysitters', ['学园奶爸', '学園ベビーシッターズ']],
  ['龙与魔女', 'BURN THE WITCH', ['龙与魔女', 'BURN THE WITCH']],
  ['Lv2开始开外挂的前勇者候补过着悠哉异世界生活', 'Lv2 Kara Cheat datta Moto Yuusha Kouho no Mattari Isekai Life', ['Lv2开始开外挂的前勇者候补过着悠哉异世界生活', 'Lv2からチートだった元勇者候補のまったり異世界ライフ']],
  ['和班上第二可爱的女孩子成为朋友', 'Class de 2-banme ni Kawaii Onnanoko to Tomodachi ni Natta', ['和班上第二可爱的女孩子成为朋友', 'クラスで２番目に可愛い女の子と友だちになった']],
  ['迷茫管家与懦弱的我', 'Mayo Chiki!', ['迷茫管家与懦弱的我', 'まよチキ!']],
  ['东京暗鸦', 'Tokyo Ravens', ['东京暗鸦', '東京レイヴンズ']],
  ['言语如汽水般涌现', 'Cider no You ni Kotoba ga Wakiagaru', ['言语如汽水般涌现', 'サイダーのように言葉が湧き上がる']],
  ['异世界超能魔术师', 'Isekai Cheat Magician', ['异世界超能魔术师', '異世界チート魔術師']],
  ['暴食的巴萨卡', 'Boushoku no Berserk', ['暴食的巴萨卡', '暴食のベルセルク']],
  ['最后大魔王', 'Ichiban Ushiro no Daimaou', ['最后大魔王', 'いちばんうしろの大魔王']],
  ['我立于百万生命之上', '100-man no Inochi no Ue ni Ore wa Tatteiru', ['我立于百万生命之上', '100万の命の上に俺は立っている']],
  ['魔女与使魔', 'Witch Watch', ['魔女与使魔', 'WITCH WATCH', 'ウィッチウォッチ']],
  ['BLOOD-C', 'BLOOD-C', ['BLOOD-C', 'ブラッドシー']],
  ['可爱又变态你喜欢吗？', 'Kawaikereba Hentai demo Suki ni Natte Kuremasu ka?', ['可爱又变态你喜欢吗？', '可愛ければ変態でも好きになってくれますか？']],
  ['境界之轮回', 'Kyoukai no Rinne', ['境界之轮回', '境界のRINNE']],
  ['白熊咖啡馆', 'Shirokuma Cafe', ['白熊咖啡馆', '白くまカフェ']],
  ['多罗罗', 'Dororo', ['多罗罗', 'どろろ']],
  ['血界战线', 'Kekkai Sensen', ['血界战线', '血界戦線']],
  ['彩云国物语', 'Saiunkoku Monogatari', ['彩云国物语', '彩雲国物語']],
  ['伯爵与妖精', 'Hakushaku to Yousei', ['伯爵与妖精', '伯爵と妖精']],
  ['枪神', 'Trigun', ['枪神', 'トライガン']],
  ['翠星之加尔刚蒂亚', 'Suisei no Gargantia', ['翠星之加尔刚蒂亚', '翠星のガルガンティア']],
  ['苍蓝钢铁的琶音', 'Aoki Hagane no Arpeggio', ['苍蓝钢铁的琶音', '苍蓝钢铁战舰']],
  ['地球队长', 'Captain Earth', ['地球队长', 'キャプテン・アース']],
  ['银河机攻队庄严皇子', 'Ginga Kikoutai Majestic Prince', ['银河机攻队庄严皇子', '银河机攻队']],
  ['重神机潘多拉', 'Juushinki Pandora', ['重神机潘多拉', '重神機パンドーラ']],
  ['M3～黑色之钢～', 'M3: Sono Kuroki Hagane', ['M3～黑色之钢～', 'M3 黑色之钢']],
  ['机甲少女 FRAME ARMS GIRL', 'Frame Arms Girl', ['机甲少女 FRAME ARMS GIRL', '机甲少女']],
  ['千绪的通学路', 'Chio-chan no Tsuugakuro', ['千绪的通学路', '千緒の通学路']],
  ['只要贝尔哲布布大小姐喜欢就好', 'Beelzebub-jou no Okinimesu mama.', ['只要贝尔哲布布大小姐喜欢就好', 'ベルゼブブ嬢のお気に召すまま。']],
  ['恋爱禁止的世界', 'Koi to Uso', ['恋爱禁止的世界', '恋と嘘']],
  ['人马小姐不迷茫', 'Centaur no Nayami', ['人马小姐不迷茫', 'セントールの悩み']],
  ['天使降临到我身边！', 'Watashi ni Tenshi ga Maiorita!', ['天使降临到我身边！', '私に天使が舞い降りた！']],
  ['邻家索菲', 'Tonari no Kyuuketsuki-san', ['邻家索菲', '邻家的吸血鬼']],
  ['音乐少女', 'Ongaku Shoujo', ['音乐少女', '音楽少女']],
  ['噬魂师NOT！', 'Soul Eater NOT!', ['噬魂师NOT！', 'SOUL EATER NOT!']],
  ['池袋西口公园', 'Ikebukuro West Gate Park', ['池袋西口公园', '池袋ウエストゲートパーク']],
  ['歌舞伎町夏洛克', 'Kabukichou Sherlock', ['歌舞伎町夏洛克', '歌舞伎町シャーロック']],
  ['漂流少年', 'Sonny Boy', ['漂流少年', 'サニーボーイ']],
  ['不死少女杀人笑剧', 'Undead Girl Murder Farce', ['不死少女杀人笑剧', 'アンデッドガール・マーダーファルス']],
  ['虫笼的卡伽斯特尔', 'Mushikago no Cagaster', ['虫笼的卡伽斯特尔', '虫籠のカガステル']],
  ['弦音 -风舞高中弓道部-', 'Tsurune: Kazemai Koukou Kyuudoubu', ['弦音 -风舞高中弓道部-', '弦音']],
  ['编舟记', 'Fune wo Amu', ['编舟记', '舟を編む']],
  ['平家物语', 'Heike Monogatari', ['平家物语', '平家物語']],
  ['ACCA13区监察课', 'ACCA: 13-ku Kansatsu-ka', ['ACCA13区监察课', 'ACCA 13区监察课']],
  ['不愉快的怪物庵', 'Fukigen na Mononokean', ['不愉快的怪物庵', '不機嫌なモノノケ庵']],
  ['极黑的布伦希尔特', 'Gokukoku no Brynhildr', ['极黑的布伦希尔特', '極黒のブリュンヒルデ']],
  ['樱花任务', 'Sakura Quest', ['樱花任务', 'サクラクエスト']],
  ['滚动的女孩', 'The Rolling Girls', ['滚动的女孩', 'ローリング☆ガールズ']],
  ['Tamayura～hitotose～', 'Tamayura: Hitotose', ['玉响', 'たまゆら']],
  ['Kamichu！', 'Kamichu!', ['神是中学生', 'かみちゅ！']],
  ['爱丽丝与藏六', 'Alice to Zouroku', ['爱丽丝与藏六', 'アリスと蔵六']],
  ['星合之空', 'Hoshiai no Sora', ['星合之空', '星合の空']],
  ['网球优等生', 'Baby Steps', ['网球优等生', 'ベイビーステップ']],
  ['乒乓', 'Ping Pong the Animation', ['乒乓', 'ピンポン']],
  ['强风吹拂', 'Kaze ga Tsuyoku Fuiteiru', ['强风吹拂', '风が强く吹いている']],
  ['奇巧计程车', 'Odd Taxi', ['奇巧计程车', 'オッドタクシー']],
  ['宝石商人理查德的谜鉴定', 'Housekishou Richard-shi no Nazo Kantei', ['宝石商人理查德的谜鉴定']],
  ['死亡游行', 'Death Parade', ['死亡游行', 'デス・パレード']],
  ['花开伊吕波', 'Hanasaku Iroha', ['花开伊吕波', '花咲くいろは']],
  ['K', 'K', ['K', 'K Project']],
  ['永生之酒', 'Baccano!', ['永生之酒', 'BACCANO!']],
  ['无头骑士异闻录', 'Durarara!!', ['无头骑士异闻录', 'DRRR!!']],
  ['元气囝仔', 'Barakamon', ['元气囝仔', 'ばらかもん']],
  ['飞翔的魔女', 'Flying Witch', ['飞翔的魔女', 'ふらいんぐうぃっち']],
  ['白兔糖', 'Usagi Drop', ['白兔糖', 'うさぎドロップ']],
  ['昭和元禄落语心中', 'Shouwa Genroku Rakugo Shinjuu', ['昭和元禄落语心中', '昭和元禄落語心中']],
  ['拂晓的尤娜', 'Akatsuki no Yona', ['拂晓的尤娜', '晨曦公主']],
  ['精灵守护者', 'Seirei no Moribito', ['精灵守护者', '精霊の守り人']],
  ['虫师', 'Mushishi', ['虫师', '蟲師']],
  ['吸血鬼骑士', 'Vampire Knight', ['吸血鬼骑士', 'ヴァンパイア騎士']],
  ['黑执事', 'Kuroshitsuji', ['黑执事', '黒執事']],
  ['天元突破 红莲螺岩', 'Tengen Toppa Gurren Lagann', ['天元突破 红莲螺岩', '天元突破红莲螺岩']],
  ['花牌情缘', 'Chihayafuru', ['花牌情缘', 'ちはやふる']],
  ['迷宫饭', 'Dungeon Meshi', ['迷宫饭', 'ダンジョン飯']],
  ['Re:CREATORS', 'Re:Creators', ['Re:CREATORS', 'Re:Creators']],
  ['全部成为F', 'Subete ga F ni Naru', ['全部成为F', 'すべてがFになる']],
  ['奇诺之旅', 'Kino no Tabi: The Beautiful World', ['奇诺之旅', 'キノの旅']],
  ['死后文', 'Shigofumi', ['死后文', 'シゴフミ']],
  ['神薙', 'Kannagi', ['神薙', 'かんなぎ']],
  ['学生会的一己之见', 'Seitokai no Ichizon', ['学生会的一己之见', '学生会的一存']],
  ['天体的秩序', 'Sora no Method', ['天体的秩序', '天体のメソッド']],
  ['我家有个鱼干妹', 'Himouto! Umaru-chan', ['我家有个鱼干妹', '干物妹！小埋']],
  ['干物妹！小埋R', 'Himouto! Umaru-chan R', ['干物妹！小埋R']],
  ['玉子市场', 'Tamako Market', ['玉子市场', 'たまこまーけっと']],
  ['来自风平浪静的明天', 'Nagi no Asukara', ['来自风平浪静的明天', '凪のあすから']],
  ['未闻花名', 'Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai.', ['未闻花名', '我们仍未知道那天所看见的花的名字。']],
  ['GJ部', 'GJ-bu', ['GJ部', 'GJ部']],
  ['月刊少女野崎君', 'Gekkan Shoujo Nozaki-kun', ['月刊少女野崎君']],
  ['恋爱研究所', 'Love Lab', ['恋爱研究所']],
  ['男子高中生的日常', 'Danshi Koukousei no Nichijou', ['男子高中生的日常']],
  ['荒川爆笑团', 'Arakawa Under the Bridge', ['荒川爆笑团']],
  ['夏目友人帐', 'Natsume Yuujinchou', ['夏目友人帐']],
  ['通灵王', 'Shaman King', ['通灵王', 'シャーマンキング']],
  ['一弦定音！', 'Kono Oto Tomare!', ['一弦定音！', 'この音とまれ！']],
  ['疾走王子', 'Prince of Stride: Alternative', ['疾走王子', 'プリンス・オブ・ストライド']],
  ['与魔共舞', 'Dance with Devils', ['与魔共舞', 'ダンス・ウィズ・デビルス']],
  ['幕末Rock', 'Bakumatsu Rock', ['幕末Rock', '幕末ロック']],
  ['八犬传 东方八犬异闻', 'Hakkenden: Touhou Hakken Ibun', ['八犬传 东方八犬异闻', '八犬伝']],
  ['组长女儿与保姆', 'Kumichou Musume to Sewagakari', ['组长女儿与保姆', '組長娘と世話係']],
  ['圣女的魔力是万能的', 'Seijo no Maryoku wa Bannou desu', ['圣女的魔力是万能的', '聖女の魔力は万能です']],
  ['即使如此世界依然美丽', 'Soredemo Sekai wa Utsukushii', ['即使如此世界依然美丽', 'それでも世界は美しい']],
  ['ZEGAPAIN', 'Zegapain', ['ZEGAPAIN', 'ゼーガペイン']],
  ['最后流亡', 'Last Exile', ['最后流亡', 'LAST EXILE']],
  ['神灵狩', 'Shinreigari', ['神灵狩', 'Ghost Hound']],
  ['租赁魔法', 'Rental Magica', ['租赁魔法', 'レンタルマギカ']],
  ['夜樱四重奏', 'Yozakura Quartet', ['夜樱四重奏', '夜桜四重奏']],
  ['绝对可怜Children', 'Zettai Karen Children', ['绝对可怜Children', '絶対可憐チルドレン']],
  ['怪物王女', 'Kaibutsu Oujo', ['怪物王女']],
  ['有你的小镇', 'Kimi no Iru Machi', ['有你的小镇', '君のいる町']],
  ['神不在的星期天', 'Kamisama no Inai Nichiyoubi', ['神不在的星期天', '神さまのいない日曜日']],
  ['战勇。', 'Senyuu.', ['战勇。', '戦勇。']],
  ['黑之宣告', 'Schwarzesmarken', ['黑之宣告', 'シュヴァルツェスマーケン']],
  ['WWW.迷糊餐厅', 'WWW.Working!!', ['WWW.迷糊餐厅', 'WWW.WORKING!!']],
]

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let lastRequest = 0
async function request(query, variables) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await sleep(Math.max(0, 1500 - (Date.now() - lastRequest)))
    lastRequest = Date.now()
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
    if (response.status === 404) {
      const payload = await response.json()
      if (payload.data) return payload.data
    }
    if ([404, 429, 500, 502, 503, 504].includes(response.status) && attempt < 3) {
      const retryAfter = Number(response.headers.get('retry-after') || 0) * 1000
      const wait = Math.max(retryAfter, response.status === 429 ? 60000 : 10000 * (attempt + 1))
      console.log(`AniList 暂时返回 HTTP ${response.status}，等待 ${Math.ceil(wait / 1000)} 秒后重试`)
      await sleep(wait)
      continue
    }
    if (!response.ok) throw new Error(`AniList HTTP ${response.status} (${JSON.stringify(variables)}): ${(await response.text()).slice(0, 500)}`)
    const data = await response.json()
    if (data.errors?.length) throw new Error(JSON.stringify(data.errors))
    return data.data
  }
}

const query = `query($search:String,$id:Int,$page:Int!){Media(search:$search,id:$id,type:ANIME){
  id title{romaji english native} synonyms format countryOfOrigin genres description(asHtml:false) siteUrl
  characters(page:$page,perPage:50,sort:ROLE){pageInfo{hasNextPage} edges{role node{id name{full native alternative} image{large} description(asHtml:false) gender age}
    voiceActors(language:JAPANESE){id name{full native} image{large}}}}
}}`

const directory = process.argv.find(x => x.startsWith('--source-dir='))?.slice(13) || 'data/anime_update_drafts'
const requestedMediaIds = process.argv.find(x => x.startsWith('--media='))?.slice(8).split(',').map(Number)
if (requestedMediaIds) {
  for (const mediaId of requestedMediaIds) {
    if (!Number.isInteger(mediaId) || mediaId <= 0) throw new Error('作品ID必须为正整数')
    let media = (await request(query, { id: mediaId, page: 1 })).Media
    if (!media) throw new Error(`作品不存在：${mediaId}`)
    const characters = [...media.characters.edges]
    let page = 1
    while (media.characters.pageInfo.hasNextPage) {
      if (page >= 10) throw new Error(`${mediaId} 角色分页超过限制`)
      media = (await request(query, { id: mediaId, page: ++page })).Media
      characters.push(...media.characters.edges)
    }
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(path.join(directory, `anime-source-${mediaId}.json`), JSON.stringify({ fetchedAt: new Date().toISOString(), ...media, characters }, null, 2))
    console.log(`${media.title.romaji} #${mediaId}: ${characters.length} 位关联角色`)
  }
  process.exit(0)
}
const exported = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const existingTitles = new Set(exported.map(x => x.anime_title))
const existingIds = new Set(exported.map(x => x.id))
const output = process.argv.find(x => x.startsWith('--output='))?.slice(9) || 'data/anime_update_drafts/batch11-selection.json'
const result = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')).anime : []
const excludedFile = process.argv.find(x => x.startsWith('--exclude-selection='))?.slice(20)
const excludedTitles = new Set(excludedFile ? JSON.parse(fs.readFileSync(excludedFile, 'utf8')).anime.flatMap(x => [x.title, ...x.titleAliases]) : [])
for (const a of result) for (const title of [a.title, ...a.titleAliases]) excludedTitles.add(title)
const selected = [...pool].filter(x => !x[2].some(t => existingTitles.has(t) || excludedTitles.has(t)))
for (let i = selected.length - 1; i > 0; i--) {
  const j = crypto.randomInt(i + 1)
  ;[selected[i], selected[j]] = [selected[j], selected[i]]
}
fs.mkdirSync(directory, { recursive: true })
const requestedCount = Number(process.argv.find(x => x.startsWith('--count='))?.slice(8) || 15)
for (const [title, search, titleAliases] of selected) {
  if (result.length >= requestedCount) break
  let media = (await request(query, { search, page: 1 })).Media
  if (!media) continue
  const chars = [...media.characters.edges]
  let page = 1
  while (media.characters.pageInfo.hasNextPage) {
    media = (await request(query, { id: media.id, page: ++page })).Media
    chars.push(...media.characters.edges)
    if (page >= 10) throw new Error(`${title} 角色分页超过限制`)
  }
  if (chars.some(x => existingIds.has(x.node.id))) {
    console.log(`跳过可能已收录的作品：${title} / ${media.title.romaji}`)
    continue
  }
  const snapshot = { fetchedAt: new Date().toISOString(), ...media, characters: chars }
  const snapshotPath = path.posix.join(directory, `anime-source-${media.id}.json`)
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2))
  const validImage = (url, bucket, id) => {
    if (typeof url !== 'string') return false
    if (new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/${bucket}/large/[bn]?\\d+-[\\w-]+\\.(?:png|jpe?g|webp)$`, 'i').test(url)) return true
    const legacyIds = bucket === 'staff' && id > 95000 ? `${id}|${id - 95000}` : String(id)
    return new RegExp(`^https://s\\d+\\.anilist\\.co/file/anilistcdn/${bucket}/large/(?:${legacyIds})\\.jpe?g$`, 'i').test(url)
  }
  const usable = chars.filter(x => validImage(x.node.image.large, 'character', x.node.id) &&
    (media.countryOfOrigin === 'CN' || x.voiceActors.some(v => validImage(v.image.large, 'staff', v.id))))
  if (usable.length < 5) {
    console.log(`暂缓图片资料不足的作品：${title}，${usable.length}/${chars.length} 位角色图片与日配合规`)
    continue
  }
  result.push({ mediaId: media.id, title, titleAliases, search, snapshotPath, characterCount: chars.length })
  fs.writeFileSync(output, JSON.stringify({ selectedAt: new Date().toISOString(), anime: result }, null, 2))
  console.log(`${result.length}. ${title} / ${media.title.romaji} #${media.id}: ${chars.length} 位角色`)
}
fs.writeFileSync(output, JSON.stringify({ selectedAt: new Date().toISOString(), anime: result }, null, 2))
if (result.length < requestedCount) throw new Error(`只筛选出 ${result.length}/${requestedCount} 部未收录作品`)
console.log(`选取 ${result.length} 部，已保存 ${output}`)
