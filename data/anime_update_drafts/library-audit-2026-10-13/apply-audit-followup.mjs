import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const csvPath = 'data/characters.csv'
const rows = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const byId = new Map(rows.map(row => [Number(row.id), row]))
const reports = Array.from({ length: 10 }, (_, index) => {
  const batch = index + 25
  const path = `${root}/batch${batch}-audit-report.json`
  return { batch, path, data: JSON.parse(fs.readFileSync(path, 'utf8')) }
})
const checkedIds = new Set(reports.flatMap(({ data }) => data.checkedIds.map(Number)))
const modified = new Set()
const followupChanged = new Set()

const descriptions = {
  27923: '岛崎慎吾是东圣高中棒球部三年级二垒手，担任球队第三棒，背号4号，右投右打。他在《王牌投手 振臂高挥》第17集中登场；阿部隆也在岛崎首次打击时称赞他是东圣队最出色的打者。岛崎的守备位置是二垒，不能误标为投手。',
  29335: '他在《魍魉之匣》中最初以“谜之男”身份出现，真实姓名为久保竣公。人物身份与作品围绕失踪事件、箱体和连续案件展开的谜团相连，调查者逐步追索其姓名与经历。现有资料能确认的核心身份信息是久保竣公；其余尚无可靠资料支持，故不补写未经证实的职业、关系或性格。',
  36372: '小桃猫生活在广岛县竹原市，是《玉响》中经常出没的猫咪角色。摄影爱好者泽渡枫很想拍下它，却总在举起相机前错失机会，这成为作品反复出现的轻松桥段。小桃猫会在街道和居民生活的场景中出现，为枫与朋友们的日常增添亲切感；它是动物角色，不是人类少女。',
  37069: '史浩弘是高桥凉介所率领的Project D副手与联络负责人，负责安排与其他车队的对战、勘察赛道，也协助凉介统筹计划。他过去曾在赤城RedSuns担任类似角色。Project D行动期间，他常驾驶编号1的厢型车支援车队；现有资料并未确认他曾作为街头车手参赛。',
  37083: '御木是《头文字D》中拓海曾就读学校足球社的学长，属于作品中的配角。现有角色条目只确认他参加足球社，并在拓海的学生时期与其有交集；没有可靠资料说明他参与过Project D或拥有重要赛车经历，因此不把他描述为车手。',
  38052: '根岸三郎太是《海月姬》中登场的政治人物，担任日本首相，也是修与藏之介的父系叔叔。通过这个亲属关系，他连接了鲤渊家族与日本政界。角色现有资料没有提供更详细的个人经历，因此本简介只保留可确认的职务和家庭关系，不补写未经证实的性格或政治活动。',
  41729: '樋口君子是法子高屋的高中好友。学生时期她和法子一样接受RX-7驾驶训练，但最终没有入选“银星号”飞行队，留在地球。成年后，君子结婚并有了女儿高见；《飞跃巅峰》的角色资料以这段人生经历交代她与法子的不同道路。',
}

