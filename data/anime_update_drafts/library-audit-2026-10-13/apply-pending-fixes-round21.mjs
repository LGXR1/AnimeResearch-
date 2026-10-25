import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('缺少 Supabase 本地环境变量')

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const sources = {
  26753: 'https://ja.wikipedia.org/wiki/フルメタル・パニック!の登場人物; https://myanimelist.net/character/26753/Zaied',
  28380: 'https://ja.wikipedia.org/wiki/魍魎の匣; https://myanimelist.net/character/28380/Atsuko_Chuuzenji',
  28922: 'https://ja.wikipedia.org/wiki/時をかける少女_(2006年の映画); https://myanimelist.net/character/28922/Soujirou_Takase',
  29335: 'https://ja.wikipedia.org/wiki/魍魎の匣; https://myanimelist.net/character/29335/Mysterious_Man',
  30727: 'https://en.wikipedia.org/wiki/A_Chinese_Ghost_Story:_The_Tsui_Hark_Animation; https://myanimelist.net/character/30727/Ning',
  30728: 'https://en.wikipedia.org/wiki/A_Chinese_Ghost_Story:_The_Tsui_Hark_Animation; https://myanimelist.net/character/30728/Siu_Lan',
  30731: 'https://en.wikipedia.org/wiki/A_Chinese_Ghost_Story:_The_Tsui_Hark_Animation; https://myanimelist.net/character/30731/Red_Beard',
  30734: 'https://en.wikipedia.org/wiki/A_Chinese_Ghost_Story:_The_Tsui_Hark_Animation; https://myanimelist.net/character/30734/Siu_Deep',
  30738: 'https://en.wikipedia.org/wiki/A_Chinese_Ghost_Story:_The_Tsui_Hark_Animation; https://myanimelist.net/character/30738/White_Cloud',
  32827: 'https://en.wikipedia.org/wiki/Broken_Blade; https://kitsu.io/characters/regarz-arrow',
  34322: 'https://ja.wikipedia.org/wiki/焼きたて!!ジャぱんの登場人物; https://myanimelist.net/character/34322/Umasaburou_Azuma',
  34323: 'https://ja.wikipedia.org/wiki/焼きたて!!ジャぱんの登場人物; https://myanimelist.net/character/34323/Umatarou_Azuma',
  36374: 'https://en.wikipedia.org/wiki/Tamayura; https://myanimelist.net/character/36374/Maestro',
  36375: 'https://en.wikipedia.org/wiki/Tamayura; https://myanimelist.net/character/36375/Tamae_Sawatari',
  36377: 'https://en.wikipedia.org/wiki/Tamayura; https://myanimelist.net/character/36377/Fus_Grandmother',
  37083: 'https://ja.wikipedia.org/wiki/頭文字Dの登場人物; https://myanimelist.net/character/37083/Miki',
  37120: 'https://ja.wikipedia.org/wiki/GA_芸術科アートデザインクラス; https://myanimelist.net/character/37120/Mayumi_Usami',
  37349: 'https://ja.wikipedia.org/wiki/機動戦艦ナデシコの登場人物; https://myanimelist.net/character/37349/Genichirou_Tsukiomi',
  38052: 'https://ja.wikipedia.org/wiki/海月姫; https://myanimelist.net/character/38052/Saburouta_Negishi',
  39434: 'https://myanimelist.net/character/39434/Asuna_Watase',
  39491: 'https://ja.wikipedia.org/wiki/マクロスFの登場人物; https://myanimelist.net/character/39491/Miranda_Meliyn',
  40224: 'https://en.wikipedia.org/wiki/List_of_Toriko_characters; https://toriko.fandom.com/wiki/Ohban',
  41968: 'https://ja.wikipedia.org/wiki/GOSICK_-ゴシック-; https://en.wikipedia.org/wiki/List_of_Gosick_episodes',
  42219: 'https://ja.wikipedia.org/wiki/GOSICK_-ゴシック-; https://myanimelist.net/character/42219/Sophie',
  43686: 'https://ja.wikipedia.org/wiki/真ゲッターロボ_世界最後の日; https://myanimelist.net/character/43686/Professor_Shikishima',
}

