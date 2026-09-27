import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// Curated from the actionable anime and character requests in the public feedback board.
// Character IDs and image/voice-actor URLs are from AniList; descriptions and traits are
// written for this site and deliberately excluded from search_text.
const records = [
  // The Fragrant Flower Blooms with Dignity (薰香花朵凛然绽放)
  { id: 268676, name: '和栗薰子', anime_title: '薰香花朵凛然绽放', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b268676-aQmqvqj0DNoJ.png', nicknames: ['Kaoruko Waguri', '薰子', 'Waguri', '和栗薫子', '薰香花朵凛然绽放'], traits: ['黑发', '紫色眼瞳', '温柔', '开朗', '礼貌', '甜点爱好者', '桔梗女子高中生', '重视朋友', '善于倾听', '与凛太郎交往'], description: '和栗薰子是桔梗女子高中二年级学生，性格开朗温柔，待人真诚，也很喜欢甜点。她在家族经营的蛋糕店帮忙时结识了高个子、外表显得凶狠的紬凛太郎，却没有被他的外貌吓退。薰子愿意直接表达好感，也尊重对方的节奏；她与凛太郎逐步靠近的过程，推动两所学校之间的误会与隔阂慢慢化解。', voice_actor: { name: '井上穗乃花', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n129363-xjhWsP7JCp3F.jpg' } },
  { id: 268677, name: '紬凛太郎', anime_title: '薰香花朵凛然绽放', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b268677-APMPGH67QqPr.jpg', nicknames: ['Rintarou Tsumugi', '凛太郎', 'Tsumugi', '紬凜太郎', '薰香花朵凛然绽放'], traits: ['金发', '高个子', '体格健壮', '表情严肃', '心地善良', '烘焙店帮手', '千鸟高中生', '不擅表达', '重视家人', '薰子的恋人'], description: '紬凛太郎是千鸟高中二年级学生，身材高大、金发且神情严肃，因此常被陌生人误以为凶狠。他其实待人诚恳，放学后会在家里的蛋糕店帮忙，也很珍惜家人与朋友。与桔梗女子高中生和栗薰子相识后，凛太郎开始正视自己的外表带来的偏见，并在笨拙却认真的交流中逐渐建立自信。', voice_actor: { name: '中山祥德', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n191121-DcWKbMDznWRQ.png' } },
  { id: 270095, name: '保科昴', anime_title: '薰香花朵凛然绽放', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b270095-Z5KpvacVXp1S.jpg', nicknames: ['Subaru Hoshina', '昴', 'Hoshina', '保科昴', '薰香花朵凛然绽放'], traits: ['短发', '运动系', '桔梗女子高中生', '薰子的好友', '直率', '可靠', '保护欲强', '重视友情', '观察敏锐', '不轻信千鸟学生'], description: '保科昴是桔梗女子高中学生，也是和栗薰子最亲近的朋友之一。她性格直率、行动力强，对朋友有很强的保护欲，起初会对与千鸟高中有关的人保持警惕。随着与紬凛太郎等人接触，昴逐渐学会把个人判断与学校间流传的偏见区分开来。她看似强势，内心却十分在意薰子的幸福与朋友之间的信任。', voice_actor: { name: '山根绮', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n152204-KPn660ma9Qyv.jpg' } },
  { id: 272241, name: '夏泽朔', anime_title: '薰香花朵凛然绽放', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b272241-6NHTwQDIUXQk.png', nicknames: ['Saku Natsusawa', '朔', 'Natsusawa', '夏沢朔', '薰香花朵凛然绽放'], traits: ['黑发', '千鸟高中生', '凛太郎的朋友', '成绩优秀', '冷静', '毒舌', '观察力强', '讲求逻辑', '重视同伴', '擅长指出问题'], description: '夏泽朔是千鸟高中学生，与紬凛太郎和宇佐美翔平关系亲近。他成绩优秀、头脑冷静，说话有时尖锐，习惯先观察再判断，因此常能发现朋友忽略的细节。朔并非刻意疏远他人，而是不擅长用柔和的方式表达关心；在凛太郎与薰子的关系发展中，他会提出直接意见，也逐渐理解自己对人际关系的看法。', voice_actor: { name: '内山昂辉', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n96764-yJWGrhjanDJQ.png' } },
  { id: 272240, name: '宇佐美翔平', anime_title: '薰香花朵凛然绽放', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b272240-1okw3miy0dPX.png', nicknames: ['Shohei Usami', '翔平', 'Usami', '宇佐美翔平', '薰香花朵凛然绽放'], traits: ['棕发', '千鸟高中生', '凛太郎的好友', '开朗', '健谈', '行动派', '气氛担当', '重视友情', '支持薰子与凛太郎', '擅长缓和冲突'], description: '宇佐美翔平是千鸟高中学生，也是紬凛太郎的重要朋友。他性格开朗健谈，常主动把同伴聚在一起，能在紧张气氛中用轻松的话题让大家放松。翔平支持凛太郎与薰子的交往，也愿意陪朋友面对学校间的偏见与误会。与夏泽朔较为冷静的做派不同，他更依靠直觉和热情表达善意，是朋友圈里的气氛担当。', voice_actor: { name: '户谷菊之介', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n284463-w0qcBQXvlz3Z.png' } },

  // A Will Eternal (一念永恒), a Chinese animation without Japanese voice actors.
  { id: 221477, name: '白小纯', anime_title: '一念永恒', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b221477-jpP38SiJuLxN.png', nicknames: ['Bai Xiaochun', '小纯', '白小纯', '一念永恒'], traits: ['黑发', '修仙者', '长生追求者', '怕死', '机灵', '贪吃', '炼药师', '灵溪宗弟子', '逆河宗宗主', '重情义'], description: '白小纯是《一念永恒》的主角，自幼因害怕死亡而踏上修仙之路，一心追求长生。他看似胆小怕事、贪吃又爱耍小聪明，却有极强的求生意志和炼丹天赋，常凭出人意料的办法化解危机。从灵溪宗弟子到宗门领袖，白小纯经历多次修行与战乱，也逐渐理解长生之外的责任、情义与守护。' },
  { id: 221478, name: '杜凌菲', anime_title: '一念永恒', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b221478-UTf9ox7fbjPj.jpg', nicknames: ['Du Lingfei', '凌菲', '杜师姐', '杜凌菲', '一念永恒'], traits: ['黑发', '修仙者', '灵溪宗弟子', '端庄', '聪慧', '外柔内刚', '重视宗门', '擅长战斗', '白小纯的同门', '身世特殊'], description: '杜凌菲是灵溪宗的重要女弟子，与白小纯在宗门修行期间相识。她外表端庄沉静，待人有礼，处理事务时却很有主见，既有出色的修为，也重视宗门与同伴。杜凌菲的身世与修仙界更深层的势力有所牵连，使她在个人情感和家族责任之间面临选择；她与白小纯的交往也成为故事早期的重要人物线索。' },
  { id: 221479, name: '侯小妹', anime_title: '一念永恒', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b221479-6wBiHciXyT85.jpg', nicknames: ['Hou Xiaomei', '小妹', '侯师妹', '侯小妹', '一念永恒'], traits: ['少女', '修仙者', '灵溪宗弟子', '活泼', '直率', '重情义', '勤于修炼', '白小纯的同门', '热心助人', '宗门生活'], description: '侯小妹是灵溪宗的年轻女弟子，与白小纯在宗门生活中有不少交集。她性格活泼直率，对同门抱有善意，也会认真参与修炼和宗门事务。面对白小纯时，她常被对方的奇特言行牵动情绪，却仍愿意在关键时刻伸出援手。侯小妹的故事呈现了宗门弟子日常的一面，也让白小纯身边的人际关系更加丰富。' },
  { id: 221496, name: '李青候', anime_title: '一念永恒', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b221496-PtdQi58ex5m1.png', nicknames: ['Li Qinghou', '李师叔', '青候', '李青候', '一念永恒'], traits: ['黑发', '筑基修士', '灵溪宗长老', '白小纯师长', '严肃', '护短', '责任心强', '擅长教导', '重视宗门', '外冷内热'], description: '李青候是灵溪宗长老，也是白小纯踏入修仙之路后重要的引路人。他外表严肃、言辞不多，处理宗门事务时讲究规矩，却会在关键时刻保护弟子并为他们承担责任。李青候对修行有清晰要求，既督促白小纯成长，也不断替这位闯祸频繁的弟子收拾残局。他的克制与护短并存，体现了宗门长辈对后辈的关怀。' },
  { id: 281839, name: '宋君婉', anime_title: '一念永恒', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b281839-A99UDHW9lrjm.png', nicknames: ['Song Junwan', '君婉', '宋师祖', '宋君婉', '一念永恒'], traits: ['红衣', '结丹修士', '血溪宗长老', '成熟', '妩媚', '精明', '实力强', '善于权衡', '与白小纯交锋', '重视修行成果'], description: '宋君婉是血溪宗的高阶修士，修为深厚，行事成熟而精明。她善于洞察局势，能够在宗门竞争与个人利益之间迅速权衡；面对白小纯时，既会试探、利用他的能力，也逐渐认可他的胆识与炼丹本领。宋君婉拥有鲜明的强者气场，言谈举止从容自信，在血溪宗的权力关系和白小纯的成长历程中都占有重要位置。' },

  // GNOSIA
  { id: 358222, name: '刹', anime_title: '古诺希亚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b358222-tS0VgiFUEd2p.png', nicknames: ['Setsu', 'セツ', '刹', '古诺希亚'], traits: ['短发', '太空船船员', '冷静', '果断', '善于分析', '可靠', '战斗训练', '失忆循环', '守护悠利', '信任伙伴'], description: '刹是宇宙飞船上的船员，面对古诺希亚潜伏的危机时表现得冷静果断。刹熟悉船上的规则与讨论流程，会协助悠利分析每一轮会议中的证词和投票，也能在危险时采取行动。随着时间循环一次次重启，刹对自身处境和悠利的信任逐渐显露；其坚定、克制的态度，是推动调查继续进行的重要力量。', voice_actor: { name: '长谷川育美', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n132768-r4FwpBpHnRtZ.png' } },
  { id: 358223, name: 'SQ', anime_title: '古诺希亚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b358223-WxQIv6a7lCb2.png', nicknames: ['エスキュ', 'エスキュー', 'SQ', '古诺希亚'], traits: ['粉色长发', '女性船员', '活泼', '善于交际', '表情丰富', '好奇心强', '擅长伪装', '观察敏锐', '立场多变', '太空船乘员'], description: 'SQ是飞船上的年轻船员，外向活泼，擅长和其他人交谈，也会用俏皮态度降低会议中的紧张感。她的热情并不代表容易看透：在古诺希亚危机和循环变化中，SQ可能表现出不同立场，需要悠利根据言行重新判断。她对周围人的反应十分敏锐，既能提供线索，也会让讨论变得更难预测，是飞船群像中活跃而多面的角色。', voice_actor: { name: '鬼头明里', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n119722-Ls7ORfBejJEP.jpg' } },
  { id: 358225, name: '拉奇欧', anime_title: '古诺希亚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b358225-HIxvbNzIrZZR.png', nicknames: ['Racio', 'ラキオ', '拉西奥', '拉奇欧', '古诺希亚'], traits: ['银发', '非二元角色', '逻辑至上', '聪明', '尖锐', '擅长辩论', '警惕心强', '观察力敏锐', '太空船员', '不轻信他人'], description: '拉奇欧是飞船上的聪明船员，习惯以逻辑和证据分析局势，发言直接尖锐，常会迅速指出他人论证中的漏洞。其冷淡而自信的表现容易引起反感，但背后有很强的生存判断力和观察能力。古诺希亚危机让拉奇欧不断面对立场变化与循环重置，悠利需要认真听取其推理，同时判断这些分析是否隐藏了个人目的。', voice_actor: { name: '七海弘希', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n151342-XKmi9w02EzHU.jpg' } },
  { id: 358221, name: '悠利', anime_title: '古诺希亚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b358221-ap07u4tJJpik.png', nicknames: ['Yuuri', 'ユーリ', '尤里', '悠利', '古诺希亚主角'], traits: ['主角', '记忆循环', '太空船乘员', '善于观察', '学习能力强', '参与投票', '适应力强', '寻找真相', '与刹合作', '身份可自定义'], description: '悠利是玩家视角的主角，登上宇宙飞船后卷入辨认古诺希亚的生存会议。每当循环重启，悠利都必须重新了解船员、收集证词并通过讨论和投票寻找威胁。悠利的性格会随选择呈现不同侧面，但核心目标始终是理解循环的原因并找到出路；其观察、沟通与判断能力也会在一次次尝试中逐步提升。', voice_actor: { name: '安济知佳', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n106030-oz4RUJZ3D9v9.png' } },
  { id: 358224, name: '吉娜', anime_title: '古诺希亚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b358224-GDi2b7yFQzWE.png', nicknames: ['Jina', 'ジナ', '吉娜', '古诺希亚'], traits: ['黑发', '安静', '细心', '温柔', '谨慎', '善于观察', '不擅争辩', '重视同伴', '飞船乘员', '危机中坚强'], description: '吉娜是飞船上的女性船员，性格安静温和，不喜欢在会议中大声争论，却会认真留意每个人的言行。她的谨慎让她在面对古诺希亚威胁时显得敏感，也使她能发现容易被忽略的细节。吉娜重视同伴，遇到危险时并非软弱退缩，而是努力保护自己珍视的人；她与悠利的交流为循环中的调查提供了重要情感线索。', voice_actor: { name: '濑户麻沙美', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n106787-ojpoY7XEGYgc.jpg' } },

  // Cells at Work!
  { id: 126981, name: '白血球 U-1146', anime_title: '工作细胞', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b126981-K1cB7bUIm6Mj.png', nicknames: ['Hakkekkyuu U-1146', '白血球', '中性粒细胞', 'U-1146', '工作细胞'], traits: ['白发', '白色制服', '中性粒细胞', '杀菌', '嗅觉敏锐', '认真', '行动迅速', '保护红血球', '战斗力强', '身体内部的守卫'], description: '白血球 U-1146 是人体内负责发现并消灭细菌等入侵者的中性粒细胞，常穿白色制服、手持短刀在身体各处巡逻。他执行任务时认真果断，面对病原体会迅速投入战斗，却也会保护迷路的红血球并耐心为她指路。U-1146把守护身体和同伴视为职责，冷静外表下有温柔体贴的一面。', voice_actor: { name: '前野智昭', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n96489-xTzYxgdC9g9l.png' } },
  { id: 126975, name: '赤血球 AE3803', anime_title: '工作细胞', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b126975-Lqj6mlIEBaSA.png', nicknames: ['Sekkekkyuu AE3803', '赤血球', 'AE3803', '红血球', '工作细胞'], traits: ['红发', '红色制服', '氧气运输', '路痴', '新人', '努力', '乐观', '迷糊', '常遇危险', '与白血球合作'], description: '赤血球 AE3803 是负责把氧气和营养输送到全身的红血球。她是刚上岗不久的新人，方向感不佳，经常在复杂的血管网络里迷路，也因此会遇到细菌等危险。虽然慌张又容易出错，AE3803仍坚持完成运输工作，并在白血球 U-1146等同伴帮助下不断积累经验，展现出认真努力、乐观向前的性格。', voice_actor: { name: '花泽香菜', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95185-x8ZYvtN7SegC.png' } },
  { id: 127417, name: '血小板', anime_title: '工作细胞', image: 'https://s4.anilist.co/file/anilistcdn/character/large/127417-mK2MxesD0nrb.jpg', nicknames: ['Kesshouban', '血小板们', 'Platelets', '工作细胞'], traits: ['幼小外形', '黄色帽子', '凝血', '修补血管', '团队行动', '勤劳', '活泼', '听从队长', '搬运纤维蛋白', '身体修复小队'], description: '血小板是负责凝血和修补受损血管的一群细胞，外形像戴着黄色帽子的孩子，工作时会一起搬运修复材料并听从队长指挥。她们看似年幼，遇到伤口却十分认真，会迅速赶到现场协助形成凝块、封住破损处。血小板们团结合作、干劲十足，是人体受伤后恢复过程中不可缺少的修复小队。', voice_actor: { name: '长绳麻理亚', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n118923-bYbaw5gwD25l.png' } },
  { id: 127070, name: '巨噬细胞', anime_title: '工作细胞', image: 'https://s4.anilist.co/file/anilistcdn/character/large/127070-CKX6o5OFrf3R.jpg', nicknames: ['Macrophage', '巨噬细胞小姐', 'マクロファ―ジ', '工作细胞'], traits: ['白色护士服', '巨噬细胞', '吞噬病原体', '温柔', '优雅', '战斗力强', '照料幼细胞', '持有大型武器', '免疫防线', '反差感'], description: '巨噬细胞是人体免疫系统的重要成员，平时以温柔优雅的护士形象出现，负责清除异物、处理细胞残骸并照顾其他细胞。遇到入侵者时，她会毫不犹豫地拿起大型武器投入战斗，展现出与端庄外表截然不同的强悍。她既是身体防线中的战士，也承担维护组织环境的工作，对血小板等年幼细胞尤其照顾。', voice_actor: { name: '井上喜久子', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95195-nLvtZl5sCK0D.png' } },
  { id: 132615, name: '癌细胞', anime_title: '工作细胞', image: 'https://s4.anilist.co/file/anilistcdn/character/large/n132615-sTziS26CL1Z8.jpg', nicknames: ['Gan Saibou', 'Cancer Cell', '癌细胞', '工作细胞'], traits: ['白发', '反派', '异常增殖', '躲避免疫系统', '伪装能力', '记恨正常细胞', '制造混乱', '身体内部的威胁', '与白血球对抗', '悲剧性角色'], description: '癌细胞是从基因异常的细胞发展而来的威胁，能够快速增殖并试图躲开免疫系统的追查。作品中的癌细胞拥有独立人格，对正常细胞和白血球怀有强烈敌意，在身体内部制造扩散与破坏。它的行动迫使免疫细胞全力应对，也让故事从轻松的细胞日常转向关于身体防御、异常生长与生命处境的严肃冲突。', voice_actor: { name: '石田彰', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95017-GSRcmQ97a8ZT.png' } },

  // The Helpful Fox Senko-san (贤惠幼妻仙狐小姐), matching the “小狐娘” request.
  { id: 130429, name: '仙狐', anime_title: '贤惠幼妻仙狐小姐', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b130429-jw2wdaJJGCIc.png', nicknames: ['Senko', '仙狐小姐', '小狐娘', '小狐狸', 'Sewayaki Kitsune no Senko-san'], traits: ['狐耳', '狐尾', '金发', '神使', '家务能手', '温柔', '喜欢油豆腐', '治愈系', '照顾中野', '拥有数百年寿命'], description: '仙狐是活了数百年的狐耳神使，为缓解上班族中野长期加班带来的疲惫而来到他的家中。她会做饭、打扫、准备热水，也擅长用温柔陪伴让人放松；平时喜欢油豆腐，偶尔会展现孩子气的一面。仙狐看似年幼，实际经历漫长岁月，对人的辛劳十分体谅，希望中野能重新学会休息并珍惜自己的生活。', voice_actor: { name: '和气杏未', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n119517-ggxWaTnTOrxW.jpg' } },
  { id: 130430, name: '小白', anime_title: '贤惠幼妻仙狐小姐', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b130430-qWlFrN5ja6R7.jpg', nicknames: ['Shiro', '白', '白狐', '小白', 'Sewayaki Kitsune no Senko-san'], traits: ['白色狐耳', '白发', '狐尾', '神使', '活泼', '自信', '喜欢捉弄人', '仙狐的熟人', '灵力强', '关心中野'], description: '小白是与仙狐相识的狐耳神使，外表活泼可爱，性格比仙狐更自信外放，也喜欢用玩笑和捉弄来表达亲近。她拥有强大的灵力，能够察觉中野身上的疲劳与仙狐的照料情况，常在两人相处时加入其中。小白看似随性，其实很在意朋友，也会在需要时认真帮助仙狐，让中野的日常增添轻松气氛。', voice_actor: { name: '内田真礼', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n108639-LLrR4WptCh5s.png' } },
  { id: 138274, name: '夜空', anime_title: '贤惠幼妻仙狐小姐', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b138274-InXC6YdDx5wf.png', nicknames: ['Sora', '夜空', '黑狐神使', 'Sewayaki Kitsune no Senko-san'], traits: ['黑色狐耳', '黑发', '狐尾', '神使', '成熟', '优雅', '沉稳', '灵力强', '小白的同伴', '观察细致'], description: '夜空是与仙狐和小白有联系的狐耳神使，举止成熟优雅，性格沉稳，常以旁观者的角度观察两人的行动。她拥有神使的灵力，对人类情绪和生活状态有敏锐感受，也会在适当时机提供帮助。夜空不像小白那样活泼张扬，却同样关心朋友与中野的处境，言行间带着从容，能为日常故事增添安定感。', voice_actor: { name: '喜多村英梨', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95413-FwAIrc8Ishpt.png' } },
  { id: 131028, name: '高圆寺安子', anime_title: '贤惠幼妻仙狐小姐', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b131028-hY409HvRfMJj.jpg', nicknames: ['Yasuko Kouenji', '安子', '高円寺安子', '邻居漫画家', 'Sewayaki Kitsune no Senko-san'], traits: ['黑发', '漫画家', '中野的邻居', '开朗', '热情', '善于社交', '工作忙碌', '关心朋友', '好奇心强', '生活能力强'], description: '高圆寺安子是中野的邻居，也是一位忙于创作的漫画家。她性格开朗热情，社交能力强，能很快注意到中野生活中的变化，并以爽快的态度与他交流。安子同样需要在工作和休息之间寻找平衡，因此能理解忙碌带来的压力；她与仙狐的相处既有惊讶也有好奇，常为中野的日常带来轻松而现实的邻里互动。', voice_actor: { name: '佐仓绫音', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n106622-yemj6ymLz4lY.png' } },
  { id: 130431, name: '中野玄人', anime_title: '贤惠幼妻仙狐小姐', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b130431-tJu9uCSlXwNJ.jpg', nicknames: ['Kuroto Nakano', '中野', '中野君', 'Kuroto', 'Sewayaki Kitsune no Senko-san'], traits: ['黑发', '公司职员', '长期加班', '责任心强', '不善拒绝', '疲惫', '温和', '独居', '仙狐照顾对象', '努力工作'], description: '中野玄人是普通公司的上班族，长期承担高强度工作，习惯把责任放在自己前面，常常加班到身心俱疲。他性格温和，不擅长拒绝工作要求，也很少主动照顾自己。仙狐来到家中后，中野逐渐接受她准备的饭菜与休息安排，并慢慢意识到持续透支并非理所当然；他的恢复过程构成了作品关于日常压力和自我关怀的核心。', voice_actor: { name: '诹访部顺一', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95095-DvSjTQnqcgXP.png' } },

  // Please Put Them On, Takamine-san (鹰峰同学请穿上衣服).
  { id: 145729, name: '鹰峰高岭', anime_title: '鹰峰同学请穿上衣服', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b145729-z9w8cFLyGjGG.png', nicknames: ['Takane Takamine', '鹰峰同学', '高岭', 'Takamine-san', '履いてください、鷹峰さん'], traits: ['红发', '学生会会长', '成绩优秀', '运动万能', '校园偶像', '自信', '任性', '拥有重置能力', '白田的搭档', '珍视内衣'], description: '鹰峰高岭是学校里成绩与运动能力都出众的学生会会长，外表完美、自信强势，深受同学关注。她拥有通过脱下内衣来回溯时间、修正失误的特殊能力，并要求同班同学白田孝志协助自己处理相关衣物。高岭习惯掌控局面，也逐渐显露出依赖与别扭的一面；她与白田之间带有喜剧色彩的合作构成故事的核心。', voice_actor: { name: '久保由利香', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n112209-6rgze0vZlnG6.png' } },
  { id: 145730, name: '白田孝志', anime_title: '鹰峰同学请穿上衣服', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b145730-oYNbdx6WUgXb.png', nicknames: ['Koushi Shirota', '白田', '孝志', 'Shirota Koushi', '履いてください、鷹峰さん'], traits: ['黑发', '高中生', '普通男生', '观察细致', '理性', '责任心强', '不善应付高岭', '秘密协助者', '成绩中等', '吐槽役'], description: '白田孝志是鹰峰高岭的同班同学，原本过着普通的高中生活，却意外发现学生会长能够通过特定方式回溯时间。为了帮助高岭维持完美形象，他承担起秘密收集和保管衣物的任务，也因此被卷入一连串校园事件。白田性格理性、观察细致，常对高岭的强势要求感到困扰，却会认真履行承诺，是故事中的主要视角与吐槽担当。', voice_actor: { name: '粕谷大介', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n283410-erm3jWhOG0Cr.png' } },
  { id: 321146, name: '艾莉依·艾佛格林', anime_title: '鹰峰同学请穿上衣服', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b321146-1uNtUbdLF7yX.jpg', nicknames: ['Ellie Evergreen', '艾莉依', '艾佛格林', 'Evergreen', '履いてください、鷹峰さん'], traits: ['金发', '留学生', '英语流利', '自信', '直率', '善于交际', '观察力强', '对高岭感兴趣', '校园生活', '行动大胆'], description: '艾莉依·艾佛格林是与鹰峰高岭和白田孝志有交集的留学生，性格开朗自信，表达直接，也不怯于主动接近自己感兴趣的人。她对校园中的人际关系观察敏锐，能察觉高岭与白田之间不同寻常的配合，并常以大胆行动打破两人的既有节奏。艾莉依带来新的社交视角，使高岭维持完美学生会长形象的计划更难按原样进行。', voice_actor: { name: '上坂堇', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n109441-6y5vZS0FDE18.jpg' } },
  { id: 355641, name: '黑崎瑠理香', anime_title: '鹰峰同学请穿上衣服', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b355641-kaL317pvsveK.png', nicknames: ['Rurika Kurosaki', '瑠理香', '黑崎', 'Rurika', '履いてください、鷹峰さん'], traits: ['黑发', '学生会成员', '端庄', '认真', '执行力强', '敬仰高岭', '有责任感', '关注校内秩序', '言行礼貌', '观察细致'], description: '黑崎瑠理香是鹰峰高岭身边的学生会成员，做事认真、言行端庄，对学生会工作有很强的责任感。她尊敬高岭的能力与领导方式，愿意协助维持校园秩序，也会留意会长周围发生的变化。瑠理香的态度比高岭更守规矩，在面对白田参与的秘密事务时显得谨慎；她为学生会日常和高岭的校园形象提供了重要支撑。', voice_actor: { name: '富田美忧', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n119518-vZN7TPy12iuu.png' } },

  // Supplement Bocchi the Rock! from four to five.
  { id: 291639, name: '广井菊里', anime_title: '孤独摇滚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b291639-VYrixXvuwLqx.png', nicknames: ['Kikuri Hiroi', '菊里', '广井', 'Hiroi Kikuri', 'SICK HACK贝斯手'], traits: ['紫发', '贝斯手', 'SICK HACK', '嗜酒', '实力派', '豪爽', '自由奔放', '照顾波奇', '舞台经验丰富', '反差可靠'], description: '广井菊里是地下乐队 SICK HACK 的贝斯手，演奏实力出众，舞台风格自由奔放，却有严重的饮酒习惯，常醉倒在演出场所附近。她与后藤独相识后，欣赏波奇的吉他才能，并以自己的方式鼓励她面对舞台和社交。菊里看似生活散漫，关键时刻却能给出实际建议，也展现出成熟乐手的经验与对音乐的热爱。', voice_actor: { name: '千本木彩花', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n119616-Dakq7gsUo2ja.png' } },
  { id: 257562, name: '后藤独', anime_title: '孤独摇滚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b257562-Ru35NYPfsqhY.png', nicknames: ['Hitori Gotou', '后藤独', 'Bocchi', '波奇', 'ひとりちゃん'], traits: ['粉发', '社恐', '吉他', '吉他英雄', '垃圾桶', '芒果箱', '结束乐队', '反差'], description: '后藤独是结束乐队的主音吉他手，长期缺乏社交自信，却在网络上以“吉他英雄”身份发布演奏视频。她从小自学吉他，希望有一天能与乐队同台，却很难主动结交朋友；被伊地知虹夏邀请加入结束乐队后，波奇逐步面对排练、演出和人际交流。她常躲进纸箱或垃圾桶，拿起吉他时却能展现惊人的技巧。', voice_actor: { name: '青山吉能', aliases: ['Yoshino Aoyama'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n118475-19IqPJRpa08T.png' } },
  { id: 261674, name: '伊地知虹夏', anime_title: '孤独摇滚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b261674-a8tJYvtzqWgC.png', nicknames: ['Nijika Ijichi', '伊地知虹夏', 'Nijika', '虹夏'], traits: ['金发', '鼓手', '队长', '阳光', '凝聚力', 'Livehouse', '把波奇拉出壳', '蓝瞳'], description: '伊地知虹夏是结束乐队的鼓手与队长，性格开朗可靠，善于把成员聚在一起。她在下北泽的 live house 工作，也是最早发现后藤独吉他才能并邀请她加入乐队的人。虹夏平时负责协调练习和演出，努力弥补成员性格上的差异；她十分尊敬经营 live house 的姐姐星歌，也希望有朝一日能实现与姐姐相关的音乐梦想。', voice_actor: { name: '铃代纱弓', aliases: ['Sayumi Suzushiro'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n126963-GnhNcLWFeKmy.png' } },
  { id: 264529, name: '山田凉', anime_title: '孤独摇滚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b264529-BvEusZnJLD2Y.png', nicknames: ['Ryou Yamada', '山田凉', 'Ryou', '凉'], traits: ['蓝发', '贝斯手', '中性', '酷', '贫穷', '吃草', '面瘫', '帅气'], description: '山田凉是结束乐队的贝斯手，外表冷淡帅气，言行也带着与年龄不太相称的洒脱。她热爱贝斯，常把生活费花在乐器和设备上，甚至穷到用奇怪的食物应付日常开销。凉不擅长直白表达关心，偶尔会故意说出令人摸不着头脑的话，却认可后藤独的才能，并以自己的方式支持乐队继续演出。', voice_actor: { name: '水野朔', aliases: ['Saku Mizuno'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n213951-EQGfRStCAJ2Q.jpg' } },
  { id: 266041, name: '喜多郁代', anime_title: '孤独摇滚', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b266041-1HKgjJGP2MmM.png', nicknames: ['Ikuyo Kita', '喜多郁代', 'Kita', '喜多'], traits: ['红发', '主唱', '吉他', '阳角', '万人迷', '逃跑', '被波奇拉回来', '红瞳'], description: '喜多郁代是结束乐队的主唱与吉他手，性格开朗亲切，在学校里人缘很好。她起初因为仰慕山田凉而加入乐队，却因不会弹吉他而临阵退缩；在后藤独帮助下，她重新面对自己的选择，并认真练习乐器。喜多拥有明亮的歌声和积极的社交能力，能为结束乐队带来舞台魅力，也逐渐找到自己热爱音乐的理由。', voice_actor: { name: '长谷川育美', aliases: ['Ikumi Hasegawa'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n132768-r4FwpBpHnRtZ.png' } },

  // Supplement Kill la Kill from four to five.
  { id: 87606, name: '蛇崩乃音', anime_title: '斩服少女', image: 'https://s4.anilist.co/file/anilistcdn/character/large/87606-3A51LUnRuyHf.png', nicknames: ['Nonon Jakuzure', '乃音', '蛇崩', 'Nonon', '四天王军乐队长'], traits: ['粉发', '军乐队制服', '学生会四天王', '乐器武装', '高傲', '毒舌', '擅长指挥', '鬼龙院皐月部下', '战斗服', '旧识关系'], description: '蛇崩乃音是本能字学园学生会四天王之一，负责统领军乐队，擅长以音乐和乐器型武装发动攻击。她出身富家，言谈高傲尖锐，与鬼龙院皐月相识多年，对皐月抱有强烈忠诚。乃音能够把战场变成演出般的节奏，以夸张而优雅的方式压制对手；在与缠流子的冲突中，她的立场也逐渐显出对旧秩序的维护。', voice_actor: { name: '新谷真弓', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95617-20JhQRgHpo1t.jpg' } },
  { id: 83797, name: '缠流子', anime_title: '斩服少女', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b83797-ix0Cl5OMfV22.png', nicknames: ['Ryuuko Matoi', '缠流子', 'Ryuuko'], traits: ['黑发', '红挑染', '巨大剪刀', '神衣鲜血', '热血', '暴躁', '复仇', '姊妹对决'], description: '缠流子是转入本能字学园的少女，为寻找杀害父亲的凶手而追查半片巨大剪刀的线索。她与能够说话的神衣“鲜血”建立伙伴关系，并在穿上神衣后获得强大战斗能力。流子性格急躁、直率，面对学园的等级制度从不退缩；她与鬼龙院皐月的对决逐渐牵出两人的身世，也让复仇目标转变为揭开生命纤维与学园统治背后的真相。', voice_actor: { name: '小清水亚美', aliases: ['Ami Koshimizu', '暂未收录'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95070-klkIfKz1VItS.png' } },
  { id: 83799, name: '鬼龙院皐月', anime_title: '斩服少女', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b83799-oPxSwMA9XAvu.png', nicknames: ['Satsuki Kiryuuin', '鬼龙院皐月', 'Satsuki'], traits: ['黑发', '学生会会长', '纯白神衣', '女王', '野心', '姐妹', '绝对统治', '长腿'], description: '鬼龙院皐月是本能字学园的学生会长，以强硬纪律和压倒性实力支配校园。她穿着神衣“纯洁”，推行严格的制服等级制度，表面上像是在巩固母亲鬼龙院罗晓建立的统治，实际另有周密计划。皐月意志坚定、判断果决，对部下要求严苛，也承担着推翻生命纤维控制的风险；她与缠流子的姐妹关系，是揭示故事核心的重要转折。', voice_actor: { name: '柚木凉香', aliases: ['Ryouka Yuzuki', '暂未收录'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95141-RUTdfZUbNcUv.png' } },
  { id: 87510, name: '鲜血', anime_title: '斩服少女', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b87510-ZH2qoBYc6XNH.jpg', nicknames: ['Senketsu', '鲜血', 'センケツ'], traits: ['水手服', '神衣', '说话', '流子搭档', '羞耻', '变身', '核心', '羁绊'], description: '鲜血是一件具有意识、能够说话的神衣，由生命纤维制成，与缠流子共同战斗。它拥有水手服外形，只有流子穿上并与之建立信任后才能发挥真正力量；变身过程会让流子感到羞耻，也需要她承担身体上的负担。鲜血沉着、忠诚，会提醒流子控制力量并保护她，两者从互不适应逐渐成为彼此依靠的战斗伙伴。', voice_actor: { name: '关智一', aliases: ['Toshihiko Seki', '暂未收录'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n95129-AAL7kfwAPpgR.jpg' } },
  { id: 87511, name: '满舰饰真子', anime_title: '斩服少女', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b87511-T8lwlQKd6SoK.png', nicknames: ['Mako Mankanshoku', '满舰饰真子', 'Mako'], traits: ['棕发', '搞笑', '良心', '流子挚友', '超语速', '无条件支持', '棕瞳', '热血'], description: '满舰饰真子是缠流子在本能字学园结识的同班同学，很快成为她最亲密的朋友。真子出身普通家庭，性格热情夸张，常用高速又跳跃的长篇发言打破紧张气氛。无论流子面对学园强敌还是自我怀疑，她都给予毫无保留的支持；真子偶尔也会获得战斗服力量，在喜剧表现之外展现直率、勇敢且珍视友情的一面。', voice_actor: { name: '洲崎绫', aliases: ['Aya Suzaki', '暂未收录'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n114834-WWHMBVvu2Lzu.png' } },

  // Ave Mujica: retag its three existing members below and add the two missing members.
  { id: 312799, name: '八幡海铃', anime_title: 'BanG Dream! Ave Mujica', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b312799-toCvN6GOl2Rt.jpg', nicknames: ['Umiri Yahata', '海铃', '八幡', 'BanG Dream! Ave Mujica'], traits: ['黑发', '贝斯手', '职业支援乐手', '技术娴熟', '冷静', '务实', '多乐队协作', '时间管理严谨', 'Ave Mujica成员', '可靠'], description: '八幡海铃是 Ave Mujica 的贝斯手，也是经验丰富的支援乐手，曾同时参与多个乐队的演奏工作。她性格冷静务实，技术稳定，习惯用明确的安排管理时间与演出任务。海铃加入 Ave Mujica 后，需要在职业乐手的工作方式和乐队成员之间建立新的平衡；她看似理性疏离，却会认真履行承诺，是乐队现场演奏的重要支柱。', voice_actor: { name: '冈田梦以', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n206239-nzeUULqoj9Tg.jpg' } },
  { id: 314493, name: '祐天寺若麦', anime_title: 'BanG Dream! Ave Mujica', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b314493-Yx1jBiTl5rec.jpg', nicknames: ['Nyamu Yuutenji', '若麦', '祐天寺にゃむ', 'Nyamu', 'BanG Dream! Ave Mujica'], traits: ['粉发', '鼓手', '网络主播', '擅长运营账号', '善于表现', '精力充沛', '关注流量', 'Ave Mujica成员', '舞台表现力强', '目标明确'], description: '祐天寺若麦以“喵梦”之名活动，是 Ave Mujica 的鼓手，也经营网络直播与社交账号。她擅长镜头前的表达，积极追求关注度和事业机会，重视团队能否带来持续曝光。若麦在舞台上充满活力，私下则会精打细算地经营个人形象；加入 Ave Mujica 后，她需要在流量目标、乐队规则和成员之间的信任中寻找平衡。', voice_actor: { name: '米泽茜', image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n314494-9WDjYe1nbr91.jpg' } },
  // Existing Ave Mujica members were previously filed under the related MyGO!!!!! anime.
  { id: 312796, name: '丰川祥子', anime_title: 'BanG Dream! Ave Mujica', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b312796-VwamX0i26tsP.jpg', nicknames: ['Sakiko Togawa', '祥子', 'Oblivionis', 'Ave Mujica', 'BanG Dream! It’s MyGO!!!!!', '丰川祥子'], traits: ['蓝发', '键盘手', 'Ave Mujica创立者', '舞台名Oblivionis', '自尊心强', '擅长作曲', '家庭变故', '隐藏脆弱', '目标执着', '主唱与乐队统筹'], description: '丰川祥子是 Ave Mujica 的创立者与键盘手，以舞台名 Oblivionis 活动。她出身优渥，曾经历家庭境况骤变，因此极力维持自尊与冷静外表，并把组建乐队视为重新掌控人生的途径。祥子拥有作曲才能和明确目标，对成员要求严格；她与若叶睦及三角初华之间复杂的旧关系，逐渐揭开乐队成立背后的秘密。', voice_actor: { name: '高尾奏音', aliases: ['Kanon Takao'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n132283-QTBB7K8jTjXM.png' } },
  { id: 312797, name: '三角初华', anime_title: 'BanG Dream! Ave Mujica', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b312797-jVfCeiZLz22a.jpg', nicknames: ['Uika Misumi', '初华', 'Doloris', 'Ave Mujica', 'BanG Dream! It’s MyGO!!!!!'], traits: ['棕发', '主唱与吉他手', '舞台名Doloris', '偶像歌手', '温柔', '擅长唱歌', '重视祥子', '隐藏真实想法', 'Ave Mujica成员', '公众形象成熟'], description: '三角初华是 Ave Mujica 的主唱兼吉他手，以舞台名 Doloris 登台，同时拥有偶像歌手身份。她待人温柔、歌唱能力突出，擅长维持得体的公众形象；与丰川祥子相识多年，对祥子的计划抱有深厚情感。初华在舞台上沉稳耀眼，私下却必须面对个人愿望与乐队关系之间的矛盾，她隐藏的想法逐步成为故事的重要悬念。', voice_actor: { name: '佐佐木李子', aliases: ['Riko Sasaki'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n122233-oAWW3lhH4rjg.png' } },
  { id: 312798, name: '若叶睦', anime_title: 'BanG Dream! Ave Mujica', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b312798-DQxF6RGiGAsB.png', nicknames: ['Mutsumi Wakaba', '睦', 'Mortis', 'Ave Mujica', 'BanG Dream! It’s MyGO!!!!!'], traits: ['黑发', '吉他手', '舞台名Mortis', '寡言', '情绪克制', '家境优渥', '与祥子相识多年', '擅长园艺', 'Ave Mujica成员', '内心复杂'], description: '若叶睦是 Ave Mujica 的吉他手，以舞台名 Mortis 活动，与丰川祥子从小相识。她出身演艺家庭，性格寡言克制，不善于表达真实感受，常把情绪压在心里。睦拥有稳定的吉他技巧，也喜欢园艺；在乐队排练与演出中，她逐渐面对自己与祥子、初华之间的旧日羁绊，沉默背后隐藏着复杂的自我认同与选择。', voice_actor: { name: '渡濑结月', aliases: ['Yuzuki Watase'], image: 'https://s4.anilist.co/file/anilistcdn/staff/large/n207332-PAAbY800I6lE.png' } },

  // The old request “林慕婉” appears to refer to Li Muwan from the already-listed 仙逆.
  { id: 376063, name: '李慕婉', anime_title: '仙逆', image: 'https://s4.anilist.co/file/anilistcdn/character/large/b376063-GsmB04EXM12p.jpg', nicknames: ['Muwan Li', '李慕婉', '慕婉', '王林道侣', '仙逆'], traits: ['女修', '炼丹师', '赵国修士', '聪慧', '坚韧', '重情义', '善良', '与王林相知', '寿元有限', '命运坎坷'], description: '李慕婉是《仙逆》中的重要女修，出身赵国修仙界，聪慧坚韧，尤其擅长炼丹。她与王林在修行与旅途中结识，彼此扶持并建立深厚感情；面对寿元、修为差距和残酷的修仙环境，慕婉仍坚持自己的选择。她温柔却不软弱，既有对炼丹之道的专注，也有守护所爱之人的勇气，是王林漫长修仙路上影响深远的伴侣。' },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function validate() {
  const ids = new Set()
  for (const c of records) {
    if (ids.has(c.id)) throw new Error(`重复 AniList ID: ${c.id}`)
    ids.add(c.id)
    if (!c.image?.match(/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/character\/.+-.+\.(png|jpg|jpeg)$/i)) {
      throw new Error(`角色图片不是带 hash 的 AniList CDN 地址: ${c.name} ${c.image}`)
    }
    if (!c.nicknames?.length) throw new Error(`缺少别名: ${c.name}`)
    if ((c.traits || []).length < 8) throw new Error(`特征少于 8 项: ${c.name}`)
    const length = [...(c.description || '')].length
    if (length < 100 || length > 200) throw new Error(`简介长度不在 100-200 字: ${c.name} (${length})`)
    if (!c.name || !c.anime_title) throw new Error(`缺少名称或动漫名: ${c.id}`)
    if (!['一念永恒', '仙逆'].includes(c.anime_title) && !c.voice_actor?.name) throw new Error(`缺少日配声优: ${c.name}`)
    if (c.voice_actor && !/^https:\/\/s\d+\.anilist\.co\/file\/anilistcdn\/staff\/.+-.+\.(png|jpg|jpeg)$/i.test(c.voice_actor.image || '')) {
      throw new Error(`声优头像不是带 hash 的 AniList CDN 地址: ${c.name}`)
    }
  }
}

function searchText(character, voiceActors) {
  return [character.name, character.anime_title || '', ...(character.nicknames || []), ...(character.traits || []), ...voiceActors.map((v) => v.name)].join(' ')
}

async function main() {
  validate()
  if (process.argv.includes('--validate-only')) {
    console.log(`校验通过：${records.length} 个角色，图片/别名/特征/简介/日配声优字段均符合规则。`)
    return
  }

  // Reclassify the three existing core members under the show explicitly requested;
  // retain the MyGO title as searchable aliases because the character IDs are shared.
  const existingIds = [312796, 312797, 312798]
  for (const id of existingIds) {
    const record = records.find((c) => c.id === id)
    const { data: existing, error } = await supabase.from('characters').select('id,nicknames').eq('id', id).single()
    if (error) throw new Error(`读取 Ave Mujica 角色 ${id} 失败: ${error.message}`)
    const nicknames = [...new Set([...(existing.nicknames || []), ...record.nicknames])]
    const { error: updateError } = await supabase.from('characters').update({ anime_title: record.anime_title, nicknames }).eq('id', id)
    if (updateError) throw new Error(`更新 Ave Mujica 角色 ${id} 失败: ${updateError.message}`)
    await sleep(50)
  }

  let added = 0
  let updated = 0
  let skippedExisting = 0
  let voiceActorsAdded = 0
  let voiceActorsUpdated = 0
  const { data: existingRows, error: existingError } = await supabase
    .from('characters')
    .select('id,name,anime_title')
    .in('id', records.map((c) => c.id))
  if (existingError) throw new Error(`检查重复角色失败: ${existingError.message}`)
  const existingById = new Map((existingRows || []).map((c) => [c.id, c]))
  const intentionalUpdates = new Set([
    ...existingIds,
    257562, 261674, 264529, 266041,
    83797, 83799, 87510, 87511,
  ])

  for (const c of records) {
    const existing = existingById.get(c.id)
    if (existing && !intentionalUpdates.has(c.id)) {
      skippedExisting++
    } else {
      const { error } = await supabase.from('characters').upsert({
        id: c.id,
        name: c.name,
        anime_title: c.anime_title,
        image: c.image,
        description: c.description,
        nicknames: c.nicknames,
        traits: c.traits,
      }, { onConflict: 'id' })
      if (error) throw new Error(`写入角色 ${c.name} 失败: ${error.message}`)
      if (existing) updated++
      else added++
    }

    if (c.voice_actor) {
      const names = [c.voice_actor.name, ...(c.voice_actor.aliases || [])]
      const { data: vaRows, error: vaReadError } = await supabase.from('voice_actors').select('id,name').eq('character_id', c.id).in('name', names).limit(1)
      if (vaReadError) throw new Error(`读取声优 ${c.name} 失败: ${vaReadError.message}`)
      if (vaRows?.length) {
        const { error: vaUpdateError } = await supabase.from('voice_actors').update({ name: c.voice_actor.name, image: c.voice_actor.image, language: '日语' }).eq('id', vaRows[0].id)
        if (vaUpdateError) throw new Error(`更新声优 ${c.name} 失败: ${vaUpdateError.message}`)
        if (vaRows[0].name !== c.voice_actor.name || !vaRows[0].image) voiceActorsUpdated++
      } else {
        const { error: vaError } = await supabase.from('voice_actors').insert({ character_id: c.id, name: c.voice_actor.name, image: c.voice_actor.image, language: '日语' })
        if (vaError) throw new Error(`写入声优 ${c.name} 失败: ${vaError.message}`)
        voiceActorsAdded++
      }
    }

    const { data: saved, error: readError } = await supabase.from('characters').select('id,name,anime_title,nicknames,traits,voice_actors(name)').eq('id', c.id).single()
    if (readError) throw new Error(`读取角色 ${c.name} 失败: ${readError.message}`)
    const { error: searchError } = await supabase.from('characters').update({ search_text: searchText(saved, saved.voice_actors || []) }).eq('id', c.id)
    if (searchError) throw new Error(`更新搜索文本 ${c.name} 失败: ${searchError.message}`)
    await sleep(50)
  }

  console.log(`完成：新增 ${added} 个角色，更新 ${updated} 个角色资料，跳过 ${skippedExisting} 个已存在角色，新增 ${voiceActorsAdded} 条日语声优记录，修正 ${voiceActorsUpdated} 条已有声优记录。`)
  console.log('新增作品及角色数：薰香花朵凛然绽放 5；一念永恒 5；古诺希亚 5；工作细胞 5；贤惠幼妻仙狐小姐 5；鹰峰同学请穿上衣服 4。')
  console.log('补充：孤独摇滚 +1，斩服少女 +1，BanG Dream! Ave Mujica 补为 5 名乐队成员，仙逆 +1 李慕婉。')
}

main().catch((error) => {
  console.error('失败:', error.message)
  process.exit(1)
})
