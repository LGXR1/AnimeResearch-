import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const profilePath = `${root}/anilist-character-profiles.json`
const supplementPath = `${root}/anilist-character-profiles-batch4-supplement.json`
const reportPath = `${root}/batch4-audit-report.json`

const profileDoc = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
const supplement = JSON.parse(fs.readFileSync(supplementPath, 'utf8'))
Object.assign(profileDoc.profiles, supplement.profiles)
profileDoc.supplementedAt = supplement.fetchedAt
profileDoc.supplementedIds = supplement.requestedIds

const fixes = {
  718: {
    traits: ['日本人神经外科医生', '任职于杜塞尔多夫的艾斯勒纪念医院', '以出色的手术技术受到院长赏识', '坚持治疗决定不应由患者身份决定', '违抗院长安排救治约翰', '因此失去晋升机会', '多年后发现约翰与连环命案有关', '为阻止约翰继续杀人而追查其行踪', '不愿逃避自己当年的选择'],
    description: '天马贤三是任职于杜塞尔多夫艾斯勒纪念医院的日本神经外科医生，凭出色手术技术受到院长赏识。一次手术中，他违抗院方安排，优先救治受枪伤的男孩约翰，因此失去原本唾手可得的晋升机会。多年后，一连串命案让天马发现约翰仍活着；他为阻止自己曾救下的孩子继续杀人，踏上追查之路。',
  },
  719: {
    traits: ['李贝尔特夫妇的双胞胎儿子', '比双胞胎妹妹安娜年长', '童年经历与红玫瑰宅邸有关', '曾在天马手术后获救', '擅长操纵他人的恐惧与欲望', '能煽动旁人实施暴力', '真实身世长期成谜', '以冷静而礼貌的外表隐藏恶意', '是天马追查的连环案件核心人物'],
    description: '约翰·李贝尔特是李贝尔特夫妇的双胞胎儿子，也是天马曾经救治的男孩。他外表温文有礼，擅长洞察并操纵他人的恐惧，常诱使旁人走向暴力与毁灭。约翰的童年经历与身世被刻意抹去，红玫瑰宅邸等事件逐步揭开他的过去；多年后，天马为阻止他制造更多悲剧而一路追查。',
  },
  720: {
    traits: ['约翰的双胞胎妹妹', '金发', '曾以安娜·李贝尔特之名生活', '创伤后改名妮娜·弗度纳', '在海德堡进入大学', '童年记忆曾因创伤而缺失', '接受过射击训练', '性格善良而坚韧', '努力摆脱童年经历的阴影', '在得知约翰行踪后重新追查身世'],
    description: '安娜·李贝尔特是约翰的双胞胎妹妹，童年创伤后改名妮娜·弗度纳，在海德堡生活并进入大学。她一度失去部分记忆，努力以新的身份开始生活；得知哥哥仍与一连串命案有关后，过往经历再次找上她。安娜曾接受射击训练，性格善良而坚韧，在保护身边人的同时，也试图弄清双胞胎共同经历的真相。',
  },
  721: {
    name: '伦格',
    nicknames: ['伦格', 'Runge', 'Inspector Lunge', 'ルンゲ', '鲁恩格', '朗格警部'],
    traits: ['德国联邦刑事警察局的资深刑警', '奉命调查杜塞尔多夫连环命案', '起初认定天马是凶手', '记忆力惊人，能逐项复盘案件细节', '思考时会用手指模拟敲击键盘', '办案严谨而固执', '长期把工作置于家庭之前', '会根据新证据重新检视旧判断', '在追查约翰时逐渐理解天马的选择'],
    description: '伦格是德国联邦刑事警察局的资深刑警，受命调查杜塞尔多夫连环命案，并一度认定天马就是凶手。他记忆力惊人，思考案情时会用手指做出仿佛敲击键盘的动作，逐项复盘细节。伦格办案严谨而固执，长期将工作置于家庭之前；随着追查约翰的证据逐渐浮现，他也开始重新审视自己最初的判断。',
  },
  723: {
    traits: ['橘发', '棕色眼瞳', '草帽海贼团航海士', '梦想绘制世界地图', '凭直觉感知细微天气变化', '精通航海与气象知识', '使用天候棒作战', '曾为拯救可可亚西村而加入恶龙海贼团', '对财宝有强烈兴趣', '重视并保护自己的伙伴', '外号“小偷猫”', '悬赏金为3亿6600万贝里', '巨乳'],
    description: '娜美是草帽海贼团的航海士，梦想亲手绘制完整的世界地图。她凭直觉就能察觉细微天气变化，熟悉航海与气象知识，并使用天候棒进行战斗。娜美童年时被恶龙海贼团控制，为了赎回故乡而替对方绘制海图；路飞等人帮助她解放可可亚西村后，她才真正加入伙伴。她爱财，却始终把同伴放在心上。',
  },
  724: {
    traits: ['黑发', '草帽海贼团狙击手', '长鼻子', '擅长使用弹弓与自制弹药', '发明和修理能力强', '爱吹牛也常说谎', '遇到强敌时容易害怕', '朋友受威胁时能鼓起勇气战斗', '以成为勇敢的海上战士为目标', '悬赏金为5亿贝里', '曾以“狙击王”身份行动', '“GOD·乌索普”是德雷斯罗萨事件后的称号'],
    description: '乌索普是草帽海贼团的狙击手，擅长使用弹弓、自制弹药和各种发明，也能修理船只与器械。他爱吹牛、遇到强敌时常会害怕，却总在朋友受威胁时重新鼓起勇气。他以成为“勇敢的海上战士”为目标，曾戴面具化名“狙击王”协助伙伴；德雷斯罗萨事件后，他获得“GOD·乌索普”的称号，悬赏金升至5亿贝里。',
  },
  730: {
    traits: ['浦饭幽助最亲密的朋友与竞争对手', '就读皿屋敷中学', '自称学校最强的不良少年', '灵力强大并能凝聚成灵剑', '擅长近身格斗', '性格直率而重义气', '常为朋友和雪菜挺身而出', '曾为救幽助而参加魔界相关战斗', '外表粗犷但心地善良'],
    description: '桑原和真是浦饭幽助最亲密的朋友与竞争对手，也是皿屋敷中学的不良少年。他拥有强大的灵力，能将灵力凝聚成灵剑，并擅长近身格斗。桑原外表粗犷、说话直率，实际上十分善良重义；他珍惜朋友，也对雪菜抱有真挚感情，常在幽助或同伴遇险时不顾自身安危地挺身而出。',
  },
  734: {
    traits: ['灵界引路人', '负责引导亡者前往灵界', '常穿粉色和服', '蓝发束成马尾', '骑着船桨在空中飞行', '性格开朗健谈', '有时会用玩笑缓和紧张气氛', '经常向幽助传达灵界任务', '在人间与灵界之间担任联络者'],
    description: '牡丹是灵界的引路人，负责把亡者带往灵界，也常在人间与灵界之间为幽助传递任务和情报。她留着蓝色马尾，常穿粉色和服，并骑着船桨在空中飞行。牡丹性格开朗健谈，偶尔会用玩笑缓和紧张气氛；虽然职位与死神相近，却不像传统想象中的阴森使者，而是幽助一行可靠又亲切的联络人。',
  },
  745: {
    traits: ['圣米亚特尔女学园现任艾特瓦尔', '受到三所女子学园学生敬仰', '留有银色长发', '钢琴演奏技艺出众', '气质神秘且不易亲近', '常逃避艾特瓦尔的例行事务', '与学生会长六条深雪关系密切', '受到转学生苍井渚砂吸引', '逐渐重新承担艾特瓦尔职责'],
    description: '花园静马是圣米亚特尔女学园现任艾特瓦尔，受到三所女子学园学生敬仰。她留着银色长发，钢琴演奏技艺出众，气质神秘却不容易亲近；静马常设法逃避艾特瓦尔的例行事务，让学生会长六条深雪颇为头疼。转学生苍井渚砂主动接近后，静马逐渐重新面对自己与他人的关系，也开始承担起艾特瓦尔的职责。',
  },
  747: {
    traits: ['凤学园学生', '为追寻童年遇见的王子而穿男生制服', '梦想成为能拯救他人的王子', '因佩戴戒指卷入蔷薇决斗', '剑术出色且行动果敢', '起初以保护姬宫安希为目标', '不愿被动等待他人拯救', '与学生会成员多次决斗', '逐渐质疑决斗规则背后的安排'],
    description: '天上欧蒂娜在童年遇见一位王子后，决定自己也要成为能够拯救他人的王子。她因此穿着男生制服就读凤学园，凭借佩戴的戒指卷入学生会组织的蔷薇决斗，并在最初以保护姬宫安希为目标。欧蒂娜剑术出色、行动果敢，不愿被动等待别人拯救；随着一次次决斗，她逐渐察觉比赛规则背后隐藏着更大的安排。',
  },
  748: {
    traits: ['凤学园的蔷薇新娘', '与决斗胜者绑定并随胜者行动', '居住在学园温室', '擅长园艺并照料蔷薇', '常戴眼镜', '肤色较深', '性格安静而顺从', '能够召出迪奥斯之剑', '是欧蒂娜保护与理解的对象'],
    description: '姬宫安希是凤学园的“蔷薇新娘”，按照决斗规则与胜者绑定并随其行动。她常戴眼镜，肤色较深，平日负责照料温室中的蔷薇，性格安静顺从。安希能够召出迪奥斯之剑，却很少主动表达自己的愿望；与欧蒂娜相遇后，她逐渐面对长期遭受的控制与伤害，也开始重新思考自己能否作出选择。',
  },
  752: {
    traits: ['凤学园剑道部与击剑社的优秀成员', '学生中广受敬重', '剑术和击剑能力出众', '佩戴橙色蔷薇徽章', '参加学生会举办的蔷薇决斗', '不相信奇迹能改变现实', '对同学薰怀有未获回应的感情', '刻意隐藏自己的脆弱', '与学生会长土谷瑠果有旧日关系'],
    description: '有栖川树璃是凤学园备受敬重的学生，也是剑术和击剑能力出众的决斗者。她佩戴橙色蔷薇徽章，参加学生会安排的蔷薇决斗，内心却不相信奇迹能够改变现实。树璃对同学薰怀有未获回应的感情，并刻意以高傲冷静的姿态掩饰脆弱；学生会长土谷瑠果的归来，也让她不得不面对过去的关系。',
  },
  781: {
    traits: ['秘银SRT部队的女军曹', '曾在美国海军陆战队服役', '相良宗介与克鲁兹的直属上司', '拥有丰富的实战与指挥经验', '熟悉电子战与特种作战', '性格豪爽泼辣', '烟酒不忌且酒量惊人', '在队伍中常扮演大姐头', '对部下的安全十分上心'],
    description: '梅丽莎·毛是秘银SRT部队的军曹，曾在美国海军陆战队服役，拥有丰富的实战与指挥经验。她是相良宗介和克鲁兹的直属上司，熟悉特种作战，也参与电子战相关任务。毛性格豪爽泼辣，烟酒不忌、酒量惊人，平时像队伍里的大姐头；执行任务时她判断果断，并认真照看部下的安全。',
  },
  797: {
    name: '柯内莉亚·li·布里塔尼亚',
    nicknames: ['柯内莉亚·li·布里塔尼亚', 'Cornelia li Britannia', 'コーネリア・リ・ブリタニア', '柯内莉亚', '第二皇女'],
  },
  834: {
    traits: ['露克斯地下竞技场的拳手', '因争斗失去左臂和右腿', '接受医生片山施行的Texhnolyze义肢改造', '后来卷入组织Organo的势力斗争', '沉默寡言，习惯以行动回应', '战斗能力强且容易失控', '与蘭及萝茜等人产生联系', '在露克斯的混乱中不断改变立场', '是观察城市衰败与冲突的重要视角'],
    description: '壹世是在露克斯地下竞技场搏斗的年轻拳手。与拉恩一派冲突后，他失去左臂和右腿，医生片山为他安装了Texhnolyze义肢；此后他被卷入组织Organo与其他势力争夺露克斯控制权的斗争。壹世沉默寡言，常以行动而非言语回应，随着与蘭和萝茜等人的相遇，他对这座濒临崩坏的城市逐渐产生不同理解。',
  },
  835: {
    traits: ['金发', '知名模特、歌手和演员', '经常自称“Misa-Misa”', '双亲被盗匪杀害', '因基拉处决凶手而崇拜夜神月', '取得第二本死亡笔记', '与死神雷姆结伴', '交换死神之眼后寿命减半', '性格活泼冲动并以第二基拉身份行动'],
    description: '弥海砂是知名模特、歌手和演员，常以“Misa-Misa”自称，性格活泼冲动。她的父母曾遭盗匪杀害，夜神月处决凶手后，海砂由此崇拜基拉并取得另一册死亡笔记，以“第二基拉”身份引起月的注意。她与死神雷姆结伴，并以寿命减半为代价交换死神之眼，希望帮助月追查其他持有死亡笔记的人。',
  },
  844: {
    traits: ['统道学园高中生', '学生会的核心成员', '擅长棗流古武术', '以实力和地位压制校内能力者', '被部分学生视为暴君', '训练时会与公牛搏斗', '有心脏方面的隐疾', '连续战斗约三分钟会受到限制', '与棗真夜有复杂的旧日情感', '是高柳雅孝的哥哥'],
    description: '高柳光臣是统道学园的强大格斗家和学生会核心成员，擅长棗流古武术，常凭实力与地位压制校内能力者，因此被部分学生视为暴君。他训练时甚至会与公牛搏斗，以免实战技巧退步；但心脏隐疾使他连续战斗约三分钟后受到限制。光臣与棗真夜有复杂的旧日情感，也是高柳雅孝的哥哥。',
  },
  845: {
    name: '鹰村守',
    nicknames: ['鹰村守', 'Mamoru Takamura', '鷹村守', 'Takamura', '鸭川拳馆王牌'],
    traits: ['鸭川拳馆职业拳手', '拳击天赋出众，力量与速度兼备', '由鸭川源二发掘并指导', '性格粗豪而自信', '爱吹嘘且常以“本大爷”自称', '最初以街头斗殴为生', '推动一郎、青木和木村接触拳击', '以取得多级别世界冠军为目标', '关键时刻会保护拳馆伙伴'],
    description: '鹰村守是鸭川拳馆的职业拳手，力量、速度和技术都十分出色，由鸭川源二从街头发掘并带入拳击界。他性格粗豪、自信，爱吹嘘，常以“本大爷”自称，也会毫不留情地嘲讽输掉比赛的选手。鹰村推动一郎、青木和木村走进拳击馆，并以夺取多个级别的世界冠军为目标；关键时刻，他仍会保护拳馆伙伴。',
  },
  846: {
    name: '青木胜',
    nicknames: ['青木胜', 'Masaru Aoki', '青木勝', 'Aoki', '青木拳手'],
    traits: ['鸭川拳馆的职业拳手', '与木村达也是好友并一同入馆', '高中时期曾是不良少年', '被鹰村击败后决定练拳', '性格滑稽，常负责活跃气氛', '擅长使用蛙跳拳', '招牌技巧包括“青蛙拳”和“看向别处”', '曾与今井胜久争夺日本轻量级冠军', '训练时认真且有韧性'],
    description: '青木胜是鸭川拳馆的职业拳手，与好友木村达也一起从不良少年转行练拳。他们最初只是想打中曾击败自己的鹰村守，后来逐渐真正喜欢上拳击。青木性格滑稽，常负责活跃气氛，却也认真训练，擅长使用“青蛙拳”和“看向别处”等独特技巧；他曾与今井胜久争夺日本轻量级冠军，并在激战后打成平手。',
  },
  847: {
    name: '木村达也',
    nicknames: ['木村达也', 'Tatsuya Kimura', '木村達也', 'Kimura', '木村拳手'],
    traits: ['鸭川拳馆的职业拳手', '青木胜最亲密的朋友', '高中时期曾与青木一起打架', '被鹰村击败后共同进入拳击馆', '性格沉稳随和', '在家族花店工作', '移动速度和左拳出手较快', '曾挑战拳王间柴了', '退役后仍因热爱拳击而重返擂台'],
    description: '木村达也是鸭川拳馆的职业拳手，也是青木胜最亲密的朋友。两人高中时曾是不良少年，被鹰村守击败后一起进入拳击馆；木村性格沉稳随和，平日还在家族经营的花店工作，训练时却毫不懈怠。他以快速左拳和灵活步法见长，曾挑战拳王间柴了；短暂退役后，他发现自己仍无法离开拳击，再次回到擂台。',
  },
  888: {
    name: '连城究',
    nicknames: ['连城究', 'Kyuu Renjo', '連城究', 'Kyuu', 'Q', '小究'],
    traits: ['Q侦探学园Class Q成员', '目标是成为名侦探', '性格乐观而富有正义感', '善于用逻辑解释案件', '能敏锐判断他人的品格', '偶尔因说话直率而闹笑话', '由母亲独自抚养长大', '幼年曾遭绑架并获侦探救出', '后来发现救过自己的侦探是生父'],
    description: '连城究是Q侦探学园Class Q的学生，乐观亲切，立志成为名侦探。他观察案件时善于推理，也常能判断他人的品格；不过说话偶尔不经思考，会让同伴尴尬或生气。究一直由母亲抚养，幼年曾遭犯罪者绑架，后来才知道救出自己的侦探正是父亲。加入侦探学园后，他与伙伴们共同解决案件并成长。',
  },
  889: {
    name: '美南惠',
    nicknames: ['美南惠', 'Megumi Minami', '美南恵', 'Megu', '小惠'],
    traits: ['Q侦探学园Class Q成员', '拥有瞬间记忆能力', '能快速记住现场细节', '擅长发现物品移动或证据缺失', '性格活泼且有主见', '与连城究等同伴合作调查', '与姐姐同住', '父母长期在海外工作', '曾在东京国家才能开发研究中心学习'],
    description: '美南惠是Q侦探学园Class Q的成员，朋友常叫她“小惠”。她拥有瞬间记忆能力，能快速记住案发现场的细节，因此容易发现物品被移动或证据缺失。惠性格活泼、有主见，经常与连城究、天草流等伙伴共同调查案件；她与姐姐同住，父母则长期在海外工作。',
  },
  890: {
    name: '天草流',
    nicknames: ['天草流', 'Ryuu Amakusa', '天草流', 'Ryu', '流'],
    traits: ['Q侦探学园Class Q成员', '观察力和推理能力出众', '性格冷静寡言', '幼年父母去世后由组织Pluto照料', '曾长期缺少与同龄人相处的机会', '最初不易信任他人', '与连城究建立特殊默契', '逐渐接纳侦探学园的伙伴', '过去与Pluto的犯罪组织有关'],
    description: '天草流是Q侦探学园Class Q的成员，观察力和推理能力出众，性格冷静寡言。父母去世后，他曾由犯罪组织Pluto照料，童年长期缺少与同龄人交往的机会，因此起初不容易信任别人。连城究最先接纳并理解他，流也逐渐与Class Q的伙伴建立关系；他的身世与Pluto的联系，成为团队调查的重要线索。',
  },
  891: {
    name: '鸣泽数马',
    nicknames: ['鸣泽数马', 'Kazuma Narusawa', '鳴沢数馬', 'Kazuma', '数马'],
    traits: ['Q侦探学园Class Q成员', '年轻的电脑游戏程序员', '擅长用笔记本电脑搜集资料', '头脑聪明且学习能力强', '最初想从Class Q转入Class A', '同伴帮助他后决定留下', '常戴幸运帽寻找灵感', '与远山金太郎有友好竞争', '在团队中负责技术与信息支援'],
    description: '鸣泽数马是Q侦探学园Class Q的成员，也是年轻的电脑游戏程序员。他习惯随身带着笔记本电脑，利用网络和程序协助伙伴寻找案件资料。数马起初认为Class Q地位较低，曾想转入Class A；同伴在他遇到麻烦时伸出援手后，他选择留下。他聪明但有时依赖自己的幸运帽，也常与远山金太郎以不同的推理方式互相较劲。',
  },
  892: {
    name: '远山金太郎',
    nicknames: ['远山金太郎', 'Kintarou Tooyama', '遠山金太郎', 'Kinta', '金太郎'],
    traits: ['Q侦探学园Class Q成员', '父亲是受人尊敬的警察', '擅长柔道、剑道和空手道', 'Class Q中力量最大', '视力与嗅觉敏锐', '习惯凭直觉而非高科技推理', '曾离家独住并做海滨吉祥物兼职', '行动强硬但重视同伴', '与鸣泽数马有友好竞争'],
    description: '远山金太郎是Q侦探学园Class Q的成员，父亲是受人尊敬的警察。他练过柔道、剑道和空手道，身体强健，视力与嗅觉也十分敏锐。金太郎更相信直觉，不像数马那样依赖电脑；他曾因家庭纠纷搬出家中，靠海滨吉祥物兼职生活。虽然说话和行动直接，他在调查中常凭敏锐感官帮团队发现线索。',
  },
  906: {
    traits: ['红发', '护廷十三队六番队副队长', '斩魄刀为蛇尾丸', '与朽木露琪亚在流魂街相识', '曾是护廷十三队真央灵术院学生', '性格直率且好胜', '平时开朗随性，危急时十分认真', '把超越朽木白哉作为目标', '珍视露琪亚和其他伙伴'],
    description: '阿散井恋次是护廷十三队六番队副队长，红发，斩魄刀为蛇尾丸。他与朽木露琪亚在流魂街一同长大，后来进入真央灵术院并成为死神。恋次性格直率好胜，平时开朗随性，涉及伙伴安危时却会变得十分认真；他以超越队长朽木白哉为目标，也始终珍视露琪亚和其他同伴。',
  },
  907: {
    traits: ['黑发', '护廷十三队六番队队长', '朽木家第二十八代当主', '四大贵族之一的家族成员', '斩魄刀为千本樱', '性格冷静且举止克制', '重视尸魂界法律与秩序', '收养露琪亚为妹妹', '在职责与守护亲人之间经历挣扎'],
    description: '朽木白哉是护廷十三队六番队队长，也是尸魂界四大贵族之一朽木家的第二十八代当主。他留着黑发，斩魄刀为千本樱，举止冷静克制，坚信死神应维护法律与秩序。白哉迎娶绯真后答应照顾她的妹妹露琪亚，却因贵族身份与职责长期压抑私人感情；与黑崎一护等人的冲突使他重新思考守法和守护亲人之间的关系。',
  },
  909: {
    traits: ['尸魂界流魂街更木区出身', '护廷十三队十一番队队长', '以“剑八”之名闻名', '极度热衷与强者交战', '习惯单手持刀作战', '曾以眼罩压制灵压', '收留并命名草鹿八千流', '不熟悉斩魄刀的始解与卍解', '在战斗中逐步学会控制真正力量'],
    description: '更木剑八是护廷十三队十一番队队长，名字取自尸魂界最混乱的更木区，后来以“剑八”之名闻名。他热衷与强者交战，习惯单手持刀，并曾戴眼罩压制过强的灵压。剑八在流魂街遇见年幼的草鹿八千流后收留了她；他起初不熟悉斩魄刀的始解和卍解，也在一次次战斗中逐步学会控制真正的力量。',
  },
  944: {
    name: '小早川濑那',
    nicknames: ['小早川濑那', 'Sena Kobayakawa', '小早川瀬那', 'Eyeshield 21', '光速蒙面侠21'],
    traits: ['泥门高中一年级学生', '泥门恶魔蝙蝠队跑卫', '从小被同学使唤跑腿', '短距离速度极快', '以“光速蒙面侠21”身份参加比赛', '起初害羞胆怯', '通过美式足球逐渐建立自信', '擅长恶魔蝙蝠幽灵等变向跑法', '立志成为可靠的美式足球选手'],
    description: '小早川濑那是泥门高中一年级学生，也是泥门恶魔蝙蝠队的跑卫。他从小常被同学使唤跑腿，意外展现出的惊人速度被蛭魔妖一发现后，被迫戴上头盔以“光速蒙面侠21”身份加入球队。濑那起初害羞胆怯，却逐渐爱上美式足球，并练成“恶魔蝙蝠幽灵”等变向跑法，在一次次比赛中建立自信。',
  },
  945: {
    name: '蛭魔妖一',
    nicknames: ['蛭魔妖一', 'Youichi Hiruma', '蛭魔', 'Hiruma', '恶魔司令塔'],
    traits: ['泥门恶魔蝙蝠队四分卫', '球队创始人及队长', '头脑灵活，擅长制定战术', '以恐吓和威胁迫使他人行动', '随身持有大量枪械', '用“恶魔手册”记录他人秘密', '经常无视学校权威', '重视栗田良寛的球队梦想', '负责招募并组织泥门球队'],
    description: '蛭魔妖一是泥门恶魔蝙蝠队的四分卫、创始人和队长。他头脑灵活，擅长制定战术，却常用恐吓、威胁和“恶魔手册”迫使别人照计划行动，甚至随身携带大量枪械。他不太尊重学校权威，却为美式足球部争取到训练和经费，也因为珍视栗田良寛的梦想而组织起球队。蛭魔言行粗鲁，关键时刻却是泥门队最可靠的指挥者。',
  },
  946: {
    name: '栗田良宽',
    nicknames: ['栗田良宽', 'Ryokan Kurita', '栗田良寛', 'Kurita', '泥门中锋'],
    traits: ['泥门恶魔蝙蝠队中锋', '球队中体格最大、力量最强的球员', '身高约195厘米', '体重约145公斤', '性格温厚善良', '与蛭魔妖一共同创建球队', '曾因神龙寺选拔失利转入泥门', '住在父亲管理的寺院', '发力时会大喊“Funnuraba”'],
    description: '栗田良宽是泥门恶魔蝙蝠队的中锋，身高约195厘米、体重约145公斤，是队中体格最大、力量最强的球员。他外表魁梧，性格却温厚善良，发力时会大喊“Funnuraba”。栗田和蛭魔妖一共同创建球队；他原本就读神龙寺，却因球队选拔未能获得名额而转入泥门，仍一直把参加全国大赛的目标放在心上。',
  },
  947: {
    name: '进清十郎',
    nicknames: ['进清十郎', 'Seijuro Shin', '進清十郎', 'Shin', '王城白骑士王牌'],
    traits: ['王城白骑士队的线卫', '队伍王牌球员', '小早川濑那的主要对手', '性格沉默而专注', '注重训练和纪律', '擅长判断对手动作', '身体素质与擒抱能力出众', '与樱庭春人是队友和朋友', '试训时受到庄司教练赏识'],
    description: '进清十郎是王城白骑士队的王牌线卫，也是小早川濑那在赛场上的主要对手。他性格沉默专注，注重训练和纪律，擅长观察对手动作并完成擒抱。进最初与樱庭春人一同参加球队试训，庄司教练看中他的天赋后，特意叮嘱队员不要让他转去其他社团。进与樱庭既是队友也是朋友。',
  },
  953: {
    traits: ['拥有数百年寿命的真祖吸血鬼', '被纳吉·史普林菲尔德施加停留学园的诅咒', '以130厘米的孩童外形生活', '精通魔法与战斗', '曾是涅吉的敌人，后来成为导师', '在魔法界有多个恐怖称号', '后来化名雪姬', '收养涅吉的孙子刀太', '担任不死者组织UQ Holder的领导者'],
    description: '依文洁琳·A·K·麦道威尔是拥有数百年寿命的真祖吸血鬼，因纳吉·史普林菲尔德施加的诅咒而被困在学园，并长期以130厘米左右的孩童外形生活。她精通魔法与战斗，起初是涅吉的敌人，后来成为他的导师。在后续故事《UQ HOLDER!》中，她化名雪姬，收养刀太并领导由不死者组成的组织UQ Holder。',
  },
  954: {
    traits: ['麻帆良学园学生', '喜欢阅读并以书虫闻名', '性格安静害羞', '与绫濑夕映是亲密好友', '曾对魔法老师涅吉抱有好感', '与涅吉订立过临时契约', '神器是能以图画日记呈现他人想法的书', '在魔法事件中协助收集情报', '成年后仍与魔法世界保持联系'],
    description: '宫崎和香是麻帆良学园的学生，安静害羞，喜欢阅读，是班里的书虫；她与绫濑夕映关系亲密，也曾喜欢自己的魔法老师涅吉。和香曾与涅吉订立临时契约，获得能以图画日记形式呈现他人想法的神器。她在魔法事件中借助阅读和观察协助同伴搜集情报，成年后仍与魔法世界保持联系。',
  },
  955: {
    name: '雷门太郎',
    nicknames: ['雷门太郎', 'Tarou Raimon', '雷門太郎', 'Monta', '猴子'],
    traits: ['泥门恶魔蝙蝠队外接手', '背号80号', '曾是棒球少年', '拥有灵活的跳跃和接球能力', '臂展长于腿长', '崇拜外接手罗宾逊', '每次精彩接球后会摆出庆祝姿势', '常在句尾加上“MAX”', '因外表像猴子而被伙伴取笑'],
    description: '雷门太郎是泥门恶魔蝙蝠队的外接手，背号80号，原本是热爱棒球的少年。他虽然个子不高，却有灵活的跳跃能力、很长的手臂和出色的接球技术，甚至能单手接住蛭魔的快速传球。太郎崇拜外接手罗宾逊，每次完成精彩接球都会摆出庆祝姿势，还习惯在说话时加上“MAX”，因此被队友称作“猴子”。',
  },
  956: {
    name: '樱庭春人',
    nicknames: ['樱庭春人', 'Haruto Sakuraba', '桜庭春人', 'Sakuraba', '模特外接手'],
    traits: ['王城白骑士队外接手', '身高约189厘米', '同时以偶像模特身份活动', '曾梦想成为职业运动员', '因身高受到教练注意而加入球队', '长期羡慕实力更强的队友进清十郎', '一度对训练失去热情', '后来重新投入美式足球', '与进清十郎是队友和朋友'],
    description: '樱庭春人是王城白骑士队的外接手，身高约189厘米，也以偶像模特身份活动。他从小梦想成为职业运动员，凭身高进入球队，却很快被天赋更突出的队友进清十郎超越，因此一度对训练失去热情。樱庭后来重新投入美式足球，逐渐把挫败感转化为动力；他既是进的重要队友，也在追逐比赛成绩和演艺事业之间寻找自己的位置。',
  },
  1019: {
    traits: ['寄居在D左手掌上的共生实体', '能够以手掌上的面孔交谈', '有时可独立施展超自然力量', '熟悉吸血鬼与古老传说', '常以讽刺口吻评论D', '会在危险时给出警告和建议', '其来历没有完全说明', '自称寄生生物', '与D形成长期搭档关系'],
    description: 'D的左手上寄居着一个能够说话的共生实体，手掌会浮现出一张人脸。它熟悉吸血鬼与古老传说，常以讽刺口吻评论D，也会在危险时提供警告和建议；在某些情况下，它还能独立使用超自然力量。这个实体的来历始终没有完全说明，虽然经常抱怨D，却与他形成长期搭档关系。',
  },
  1020: {
    traits: ['马库斯兄弟吸血鬼猎人团体中的女性成员', '与马库斯兄弟没有血缘关系', '被兄弟们视作家人', '父亲曾为救母亲而死于吸血鬼之手', '母亲被吸血鬼转化后遭村民杀害', '年幼时亲眼目睹母亲死亡', '为父母复仇而加入猎人团体', '擅长使用强力枪械', '性格坚韧并重视伙伴'],
    description: '蕾拉·马库斯是马库斯兄弟吸血鬼猎人团体中的女性成员，虽无血缘关系，却被兄弟们当作家人。她的父亲曾为救母亲死于吸血鬼之手，母亲被转化后又遭村民杀害，年幼的蕾拉亲眼目睹了这一切。为了复仇，她加入猎人团体并使用强力枪械作战；旅途中，她逐渐将同伴视作新的家人。',
  },
  1021: {
    traits: ['力量强大的吸血鬼贵族', '被称作吸血鬼骑士', '与夏洛特相爱并带她离开', '能将长斗篷化作锋利的钢刃', '剑术足以与D抗衡', '同时遭D与马库斯兄弟追捕', '拒绝强迫夏洛特转化为吸血鬼', '希望与爱人逃离家族安排', '行事克制并愿意承担风险'],
    description: '迈耶·林克是力量强大的吸血鬼贵族，被称作“吸血鬼骑士”。他能将长斗篷化作锋利的钢刃，剑术足以与吸血鬼猎人D抗衡。迈耶带着相爱的夏洛特离开，因此同时遭到D和马库斯兄弟追捕；但他并非强迫她，而是拒绝将夏洛特转化为吸血鬼，希望两人能借助卡蜜拉的飞船逃离家族安排。',
  },
  1022: {
    traits: ['埃尔伯恩家族的女儿', '起初被认为遭迈耶绑架', '实际上与迈耶相爱并主动同行', '希望迈耶将自己转化为吸血鬼', '迈耶拒绝让她成为吸血鬼', '计划借卡蜜拉的飞船逃往太空', '同时遭D与马库斯兄弟追踪', '性格温柔但有自主意愿', '愿为追求自由承担危险'],
    description: '夏洛特·埃尔伯恩是埃尔伯恩家族的女儿，起初被家人认为遭吸血鬼迈耶绑架，后来才揭示她是自愿与爱人同行。夏洛特希望迈耶将自己转化为吸血鬼，迈耶却拒绝让她承担这种命运；两人计划借助卡蜜拉的飞船逃往太空。她温柔但有自主意愿，愿意为摆脱家族安排和追求自由承担危险。',
  },
  1023: {
    traits: ['马库斯兄弟吸血鬼猎人团体的成员', '与另外三名兄弟有血缘关系', '参与追捕迈耶与夏洛特', '携带银制十字形刀刃', '行动自信而直接', '发现赏金目标时容易兴奋', '常以调侃方式逗弄蕾拉', '在团队中负责近身战斗', '把蕾拉也当作家人保护'],
    description: '凯尔·马库斯是马库斯兄弟吸血鬼猎人团体的成员，与另外三名兄弟有血缘关系。他参与追捕迈耶与夏洛特，随身携带银制十字形刀刃，行动自信而直接；发现赏金目标时容易兴奋，也常以调侃方式逗弄蕾拉。虽然嘴上爱开玩笑，凯尔仍把蕾拉视作家人，并会在战斗中与兄弟们配合保护她。',
  },
  1024: {
    traits: ['马库斯兄弟中的第四名兄弟', '身体长期卧床', '可在注射特殊药物后投射灵魂', '灵魂体能够发动强力精神攻击', '行动依赖药物带来的短暂能力', '身体状态限制了日常活动', '与蕾拉关系亲近', '仍参与追捕迈耶的行动', '在队伍危急时提供远程支援'],
    description: '格罗夫·马库斯是马库斯兄弟中的第四名兄弟，身体长期卧床，无法像其他人一样正常行动。注射特殊药物后，他能将灵魂投射到外界，并以灵魂体发动强力精神攻击。格罗夫与蕾拉关系亲近，也参与追捕迈耶的行动；他的能力虽受身体状态和药效限制，却能在猎人队伍陷入危机时提供关键支援。',
  },
  1025: {
    name: '本格',
    nicknames: ['本格', 'Benge', 'ベンゲ'],
    traits: ['被布幔包裹的变异者', '面部与双手呈歌舞伎妆般的白色', '性格古怪且带有扭曲幽默感', '能够制造幻象', '擅长设置时空扭曲陷阱', '可压扁身体化作影子般的黑暗', '能够在影子中移动', '可通过攻击目标影子造成伤害', '曾以陷阱困住吸血鬼猎人D'],
    description: '本格是被布幔包裹的变异者，脸和双手呈现近似歌舞伎妆容的白色，性格古怪且带有扭曲的幽默感。他能制造幻象并设置时空扭曲陷阱，也可把身体压扁成影子般的黑暗，在阴影中移动。由于他能够直接攻击目标的影子，本格曾用复杂陷阱困住吸血鬼猎人D，是旅途中危险而难以捉摸的敌人。',
  },
}

