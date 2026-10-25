import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const profilePath = `${root}/anilist-character-profiles.json`
const supplementPath = `${root}/anilist-character-profiles-batch5-supplement.json`
const reportPath = `${root}/batch5-audit-report.json`

const profileDoc = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
const supplement = JSON.parse(fs.readFileSync(supplementPath, 'utf8'))
Object.assign(profileDoc.profiles, supplement.profiles)
profileDoc.supplementedAt = supplement.fetchedAt
profileDoc.supplementedIds = supplement.requestedIds

const fixes = {
  1044: {
    traits: ['怪盗阿尔塞纳·鲁邦的第三代后裔', '黑发', '棕色眼瞳', '擅长易容和潜入', '机智善于临场应变', '能策划复杂盗窃行动', '擅长驾驶与逃脱', '与次元大介长期搭档', '被国际刑警钱形幸一持续追捕', '有时会帮助受害者对抗不公'],
    description: '鲁邦三世是传奇怪盗阿尔塞纳·鲁邦的第三代后裔，擅长易容、潜入和临场应变，常策划复杂的盗窃行动。他与次元大介、石川五右卫门结伴行动，峰不二子则时而合作、时而争夺目标。国际刑警钱形幸一长期追捕鲁邦；尽管以盗窃为业，他有时也会帮助受害者对抗不公。',
  },
  1045: {
    traits: ['鲁邦三世最常搭档的枪手', '黑发棕瞳', '擅长使用史密斯威森M19左轮手枪', '枪法精准且拔枪速度极快', '常戴宽檐帽遮住眼睛', '留有短胡须', '行事冷静谨慎', '吸烟成习惯', '在关键时刻会保护伙伴'],
    description: '次元大介是鲁邦三世最常搭档的枪手，以精准枪法和迅速拔枪著称，常使用史密斯威森M19左轮手枪。他习惯戴宽檐帽遮住眼睛，也留着短胡须，行事冷静谨慎并常叼着香烟。次元表面上不愿卷入麻烦，却多次与鲁邦并肩行动，在危急时保护伙伴。',
  },
  1046: {
    traits: ['石川五右卫门家族第十三代传人', '以居合斩和剑术闻名', '使用名刀斩铁剑', '常穿传统和服', '留有黑色长发', '性格沉静寡言', '遵循武士道精神', '能将坚硬物体一刀斩断', '多次与鲁邦和次元并肩行动'],
    description: '石川五右卫门是石川五右卫门家族第十三代传人，精通居合斩，使用名刀斩铁剑作战，能将许多坚硬物体一刀斩断。他留着黑色长发，常穿传统和服，性格沉静寡言并重视武士道。五右卫门起初与鲁邦为敌，后来成为鲁邦与次元的重要伙伴，多次共同执行任务。',
  },
  1047: {
    traits: ['职业女盗贼', '黑发棕瞳', '擅长易容与潜入', '善于利用魅力获取情报', '身手敏捷并具备格斗能力', '常使用枪械', '行事独立且精于算计', '会按自身利益选择合作对象', '与鲁邦既合作也竞争'],
    description: '峰不二子是身手敏捷的职业女盗贼，擅长易容、潜入和搜集情报，也会利用魅力接近目标。她能使用枪械并具备格斗能力，行事独立，常按自身利益决定是否与鲁邦合作。不二子与鲁邦之间既有默契也有竞争，时常在关键时刻改变计划或带走目标。',
  },
  1048: {
    traits: ['国际刑警组织的资深刑警', '黑发棕瞳', '长期负责追捕鲁邦三世', '执着且不轻易放弃案件', '熟悉国际刑警调查程序', '擅长格斗与逮捕行动', '常携带手铐', '办案时重视法律与正义', '危急时也会与鲁邦临时合作'],
    description: '钱形幸一是国际刑警组织的资深刑警，长期负责追捕鲁邦三世。他执着而不轻易放弃，熟悉调查程序，擅长格斗与逮捕行动，手铐也是常用装备。钱形办案时重视法律和正义，屡次识破鲁邦的伪装与计划；面对更大的危险时，两人也曾暂时联手。',
  },
  1049: {
    nicknames: ['阿希鲁', 'Ahiru Arima', '有马阿希鲁', 'Princess Tutu', '芭蕾公主'],
    traits: ['芭蕾学校的学生', '真实身份是一只鸭子', '被德罗斯尔迈耶变成女孩', '佩戴可变身的吊坠', '可变身为芭蕾公主', '希望米多重新露出笑容', '帮助米多找回破碎的心', '性格善良而行动笨拙', '与法奇尔和露逐渐成为朋友'],
    description: '阿希鲁平时是芭蕾学校的学生，真实身份却是一只被德罗斯尔迈耶变成人类女孩的鸭子。她以吊坠变身为芭蕾公主，帮助米多找回被打碎的心，最初只是希望王子重新露出笑容。阿希鲁心地善良、行动笨拙，逐渐与法奇尔、露和米多成为重要伙伴。',
  },
  1050: {
    nicknames: ['法奇尔', 'Fakir', '骑士', 'The Knight'],
    traits: ['芭蕾故事中的骑士', '米多从小的朋友和守护者', '是德罗斯尔迈耶的后裔', '能够书写并影响故事', '擅长剑术', '起初对阿希鲁态度冷淡', '曾阻挠芭蕾公主', '后来选择违抗既定故事', '重视并保护米多与阿希鲁'],
    description: '法奇尔是芭蕾故事中的骑士，也是米多从小的朋友和守护者。为了避免米多的心重新完整后受到痛苦，他起初阻挠芭蕾公主并以冷淡态度拒人。法奇尔是德罗斯尔迈耶的后裔，具备书写故事并影响现实的能力，后来选择违抗既定剧本，保护阿希鲁等伙伴。',
  },
  1051: {
    nicknames: ['米多', 'Mytho', '王子', 'The Prince'],
    traits: ['故事中的王子', '原本善良勇敢', '为封印乌鸦而打碎自己的心', '失去心后难以感受情绪', '日常生活依赖法奇尔照料', '芭蕾公主帮助他寻回心的碎片', '随着情感恢复重新理解爱与悲伤', '曾与露交往', '逐渐面对乌鸦带来的威胁'],
    description: '米多原本是善良勇敢的王子，为封印乌鸦而打碎自己的心，从此失去喜怒哀乐，生活上依赖法奇尔照料。阿希鲁成为芭蕾公主后，逐渐为他找回心的碎片；随着情感恢复，米多重新学会体会悲伤、喜悦和爱，并面对乌鸦与露之间的纠葛。',
  },
  1052: {
    nicknames: ['露', 'Rue Kuroha', 'Princess Kraehe', '芭蕾公主克拉耶'],
    traits: ['芭蕾学校的学生', '原本与米多交往', '另一身份是乌鸦之女克拉耶', '受乌鸦影响而与芭蕾公主敌对', '渴望获得父亲和米多的爱', '起初难以表达真实情感', '会使用黑色羽毛攻击', '逐渐重新选择自己的立场', '与阿希鲁等伙伴建立友情'],
    description: '露是芭蕾学校的学生，原本与米多交往。她的另一身份为乌鸦之女芭蕾公主克拉耶，因渴望获得父亲和米多的爱而与阿希鲁敌对。随着被压抑的情感逐渐显露，露开始重新选择自己的立场，并在结局与阿希鲁、法奇尔和米多建立友情。',
  },
  1073: {
    traits: ['第五人偶', '最先在系列中登场的人偶', '外表穿着维多利亚风格洋装', '重视喝红茶的礼仪', '与樱田纯缔结媒介关系', '性格高傲严谨', '珍视人偶伙伴', '参与爱丽丝游戏', '常以言语和动作惩戒纯'],
  },
  1081: {
    traits: ['蓝染麾下的破面', '十刃成员并排名第四', '黑发绿瞳', '眼下有黑色泪痕状纹路', '斩魄刀为黑翼大魔', '性格冷静寡言而善于分析', '曾负责看守井上织姬', '与黑崎一护交战', '拥有第二阶段归刃形态', '常思考人类情感与“心”的含义'],
    description: '乌尔奇奥拉·西法是蓝染麾下排名第四的十刃，黑发绿瞳，眼下有泪痕状纹路。他持有斩魄刀“黑翼大魔”，归刃后长出黑色双翼，并拥有第二阶段归刃形态。乌尔奇奥拉性格冷静寡言，负责看守井上织姬，多次与黑崎一护交锋，也不断追问人类所谓“心”的含义。',
  },
  1087: {
    traits: ['曾任护廷十三队三番队队长', '有银色长发', '常眯起眼睛微笑', '持有斩魄刀神枪', '始解后刀身可迅速伸长', '曾任蓝染惣右介的副队长', '与松本乱菊自幼相识', '曾救下乱菊并一直关心她', '说话常带玩笑和试探', '曾背离尸魂界潜伏在蓝染身边'],
    description: '市丸银曾任护廷十三队三番队队长，留着银色长发，常眯起眼睛微笑。他的斩魄刀“神枪”始解后能迅速伸长，曾任蓝染的副队长，并与松本乱菊自幼相识。银说话常带玩笑和试探，长期潜伏在蓝染身边；他对乱菊怀有深厚感情，行动背后另有目的。',
  },
  1088: {
    traits: ['护廷十三队八番队队长', '后来担任护廷十三队总队长', '常戴斗笠', '穿着粉色花纹羽织', '持有双刀斩魄刀花天狂骨', '与浮竹十四郎是好友', '曾师从山本元柳斋', '性格散漫却善于判断局势', '爱喝酒也喜欢小憩', '重视部下与伙伴'],
    description: '京乐春水曾任护廷十三队八番队队长，后来继任总队长。他常戴斗笠，穿着粉色花纹羽织，持有双刀斩魄刀“花天狂骨”。春水性格散漫，爱喝酒和小憩，但擅长判断局势；他与浮竹十四郎是多年好友，关键战役中也承担起指挥责任。',
  },
  1093: {
    traits: ['护廷十三队三番队副队长', '出身于下级贵族家庭', '年少时父母双亡', '曾与雏森桃、阿散井恋次和桧佐木修兵同窗', '持有斩魄刀侘助', '始解后刀刃击中目标会使其重量加倍', '性格认真而忧郁', '忠于队长和工作职责', '曾因攻击雏森而自责'],
    description: '吉良伊鹤是护廷十三队三番队副队长，出身下级贵族家庭，年幼时父母双亡。他在真央灵术院与雏森桃、阿散井恋次和桧佐木修兵相识，持有斩魄刀“侘助”；始解后每次击中都会使目标重量加倍。伊鹤认真忠于职责，也因曾对雏森拔刀而长期自责。',
  },
  1095: {
    traits: ['护廷十三队九番队副队长', '脸上有“69”纹身', '面部留有战斗疤痕', '持有斩魄刀风死', '曾受东仙要指导', '在真央灵术院时是恋次等人的学长', '性格成熟冷静且有责任感', '通常尽量避免无谓冲突', '与阿散井恋次和吉良伊鹤关系熟络', '会认真面对自己对东仙的复杂情感'],
    description: '桧佐木修兵是护廷十三队九番队副队长，脸上有“69”纹身并留有战斗疤痕，持有斩魄刀“风死”。他曾受东仙要指导，在真央灵术院时是恋次等人的学长。修兵成熟冷静、有责任感，平时尽量避免无谓冲突；东仙叛变后，他也必须面对对这位老师的复杂情感。',
  },
  1110: {
    traits: ['鲁鲁修的妹妹', '浅金色头发', '蓝色眼睛但因创伤失明', '旧伤使她需要使用轮椅', '被不列颠尼亚入侵改变身份后改姓兰佩路基', '性格温柔善良', '坚持以和平方式解决冲突', '与哥哥感情深厚', '曾在阿什福德家族庇护下生活'],
    description: '娜娜莉·兰佩路基是鲁鲁修的妹妹，年幼时因枪伤失去视力，腿部旧伤也使她需要使用轮椅。她温柔善良，始终希望以和平方式改变不列颠尼亚对日本的统治。日本沦陷后，鲁鲁修为保护她而隐瞒皇族身份，两人改姓兰佩路基并在阿什福德家族的庇护下生活。',
  },
  1114: {
    traits: ['神圣不列颠尼亚帝国第三皇女', '鲁鲁修与娜娜莉同父异母的妹妹', '粉色头发', '性格温和善良', '重视平民的处境', '提出建立日本特别行政区', '与枢木朱雀相恋', '曾担任第十一区副总督', 'Geass失控后引发重大悲剧'],
    description: '尤菲米娅是神圣不列颠尼亚帝国第三皇女，也是鲁鲁修与娜娜莉同父异母的妹妹。她性情温和，试图以和平方式改善日本人的处境，提出建立特别行政区。她与朱雀相恋，担任副总督期间努力推行理想；Geass失控后发生的惨剧彻底改变了战争局势。',
  },
  1167: {
    traits: ['山本有里的姐姐', '矢野元本女友', '黑发棕瞳', '身高161厘米', '性格与妹妹有明显反差', '性格与高桥七美有相似之处', '在故事开始前已去世', '与前男友同乘汽车时遭遇车祸', '她的死影响矢野后续的情感选择'],
    description: '山本奈奈是山本有里的姐姐，也是矢野的初恋女友。她性格与妹妹相反，却与高桥七美有几分相似，身高161厘米。故事开始前一年，奈奈与前男友同乘汽车时遭遇车祸去世；虽然她未持续出现在主线中，这段往事仍影响矢野对恋爱、失去与新关系的态度。',
  },
  1184: {
    traits: ['桃丘音乐学院三年级钢琴专业学生', '二十一岁', '棕发棕瞳', '擅长钢琴和小提琴', '目标是成为职业指挥家', '出身富裕家庭', '做事追求完美', '童年经历使他害怕乘飞机和乘船', '与野田惠逐渐发展为恋人关系'],
    description: '千秋真一是桃丘音乐学院三年级钢琴专业学生，兼擅钢琴与小提琴，目标是成为指挥家。他来自优渥家庭，做事追求完美，因童年经历惧怕乘飞机和乘船。遇见野田惠后，他逐渐面对恐惧、重新理解音乐，并前往欧洲展开指挥生涯。',
  },
  1185: {
    nicknames: ['野田惠', 'Megumi Noda', 'Nodame', '野田妹', '野田めぐみ'],
    traits: ['桃丘音乐学院的钢琴专业学生', '棕发', '昵称“野田妹”', '擅长凭听觉记忆演奏', '演奏风格自由而富有歌唱性', '生活随性且不擅长打扫', '料理能力很差', '爱慕千秋真一并常跟着他', '常戏称自己是千秋的妻子'],
    description: '野田惠是桃丘音乐学院的钢琴专业学生，擅长凭听觉记忆弹奏，风格自由而富有歌唱性。她生活随性，不擅做饭和打扫，常以“野田妹”自称。惠爱慕千秋真一，常跟在他身边并戏称自己是他的妻子；她的演奏天赋也影响千秋重新发现音乐的乐趣。',
  },
  1186: {
    traits: ['黑发', '千秋真一的前女友', '家中经营乐器店', '在千秋对过去关系的回忆中出现', '黑瞳', '成熟稳重', '与古典音乐生活圈有关', '优雅'],
    description: '多贺谷彩子是千秋真一曾交往的前女友，她的家族经营乐器店。她出现在千秋对过去关系的回忆中，与他所处的音乐生活圈有所交集，也让千秋重新面对旧日情感与选择。现有AniList档案没有说明彩子的专业或演奏乐器，因此不沿用尚未核实的“低音提琴手”说法。',
  },
  1244: {
    traits: ['《芳邻物语》角色德森弘明的儿子', '早坂紫的同班同学', '外表英俊且成绩优秀', '故事初期是紫倾慕的对象', '曾与樱田实和子相恋', '其父曾阻止他与实和子见面', '后来与早坂紫相恋', '与服装设计学校的学生们相识', '出身与《芳邻物语》人物有关'],
    description: '德森浩行是《芳邻物语》角色德森弘明的儿子，也是早坂紫的同班同学。他外表英俊、成绩优秀，故事初期是紫倾慕的对象。浩行过去曾与樱田实和子相恋，但实和子的哥哥岚介入后两人分开；随着故事发展，浩行逐渐与紫相恋。',
  },
  1262: {
    traits: ['碇真嗣的同班同学', '棕发棕瞳', '与相田剑介是好友', '是校队成员和运动少年', '最初因妹妹在使徒袭击中受伤而殴打真嗣', '后来与真嗣成为好友', '被选为第四适格者', '驾驶EVA三号机', '曾在EVA三号机事故中被迫与真嗣交战', '性格直率而重视家人'],
    description: '铃原东治是碇真嗣的同班同学，也是相田剑介的好友，平时热爱运动。他最初因妹妹在使徒袭击中受伤而迁怒真嗣，后来逐渐与真嗣成为朋友。东治被选为第四适格者并驾驶EVA三号机；机体遭使徒控制后，真嗣被迫与其交战，这段经历给两人留下深刻影响。',
  },
  1272: {
    traits: ['十六岁的高中一年级学生', '父母双亡后成为孤儿', '偶然损坏SPR调查用的相机后暂代助理', '后来成为SPR正式兼职助手', '担任调查事务所的办公室与外勤助手', '称涉谷一也为“Naru”', '性格开朗善良', '逐渐显现预知梦等灵异能力', '参与多起灵异事件调查'],
    description: '谷山麻衣是十六岁的高中一年级学生，父母双亡后独自生活。她意外损坏SPR调查用的相机，暂时替代受伤的林做助手，之后留下来担任事务所的兼职助手，负责办公室和外勤工作。麻衣性格开朗善良，称负责人涉谷一也为“Naru”；随着调查推进，她逐渐发现自己具有预知梦等灵异能力。',
  },
  1273: {
    nicknames: ['涉谷一也', 'Kazuya Shibuya', 'Naru', '涉谷Naru', '成濑巳赖'],
    traits: ['SPR灵异调查事务所负责人', '头脑敏锐且知识丰富', '主要依靠科学调查和推理', '并不具备明显的灵能力', '因自恋被麻衣称为“Naru”', '表面冷淡且言辞尖锐', '实际关心调查团队成员', '与林长期合作', '能在伙伴缺席时独立主持调查'],
    description: '涉谷一也是SPR灵异调查事务所的负责人，头脑敏锐、知识丰富，主要依靠科学调查与推理处理案件，并不具备明显的灵能力。麻衣因他自恋而称他为“Naru”。他表面冷淡、言辞尖锐，实际上关心团队成员，长期与林合作，也能在同伴缺席时主持调查。',
  },
  1274: {
    traits: ['年轻的灵媒', '拥有广受欢迎的电视节目', '能够感知并与亡灵交流', '常穿和服', '连睡觉时也穿和服', '外貌像日本人偶', '参与SPR的灵异调查', '在调查中提供灵媒视角', '与麻衣等调查成员合作'],
    description: '原真砂子是年轻的灵媒，拥有广受欢迎的电视节目，能够感知并与亡灵交流。她几乎总穿着和服，连睡觉也不换衣，因此外貌像日本人偶。真砂子参与SPR的灵异调查，为案件提供灵媒视角，并与麻衣、涉谷一也等成员共同面对各种灵异事件。',
  },
  1275: {
    traits: ['来自澳大利亚的天主教神父', '身高162厘米', '日语带有明显关西腔', '性格友善且乐于助人', '使用圣水进行驱魔', '驱魔时会诵读《约翰福音》', '经常协助SPR调查', '擅长处理附身在人身上的灵体', '与麻衣和涉谷一也合作'],
    description: '约翰·布朗是来自澳大利亚的天主教神父，日语带有明显关西腔，因此说话方式颇有特色。他性格友善、乐于助人，常协助麻衣和涉谷一也调查灵异事件。约翰以圣水配合《约翰福音》驱魔，尤其擅长处理附身在人身上的灵体，在SPR遇到相关案件时会提供帮助。',
  },
  1276: {
    traits: ['二十五岁', '曾在高野山学习并离开僧职', '法名为泷川法生', '目前是乐队的贝斯手', '熟悉佛教咒语与除灵仪式', '常被SPR成员称为“和尚”', '性格随和，常开玩笑', '会在涉谷缺席时带领调查', '像兄长一样关照谷山麻衣'],
    description: '泷川法生二十五岁，曾在高野山学习并离开僧职，后来成为乐队的贝斯手。他熟悉佛教咒语与除灵仪式，SPR成员常称他为“和尚”。泷川性格随和爱开玩笑，处理灵异事件经验丰富；涉谷缺席时他会带领调查，也常像兄长一样关照麻衣。',
  },
  1277: {
    traits: ['二十三岁的自称巫女', '并非在神社家庭长大', '父亲是经营社区医院的富有医生', '自信且性格直率', '擅长神道仪式与九字护身法', '会教麻衣防身咒法', '部分能力依靠附近的活树', '尝试展示灵力时常未能奏效', '参与SPR的灵异调查'],
    description: '松崎绫子二十三岁，自称神道巫女，但她并非在神社家庭长大，而是富有医生的女儿。绫子自信直率，熟悉神道仪式和九字护身法，也教麻衣一些防身咒法。她的灵力并非总能奏效，后来发现部分能力需要附近有活树；她持续参与SPR的灵异调查。',
  },
  1278: {
    traits: ['原籍香港', '涉谷一也的助手', '性格冷静寡言', '很少主动说话', '擅长处理灵异事件', '被认为掌握阴阳道和式神术', '能够进行驱邪并召唤式神', '常接手调查中的繁重工作', '曾向麻衣谈及日本侵华历史'],
    description: '林兴徐原籍香港，是涉谷一也冷静寡言的助手，很少主动说话，却经常承担调查中的繁重工作。他熟悉多种灵异知识，擅长驱邪和召唤式神，因此常被认为掌握阴阳道。林曾向麻衣谈及日本侵华历史，也会在关键时刻运用术法保护调查团队。',
  },
  1283: {
    nicknames: ['莉莉叶', 'Lilie', 'Yuma', '尤玛'],
    traits: ['阿希鲁在芭蕾学校的朋友', '与阿希鲁一同学习芭蕾', '常称赞阿希鲁可爱', '有时故意说些惹她困扰的话', '内心希望阿希鲁过得好', '性格活泼俏皮', '故事中的芭蕾学校学生', '在校园日常中与阿希鲁互动', '是阿希鲁身边的同学伙伴'],
    description: '莉莉叶是阿希鲁在芭蕾学校的朋友，两人一同学习芭蕾，她也坚持练习舞蹈。她常称赞阿希鲁可爱，有时也故意说些惹她困扰的话；不过莉莉叶内心希望朋友过得好。她性格活泼俏皮，是阿希鲁校园日常中的同学伙伴，英文译名也作Yuma。',
  },
  1284: {
    traits: ['本名夏洛特·奥尔良', '常用别名塔巴萨', '蓝发蓝瞳', '伽利亚王国的公主与王位继承人', '路易丝与丘鲁克的同学', '性格沉静寡言', '喜欢阅读', '擅长风系魔法', '使魔是风龙希尔菲德', '与丘鲁克是好友'],
    description: '夏洛特·奥尔良常用别名“塔巴萨”，是伽利亚王国的公主和王位继承人。她是路易丝与丘鲁克的同学，性格沉静寡言，常捧书阅读，擅长风系魔法。塔巴萨的使魔是风龙希尔菲德，她与丘鲁克关系亲密，身世与王位争夺也逐渐成为故事的重要线索。',
  },
  1286: {
    traits: ['崔斯汀魔法学院学生', '红发棕瞳', '擅长火系魔法', '使魔是火蜥蜴弗雷姆', '来自泽尔布斯家族', '与拉·瓦利埃尔家族有世仇', '性格热情自信', '擅长与男生交往并主动调情', '后来爱上平贺才人'],
  },
  1308: {
    traits: ['圣米亚特尔女子学园学生', '蓝发蓝瞳', '初登场时是渚砂的室友', '性格开朗热情', '对渚砂十分关心并逐渐爱上她', '擅长读书且加入文学社', '喜欢写诗', '为学校演出撰写《卡门》剧本', '曾被视为伊托瓦尔候选人'],
    description: '凉水玉青是圣米亚特尔女子学园的学生，初登场时是渚砂的室友。她性格开朗热情，对渚砂格外关心并逐渐爱上她。玉青喜欢读书、加入文学社，也会创作诗歌；她还为学校改编演出撰写《卡门》剧本，深受同学欢迎，一度被视为伊托瓦尔候选人。',
  },
  1309: {
    traits: ['月之巫女', '黑发蓝瞳', '出身名门且家境富裕', '住在有多名女仆的大宅', '在学校拥有很高声望', '擅长弓道并以弓作战', '钢琴和网球也很出色', '与姬子关系亲密', '对姬子怀有深厚感情'],
    description: '姬宫千歌音是月之巫女，出身名门，住在有多名女仆的大宅，在学校拥有很高声望。她气质优雅、擅长领导，加入弓道社并常以弓对抗大蛇众，钢琴和网球也十分出色。千歌音与姬子关系亲密，长期压抑着对姬子的深厚感情，在校内也受到许多男女同学仰慕。',
  },
  1311: {
    traits: ['大蛇众的第七首', '黑发黑瞳', '在大蛇众中仍能抵抗邪恶侵蚀', '长期保护姬子和千歌音', '与姬子是青梅竹马', '也喜欢姬子', '在学校有很高声望', '性格正直而有责任感', '最终由哥哥翼救回'],
    description: '大神相马是大蛇众的第七首，也是其中少数能抵抗邪恶侵蚀的人。他长期保护姬子和千歌音，与姬子自幼相识，也一直喜欢她。相马在学校颇有声望，性格正直而有责任感，也擅长操作大蛇机体；后来他被诅咒压制，最终由哥哥翼救回。',
  },
  1312: {
    traits: ['大蛇众第一首', '被视为大蛇众的首领和最强者', '有蓝绿色头发', '大神相马的亲哥哥', '为保护弟弟而杀死虐待他的父亲', '离开家后长期逃亡', '曾有多项犯罪记录', '试图让相马加入大蛇众', '对弟弟仍怀有保护之情'],
    description: '翼是大蛇众第一首，被视为组织的首领和最强者，留着蓝绿色头发。他是大神相马的亲哥哥，童年时为保护弟弟而杀死虐待他们的父亲，之后长期逃亡并留下多项犯罪记录。翼后来试图让相马加入大蛇众；虽然行动残酷，他对弟弟仍有复杂的保护之情。',
  },
  1313: {
    traits: ['园崎魅音的双胞胎姐妹', '绿发绿瞳', '两人幼年时曾互换身份', '在家族安排下曾被送往寄宿学校', '逃离学校后住在兴宫町', '性格与魅音不同', '携带电击器', '曾遭园崎家长期囚禁和虐待', '经历创伤后产生强烈复仇心理'],
    description: '园崎诗音是园崎魅音的双胞胎姐妹，两人幼年时曾因家族安排而互换身份。诗音曾被送往寄宿学校，后来逃离并住在兴宫町；她与魅音性格不同，却仍会交换身份。诗音携带电击器，曾遭园崎家囚禁和虐待，这些创伤逐渐转化为针对家族的强烈复仇心理。',
  },
  1340: {
    traits: ['体型小巧的球形机器人', '常见外壳为绿色', '作为伙伴型支援机器人出现', '沿用高达系列的吉祥物设计', '能够发出“Haro”等电子语音', '在《水星的魔女》中与斯莱塔同行', '可连接终端并协助操作', '性格表现活泼可爱', '是《机动战士高达》系列的代表性机器人形象'],
    description: '哈罗是体型小巧的球形机器人，也是《机动战士高达》系列长期沿用的吉祥物与伙伴型支援角色。在《水星的魔女》中，哈罗以绿色外壳登场，会发出“Haro”等电子语音，并能连接终端协助操作。它常陪伴斯莱塔等角色，为紧张的校园与战斗剧情增添轻松气氛。',
  },
  1353: {
    traits: ['犬妖与人类所生的半妖', '银白色长发并有犬耳', '持有父亲留下的铁碎牙', '常穿火鼠裘', '半月之夜会暂时变成人类', '人类形态为黑发并失去妖力', '性格急躁好胜却重视伙伴', '喜欢吃方便面', '与日暮戈薇等人寻找四魂之玉'],
    description: '犬夜叉是犬妖与人类所生的半妖，留着银白色长发并有犬耳，常穿火鼠裘，持有父亲留下的铁碎牙。每逢无月之夜，他会暂时变成黑发的人类并失去妖力。犬夜叉脾气急躁、好胜，却重视伙伴；他与日暮戈薇等人踏上旅程，寻找四魂之玉碎片。',
  },
  1354: {
    traits: ['生活在现代日本的初中女生', '黑发棕眼', '从食骨之井穿越到战国时代', '是桔梗的转世', '体内封存着四魂之玉', '拥有强大的灵力', '擅长使用弓箭和破魔之箭', '性格勇敢而富有同情心', '常以念珠命令犬夜叉伏下'],
    description: '日暮戈薇是生活在现代日本的初中女生，从食骨之井穿越到战国时代。她是巫女桔梗的转世，体内一度封存四魂之玉，拥有灵力并擅长使用弓箭与破魔之箭。戈薇勇敢而富有同情心，常以念珠命令犬夜叉伏下，也与伙伴共同寻找四魂之玉碎片。',
  },
  1355: {
    traits: ['职业是妖怪退治屋', '留有黑色长发和棕色眼睛', '使用巨型回旋镖飞来骨', '随身伙伴是猫妖云母', '弟弟是琥珀', '擅长使用毒针和除妖工具', '身手敏捷且战斗经验丰富', '与弥勒相恋并结为夫妻', '重视保护伙伴与家人'],
    description: '珊瑚是职业妖怪退治屋，留有黑色长发和棕色眼睛，使用巨型回旋镖“飞来骨”作战，伙伴是猫妖云母。她身手敏捷、战斗经验丰富，也会使用毒针等除妖工具。珊瑚曾被奈落利用而与伙伴为敌，之后重返队伍，与弥勒相恋并共同保护弟弟琥珀。',
  },
  1356: {
    traits: ['留有黑发', '游方的法师', '右手掌有风穴诅咒', '风穴会吸入眼前物体和妖怪', '风穴扩大后会危及自身性命', '使用锡杖和法术战斗', '熟悉佛经与符咒', '好色且常向女性求婚', '与珊瑚相恋并成家', '作为队伍成员共同追捕奈落'],
    description: '弥勒是游方的法师，右手掌带有奈落施下的“风穴”诅咒，会不断吸入眼前的物体和妖怪，扩大后甚至危及自身性命。他使用锡杖、佛经与符咒战斗，平日好色，常向女性求婚。弥勒与珊瑚相恋并成家，也一直与伙伴追捕奈落。',
  },
  1357: {
    traits: ['年幼的狐妖', '棕色眼瞳', '擅长变身和制造幻象', '父亲曾被雷兽兄弟杀害', '因复仇而接近犬夜叉一行', '之后成为队伍伙伴', '性格胆小又爱逞强', '常与犬夜叉斗嘴', '会在危险时保护伙伴', '喜欢恶作剧并负责活跃气氛'],
    description: '七宝是年幼的狐妖，擅长变身和制造幻象。父亲被雷兽兄弟杀害后，他曾为复仇而接近犬夜叉一行，之后成为旅途伙伴。七宝胆小又爱逞强，常与犬夜叉斗嘴、恶作剧并活跃气氛，也协助寻找四魂之玉碎片；遇到危险时会努力保护同伴。',
  },
  1374: {
    traits: ['《游戏王》系列的主要主人公', '身高153厘米', '标志性发型由黑色、金色和洋红色组成', '紫色眼瞳', '性格善良且起初十分害羞', '解开千年积木后唤醒其中的灵魂', '热爱与伙伴进行游戏和决斗', '在决斗中逐渐建立自信', '与暗游戏互相信任并合作', '把伙伴和友情看得很重要'],
    description: '武藤游戏是《游戏王》的主人公，身高153厘米，标志性发型由黑色、金色和洋红色组成。他起初害羞孤独，在解开千年积木后唤醒其中沉睡的灵魂，并逐渐结识伙伴。游戏热爱游戏与决斗，随着一次次对战建立自信，也与暗游戏互相信任、并肩解决危机。',
  },
  1375: {
    nicknames: ['暗游戏', 'Yami Yuugi', 'Yami Yugi', 'Atem', '阿图姆', '无名法老'],
    traits: ['沉睡在千年积木中的灵魂', '真实身份是古埃及法老阿图姆', '标志性发型与武藤游戏相似', '头发呈黑、金、洋红色组合', '紫色眼瞳', '失去生前记忆', '精通古埃及暗游戏', '与武藤游戏共享身体并相互合作', '在决斗中守护伙伴'],
    description: '暗游戏是沉睡在千年积木中的灵魂，真实身份是古埃及法老阿图姆。苏醒后，他与武藤游戏共享身体，起初彼此并不了解，后来建立信任并共同应对危机。暗游戏精通古埃及暗游戏，决斗时冷静果断，努力找回失去的记忆，也会保护游戏和他的伙伴。',
  },
}