const traitPatches = {
  23401: ['浅棕发', '灰绿色眼睛', '女高中生', '松冈女子高中学生', '万城目富美的朋友', '杉本恭子与安田久美的好友', '戏剧社成员', '喜欢舞台表演'],
  23508: ['美式足球', '王城白骑士队', '球队主教练', '球队训练员', '大学时期是美式足球好手', '信奉坚固防守', '严厉而公平', '曾与泥门教练泥骨并肩作赛'],
  23764: ['少年', '住在山中', '祖母去世后独居', '左手拥有异能', '画出的事物会变成活物', '银古调查对象', '虫师单篇故事人物', '与虫相关的异象'],
  24073: ['黑发', '灰褐色眼睛', '杉本家第三女', '曾就读藤之谷女子学院', '性格冷淡讽刺', '不纵容姐姐安子', '担心富美受安子伤害', '喜欢抽烟', '曾暗恋加贺美'],
  24227: ['初中三年级学生', '芳山和子', '理科实验室事件当事人', '闻到薰衣草气味后昏倒', '拥有时间跳跃能力', '可回到24小时前', '与深町一夫共同调查异常', '浅仓吾朗的好友'],
  24270: ['GA美术科三年级学生', '美术社社长', '中部方言', '性格爽朗', '行动派', '被水渕和三井称作阿千', '尊敬前任社长野崎', '重视美术社'],
  24271: ['GA美术科三年级学生', '如月的童年好友', '校园生活社负责人', '校园生活社唯一成员', '学校高年级学生', '与GA美术科学生熟识', '校园社团成员', '参与学校日常事务'],
  24272: ['GA一年级一班班主任', '美术科教师', '重度咖啡爱好者', '负责指导一年级学生', 'GA学园教师', '与如月等学生有接触', '男性教师', '校园日常角色'],
  24333: ['白发', '深红色眼睛', '伊莉雅的女仆', '爱因兹贝伦家人造人', '擅长战斗', '擅长使用长柄战斧', '可发动天之衣', '保护伊莉雅'],
  24802: ['扶桑皇国陆军航空队第47飞行中队魔女', '扶桑出身', '《强袭魔女》第12集登场', '曾把宫藤一郎写给芳佳的信交给她', '认识宫藤芳佳', '在动画第二季第1集再次出现', '魔女飞行员', '参与对抗异形军的战争'],
  25034: ['黑发', '齐刘海', '霓虹绿眼', '哥特洛丽塔风格', '黑色连衣裙', '骷髅形长角', '背生翅膀', '持有Dead Scythe', '能够操纵锁链'],
  26189: ['天野草莓', '圣玛丽学园学生', 'Team Ichigo队长', '糕点师学徒', '学习成绩不突出', '性格热情活泼', '曾一度喜欢亨利·卢卡斯', '与樫野等人组队参赛'],
  26190: ['圣玛丽学园甜点王子', '专长巧克力甜点', '梦想成为糕点师', '出身医生世家', '父母反对其学习糕点', '不善交际', '说话直率', '安堂千乃介的童年好友'],
  26191: ['圣玛丽学园甜点王子', '专长和果子', '梦想开设点心店', '家族经营点心铺', '五兄弟姐妹中的长子', '假期帮忙家中店铺', '樫野真的童年好友', '性格沉稳可靠'],
  26192: ['圣玛丽学园甜点王子', '擅长糖艺雕塑', '擅长花卉主题蛋糕', '梦想与母亲共事', '母亲是花道名家兼学园教师', '父亲是园艺家', '父亲已故', '重视甜点造型美感'],
  26193: ['甜点精灵', '专长香草甜点', '天野草莓的搭档', '性格急躁好胜', '严格训练派', '经常与巧克力争吵', '忠于草莓', '能够使用甜点魔法'],
  26194: ['甜点精灵', '专长巧克力甜点', '樫野真的搭档', '竞争心强', '容易受惊', '典型傲娇性格', '关心天野草莓', '会帮助草莓改进甜点'],
  26195: ['甜点精灵', '专长焦糖甜点', '安堂千乃介的搭档', '草莓团队中年长的精灵', '性格笨拙', '容易哭泣', '常在句尾使用“です”', '方向感差', '把安堂视作兄长'],
  26196: ['甜点精灵', '花房五月的搭档', '礼貌有分寸', '草莓团队中最礼貌的精灵之一', '参与糕点制作', '支持五月的创作', '与其他甜点精灵共同行动', '协助糕点比赛'],
  26256: ['男性科学家', '早乙女博士的旧同僚', '曾研究盖塔能源', '考恩与斯汀格之一', '执着于进化', '身体被侵略者寄生', '成为敌方威胁', '《真盖塔机器人 世界最后之日》反派'],
  26257: ['男性科学家', '早乙女博士的旧同僚', '曾研究盖塔能源', '考恩与斯汀格之一', '执着于进化', '身体被侵略者寄生', '成为敌方威胁', '《真盖塔机器人 世界最后之日》反派'],
  26274: ['女孩', '声音会吸引名为“矢叫”的虫', '歌声会令村民麻痹', '年幼时察觉声音的影响', '曾发誓不再说话', '银古调查对象', '虫师单篇故事人物', '经历声音与孤独的困扰'],
  26571: ['体格高大', '性格善良', '弁庆队伍成员', '曾与队伍在外界生活多年', '驾驶真盖塔三号', '弁庆受伤后接任机师', '与庆关系友好', '对惠有好感'],
  26793: ['金发', '圣玛丽学园教师', '邀请草莓进入学园', '因故返回巴黎', '善于发现学生潜力', '曾指导糕点制作', '擅长法式大型装饰蛋糕', '与天王寺麻里关系密切'],
  27902: ['特车二课第二小队第一组成员', '来自冲绳', '体格高大', '性格温和善良', '曾想成为渔夫', '容易晕船', '加入警察后进入特车二课', '驾驶巡逻车运输载具'],
}