const updates = {
  26753: {
    traits: ['男性', '比宗介年长三岁', '少年宗介的旧识', '曾教导宗介战斗技巧', '游击队成员', '驾驶Zy-98“影”', '盖乌隆的部下', '使用加特林炮', '与宗介交战后身亡'],
    description: '赛义德是《全金属狂潮》第一季原创故事“故乡的风”中的角色。宗介以“卡西姆”之名生活的童年时期，赛义德比他年长三岁，曾教他战斗技巧。游击队营地遭盖乌隆率领的部队袭击后，赛义德一度被认为已经死亡；他后来驾驶Zy-98“影”作为盖乌隆的部下再度出现，并在与宗介交战后身亡。',
  },
  28380: {
    traits: ['女性', '中禅寺秋彦的妹妹', '稀谭舍员工', '报社记者', '调查连环分尸案', '与关口巽同行', '与鸟口守彦同行', '途中误入美马坂近代医学研究所', '第六集以她的采访笔记开场'],
    description: '中禅寺敦子是中禅寺秋彦的妹妹，也是稀谭舍报社的记者。她为调查连续分尸案，与关口巽、鸟口守彦一同前往相模湖，途中误入美马坂近代医学研究所。动画第六集以她关于幽灵目击传闻的采访笔记开场；敦子以记者身份接触案件线索，并把调查带入故事主线。',
  },
  28922: {
    traits: ['男性', '真琴的同班同学', '校园学生', '料理实习小火事件当事人', '承受真琴时跃避开的事故', '遭加藤等同学欺负', '会反击欺凌者', '与加藤之间的冲突升级', '向真琴投掷灭火器', '导致友梨受伤'],
    description: '高濑宗次郎是《穿越时空的少女》中真琴的同班同学。真琴通过时间跳跃躲开料理实习时的小火后，高濑承受了事故后果，并因此遭加藤等同学欺负。他每次都会反击，使双方的嫌隙逐渐升级。后来高濑把矛头转向真琴并向她投掷灭火器，结果误伤了在场的友梨。',
  },
  29335: {
    name: '久保竣公',
    nicknames: ['久保竣公', 'Shunkō Kubo', 'Shunko Kubo', '謎の男', '谜之男'],
    traits: ['男性', '约20岁', '细长眉毛', '眼神清冷', '数根手指缺失', '常戴手套', '新锐幻想小说家', '为《近代文艺》杂志投稿', '处女作获幻想文学新人奖', '正在创作《匣中之女》', '居住在车库改建的箱形住宅', '熟悉修验道与伊势神道'],
    description: '久保竣公是《魍魉之匣》中的新锐幻想小说家，最初以“谜之男”的身份出现。他约二十岁，眉目清秀，有数根手指缺失，因此常戴手套。他向稀谭舍发行的《近代文艺》投稿，处女作《蒐集者之庭》曾获本朝幻想文学新人奖，并正在创作《匣中之女》。久保住在国分寺一处由车库改造的箱形住宅。',
  },
  30727: {
    traits: ['男性', '职业收税员', '与小兰分手后独自行旅', '养有爱犬黄金', '在旅途中遇见白云与十里', '进入鬼城', '爱上女鬼小倩', '把小倩藏在伞中避开阳光', '请求红胡子放过小倩'],
    description: '宁采臣是1997年动画电影《小倩》中的收税员。他与恋人小兰分手后，带着爱犬黄金独自行旅，途中遇见和尚白云、十里与驱鬼人红胡子。宁采臣后来误入鬼城并爱上女鬼小倩；得知她不能接触阳光后，他把她安置在伞中保护，并恳求红胡子不要伤害她。',
  },
  30728: {
    name: '小兰',
    nicknames: ['小兰', 'Siu Lan', 'シウラン', '西兰'],
    traits: ['女性', '宁采臣的旧恋人', '在故事开端与宁采臣分手', '选择了另一名男子', '分手后宁采臣独自上路', '与宁采臣的爱犬黄金有关', '是电影开篇人物', '与鬼城中的女鬼小倩是不同角色'],
    description: '小兰是动画电影《小倩》开篇出现的人物，也是宁采臣此前的恋人。她离开宁采臣并选择了另一名男子，令宁采臣带着爱犬黄金独自上路。小兰与后来在鬼城中遇见的女鬼小倩是两名不同角色；她和宁采臣的分手交代了他踏上旅途的起因，也开启了影片之后的奇幻经历。',
  },
  30731: {
    traits: ['男性', '驱鬼人', '以红胡子为名', '与白云和十里竞争', '携带机械战斗装置', '起初受雇斩杀女鬼小倩', '曾与宁采臣、小倩同行', '机械装置曾为一行人挡下攻击', '答应宁采臣不再伤害小倩'],
    description: '红胡子是《小倩》中的驱鬼人，与白云、十里和尚互相竞争。他起初把消灭女鬼作为职业，遇见宁采臣和小倩时也打算斩杀小倩。鬼城混战中，红胡子的机械装置为同行者挡下攻击并被毁；听过宁采臣的请求后，他答应不再伤害小倩，并与两人继续同行。',
  },
  30734: {
    traits: ['女性幽灵', '英文名Butterfly', '小倩的朋友', '与小倩一同为树妖夫人做事', '曾协助树妖夫人接近宁采臣', '被树妖夫人追问小倩下落', '受逼问后透露小倩与宁采臣同行', '后来帮助小倩与宁采臣逃离', '相信人类与幽灵可以共存'],
    description: '小蝶（Butterfly）是动画电影《小倩》中的女鬼，也是小倩的朋友。她与小倩一同受树妖夫人支配，曾协助夫人寻找宁采臣；遭逼问后，小蝶透露小倩正与宁采臣同行。后来她意识到人类与幽灵能够共存，转而帮助两人逃离树妖夫人，成为他们脱身的关键助力。',
  },
  30738: {
    traits: ['男性和尚', '佛教僧人', '与十里同行', '试图净化邪灵并送其往阴间', '与红胡子互为竞争者', '袭击鬼城时对付山恶', '剃掉山恶的长发', '曾与宁采臣、小倩一行交战', '在灵界事件中使用法术'],
    description: '白云是《小倩》中与十里同行的佛教和尚，两人试图净化邪灵并送它们前往阴间，也与红胡子处于竞争关系。鬼城遭袭时，白云负责对付山恶，并剃掉了山恶的长发。宁采臣和小倩的旅途中多次遇到这名和尚，他的驱邪行动推动了鬼城冲突进一步升级。',
  },
  32827: {
    traits: ['男性', '莱卡特的弟弟', '阿洛家族成员', '与哥哥同为无魔力者', '不能像多数人一样操纵石英', '属于克里修纳王国人物', '身处克里修纳与雅特涅斯战争背景', '在比诺滕被确认仍然存活'],
    description: '雷加兹·阿洛是莱卡特的弟弟，也是无魔力者，无法像大多数人那样操纵石英。故事后段确认，克里修纳与雅特涅斯的战争期间他仍在比诺滕存活。原记录中的“父亲”“教官”均无来源支持，现已删除；英文名为Reigaz Arlo，资料将他列作阿洛家族成员。',
  },
  34322: {
    name: '东马马三郎',
    nicknames: ['Umasaburou Azuma', '东马马三郎', '东马', '马三郎'],
    traits: ['男性', '东马马太郎的弟弟', '东和马的叔祖父', '居住在岐阜县土岐市', '以美浓烧闻名的陶艺家', '擅长制作陶器', '为Japan 44号制作烤箱用烧板', '选用富含透锂长石的土', '由声优长岛雄一配音'],
    description: '东马马三郎是《日式面包王》主角东和马的叔祖父，也是东马马太郎的弟弟。他住在岐阜县土岐市，是以美浓烧闻名的陶艺家。为协助和马开发Japan 44号，他用富含透锂长石的土制成烤箱用烧板；作品中他吃下44号面包后，夸张地形容自己仿佛到了天堂。',
  },
  34323: {
    name: '东马马太郎',
    nicknames: ['Umatarou Azuma', '东马马太郎', '东马', '马太郎', '东和马的祖父'],
    traits: ['男性', '东和马的祖父', '居住在新潟县', '经营稻米农场', '89岁', '东马马次郎与马三郎的兄长', '兄弟都拥有敏锐味觉', '曾把自制面粉寄给孙子', '寄出的粉误做成乌冬面粉', '由声优长岛雄一配音'],
    description: '东马马太郎是《日式面包王》主角东和马的祖父，在新潟县经营稻米农场。人物资料记载他当时89岁，另有两名弟弟马次郎与马三郎。东马兄弟都拥有敏锐味觉，能对食物作出强烈反应；马太郎曾把自制面粉寄给孙子，却因制作方法弄错而寄成了乌冬面粉。',
  },
  36374: {
    traits: ['男性', '竹原照相馆店主', '熟悉相机与摄影器材', '泽渡枫父亲生前的朋友', '枫经常光顾他的店', '常与女性顾客调情', '又称日之丸（Hinomaru）', '帮助呈现枫父亲留下的摄影回忆', '在OVA第一集登场'],
    description: '“大师”本名日之丸，是《玉响》中竹原一家照相馆的店主，熟悉相机并常与女性顾客调情。他是泽渡枫父亲生前的朋友，枫经常到店里与他谈相机、照片及父亲留下的回忆。大师也在枫继续摄影的过程中给予帮助，是她在竹原生活中熟悉的长辈。',
  },
  36375: {
    traits: ['女性', '泽渡枫与泽渡香的母亲', '与女儿共同搬到竹原', '女儿提出回竹原后决定搬家', '在母亲经营的咖啡馆工作', '会尝试制作新食谱', '丈夫已故', '支持女儿重新接触父亲故乡'],
    description: '泽渡珠惠是泽渡枫与弟弟香的母亲。枫提出想回到父亲的故乡竹原生活后，珠惠决定带孩子们搬回当地。她在自己母亲经营的咖啡馆工作，也会尝试新的食谱。丈夫去世后，她仍支持枫通过摄影重新接触父亲留下的回忆，并陪伴孩子适应新的生活。',
  },
  36377: {
    traits: ['女性长者', '泽渡枫与香的祖母', '泽渡珠惠的母亲', '经营家庭咖啡馆', '居住在竹原', '枫一家住在她经营的咖啡馆', '在OVA第一集登场', '为泽渡一家提供居所'],
    description: '枫的祖母是泽渡珠惠的母亲，也是枫与香的外祖母。她在竹原经营咖啡馆，珠惠和孩子们搬回当地后，一家人住在咖啡馆中。祖母在OVA第一集登场；她的店铺既是家人的住所，也是泽渡一家重新在竹原开始生活的落脚处，枫与香也在这里度过回到竹原后的日常生活。',
  },
  37083: {
    traits: ['男性', '拓海高中足球社的学长', '比拓海高一届', '曾在东京上大学', '与茂木夏树交往过', '长发俊朗外表', '曾与多名女性交往', '回乡后强行要求与夏树复合', '带走夏树并与拓海展开雪道追逐', '不具备走山赛车手技术'],
    description: '御木是藤原拓海足球社时期高一届的学长，后来到东京上大学。他曾与茂木夏树交往，也和其他女性有过关系。大学放假回乡后，御木试图强迫夏树复合并带她离开，拓海开车追上两人，双方在雪道上展开追逐。御木是普通人，并没有走山赛车手的驾驶技术。',
  },
  37120: {
    name: '宇佐美真由实',
    nicknames: ['Mayumi Usami', '宇佐美真由实', '宇佐美老师', '鲨鱼老师', '真弓'],
    traits: ['女性', 'GA一年级副班主任', '美术教师', '外貌出众', '温柔认真', '体弱且容易贫血', '教龄尚浅', '毕业于彩井学园工业大学信息班', '对外间巧真有好感', 'GA一年升二年级时剪短头发'],
    description: '宇佐美真由实是《GA艺术科美术设计班》中GA一年级的副班主任和美术教师。她外貌出众、性格温柔认真，但身体较弱且容易贫血；由于教龄尚浅，也会为学生作业的提交情况烦恼。她对同事外间巧真抱有好感，学生曾因她自我介绍时口误称她为“鲨鱼老师”。',
  },
  37349: {
    traits: ['男性', '木连优人部队成员', '驾驶“玛吉恩”与“大玛吉恩”', '白鸟九十九的同僚与好友', '身体能力出众', '曾盲目崇拜草壁中将', '受命杀害主张和平的九十九', '因好友之死感到悔恨', '参加推动和平的热血政变', '后来加入Nergal秘密服务部门', '训练天河明人的武术与机动兵器操作'],
    description: '月臣元一朗是木连优人部队的机师，驾驶“玛吉恩”与“大玛吉恩”，也是白鸟九十九的好友。他曾盲目崇拜草壁中将，并亲手杀死主张与地球和平的九十九；事后月臣深感悔恨，成为“热血政变”的核心参与者。之后他离开木连加入Nergal秘密服务部门，并协助训练天河明人。',
  },
  38052: {
    traits: ['男性', '日本内阁总理大臣', '鲤渊修与藏之介的舅舅', '鲤渊修母亲的兄长', '公开场合举止稳重', '私下常说冷笑话', '喜欢称修为“修修”', '喜爱偶像', '支持穿女装的藏之介'],
    description: '根岸三郎太是《海月姬》中的日本首相，也是鲤渊修与藏之介的舅舅。公开场合他举止稳重，私下却经常讲冷笑话，把修称作“修修”，并喜欢偶像。他也能自然接纳穿女装的藏之介，甚至把藏之介的照片当作“侄女”介绍给别人，是鲤渊家族中言行活泼的长辈。',
  },
  39434: {
    traits: ['故事主角', '小学生', '父亲已故', '母亲是医院护士', '父亲留给她矿石收音机', '喜欢收听收音机中的神秘音乐', '常独自在山间消磨时间', '养有名叫咪咪的猫', '遇见少年修恩', '与森崎老师前往阿加尔塔'],
    description: '渡濑明日菜是《追逐繁星的孩子》的小学生主角。父亲去世后，护士母亲常因长时间值班不在家，明日菜便带着父亲留下的矿石收音机独自在山间听神秘音乐，并由宠物猫咪咪陪伴。她遇见来自地下世界的少年修恩后，开始追寻阿加尔塔的秘密，并与森崎老师踏上旅程。',
  },
  39491: {
    traits: ['女性', '米兰达·梅琳', '超时空要塞F第12届Miss Macross冠军', '身材出众', '演员贾米斯·梅琳的孙女', '与松浦七濑中学时相识', '电影《BIRD HUMAN》主演莎拉·诺姆', '性格高傲', '在片场轻视并冷落兰卡', '仰慕雪莉露'],
    description: '米兰达·梅琳是第12届“Miss Macross Frontier”大赛冠军，也是演员贾米斯·梅琳的孙女，与松浦七濑是中学旧识。她在剧中电影《BIRD HUMAN》中饰演女主角莎拉·诺姆。米兰达性格高傲，曾在片场轻视并冷落兰卡，却以仰慕的目光看待雪莉露；作品设定没有把她写成舞台伴舞。',
  },
  40224: {
    traits: ['男性', '蜂蜜监狱副典狱长', '监狱内的第二负责人', '隶属司法事务局管理的美食监狱', '体格极其高大', '红色皮肤', '长有尖牙', '脸部布满缝线与螺栓', '外貌近似传统恶魔形象'],
    description: '奥班是《美食的俘虏》中蜂蜜监狱的副典狱长，负责协助管理这座由司法事务局管辖的美食监狱，并位列典狱长之下。奥班身材极其高大，红色皮肤、尖牙和脸上的缝线与螺栓，使他看起来像传统描绘中的恶魔。他是监狱篇登场的配角。',
  },
  41968: {
    traits: ['女性', '索维尔王妃', '昵称“蓝玫瑰”', '1897年自法国嫁入索维尔', '深受年轻女性欢迎', '性格内向', '对宫廷人际关系感到孤独', '曾沉迷利维坦等神秘学', '与利维坦育有一子', '以农民身份与儿子隐居生活'],
    description: '可可·萝丝是《GOSICK》的索维尔王妃，因美貌被称为“蓝玫瑰”，深受年轻女性欢迎。她1897年从法国嫁入王室，性格内向，因宫廷关系孤独而沉迷神秘学，并与利维坦育有一子。传闻中的王妃遇害者其实是她的替身女仆；真正的可可·萝丝幸存下来，与儿子隐居生活。',
  },
  42219: {
    name: '索菲',
    nicknames: ['Sophie', 'Zofi', 'ゾフィ', '索菲', '佐菲'],
    traits: ['女性', '久城一弥所在男子宿舍的管理员', '红发', '作风爽快', '会请一弥跑腿', '会把看完的报纸给一弥', '曾在女子宿舍担任女仆', '与塞西尔相识', '喜欢东方风格的物品', '常拿走一弥的衣物和小物件'],
    description: '索菲（Zofi）是《GOSICK》中久城一弥所在男子宿舍的红发管理员，性格爽快，常让一弥替她跑腿，也会把读完的报纸给他。她曾在女子宿舍担任女仆，并在那里认识教师塞西尔。索菲喜欢东方风格的物品，还常拿走一弥房间里的衣服和小物件。',
  },
  43686: {
    traits: ['男性', '克隆技术博士', '研究盖塔射线技术', '早乙女博士与神隼人的旧识', '参与豪与同伴的开发培养', '在第一部开始时登场', '第二部成为隼人在塔中的搭档', '性格近似疯狂科学家', '研究好奇心集中于真龙与豪', '塔突击时留守至最后', '最终与塔一同消失'],
    description: '敷岛博士是《真盖塔机器人 世界最后之日》中研究盖塔射线克隆技术的科学家，也是早乙女博士与神隼人的旧识。他参与豪及其伙伴的开发与培养，第二部中成为隼人在“塔”中的搭档。敷岛行事近乎疯狂科学家，尤其关注真龙以及与之共鸣的豪；塔突击时他留守至最后，并随塔一同消失。',
  },
}