const actorImageUrls = {
  723: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95076-itRGy8F3x5Em.png',
  724: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95067-hqIpNxMfAuN2.png',
  745: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95184-OpXCWNXhJJpg.png',
  835: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95004-qWQQHGzY3wqr.png',
}

const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const localById = new Map(local.map((row) => [Number(row.id), row]))
const originalNames = new Map(local.map((row) => [Number(row.id), row.name]))
const databaseSourceNames = {
  721: '伦格',
  845: '鹰村守',
  846: '青木胜',
  847: '木村达也',
  888: '连城究',
  889: '美南惠',
  890: '天草流',
  891: '鸣泽数马',
  892: '远山金太郎',
  944: '小早川濑那',
  946: '栗田良宽',
  947: '进清十郎',
  955: '雷门太郎',
  956: '樱庭春人',
}
const batch = local.filter((row) => Number(row.id) > 702).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const ids = batch.map((row) => Number(row.id))
const missingProfiles = ids.filter((id) => !profileDoc.profiles[id])

for (const row of batch) {
  const id = Number(row.id)
  if (fixes[id]) Object.assign(row, fixes[id])
  const profile = profileDoc.profiles[id]
  row.nicknames = [...new Set([
    ...(row.nicknames || []),
    originalNames.get(id),
    row.name,
    ...(fixes[id]?.nicknames || []),
    profile?.name?.full,
    profile?.name?.native,
    ...(profile?.name?.alternative || []),
  ].filter(Boolean))]
  row.voice_actors ||= []
  if (actorImageUrls[id]) {
    const japaneseActor = row.voice_actors.find((actor) => actor.language === '日语' || actor.language === 'Japanese' || actor.language === 'JA')
    if (!japaneseActor) throw new Error(`角色${id}找不到日配声优`)
    japaneseActor.image = actorImageUrls[id]
  }
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...row.voice_actors.map((actor) => actor.name)].join(' ')
  if ((row.traits || []).length < 8) throw new Error(`角色${id}特征少于8条`)
  if ((row.description || '').length < 100 || row.description.length > 200) throw new Error(`角色${id}简介长度不合格：${row.description?.length}`)
  if (row.search_text.includes(row.description)) throw new Error(`角色${id}的 search_text 包含简介`)
}