const colorFixes = {
  23401: { hair: '浅棕发', eyes: '灰绿色眼睛' },
  23494: { hair: '银白发', eyes: '青绿色眼睛' },
  23495: { hair: '深紫发', eyes: '粉褐色眼睛' },
  23701: { hair: '红棕发', eyes: '棕色眼睛' },
  23736: { hair: '金发', eyes: '灰蓝色眼睛' },
  24072: { hair: '棕发', eyes: '浅棕色眼睛' },
  24203: { hair: '粉发', eyes: '红色眼睛' },
  24337: { eyes: '灰绿色眼睛' },
  24418: { hair: '棕发', eyes: '棕色眼睛' },
  24419: { hair: '浅棕发', eyes: '棕色眼睛' },
  24502: { hair: '浅棕发' },
  24544: { hair: '金发', eyes: '蓝绿色眼睛' },
  24726: { hair: '灰发' },
  27639: { hair: '深蓝紫色长发', eyes: '灰绿色眼睛' },
  27717: { hair: '浅绿色头发', eyes: '金色眼睛' },
  27719: { hair: '粉棕发' },
  28623: { hair: '浅绿色长发' },
  29210: { hair: '深蓝紫发' },
  29211: { hair: '粉发', eyes: '蓝色眼睛' },
  29996: { hair: '橙发', eyes: '金色眼睛' },
  30905: { hair: '浅棕发', eyes: '灰绿色眼睛' },
  31844: { hair: '蓝绿色头发', eyes: '蓝色眼睛' },
  32394: { hair: '粉棕发', eyes: '棕色眼睛' },
  32396: { hair: '黑棕发', eyes: '蓝色眼睛' },
  33217: { hair: '棕发', eyes: '棕色眼睛' },
  33218: { hair: '深蓝黑发', eyes: '灰绿色眼睛' },
  33220: { eyes: '玫瑰棕色眼睛' },
  33221: { eyes: '绿色眼睛' },
  33801: { eyes: '蓝绿色眼睛' },
  34470: { hair: '棕发', eyes: '蓝色眼睛' },
  35071: { hair: '金发' },
  35255: { hair: '浅棕金发', eyes: '黄绿色眼睛' },
  35256: { hair: '粉红发', eyes: '紫色眼睛' },
  35598: { hair: '棕发' },
  35600: { hair: '蓝发' },
  35616: { eyes: '棕色眼睛' },
  35872: { hair: '粉发' },
  35875: { eyes: '绿色眼睛' },
  35876: { hair: '粉紫发' },
  35877: { hair: '浅紫发' },
  36831: { hair: '浅绿色头发' },
  36945: { hair: '深紫发', eyes: '绿色眼睛' },
  37871: { hair: '浅绿发', eyes: '绿色眼睛' },
  37876: { hair: '银白发', eyes: '灰蓝色眼睛' },
  38662: { hair: '棕发' },
  39491: { hair: '橙棕发', eyes: '蓝色眼睛' },
  40012: { hair: '银白发', eyes: '紫色眼睛' },
  40054: { eyes: '浅绿色眼睛' },
  40195: { hair: '棕发' },
  40196: { hair: '灰紫发' },
  40197: { hair: '黑发', eyes: '棕色眼睛' },
  40198: { hair: '橙发', eyes: '绿色眼睛' },
  40874: { eyes: '绿色眼睛' },
  41025: { hair: '粉发', eyes: '金色眼睛' },
  41055: { hair: '浅棕金发', eyes: '蓝色眼睛' },
  41371: { eyes: '蓝色眼睛' },
  41900: { hair: '棕发' },
  41949: { eyes: '紫色眼睛' },
  42115: { hair: '橙粉发', eyes: '红色眼睛' },
  42116: { hair: '橙发', eyes: '琥珀色眼睛' },
  42183: { hair: '蓝发', eyes: '棕色眼睛' },
  42202: { hair: '浅绿色头发', eyes: '蓝灰色眼睛' },
  42813: { hair: '棕发' },
  43088: { hair: '灰紫发', eyes: '蓝色眼睛' },
  43089: { hair: '金棕发', eyes: '绿色眼睛' },
  43976: { hair: '红棕发', eyes: '棕色眼睛' },
}