const actorImageUrls = {
  1111: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95140-sFp0uedEmZ9f.png',
  1259: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95009-d01Dg8mMwcg6.png',
  1308: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95072-V8FWqUIDJ57b.png',
  1353: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95067-hqIpNxMfAuN2.png',
  1354: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95003-Du7wb5JJzb8P.png',
  1355: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95057-zkd7yTPVxfyu.jpg',
  1356: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95427-g0bwNKDLlROd.png',
}

const local = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const localById = new Map(local.map((row) => [Number(row.id), row]))
const batch = local.filter((row) => Number(row.id) > 1038).slice(0, 100)
if (batch.length !== 100) throw new Error(`本批应为100位，实际${batch.length}位`)
const ids = batch.map((row) => Number(row.id))
const originalNames = new Map(batch.map((row) => [Number(row.id), row.name]))
const originalTitles = new Map(batch.map((row) => [Number(row.id), row.anime_title]))
const missingProfiles = ids.filter((id) => !profileDoc.profiles[id])

for (const row of batch) {
  const id = Number(row.id)
  const profile = profileDoc.profiles[id]
  if (fixes[id]) Object.assign(row, fixes[id])
  row.nicknames = [...new Set([
    ...(row.nicknames || []),
    row.name,
    profile?.name?.full,
    profile?.name?.native,
    ...(profile?.name?.alternative || []),
    ...(fixes[id]?.nicknames || []),
  ].filter(Boolean))]
  row.voice_actors ||= []
  if (actorImageUrls[id]) {
    const japaneseActor = row.voice_actors.find((actor) => ['日语', 'Japanese', 'JA'].includes(actor.language))
    if (!japaneseActor) throw new Error(`角色${id}找不到日配声优`)
    japaneseActor.image = actorImageUrls[id]
  }
  row.search_text = [row.name, row.anime_title, ...row.nicknames, ...(row.traits || []), ...row.voice_actors.map((actor) => actor.name)].join(' ')
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
    if (remote.name !== originalNames.get(id) || remote.anime_title !== originalTitles.get(id)) throw new Error(`角色${id}数据库原值与本地导出不同，停止写入`)
  }
  const actorNames = new Map()
  for (const actor of actorsResult.data || []) {
    const list = actorNames.get(Number(actor.character_id)) || []
    list.push(actor.name)
    actorNames.set(Number(actor.character_id), list)
  }
  const voiceImageUpdates = []
  const voiceRows = voiceRowsResult.data || []
  for (const [characterIdText, image] of Object.entries(actorImageUrls)) {
    const characterId = Number(characterIdText)
    const expectedActor = localById.get(characterId).voice_actors.find((actor) => actor.image === image)
    if (!expectedActor) throw new Error(`角色${characterId}的声优头像地址找不到对应角色声优`)
    const matches = voiceRows.filter((row) => Number(row.character_id) === characterId && row.name === expectedActor.name)
    if (matches.length !== 1) throw new Error(`角色${characterId}的声优头像记录匹配${matches.length}条，停止写入`)
    voiceImageUpdates.push({ id: matches[0].id, characterId, name: expectedActor.name, image })
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
    db.from('voice_actors').select('id,character_id,name,image').in('id', voiceImageUpdates.map((row) => row.id)),
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
    const expectedSearch = [got.name, got.anime_title, ...(got.nicknames || []), ...(got.traits || []), ...(actorNames.get(id) || [])].join(' ')
    if (got.search_text !== expectedSearch || got.search_text.includes(got.description)) throw new Error(`角色${id}的search_text回读不一致`)
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
    const text = String(value ?? '')
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const lines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
  for (const row of local) lines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map((actor) => actor.name).join(',')].map(csvField).join(','))
  fs.writeFileSync(fullPath, JSON.stringify(local, null, 2))
  fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
  fs.writeFileSync(csvPath, `\uFEFF${lines.join('\n')}\n`)
  fs.writeFileSync(profilePath, JSON.stringify(profileDoc, null, 2))
}