async function syncDatabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('同步数据库需要本地 Supabase secret 环境变量')
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  const [charactersResult, actorsResult, voiceRowsResult] = await Promise.all([
    db.from('characters').select('id,name,anime_title').in('id', ids),
    db.from('voice_actors').select('character_id,name').in('character_id', ids),
    db.from('voice_actors').select('id,character_id,name,image,language').in('character_id', Object.keys(actorImageUrls).map(Number)),
  ])
  if (charactersResult.error) throw new Error(`读取角色失败：${charactersResult.error.message}`)
  if (actorsResult.error) throw new Error(`读取声优失败：${actorsResult.error.message}`)
  if (voiceRowsResult.error) throw new Error(`读取声优头像失败：${voiceRowsResult.error.message}`)
  const remoteById = new Map((charactersResult.data || []).map((row) => [Number(row.id), row]))
  if (remoteById.size !== ids.length) throw new Error(`Supabase 返回${remoteById.size}/${ids.length}位，停止写入`)
  for (const id of ids) {
    const remote = remoteById.get(id)
    const beforeName = databaseSourceNames[id] || originalNames.get(id)
    const beforeTitle = localById.get(id).anime_title
    if (remote.name !== beforeName || remote.anime_title !== beforeTitle) throw new Error(`角色${id}数据库原值与本地导出不同，停止写入`)
  }
  const actorNames = new Map()
  for (const actor of actorsResult.data || []) {
    const list = actorNames.get(Number(actor.character_id)) || []
    list.push(actor.name)
    actorNames.set(Number(actor.character_id), list)
  }
  const voiceRows = voiceRowsResult.data || []
  const voiceImageUpdates = []
  for (const [characterIdText, image] of Object.entries(actorImageUrls)) {
    const characterId = Number(characterIdText)
    const expectedName = localById.get(characterId).voice_actors.find((a) => a.image === image)?.name
    const matches = voiceRows.filter((v) => Number(v.character_id) === characterId && v.name === expectedName)
    if (matches.length !== 1) throw new Error(`角色${characterId}的声优头像记录匹配${matches.length}条，停止写入`)
    voiceImageUpdates.push({ id: matches[0].id, characterId, name: expectedName, image })
  }
  for (const update of voiceImageUpdates) {
    const { error } = await db.from('voice_actors').update({ image: update.image }).eq('id', update.id)
    if (error) throw new Error(`更新角色${update.characterId}的声优头像失败：${error.message}`)
  }
  for (const id of ids) {
    const row = localById.get(id)
    const searchText = [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(actorNames.get(id) || [])].join(' ')
    const payload = { name: row.name, nicknames: row.nicknames, traits: row.traits, description: row.description, search_text: searchText }
    const { error } = await db.from('characters').update(payload).eq('id', id)
    if (error) throw new Error(`写入角色${id}失败：${error.message}`)
  }
  const [readbackResult, voiceReadbackResult] = await Promise.all([
    db.from('characters').select('id,name,anime_title,nicknames,traits,description,search_text').in('id', ids),
    db.from('voice_actors').select('id,character_id,name,image').in('id', voiceImageUpdates.map((v) => v.id)),
  ])
  if (readbackResult.error) throw new Error(`回读角色失败：${readbackResult.error.message}`)
  if (voiceReadbackResult.error) throw new Error(`回读声优头像失败：${voiceReadbackResult.error.message}`)
  const readback = new Map((readbackResult.data || []).map((row) => [Number(row.id), row]))
  if (readback.size !== ids.length) throw new Error(`角色回读数量${readback.size}/${ids.length}不符`)
  for (const id of ids) {
    const got = readback.get(id)
    const row = localById.get(id)
    for (const key of ['name', 'anime_title', 'nicknames', 'traits', 'description']) {
      if (JSON.stringify(got[key]) !== JSON.stringify(row[key])) throw new Error(`角色${id}的${key}回读不一致`)
    }
    const expectedSearchText = [got.name, got.anime_title, ...(got.nicknames || []), ...(got.traits || []), ...(actorNames.get(id) || [])].join(' ')
    if (got.search_text !== expectedSearchText || got.search_text.includes(got.description)) throw new Error(`角色${id}的search_text回读不一致`)
    row.search_text = got.search_text
  }
  const voiceReadback = new Map((voiceReadbackResult.data || []).map((row) => [Number(row.id), row]))
  for (const update of voiceImageUpdates) {
    if (voiceReadback.get(Number(update.id))?.image !== update.image) throw new Error(`角色${update.characterId}的声优头像回读不一致`)
  }
}

