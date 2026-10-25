import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const profilePath = `${root}/anilist-character-profiles.json`
const reportPath = `${root}/batch7-audit-report.json`

const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const profileDoc = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
const startIndex = local.findIndex((row) => Number(row.id) === 1896)
if (startIndex < 0) throw new Error('找不到上批最后一位角色 ID 1896')
const batch = local.slice(startIndex + 1).filter((row) => Number(row.id) < 990000000).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const ids = batch.map((row) => Number(row.id))

const fixes = {
  2012: {
    traits: ['高坂真琴的女友', '时尚而自信', '性格强势，有时会动手', '偶尔吸烟', '并非御宅族', '对动漫角色没有兴趣', '跟随高坂进入现视研', '曾被现视研前任社长要挟加入社团', '两次阻止现视研被解散', '相关行动更多源于报复和愧疚，而非宅文化兴趣'],
    description: '春日部咲是高坂真琴的女友，时尚自信，却不是御宅族，对动漫角色也没有兴趣。她跟随高坂进入现视研，后来受到前任社长要挟而加入社团。咲有时暴躁、偶尔吸烟，并曾两次阻止社团被解散；这些行动更多源于报复和愧疚，而非对御宅文化产生兴趣。',
  },
  2013: {
    traits: ['现视研的重度御宅族', '外貌俊美可爱，常吸引旁人注意', '热爱成人游戏', '格斗游戏技术高超', '几乎无人能在游戏中胜过他', '春日部咲的男友', '带咲接触现视研', '面对咲对宅文化的陌生表现包容'],
    description: '高坂真琴是现视研的重度御宅族，外貌俊美可爱，经常吸引旁人关注。他热爱成人游戏，格斗游戏尤其擅长，并与春日部咲交往。咲并非御宅族，真琴仍带她接触现视研；面对女友对宅文化的陌生，他表现得包容而耐心，也颇受同伴关注。',
  },
  1904: {
    traits: ['检察官', '学生时代因坚持主持正义而遭霸凌', '学习成绩优秀', '成年后以惩治罪犯为己任', '崇拜夜神月和基拉', '称基拉为“神”', '做事严谨守时', '坚持每天锻炼', '受命成为第二基拉', '愿意牺牲自己协助基拉'],
    description: '魅上照是一名检察官，学生时代因坚持主持正义而遭受霸凌，成年后仍以惩治罪犯为己任。他崇拜夜神月和基拉，将基拉称为“神”，并受命成为第二基拉。他学习成绩优秀，做事严谨守时、坚持锻炼，甚至愿意牺牲自己来协助基拉。',
  },
  1905: {
    traits: ['女性死神', '最先将死亡笔记交给弥海砂', '持有两本死亡笔记', '第二本笔记继承自杰拉斯', '杰拉斯为救海砂而消失', '承接杰拉斯对海砂的感情', '警惕夜神月', '明确表示会阻止月伤害海砂', '愿为保护海砂牺牲自己'],
    description: '雷姆是将死亡笔记交给弥海砂的女性死神。她持有两本笔记，第二本继承自为救海砂而消失的杰拉斯；雷姆因此承接了杰拉斯对海砂的保护之情。她不信任夜神月，并表示若海砂遭到伤害就会杀死月，最终也愿为保护海砂付出生命。',
  },
  1906: {
    traits: ['日本警察搜查本部成员', '在搜查组中经验较浅', '性格热情、冲动且天真', '常显得不够严肃', '关注民众支持基拉的原因', '曾质疑基拉部分行动能否算作善行', '敬重并忠于夜神总一郎', '调查中敢于承担危险', '重视搜查组同僚'],
    description: '松田桃太是日本警方搜查本部的年轻成员，在搜查组中经验较浅，性格热情、冲动而天真，工作时有时显得不够严肃。他会思考民众支持基拉的原因，也曾质疑基拉的部分行动是否算善行；但他始终忠于搜查组，敬重夜神总一郎，并敢于在调查中承担危险。',
  },
  1927: {
    traits: ['夜神月的父亲', '日本警方搜查本部成员', '后任L领导的搜查队负责人', '正义感强', '性格善良而严肃', '责任心强，赢得同僚尊重', '关心家人与搜查组成员', '警察停止资助后仍继续调查基拉'],
    description: '夜神总一郎是夜神月的父亲，也是日本警方搜查本部成员，后来负责L领导下的搜查队。他为人善良严肃，正义感和责任心都很强，既关心家人，也重视搜查组同僚。即使警方停止为基拉调查提供经费，他仍与同僚继续追查案件。',
  },
  1928: {
    traits: ['四叶集团技术开发部负责人', '四叶集团八名会议成员之一', '取得死亡笔记后成为四叶基拉', '利用死亡笔记杀害商业竞争者', '杀人动机是维护公司利益', '为集团高层秘密会议提供执行者', '遭L与搜查组调查', '野心强烈'],
    description: '火口卿介是四叶集团技术开发部负责人，也是集团秘密会议的八名成员之一。他取得死亡笔记后成为四叶基拉，按照集团高层的商业利益杀害竞争公司的人员。L和搜查组追查四叶集团的异常死亡事件后，火口逐渐成为调查的核心对象。',
  },
  1929: {
    traits: ['四叶集团销售部副总裁', '四叶集团秘密会议成员', '在会议中支持四叶基拉', '被视为八名成员中最有才能者', '擅长将棋，达到职业四段水平', '不喜欢无能的下属', '认为自己不依赖基拉也能晋升', '参与四叶集团高层决策'],
    description: '奈南川零司是四叶集团销售部副总裁，也是秘密会议成员。他起初支持四叶基拉，却被认为是八名成员中最有才能者，甚至可能不依赖基拉也能升至高位。他的将棋水平达到职业四段，并厌恶无能的下属；在基拉案件中，他逐渐意识到集团计划的危险。',
  },
  1930: {
    traits: ['四叶集团高层', '四叶秘密会议的八名成员之一', '定期参加集团内部秘密会议', '卷入四叶基拉事件', '会议讨论利用死亡笔记杀害商业竞争者', '受到L与搜查组调查', '其身份和行动被调查组监视', '是四叶集团的重要决策参与者'],
    description: '叶鸟新义是四叶集团高层，也是参与秘密会议的八名成员之一。会议讨论利用死亡笔记杀害商业竞争者，使他卷入四叶基拉事件。L与搜查组调查集团成员及其秘密决策后，叶鸟也成为调查对象；AniList对他的个别经历没有更多说明。',
  },
  1931: {
    traits: ['四叶集团权利企划部副总裁', '四叶集团秘密会议成员', '掌管委员会资金', '联系侦探艾勒鲁协助调查', '被《死亡笔记13》描述为沉着冷静', '不擅长应付突发状况', '因侦探索要更多费用而慌张', '参与四叶集团的秘密决策'],
    description: '树多正彦是四叶集团权利企划部副总裁，也是秘密会议成员，负责掌管委员会资金并联络侦探艾勒鲁。《死亡笔记13》将他描述为沉着冷静，但他不擅长应付突发状况；当艾勒鲁要求更多报酬时，树多因此慌张。这一反应也与他平时冷静的形象形成反差。',
  },
  1932: {
    nicknames: ['艾伯', 'Aiber'],
    traits: ['职业欺诈师', '常用代号艾伯', '擅长伪装身份与表演', '受L雇用协助调查', '曾假扮侦探艾勒鲁', '帮助弥海砂准备与四叶集团交涉', '善于利用人脉', '死因是肝癌'],
    description: '艾伯的真实姓名是蒂埃里·莫雷洛，是一名职业欺诈师，擅长伪装身份和表演。他受L雇用，曾假扮侦探艾勒鲁接近四叶集团，也帮助弥海砂准备与集团成员交涉。他善于利用人脉协助调查，以不同身份周旋于商界人士之间，后来死于肝癌。',
  },
  1933: {
    nicknames: ['薇蒂', 'Wedy'],
    traits: ['职业女飞贼', '真实姓名是玛丽·肯伍德', '常用代号薇蒂', '受L雇用协助调查', '擅长潜入和安装窃听器', '曾监视四叶集团每周秘密会议', '也在火口的汽车中安装窃听器', '行动依赖专业技巧而非超能力'],
    description: '薇蒂的真实姓名是玛丽·肯伍德，是一名职业女飞贼，受L雇用协助调查。她擅长潜入和安装窃听器，曾在四叶集团会议室及火口的汽车中安装设备，帮助搜查组监视会议与追踪火口，并协助揭露集团成员的计划。她以地下世界活动者的身份闻名。',
  },
  1976: {
    traits: ['圣米亚托尔女子学园一年级学生', '自幼体弱', '患有未具名疾病', '疾病影响呼吸，可能也影响心脏', '性格平和', '面对身体状况表现得坦然', '是《惊爆草莓》中的重要人物', '她的病情限制了日常生活'],
    description: '樱木花织是圣米亚托尔女子学园一年级学生，自幼体弱，患有一种没有说明名称的疾病，病情影响呼吸，也可能影响心脏。她性格平和，面对身体状况表现得坦然；疾病限制了她的生活，并成为《惊爆草莓》中回忆与人物关系的重要背景。',
  },
  1995: {
    traits: ['《灰羽联盟》的主人公', '旧家屋最新诞生的灰羽', '诞生前梦见自己从天空坠落', '梦中有一只乌鸦相伴', '对自己生前身份感到好奇', '来到古利耶后逐渐适应生活', '亲切友善，很快与同伴亲近', '与旧家屋的灰羽共同生活'],
    description: '拉卡是《灰羽联盟》的主人公，也是旧家屋中最新诞生的灰羽。她梦见自己从天空坠落，身边只有一只乌鸦，因此总觉得自己与乌鸦有所联系。来到古利耶后，她逐渐适应灰羽的生活，结识同伴，也不断追问自己生前是谁、是否还有家人。',
  },
  1996: {
    traits: ['旧家屋的非正式领导者', '负责照料年幼灰羽', '发现拉卡的茧并陪伴她诞生', '照顾刚长出翅膀的新羽', '外表开朗，内心背负过去阴影', '坚强可靠', '富有同情心且乐于照顾他人', '受到旧家屋其他灰羽尊敬'],
    description: '礼祈是旧家屋实际上的带领者，负责照顾年幼的灰羽和刚诞生的新羽。她发现拉卡的茧，并在拉卡长出翅膀时一直陪在身边。礼祈表面开朗、坚强可靠，也很体贴；她长期承担照顾者的责任，故事逐步揭示她隐藏在笑容背后的痛苦过去。',
  },
  2001: {
    traits: ['灰羽联盟的主持者', '负责处理灰羽共同体事务', '会向灰羽提供精神建议', '会给予实际生活上的帮助', '必要时惩戒违反规则的灰羽', '熟悉古利耶的生活规约', '是灰羽联盟中具有权威的职位', '以协调和引导为主要职责'],
    description: '话郎是灰羽联盟中的主持者，负责处理共同体事务。他会向灰羽提供精神建议和生活上的协助，也会在必要时惩戒违反规约的人。话郎熟悉古利耶及灰羽的生活规则，是联盟中具有权威、引导灰羽遵守规约并维系共同体秩序的长者。',
  },
  2002: {
    traits: ['曾是旧家屋的灰羽', '年轻时照料过礼祈和眠', '身体较为虚弱', '性情温和', '乐于帮助年幼灰羽', '后来不再居住在旧家屋', '她的过去通过角色回忆交代', '是早期灰羽生活的重要照护者'],
    description: '暗森曾是居住在旧家屋的灰羽，年轻时照料过礼祈和眠。她身体较为虚弱，却性情温和、乐于帮助年幼的灰羽。后来她离开旧家屋，不再与其他灰羽共同生活；她曾是礼祈和眠的早期照护者，也属于两人的成长记忆，故事通过回忆介绍她。',
  },
  2030: {
    traits: ['金发', '双丸子头并垂有长辫', '初登场时是中学生', '能变身为水手月亮', '是月亮公主倩尼迪的转世', '起初爱哭、懒散且笨拙', '学习成绩不佳', '富有同情心并珍视同伴', '逐渐成长为可靠的领袖', '经典变身台词为“代表月亮惩罚你”'],
    description: '月野兔是《美少女战士》的主人公，起初是爱哭、懒散又笨拙的中学生，后来觉醒为水手月亮，并得知自己是月亮公主倩尼迪的转世。她学习成绩不佳，却富有同情心，珍视朋友和家人；在一次次战斗中逐渐成长为可靠的团队领袖。',
  },
  2067: {
    traits: ['槙村香的义兄', '冴羽獠的旧搭档', '曾任警察', '与冴羽獠共同从事城市猎人工作', '为人温和', '对妹妹十分关爱', '遭犯罪集团枪击重伤', '临终前请冴羽獠照顾香'],
    description: '槙村秀幸是槙村香的义兄，曾任警察，后来成为冴羽獠在城市猎人事务中的搭档。他为人温和，对香十分关爱；在遭犯罪集团枪击重伤后，秀幸临终前拜托獠照顾妹妹，相信獠会保护好香，随后去世，这也使香接替他与獠合作。',
  },
  2154: {
    nicknames: ['鷺月子', '鹭月子', 'Tsukiko Sagi'],
    traits: ['《妄想代理人》的主要人物', '知名卡通角色设计师', '创作了人气吉祥物麻罗美', '性格胆怯内向', '随身带着麻罗美玩偶', '成为少年棒球手最初宣称的受害者', '袭击事件引发警方调查', '承受名气和工作带来的压力'],
    description: '鷺月子是知名卡通角色设计师，创作了大受欢迎的狗狗吉祥物麻罗美。她性格胆怯内向，常随身带着麻罗美玩偶；故事开始时，她声称自己遭少年棒球手袭击，这件事引发警方调查与连锁事件，也使她承受的工作和名气压力浮上台面。',
  },
  2155: {
    nicknames: ['Maromi', 'マロミ'],
    traits: ['鷺月子创作的卡通狗吉祥物', '粉色狗狗形象', '有黑色大眼睛和下垂耳朵', '外形被大众认为可爱', '迅速成为人气角色', '推出对应的毛绒玩偶', '在鷺月子的主观体验中会说话和活动', '与作品中的压力逃避主题相关'],
    description: '麻罗美是角色设计师鷺月子创作的卡通狗吉祥物，外形是粉色小狗，长着黑色大眼睛和下垂耳朵，因可爱形象迅速走红并推出毛绒玩偶。在鷺月子的主观体验中，玩偶会说话和活动；这个形象也与作品关于压力和逃避的主题相连。',
  },
  2156: {
    traits: ['《妄想代理人》中的神秘袭击者', '外表像戴棒球帽的少年', '穿着金色直排轮鞋', '手持弯曲的金色金属球棒', '袭击使受害者遭受压力的人', '案件在东京引发社会恐慌', '不同受害者对袭击者的描述存在差异', '是串联多个单元故事的关键人物'],
    description: '少年棒球手是《妄想代理人》中案件围绕的神秘袭击者，外表像戴棒球帽的少年，脚穿金色直排轮鞋，手持一根弯曲的金色金属球棒。多名承受压力的人声称遭他袭击，案件在东京引发恐慌；不同人物的描述和记忆也并不完全一致。',
  },
  2166: {
    traits: ['第四课外国人事务科科长', '长棕发并戴眼镜', '负责调查契约者相关事件', '正义感强且直觉敏锐', '当警察是为了保护弱者', '很少露出笑容', '讨厌香烟气味', '喜欢油腻食物', '日常工作活动量大'],
    description: '雾原未咲是警视厅第四课外国人事务科科长，负责调查与契约者有关的事件。她留着棕色长发并戴眼镜，正义感强、直觉敏锐，很少露出笑容；她从警是为了保护弱者，讨厌香烟气味，喜欢油腻食物，并以日常工作活动量大来维持身材。',
  },
  2179: {
    traits: ['L最信任的助手', '本名是奎尔什·瓦米', '华米之家创办人', '是著名发明家', '负责调查组的后勤和联络', '为调查提供设备与支持', '擅长间谍行动', '熟练使用枪械', '在调查组成立前是唯一见过L的人'],
    description: '渡是L最信任的助手，真实身份为发明家奎尔什·瓦米，也是英国温彻斯特华米之家的创办人。他负责调查组的后勤、联络和设备支持，擅长间谍行动并熟练使用枪械。在调查组成立前，他是唯一见过L、也能直接联系到L的人。',
  },
  2078: {
    traits: ['13岁，身高138厘米', '三千院财团唯一继承人', '就读白皇学院并跳级三年', '热爱漫画、动画和电子游戏', '自己创作漫画并参加业余比赛', '擅长金融和学习', '性格任性好胜且不愿认错', '社交退缩，因身份安全问题常待在家中', '由玛莉亚照料并视作母亲或姐姐', '暗恋管家绫崎飒'],
    description: '三千院凪是13岁、身高138厘米的三千院财团唯一继承人，就读白皇学院，并因成绩优秀跳级三年。她热爱漫画、动画和游戏，也会创作漫画并参加业余比赛。凪性格任性好胜、社交退缩，常待在家中；她暗恋管家绫崎飒，也由玛莉亚照料。',
  },
  2270: {
    traits: ['15岁，后来满16岁', '身高161厘米', '白皇学院学生会会长', '剑道社社长', '擅长剑术和剑道', '运动能力强', '认真好胜并具领导力', '意外地害怕高处', '允许绫崎飒直呼她的名字', '逐渐对飒产生好感'],
    description: '桂雏菊是白皇学院学生会会长兼剑道社社长，初登场15岁，身高161厘米，剑术出众且运动能力强。她认真好胜，担任学生领袖，却意外地害怕高处。雏菊在校园里与迷路的绫崎飒相识，后来允许他直呼自己的名字，并逐渐对他产生好感。',
  },
  2293: {
    traits: ['唐格拉尔家的女儿', '阿尔贝与弗朗兹的童年好友', '与阿尔贝有婚约', '对婚事并不情愿', '有时会对阿尔贝表现冷淡', '擅长作曲', '会弹钢琴', '梦想成为职业钢琴家'],
    description: '尤金妮·唐格拉尔是唐格拉尔家的女儿，也是阿尔贝与弗朗兹的童年好友。她与阿尔贝有婚约，却并不情愿接受这桩安排，偶尔会对他表现冷淡。尤金妮热爱音乐，常用作曲和钢琴演奏表达情感，梦想成为职业钢琴家，并希望靠音乐建立自己的事业。',
  },
  2301: {
    traits: ['在巴黎社交界使用安德烈亚·卡瓦尔坎蒂之名', '真实身份是罪犯贝内代托', '由伯爵安排进入上流社会', '擅长伪装和操纵他人', '性格残忍且具有虐待倾向', '与维尔福及唐格拉尔有血缘关系', '企图迎娶尤金妮', '婚礼上身份被揭穿'],
    description: '安德烈亚·卡瓦尔坎蒂以贵族身份进入巴黎社交界，真实身份是罪犯贝内代托。伯爵安排他接近唐格拉尔家后，他以财富和风度取信上流社会，并企图迎娶尤金妮。安德烈亚残忍善于操纵他人；婚礼上，他的犯罪身份及与维尔福、唐格拉尔家的血缘关系被揭穿。',
  },
  2309: {
    traits: ['短鲑粉色头发', '右侧有一根呆毛', '金黄色眼睛', '初中生', 'Comptiq杂志“幸运频道”的主持人', '总以“Oha-Lucky”打招呼', '是经验丰富的声优', '受气时会露出暴躁且抽烟的一面'],
    description: '小神晶是初中生，也是Comptiq杂志“幸运频道”的主持人。她留着短鲑粉色头发，右侧有一根呆毛，眼睛呈金黄色，常以“Oha-Lucky”打招呼。晶同时是经验丰富的声优，受到白石稔惹恼时会突然脱离主持人形象，显露暴躁、抽烟的一面。',
  },
  2369: {
    traits: ['黑发', '黄色眼睛', '方向感极差的超级路痴', '与早乙女乱马是对手也是朋友', '暗恋天道茜', '曾落入中国咒泉乡的黑猪溺泉', '遇冷水会变成黑色小猪Pちゃん', '遇热水恢复人形', '擅长格斗且力量强大', '招式包括狮子咆哮弹'],
    description: '响良牙是早乙女乱马的宿敌兼朋友，也是方向感极差的超级路痴。他曾在中国咒泉乡落入黑猪溺泉，遇冷水会变成黑色小猪“Pちゃん”，遇热水则恢复人形。良牙暗恋天道茜，擅长格斗且力量强大，常以狮子咆哮弹等招式迎战乱马。',
  },
}