const traitResolvedIds = Object.keys(updates).map(Number)
const descriptionResolvedIds = [26753, 29335, 30727, 30728, 30731, 30734, 30738, 34322, 34323, 36377, 37120, 37349, 40224, 41968, 42219]
const local = JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8'))
const slim = JSON.parse(fs.readFileSync('data/characters_slim.json', 'utf8'))
const localById = new Map(local.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const ids = Object.keys(updates).map(Number)
for (const id of ids) {
  const patch = updates[id]
  const row = localById.get(id)
  if (!row || !slimById.has(id)) throw new Error(`本地导出缺少角色 ${id}`)
  if ((patch.traits || row.traits).length < 8) throw new Error(`角色 ${id} 的特征不足 8 条`)
  if (patch.description && (patch.description.length < 100 || patch.description.length > 200)) throw new Error(`角色 ${id} 的简介为 ${patch.description.length} 字，不在 100–200 字范围内`)
  if (!sources[id]) throw new Error(`角色 ${id} 缺少来源记录`)
}

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const [charactersResult, actorsResult] = await Promise.all([
  db.from('characters').select('id,name,anime_title').in('id', ids),
  db.from('voice_actors').select('character_id,name').in('character_id', ids),
])
if (charactersResult.error) throw charactersResult.error
if (actorsResult.error) throw actorsResult.error
const remoteById = new Map((charactersResult.data || []).map(row => [Number(row.id), row]))
if (remoteById.size !== ids.length) throw new Error(`Supabase 返回 ${remoteById.size}/${ids.length} 位角色，停止写入`)
for (const id of ids) {
  const row = localById.get(id)
  const remote = remoteById.get(id)
  if (remote.anime_title !== row.anime_title) throw new Error(`角色 ${id} 的作品名与 Supabase 不符`)
  if (remote.name !== row.name) throw new Error(`角色 ${id} 的本地与 Supabase 姓名不一致：${row.name} / ${remote.name}`)
}

const actorsById = new Map()
for (const actor of actorsResult.data || []) {
  const list = actorsById.get(Number(actor.character_id)) || []
  list.push(actor.name)
  actorsById.set(Number(actor.character_id), list)
}
const payloads = ids.map(id => {
  const row = localById.get(id)
  const patch = updates[id]
  const next = {
    name: patch.name || row.name,
    nicknames: patch.nicknames || row.nicknames || [],
    traits: patch.traits || row.traits || [],
    description: patch.description || row.description,
  }
  next.search_text = [next.name, row.anime_title, ...next.nicknames, ...next.traits, ...(actorsById.get(id) || [])].join(' ')
  return { id, row, next }
})

for (const item of payloads) {
  const { error } = await db.from('characters').update(item.next).eq('id', item.id)
  if (error) throw new Error(`角色 ${item.id} 写入失败：${error.message}`)
}
const readbackResult = await db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', ids)
if (readbackResult.error) throw readbackResult.error
const savedById = new Map((readbackResult.data || []).map(row => [Number(row.id), row]))
if (savedById.size !== ids.length) throw new Error(`Supabase 回读 ${savedById.size}/${ids.length} 条`)
for (const item of payloads) {
  const saved = savedById.get(item.id)
  for (const key of ['name', 'nicknames', 'traits', 'description']) {
    if (JSON.stringify(saved[key] ?? null) !== JSON.stringify(item.next[key] ?? null)) throw new Error(`角色 ${item.id} 的 ${key} 回读不一致`)
  }
  if (saved.search_text !== item.next.search_text || saved.search_text.includes(saved.description || '\u0000')) throw new Error(`角色 ${item.id} 的搜索索引回读失败`)
  item.row.name = saved.name
  item.row.nicknames = saved.nicknames
  item.row.traits = saved.traits
  item.row.description = saved.description
  item.row.search_text = saved.search_text
  const slimRow = slimById.get(item.id)
  for (const key of ['name', 'nicknames', 'traits', 'description', 'search_text']) slimRow[key] = saved[key]
}

fs.writeFileSync('data/characters_full.json', JSON.stringify(local, null, 2))
fs.writeFileSync('data/characters_slim.json', JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of local) csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const correctedAt = new Date().toISOString()
for (let batch = 25; batch <= 34; batch++) {
  const path = `${root}/batch${batch}-audit-report.json`
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const inBatch = ids.filter(id => report.checkedIds.map(Number).includes(id))
  if (!inBatch.length) continue
  for (const field of ['pendingTraitVerificationIds', 'pendingExternalVerificationIds']) report[field] = (report[field] || []).filter(id => !traitResolvedIds.includes(Number(id)))
  for (const field of ['pendingShortDescriptionIds', 'pendingDescriptionQualityIds']) report[field] = (report[field] || []).filter(id => !descriptionResolvedIds.includes(Number(id)))
  if (batch === 32) report.pendingVisualVerificationIds = (report.pendingVisualVerificationIds || []).filter(id => Number(id) !== 39721)
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...inBatch])]
  report.localFollowup ||= {}
  report.localFollowup.researchCorrections ||= {}
  for (const id of inBatch) report.localFollowup.researchCorrections[id] = {
    sources: sources[id].split('; '),
    correctedAt,
    databaseReadbackVerified: true,
    introExcludedFromSearch: true,
  }
  if (batch === 32) {
    report.localFollowup.imageVerification ||= {}
    report.localFollowup.imageVerification[39721] = {
      sources: ['https://s4.anilist.co/file/anilistcdn/character/large/b39721-4tIwXbf3Ut0K.png', 'https://myanimelist.net/character/39721/Onyx'],
      verifiedVisually: true,
      imagesMatch: true,
      verifiedAt: correctedAt,
    }
  }
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

