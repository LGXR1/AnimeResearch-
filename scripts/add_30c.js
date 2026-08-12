import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const D=[
// 魔道祖师(4)
[127465,{n:'魏无羡',a:'魔道祖师',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127465-vxaYSRgh7Rjf.png',dsc:'夷陵老祖——云梦江氏大弟子。修鬼道的天才被世人畏惧和唾弃。手持笛子"陈情"驱使万鬼。性格洒脱不羁但内心深处藏着对蓝忘机最深的信任。"蓝湛——你信我吗？"——他从来不需要答案。'}],
[127466,{n:'蓝忘机',a:'魔道祖师',img:'https://s4.anilist.co/file/anilistcdn/character/large/b127466-J3otX1gFDatJ.png',dsc:'姑苏蓝氏二公子——含光君。白袍古琴不问世事的面瘫剑仙。十六年前没能在不夜天城保护好那个人。十六年后——"魏婴——我在。"——他用十六年等一个人回来。'}],
[130267,{n:'江澄',a:'魔道祖师',img:'https://s4.anilist.co/file/anilistcdn/character/large/b130267-lxfJm8K1W2ml.png',dsc:'云梦江氏宗主——紫电鞭持有者。魏无羡的师弟和最终的决裂者。莲花坞的覆灭改变了他的一生。他恨魏无羡——但他也找了他十三年。"魏无羡——你给我回来。"'}],
[142935,{n:'虞紫鸢',a:'魔道祖师',img:'https://s4.anilist.co/file/anilistcdn/character/large/b142935-EYbtP7MESooQ.png',dsc:'云梦江氏主母——江澄的母亲。性格刚烈强势但在莲花坞覆灭时她用生命守护了自己的丈夫和家。'}],
// 全职高手(3)
[124093,{n:'叶修',a:'全职高手',img:'https://s4.anilist.co/file/anilistcdn/character/large/b124093-nEn03Xv0gD1S.png',dsc:'荣耀之神——"一叶之秋"。被俱乐部驱逐后从零开始在网吧重新建队。十年荣耀——一千五百场连胜——三百六十五天不休息——只因为"荣耀——从来不只是一个游戏。"'}],
[130025,{n:'陈果',a:'全职高手',img:'https://s4.anilist.co/file/anilistcdn/character/large/n130025-A0SOf9nSZBPB.png',dsc:'兴欣网吧的老板——荣耀菜鸟叶修的忠实粉丝。收留了被驱逐的叶修然后眼睁睁看着他把自己网吧变成了冠军训练营。'}],
[130027,{n:'唐柔',a:'全职高手',img:'https://s4.anilist.co/file/anilistcdn/character/large/n130027-4w88NcgN8RwC.png',dsc:'钢琴天才——在网吧摸了叶修的键盘后决意挑战荣耀职业联赛。从新手到职业选手只用了几个月——因为她的手腕里住着钢琴家的灵魂。"我不需要天赋——我只需要赢。"'}],
// 哪吒(2)
[156371,{n:'哪吒',a:'哪吒之魔童降世',img:'https://s4.anilist.co/file/anilistcdn/character/large/b156371-9mVrYawnrawo.png',dsc:'混元珠转世——注定要成为魔丸的少年。被全村人畏惧和唾弃。但他的父母从未放弃过他。在雷电交加的对决中——"我命由我不由天——是魔是仙我自己说了算！"'}],
[156374,{n:'敖丙',a:'哪吒之魔童降世',img:'https://s4.anilist.co/file/anilistcdn/character/large/b156374-EcKKQgzUPClk.png',dsc:'灵珠转世的龙族太子——被龙族寄予了全部希望的少年。与哪吒是唯一的朋友和最残酷的对手。"你是我唯一的朋友——但命运让我们必须厮杀。"'}],
// 野良神(3)
[84677,{n:'夜斗',a:'野良神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b84677-PFmohzIXD1ud.png',dsc:'穿着运动服的五元神——愿望只要五日元。没有神社居无定所靠着给人类打零工维持存在。他的过去——祸津神"夜卜"杀过的人比任何神都多。但他选择了用最不起眼的方式赎最深的罪。"你的愿望——我确实收到了。"'}],
[84679,{n:'壹岐日和',a:'野良神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b84679-GdMxvYy36M9H.png',dsc:'半妖体质的高中生——灵魂会自动脱离身体。为了恢复成为普通少女而向夜斗许愿。在所有人的不愿意中她是第一个愿意对夜斗说"谢谢"的人。"你是个好神明——夜斗。"'}],
[84681,{n:'雪音',a:'野良神',img:'https://s4.anilist.co/file/anilistcdn/character/large/b84681-vFMPNxeDkoqt.png',dsc:'夜斗的神器——金发少年。死前是个没人要的孩子死后成了没人要的神器。偷东西、撒谎、刺伤主人——但夜斗从未放弃过他。"我不是没人要——我有夜斗。"'}],
// 幻界战线(3)
[89025,{n:'莱昂纳多·沃奇',a:'幻界战线',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89025-mUe7SN8rIaWP.png',dsc:'拥有"神之义眼"的青年——被神秘生物赋予了看穿一切的眼睛。加入秘密结社莱布拉只是为了在纽约地狱般的地下世界活下来。每天都在被怪物追着跑然后一脸茫然地问"为什么是我——"。'}],
[89106,{n:'克劳斯·冯·莱因赫兹',a:'幻界战线',img:'https://s4.anilist.co/file/anilistcdn/character/large/b89106-nhuUmojcyv9w.png',dsc:'莱布拉的领袖——用拳头说话的红发巨汉。战斗风格——用牙齿咬碎对手然后用拳头轰飞整条街。可以徒手拧断吸血鬼的头。对同伴无比温柔——"保护这座城市的日常——就是我们莱布拉的使命。"'}],
[89130,{n:'扎普·伦弗洛',a:'幻界战线',img:'https://s4.anilist.co/file/anilistcdn/character/large/89130-W0uwE4ZDzcUq.jpg',dsc:'莱布拉的剑士——操纵血液战斗的银发流氓。每次见到莱昂纳多都在欺负他但也总是在最危险的时候挡在他面前。"小鬼——这是大人的战斗——你退后。"'}],
// 罪恶王冠(2)
[43278,{n:'樱满集',a:'罪恶王冠',img:'https://s4.anilist.co/file/anilistcdn/character/large/b43278-qtyFTwAaLiLb.jpg',dsc:'17岁的高中生——右手获得了"王的刻印"——能从少女体内抽出"虚空"作为武器。从懦弱少年变成了暴君再到最后的救赎。在失去了一切之后用自己的生命换回了所有人的未来。"我是——为了与你相遇而生。"'}],
[43280,{n:'楪祈',a:'罪恶王冠',img:'https://s4.anilist.co/file/anilistcdn/character/large/b43280-dxRTpIioqSg7.png',dsc:'网络乐队的虚拟歌手——真实身份是为了"夏娃计划"而制造的人造人。从不理解什么是"爱"到用最后一首歌拯救了整个世界。"盛开的野花啊——请你一定要告诉集——"'}],
// 终结的炽天使(3)
[83015,{n:'百夜优一郎',a:'终结的炽天使',img:'https://s4.anilist.co/file/anilistcdn/character/large/b83015-XmUdY42WSKRG.png',dsc:'被吸血鬼圈养的人类孤儿——逃出后加入了帝鬼军发誓杀光所有吸血鬼。手持Cursed Gear黑鬼系列。最恨吸血鬼但他最好的朋友就是那个变成了吸血鬼的人。"米迦——我一定会把你带回来的——"' }],
[87287,{n:'百夜米迦尔',a:'终结的炽天使',img:'https://s4.anilist.co/file/anilistcdn/character/large/b87287-cBUVUJNbvfvT.png',dsc:'优一郎的家人——为了保护优一郎被吸血鬼吸血变成了吸血鬼。金发血瞳的吸血鬼少年。被所有人类憎恨但他唯一在乎的是优一郎的安危。"优——我不会让任何人伤害你——哪怕是我自己。"'}],
[83017,{n:'柊筱娅',a:'终结的炽天使',img:'https://s4.anilist.co/file/anilistcdn/character/large/b83017-XXdnbunnBdTd.png',dsc:'帝鬼军的精英队员——总是微笑但从不表露真实感情。银色短发的少女。在优一郎身边一边捉弄他一边默默守护着他。"我当然有自己的理由——只是不想告诉你而已。"'}],
// 末日三问(2)
[121661,{n:'珂朵莉·诺塔·瑟尼欧里斯',a:'末日时在做什么',img:'https://s4.anilist.co/file/anilistcdn/character/large/b121661-ZMTXdRglB2fx.png',dsc:'人类灭亡后诞生的妖精兵——用圣剑战斗的金发少女。她只有15岁——她的生命每一天都在燃烧自己的"前世"记忆。遇到了那个叫她"珂朵莉"而不是"兵器"的男人。"威廉——谢谢你让我成为世界上最幸福的少女。"'}],
[122768,{n:'威廉·克梅修',a:'末日时在做什么',img:'https://s4.anilist.co/file/anilistcdn/character/large/122768-YNzTBE7wla0v.jpg',dsc:'最后的幸存人类——被封印了五百年后苏醒。成为妖精仓库的管理者努力挽救每一个妖精少女。他救不了任何人——但他至少能让她们在被燃烧殆尽前像普通人一样活过。'}],
// 食戟之灵(3)
[75216,{n:'幸平创真',a:'食戟之灵',img:'https://s4.anilist.co/file/anilistcdn/character/large/b75216-KDU8333eIcqf.jpg',dsc:'平民料理店继承者——被父亲扔进远月学园——这所靠料理决斗生存的贵族料理学校。用一碗鸡蛋拌饭挑战整个精英世界。"招待不周——"这句开场白是他每次在最不可能赢的战斗中最平静的宣言。'}],
[75284,{n:'薙切绘里奈',a:'食戟之灵',img:'https://s4.anilist.co/file/anilistcdn/character/large/b75284-4Hiyq7DOwvy7.png',dsc:'拥有"神之舌"的远月学园女王——能分辨出任何料理中所有成分和火候。从不认证任何人的料理——直到那个平民端上了一碗鸡蛋拌饭。她颤抖着说出了她从没说过的评价——"好吃"。'}],
[76026,{n:'田所惠',a:'食戟之灵',img:'https://s4.anilist.co/file/anilistcdn/character/large/b76026-cQAQTlZFfG2e.png',dsc:'远月学园最差的学生——每次料理对决都吓得发抖但在创真的鼓励下一次次站上对决台。她的料理是用"温柔"作为调料的——这是所有天才都无法复制的美味。'}],
// 打工吧魔王大人(2)
[70733,{n:'真奥贞夫',a:'打工吧魔王大人',img:'https://s4.anilist.co/file/anilistcdn/character/large/b70733-d564H7iUj7Y2.png',dsc:'安特·伊苏拉——魔王撒旦。在勇者手中逃到日本后失去魔力变成了快餐店员工。社畜中的社畜——每天赶着末班车打工补贴家用。站在柜台后面大喊"欢迎光临——麦当劳！"的前魔王是日本动画最荒谬也最可爱的画面。'}],
[70735,{n:'游佐惠美',a:'打工吧魔王大人',img:'https://s4.anilist.co/file/anilistcdn/character/large/b70735-DmmbHRLKpS0E.png',dsc:'安特·伊苏拉的勇者艾米莉亚——追着魔王来到日本当起了呼叫中心客服。每天和魔王在同一个城市过着普通的打工生活。从宿敌到邻居——"为什么你这个魔王住的地方比我还便宜！"'}],
// 斗破苍穹(2)
[146584,{n:'萧炎',a:'斗破苍穹',img:'https://s4.anilist.co/file/anilistcdn/character/large/b146584-4aP9ukOzMnse.png',dsc:'曾经的修炼天才——一夜之间沦为废物被所有人嘲笑和悔婚。三年之后他带着药老留下的灵魂和全新的力量回来了。"三十年河东三十年河西——莫欺少年穷！"'}],
[138713,{n:'药尘',a:'斗破苍穹',img:'https://s4.anilist.co/file/anilistcdn/character/large/b138713-hdndr5zLVjbr.jpg',dsc:'曾经的斗尊——只剩一缕残魂寄宿在戒指中。成为萧炎的导师教他炼药和修炼。外表是个俊美的青年但实际年龄超过百岁。"小子——想变强吗？那就把你的一切都交给我吧。"'}],
// 斗罗大陆(4)
[142006,{n:'马红俊',a:'斗罗大陆',img:'https://s4.anilist.co/file/anilistcdn/character/large/b142006-jzWKkQk56d8n.jpg',dsc:'史莱克七怪之一——凤凰武魂觉醒的胖少年。在最初的七个怪物中他的爆发力是最强的。性格憨厚忠实的重情义汉子。'}],
[142007,{n:'朱竹清',a:'斗罗大陆',img:'https://s4.anilist.co/file/anilistcdn/character/large/b142007-LChXs3jV2DDV.jpg',dsc:'史莱克七怪之一——幽冥灵猫武魂的黑发少女。戴沐白的未婚妻。沉默寡言但行动力极强。在七怪中最冷酷但也最可靠。'}],
[142010,{n:'宁荣荣',a:'斗罗大陆',img:'https://s4.anilist.co/file/anilistcdn/character/large/b142010-XvJFQnJa56R3.png',dsc:'七宝琉璃宗的公主——九宝琉璃塔的辅助系魂师。最初是个娇气大小姐但在史莱克学院的魔鬼训练中蜕变为最出色的辅助魂师。'}],
[142005,{n:'戴沐白',a:'斗罗大陆',img:'https://s4.anilist.co/file/anilistcdn/character/large/b142005-VuGRUuRhHsxg.jpg',dsc:'星罗帝国皇子——白虎武魂的强攻系魂师。史莱克七怪中最强战力的前三名。骄傲但不自大——为了保护朱竹清和伙伴可以付出一切。'}],
// 补充
[88993,{n:'一濑红莲',a:'终结的炽天使',img:'https://s4.anilist.co/file/anilistcdn/character/large/b88993-YNw36YYleasn.png',dsc:'帝鬼军的中佐——优一郎和米迦尔的监护人。在最黑暗的时期保护了唯一存活的几个孩子。用自己的方式与掌控帝鬼军的权力者周旋。"这群孩子——我来保护。"'}],
]
let c=0
for(const[id,o]of D){
  const{error}=await supabase.from('characters').upsert({id,name:o.n,anime_title:o.a,image:o.img,description:o.dsc||'',traits:[],nicknames:o.nk||[]},{onConflict:'id'})
  process.stdout.write(error?'❌':'+');c++
}
console.log('\n重建search_text...')
const{data:chs}=await supabase.from('characters').select('id,name,anime_title,nicknames,traits,voice_actors(name)')
for(const x of chs||[]){const s=[x.name,x.anime_title||'',...(x.nicknames||[]),...(x.traits||[]),...(x.voice_actors||[]).map(v=>v.name)].join(' ');await supabase.from('characters').update({search_text:s}).eq('id',x.id)}
console.log('✅',c)