const localById = new Map(local.map((row) => [Number(row.id), row]))
for (const [idText, fix] of Object.entries(fixes)) {
  const row = localById.get(Number(idText))
  if (!row || !ids.includes(Number(idText))) throw new Error(`修正目标 ${idText} 不在本批中`)
  Object.assign(row, fix)
}

for (const row of batch) {
  const profile = profileDoc.profiles[row.id]
  row.nicknames = [...new Set([
    ...(row.nicknames || []),
    row.name,
    profile?.name?.full,
    profile?.name?.native,
    ...(profile?.name?.alternative || []),
    ...(fixes[row.id]?.nicknames || []),
  ].filter(Boolean))]
  row.voice_actors ||= []
  row.search_text = [row.name, row.anime_title, ...row.nicknames, ...(row.traits || []), ...row.voice_actors.map((actor) => actor.name)].join(' ')
  if (fixes[row.id] && (row.traits || []).length < 8) throw new Error(`角色 ${row.id} 特征少于8条`)
  if (fixes[row.id] && ((row.description || '').length < 100 || row.description.length > 200)) throw new Error(`角色 ${row.id} 简介长度不合格：${row.description?.length}`)
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${row.id} 的 search_text 包含简介`)
}

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
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of local) lines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${lines.join('\n')}\n`)