const summaryPath = `${root}/batch25-34-audit-summary.md`
const summaryAddition = `\n\n## 后续核实与修正（${correctedAt.slice(0, 10)}）\n\n- 依据日文维基百科、MyAnimeList、作品剧情资料与 Kitsu 页面，修正 ${ids.length} 位人物的姓名、身份、简介或特征，并重建搜索索引；逐条回读 Supabase，简介未进入搜索索引。来源和逐条记录见各批次报告。\n- 解决 15 条原先缺少有效简介的记录；仍缺少足够可核实资料的为 34419、43961、43976，共 3 条，未编造人物经历。\n- ID 39721 欧尼克斯的 AniList 图片与 MyAnimeList 角色图逐图一致，图片待核实项已关闭。\n- 检查 8 位 JOJO 角色的 AniList 与 MyAnimeList 动画关联和声优记录，未找到可确认的动画配音；按既定规则保留为空，不填游戏或宣传语音。\n- 当前待核实特征：24129、34419、36309、42948、42949、43961、43976，共 7 位。\n- 未提交 Git。\n`
fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf8') + summaryAddition)

console.log(JSON.stringify({ correctedAt, modifiedCount: ids.length, ids, descriptionsResolved: descriptionResolvedIds, traitPendingIds: [24129, 34419, 36309, 42948, 42949, 43961, 43976], image39721Verified: true, supabaseReadbackVerified: true, introExcludedFromSearch: true }, null, 2))