if (process.argv.includes('--sync')) await syncDatabase()
writeLocalExports()

const colorRegex = /(浅金色头发|粉色头发|蓝绿色头发|黑色、金色和洋红色组成|金发|黄发|银发|白发|黑发|红发|橘发|橙发|棕发|蓝发|绿发|紫发|金色眼瞳|绿色眼瞳|棕色眼瞳|黑色眼瞳|蓝色眼瞳|红色眼瞳|绿瞳|蓝瞳|红瞳|棕瞳|黑瞳|紫瞳|蓝眼|棕眼|黑眼|红眼|绿眼|紫眼)/
const sourceVisualReviewIds = [1044, 1045, 1046, 1047, 1048, 1080, 1110, 1111, 1113, 1114, 1121, 1164, 1165, 1167, 1168, 1184, 1185, 1186, 1259, 1261, 1262, 1264, 1284, 1286, 1287, 1289, 1308, 1309, 1310, 1311, 1312, 1313, 1353, 1354, 1355, 1356, 1357, 1374, 1375, 1377]
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
  pendingSourceReviewIds: [1186, 1243],
  pendingVisualVerificationIds: [...new Set([
    ...sourceVisualReviewIds,
    ...batch.filter((row) => (row.traits || []).some((trait) => colorRegex.test(trait))).map((row) => Number(row.id)),
  ])].sort((a, b) => a - b),
  pendingVisualVerification: 'AniList文字档案已对照；浏览器无法打开本地角色图核对页，直接角色页读取超时，故含发色或瞳色的记录未标为视觉验收通过。',
  featureTagPreference: '按用户说明，可靠来源支持时纳入网络流行用语特征；本批没有找到足以确认“平乳”适用对象的可靠信息，未臆加。',
  verifiedCorrections: [{ id: 1355, field: 'traits', before: '弟弟是珊瑚', after: '弟弟是琥珀', source: 'AniList character profile 1355 states Sango’s younger brother is Kohaku.' }],
  voiceActorImageIds: Object.keys(actorImageUrls).map(Number),
  note: process.argv.includes('--sync') ? 'Supabase写入并回读成功；人物搜索字段不含简介；7位日配声优头像已补齐并回读。另修正珊瑚弟弟姓名：珊瑚→琥珀。1186、1243档案信息过少，留待可靠来源补查。' : '本地导出已更新；尚未同步Supabase。',
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ checked: batch.length, modified: Object.keys(fixes).length, missingProfiles, pendingSourceReviewIds: report.pendingSourceReviewIds, pendingVisualVerificationIds: report.pendingVisualVerificationIds, actorImages: Object.keys(actorImageUrls).length, reportPath }, null, 2))