const liveVerifiedIds = [2012, 2013, 2078, 2270]
const liveVerifiedIdSet = new Set(liveVerifiedIds)
const missingProfiles = ids.filter((id) => !profileDoc.profiles[id] && !liveVerifiedIdSet.has(id))
const colorRegex = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛|眼瞳)|金黄色眼睛|异色瞳/
const pendingVisualVerificationIds = batch.filter((row) => (row.traits || []).some((trait) => colorRegex.test(trait))).map((row) => Number(row.id))
const correctionSources = Object.keys(fixes).map((idText) => ({
  id: Number(idText),
  url: `https://anilist.co/character/${idText}`,
  note: 'AniList角色资料页；按角色简介及资料字段核实，修正作品标签、角色关系、经历或外观信息。',
}))
const report = {
  checkedAt: new Date().toISOString(),
  checkedCount: batch.length,
  profileVerifiedCount: batch.length - missingProfiles.length,
  checkedIds: ids,
  checkedRange: { firstId: ids[0], lastId: ids.at(-1) },
  modifiedIds: Object.keys(fixes).map(Number),
  source: {
    name: 'AniList GraphQL character profile snapshot plus direct AniList page checks and local character record review',
    fetchedAt: profileDoc.fetchedAt,
    records: ids.filter((id) => profileDoc.profiles[id]).map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
    livePageRecords: liveVerifiedIds.map((id) => ({ id, url: `https://anilist.co/character/${id}` })),
  },
  pendingExternalVerificationIds: missingProfiles,
  pendingVisualVerificationIds,
  pendingSourceReviewIds: missingProfiles,
  verifiedCorrections: correctionSources,
  note: '本批100位均已通过 AniList 快照或对应角色资料页核对；发色、瞳色条目列入目视复核清单，未用文字简介代替图像目视确认。',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, profileVerified: report.profileVerifiedCount, modified: report.modifiedIds, missingProfiles, pendingVisualVerificationIds, reportPath }, null, 2))