for (const [rawId, description] of Object.entries(descriptions)) {
  const id = Number(rawId)
  const row = byId.get(id)
  if (!row || !checkedIds.has(id)) throw new Error(`简介对象 ${id} 不在本轮范围`)
  if (description.length < 100 || description.length > 200) throw new Error(`角色 ${id} 简介长度 ${description.length} 不符合100–200字要求`)
  row.description = description
  modified.add(id)
  followupChanged.add(id)
}

const correctedName = byId.get(27923)
correctedName.name = '岛崎慎吾'
correctedName.nicknames = [...new Set([...(correctedName.nicknames || []).filter(name => name !== 'Shingo Yamazaki'), 'Shingo Shimazaki', '島崎慎吾', '岛崎慎吾'])]
modified.add(27923)
followupChanged.add(27923)

for (const [rawId, traits] of Object.entries(traitPatches)) {
  const id = Number(rawId)
  const row = byId.get(id)
  if (!row || !checkedIds.has(id)) throw new Error(`特征对象 ${id} 不在本轮范围`)
  if (traits.length < 8) throw new Error(`角色 ${id} 的特征少于8条`)
  row.traits = [...new Set(traits)]
  modified.add(id)
  followupChanged.add(id)
}

const colorTerm = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/
const hairToken = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发)/
const eyeToken = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:瞳|眼睛|眼瞳|眼眸|眼)/
function preserveSemanticPart(trait) {
  const rest = trait
    .replace(/^(?:外表是|留着|留有|拥有|有|一头|一双)/, '')
    .replace(/(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?/g, '')
    .replace(/(?:长|短|中长)?(?:头发|发|发色|发型|眼睛|眼瞳|眼眸|瞳|眼)/g, '')
    .replace(/[、，,\s]/g, '')
  return rest.length >= 2 ? rest : ''
}
for (const [rawId, colors] of Object.entries(colorFixes)) {
  const id = Number(rawId)
  const row = byId.get(id)
  if (!row || !checkedIds.has(id)) throw new Error(`视觉修正对象 ${id} 不在本轮范围`)
  const kept = []
  let replacedHair = false
  let replacedEyes = false
  for (const trait of row.traits || []) {
    const hasColor = colorTerm.test(trait)
    const hasHair = hasColor && hairToken.test(trait)
    const hasEyes = hasColor && eyeToken.test(trait)
    if (hasHair && colors.hair) {
      replacedHair = true
      const semantic = preserveSemanticPart(trait)
      if (semantic) kept.push(semantic)
      continue
    }
    if (hasEyes && colors.eyes) {
      replacedEyes = true
      const semantic = preserveSemanticPart(trait)
      if (semantic) kept.push(semantic)
      continue
    }
    kept.push(trait)
  }
  if (colors.hair && !replacedHair) kept.unshift(colors.hair)
  else if (colors.hair && replacedHair) kept.unshift(colors.hair)
  if (colors.eyes && !replacedEyes) kept.unshift(colors.eyes)
  else if (colors.eyes && replacedEyes) kept.unshift(colors.eyes)
  row.traits = [...new Set(kept)]
  modified.add(id)
  followupChanged.add(id)
}

const searchText = row => [row.name, row.anime_title, ...(row.nicknames || []), ...(row.traits || []), ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
for (const row of rows) {
  const next = searchText(row)
  if (row.search_text !== next) modified.add(Number(row.id))
  row.search_text = next
}

const checks = []
for (const id of modified) {
  const row = byId.get(id)
  if (!row) throw new Error(`本地缺少角色 ${id}`)
  if (row.traits.length < 8) checks.push(`角色 ${id} 特征不足8条`)
  if (row.search_text.includes(row.description)) checks.push(`角色 ${id} 搜索索引包含简介`)
}
for (const id of Object.keys(descriptions).map(Number)) {
  const row = byId.get(id)
  if (row.description.length < 100 || row.description.length > 200) checks.push(`角色 ${id} 简介长度不合格`)
}
if (checks.length) throw new Error(checks.join('\n'))

const slim = rows.map(row => ({
  id: row.id,
  name: row.name,
  anime_title: row.anime_title,
  image: row.image,
  description: row.description,
  nicknames: row.nicknames || [],
  traits: row.traits || [],
  voice_actors: (row.voice_actors || []).map(({ name, language, image }) => ({ name, language, image })),
}))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csv = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of rows) csv.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync(fullPath, JSON.stringify(rows, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
fs.writeFileSync(csvPath, `\uFEFF${csv.join('\n')}\n`)

const genericTrait = /^(?:日本动画|美食题材|剧情推动者|剧情核心|作品群像|动漫角色|登场角色|相关人物|相关者|重要配角|核心人物|核心角色|常驻人物|主要角色|重要角色|配角|重要人物|作品主角|团队成员|日语配音|角色序位\d+|相关角色|故事主角|核心成员)$/
const templateDescription = /角色在训练、比赛与团队相处中展现独特性格|通过自身经历参与关键事件|在故事中扮演着自己的角色|这个角色见证了作品情节的发展|是这部作品群像中的一员|本作.{0,20}不可忽略的一员|作品围绕.{0,35}展开|在日常相处、冲突和情感变化中|在日常相处、冲突抉择和团队协作中/
const unresolvedDescriptions = rows.filter(row => checkedIds.has(Number(row.id)) && (templateDescription.test(row.description || '') || (row.description || '').length < 100)).map(row => Number(row.id))
const unresolvedTraits = rows.filter(row => checkedIds.has(Number(row.id)) && (row.traits || []).some(trait => genericTrait.test(trait))).map(row => Number(row.id))
const manifest = JSON.parse(fs.readFileSync(`${root}/visual-audit-tmp/manifest.json`, 'utf8'))
const inaccessible = manifest.filter(item => item.status !== 'downloaded').map(item => Number(item.id))
const unresolvedVisuals = [...new Set(inaccessible)].sort((a, b) => a - b)
const qualityEvidence = JSON.parse(fs.readFileSync(`${root}/description-kitsu-profiles.json`, 'utf8'))
const traitEvidence = JSON.parse(fs.readFileSync(`${root}/trait-kitsu-sources.json`, 'utf8'))
const allModified = new Set([...modified])
const syncedAt = new Date().toISOString()

for (const { batch, path, data } of reports) {
  const group = new Set(data.checkedIds.map(Number))
  data.modifiedIds = [...new Set([...(data.modifiedIds || []).map(Number), ...[...allModified].filter(id => group.has(id))])].sort((a, b) => a - b)
  data.pendingDescriptionQualityIds = unresolvedDescriptions.filter(id => group.has(id))
  data.pendingShortDescriptionIds = data.pendingDescriptionQualityIds.filter(id => [43961, 43976].includes(id))
  data.pendingTraitVerificationIds = unresolvedTraits.filter(id => group.has(id))
  data.pendingVisualVerificationIds = unresolvedVisuals.filter(id => group.has(id))
  data.pendingVoiceActorIds = data.checkedIds.filter(id => {
    const row = byId.get(Number(id))
    return row && (!row.voice_actors?.length || row.voice_actors.some(actor => /暂未收录|待补|未知/.test(actor.name)))
  }).map(Number)
  data.followupEvidence = data.checkedIds.map(Number).filter(id => allModified.has(id)).map(id => ({
    id,
    descriptionSources: descriptions[id] ? [`https://myanimelist.net/character/${id}`, ...(qualityEvidence[id]?.exactMalIdMatches || []).map(item => item.kitsuUrl).filter(Boolean)] : [],
    traitSource: traitPatches[id] ? (traitEvidence[id]?.exact?.[0]?.url || null) : null,
    imageSource: colorFixes[id] ? manifest.find(item => Number(item.id) === id)?.image : null,
  })).filter(item => item.descriptionSources.length || item.traitSource || item.imageSource)
  data.localFollowup = {
    updatedAt: syncedAt,
    modifiedCount: data.modifiedIds.length,
    pendingDescriptionQualityCount: data.pendingDescriptionQualityIds.length,
    pendingTraitVerificationCount: data.pendingTraitVerificationIds.length,
    pendingVisualVerificationCount: data.pendingVisualVerificationIds.length,
    externalWritePending: true,
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

const oldSummary = fs.readFileSync(`${root}/batch25-34-audit-summary.md`, 'utf8')
const summaryBase = oldSummary.split('\n## 后续核实')[0].trimEnd()
const summary = `${summaryBase}\n\n## 后续核实（${syncedAt.slice(0, 10)}）\n\n- 依据 AniList 头像逐图检查 227 条带发色或瞳色特征的记录；已修正明显不符头像的颜色标签。ID 39721 头像无法读取，保留待核实。\n- 依据 MyAnimeList 与 Kitsu 的对应角色资料，改写并核对 ${Object.keys(descriptions).length} 条简介；其余 ${unresolvedDescriptions.length} 条因可用来源不足保留待核实，未编造经历。\n- 使用 Kitsu 对应角色资料重写 ${Object.keys(traitPatches).length} 位人物的泛化标签；其余 ${unresolvedTraits.length} 位仍有泛化特征待逐项核实。\n- 本地重建 characters_full.json、characters_slim.json、characters.csv 及全部 search_text；简介未写入搜索索引。\n- 本次改动尚待同步 Supabase 并逐条回读验证。JOJO 的 8 位缺声优角色仍需可靠的媒介对应配音来源；没有确认的演员姓名不写入。\n`
fs.writeFileSync(`${root}/batch25-34-audit-summary.md`, summary)
fs.writeFileSync(`${root}/followup-changed-ids.json`, JSON.stringify([...followupChanged].sort((a, b) => a - b), null, 2))

console.log(JSON.stringify({
  modifiedCount: modified.size,
  descriptionCount: Object.keys(descriptions).length,
  traitPatchCount: Object.keys(traitPatches).length,
  visualColorCorrections: Object.keys(colorFixes).length,
  pendingDescriptions: unresolvedDescriptions.length,
  pendingGenericTraits: unresolvedTraits.length,
  pendingVisuals: unresolvedVisuals,
  pendingJoJoVoiceActors: [...new Set(reports.flatMap(({ data }) => data.pendingVoiceActorIds))].length,
}, null, 2))