function writeLocalExports() {
  const slim = local.map((row) => ({
    id: row.id,
    name: row.name,
    anime_title: row.anime_title,
    image: row.image,
    description: row.description,
    nicknames: row.nicknames || [],
    traits: row.traits || [],
    voice_actors: (row.voice_actors || []).map(({ name, language, image }) => ({ name, language, image })),
  }))
  const csvField = (value) => {
    const s = String(value ?? '')
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
  for (const row of local) {
    lines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(',')].map(csvField).join(','))
  }
  fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
  fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
  fs.writeFileSync(csvPath, `\uFEFF${lines.join('\n')}\n`)
  fs.writeFileSync(profilePath, JSON.stringify(profileDoc, null, 2))
}

if (process.argv.includes('--sync')) await syncDatabase()
writeLocalExports()

const colorRegex = /(金发|黄发|银发|白发|黑发|红发|橘发|橙发|棕发|蓝发|绿发|紫发|粉发|红眼|棕眼|黑眼|蓝眼|绿眼|紫眼|金色眼瞳|绿色眼瞳|棕色眼瞳|黑色眼瞳|蓝色眼瞳|红色眼瞳|绿瞳|蓝瞳|红瞳|棕瞳|黑瞳|紫瞳|肤色较深|黑肤)/
const report = {
  checkedAt: new Date().toISOString(),
  checkedCount: batch.length,
  checkedIds: ids,
  checkedRange: { firstId: batch[0].id, lastId: batch.at(-1).id },
  modifiedIds: Object.keys(fixes).map(Number),
  source: {
    name: 'AniList GraphQL character profile snapshot',
    originalFetchedAt: profileDoc.fetchedAt,
    supplementedAt: supplement.fetchedAt,
    supplementedIds: supplement.requestedIds,
    records: ids.filter((id) => profileDoc.profiles[id]).map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
  },
  pendingExternalVerificationIds: missingProfiles,
  pendingVisualVerificationIds: batch.filter((row) => (row.traits || []).some((trait) => colorRegex.test(trait))).map((row) => Number(row.id)),
  pendingVisualVerification: '本轮使用 AniList 文字档案与可靠角色资料核对；除已在文字来源明确支持的外观外，发色及瞳色尚未逐一对照角色图像独立验收。',
  voiceActorImageIds: Object.keys(actorImageUrls).map(Number),
  note: process.argv.includes('--sync') ? 'Supabase写入并回读成功；人物搜索字段不含简介；4位日配声优头像已补齐并回读。' : '本地导出已更新；尚未同步Supabase。',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, modified: Object.keys(fixes).length, missingProfiles, actorImages: Object.keys(actorImageUrls).length, descriptionLengths: Object.keys(fixes).map((id) => [Number(id), localById.get(Number(id)).description.length]), reportPath }, null, 2))
