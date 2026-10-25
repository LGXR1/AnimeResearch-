import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const updates = {
  271367: {
    traits: ['男性', '17岁', '身高约175厘米', '游戏昵称桑乐（Sunraku）', '热衷游玩垃圾游戏', '擅长应对恶劣游戏机制', '《香格里拉·弗陇提亚》主人公', '游戏形象不穿防具', '游戏形象双持匕首', '游戏形象为鸟首人形并有红瞳'],
    description: '阳务乐郎是《香格里拉·弗陇提亚》的主人公，游戏昵称为“桑乐”（Sunraku）。他是男性，17岁，身高约175厘米，尤其热衷挑战以漏洞、恶劣机制和糟糕人工智能闻名的“垃圾游戏”。这些经历锻炼了他在逆境中迅速应变的能力。进入VR游戏《香格里拉·弗陇提亚》后，他选择不穿防具、双持匕首，并将游戏形象设定为鸟首人形。',
    sources: ['https://anilist.co/character/271367'],
  },
  310325: {
    traits: ['黑猫型魔物', '通常以黑猫形态出现', '在迷宫中与织田晶相遇', '与织田晶缔结契约', '成为织田晶的使魔', '陪伴晶及同伴行动', '头像显示金色眼睛', '日语声优为小林早苗', 'AniList英文名为Yoru'],
    description: '夜（Yoru）是《身为暗杀者的我明显比勇者还强》中的黑猫型魔物，通常以黑猫姿态出现。她在迷宫中与主角织田晶相遇，随后成为晶缔结契约的使魔并陪伴他及同伴行动。MyAnimeList相关角色目录与动画新闻报道均将她介绍为黑猫魔物；动画资料列出的日语声优为小林早苗。角色头像显示其眼睛为金黄色。公开资料未详述其他形态和能力，因此不补写未证实设定。',
    sources: [
      'https://www.animenewsnetwork.com/news/2025-08-17/my-status-as-an-assassin-obviously-exceeds-the-hero-anime-reveals-special-black-cat-appreciation-/.227710',
      'https://anihk.com/en/character/yoru-my-status-as-an-assassin-obviously-exceeds-the-heros',
    ],
  },
  312168: {
    traits: ['幼年史莱姆', '由雷·泰勒收养', '雷身边的伙伴', '蓝色半透明胶状外形', '非人类生物', '《我推是反派大小姐》角色', 'AniList英文名Ralaire', '日语声优为Minami Kurisaka'],
    description: '拉莱尔（Ralaire）是《我推是反派大小姐》中的幼年史莱姆，由雷·泰勒收养并成为她身边的伙伴。AniList角色资料明确将它介绍为“由雷收养的幼年史莱姆”，角色头像也呈现蓝色半透明的胶状外形。公开资料没有说明它的进化阶段、战斗能力或更详细的过往，因此这里只记录已确认的种类、收养关系和作品身份，不扩写未经证实的经历。',
    sources: ['https://anilist.co/character/312168'],
  },
  370389: {
    traits: ['古代龙族幼崽', '与武尊同行', '可靠的旅行伙伴', '擅长灵术', '探索能力出色', '食量很大', '非人类龙兽', '头像显示金色眼睛', 'AniList英文名为Bee', '日语声优为Ayasa Itou'],
    description: '蜂（Bee）是《素材采集家的异世界旅行记》中与武尊同行的古代龙族幼崽。AniList角色资料称它是可靠的伙伴，擅长灵术和探索，食量也很大。头像显示它是黑色毛茸茸的龙兽形象，眼睛呈金黄色；因此名字“蜂”不应被误解为普通昆虫。公开角色简介没有提供更多能力规则或身世细节，这里仅整理来源明确的种族、同伴关系和特征。',
    sources: ['https://anilist.co/character/370389'],
  },
  376812: {
    traits: ['男性', '蜥蜴人战士', '冒险者公会“欧罗巴”成员', '资深冒险者', '正义感强', '交游广泛', '说话有时显得说教', '食量很大', '头像显示蓝色鳞皮', '头像显示金黄色眼睛', '日语声优为森川智之'],
    description: '克莱斯顿（Clayston）是《素材采集家的异世界旅行记》中的男性蜥蜴人战士，隶属冒险者公会“欧罗巴”。AniList资料称他是经验丰富的冒险者，具有强烈的正义感和广泛人脉；他说话有时显得说教，食量也很大。角色头像显示他有蓝色鳞皮和金黄色眼睛，属于蜥蜴人外观，并非黑发。公开资料未提供更多身世信息，因此不补写未经核实的经历。',
    sources: ['https://anilist.co/character/376812'],
  },
}

const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const byId = new Map(full.map(row => [Number(row.id), row]))
const ids = Object.keys(updates).map(Number)
const stamp = new Date().toISOString()
for (const id of ids) {
  const row = byId.get(id)
  const slimRow = slimById.get(id)
  const update = updates[id]
  if (!row || !slimRow) throw new Error(`本地导出缺少角色 ${id}`)
  if (update.traits.length < 8) throw new Error(`角色 ${id} 特征不足 8 条`)
  if (update.description.length < 100 || update.description.length > 200) throw new Error(`角色 ${id} 简介长度 ${update.description.length}，不符合 100–200 字要求`)
  row.traits = update.traits
  row.description = update.description
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description)) throw new Error(`角色 ${id} 简介进入搜索索引`)
  for (const key of ['traits', 'description', 'search_text']) slimRow[key] = row[key]
}

const genericDescriptionRegex = /角色在训练、比赛与团队相处中展现独特性格|通过自身经历参与关键事件|在故事中扮演着自己的角色|这个角色见证了作品情节的发展|是这部作品群像中的一员|本作.{0,20}不可忽略的一员|作品围绕.{0,35}展开|在日常相处、冲突和情感变化中|在日常相处、冲突抉择和团队协作中|与某位.+相识|成为了重要的伙伴|在冒险中不断成长|用自己的方式支持着朋友/
const genericTraitRegex = /^(?:日本动画|美食题材|剧情推动者|剧情核心|作品群像|动漫角色|登场角色|相关人物|相关者|重要配角|核心人物|核心角色|常驻人物|主要角色|重要角色|配角|重要人物|作品主角|团队成员|日语配音|角色序位\d+|相关角色|故事主角|核心成员|伙伴|可靠|异世界|成长|战斗|友情|神秘|可爱|搞笑|速通)$/
const reportPaths = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
for (const path of reportPaths) {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = report.checkedIds.map(Number)
  report.pendingTraitVerificationIds = (report.pendingTraitVerificationIds || []).filter(id => !ids.includes(Number(id)))
  report.pendingShortDescriptionIds = batchIds.filter(id => (byId.get(id)?.description || '').length < 100)
  report.pendingDescriptionQualityIds = batchIds.filter(id => genericDescriptionRegex.test(byId.get(id)?.description || ''))
  report.pendingExactGenericTraitIds = batchIds.filter(id => (byId.get(id)?.traits || []).some(trait => genericTraitRegex.test(trait)))
  report.modifiedIds = [...new Set([...(report.modifiedIds || []).map(Number), ...ids.filter(id => batchIds.includes(id))])].sort((a, b) => a - b)
  report.localFollowup ||= {}
  report.localFollowup.factualCorrectionsRound23 = ids.filter(id => batchIds.includes(id)).map(id => ({ sources: updates[id].sources, correctedAt: stamp, databaseReadbackVerified: false, introExcludedFromSearch: true }))
  if (ids.some(id => batchIds.includes(id))) report.note = '已依据 AniList 角色资料和可信作品角色报道修正具名身份、外观、简介及特征；简介未进入搜索索引。'
  fs.writeFileSync(path, JSON.stringify(report, null, 2))
}

fs.writeFileSync(fullPath, JSON.stringify(full, null, 2))
fs.writeFileSync(slimPath, JSON.stringify(slim, null, 2))
const csvField = value => {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const csvLines = ['id,name,anime_title,image,description,nicknames,traits,voice_actors']
for (const row of full) csvLines.push([row.id, row.name, row.anime_title, row.image, row.description, (row.nicknames || []).join('|'), (row.traits || []).join('|'), (row.voice_actors || []).map(actor => actor.name).join(',')].map(csvField).join(','))
fs.writeFileSync('data/characters.csv', `\uFEFF${csvLines.join('\n')}\n`)

const summaryPath = `${root}/batch85-128-audit-summary.md`
const summary = `\n\n## 可靠来源补充修正（${stamp.slice(0, 10)}）\n\n- 依据 AniList 角色条目补齐阳务乐郎、拉莱尔、蜂与克莱斯顿的具体身份和特征；纠正“蜂”为龙族幼崽而非普通昆虫、克莱斯顿为蜥蜴人而非黑发人物。\n- 依据 Anime News Network 角色报道与角色目录，改写黑猫型魔物夜的简介和特征，确认其与织田晶缔结契约、成为使魔，日语声优为小林早苗。\n- 为以上 ${ids.length} 位改写 100–200 字简介、每人补足至少 8 条可核实特征，并重建搜索索引；简介未写入索引。来源见批次报告。\n`
fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf8') + summary)
console.log(JSON.stringify({ modifiedCount: ids.length, ids, lengths: Object.fromEntries(ids.map(id => [id, updates[id].description.length])), minimumTraits: Math.min(...ids.map(id => byId.get(id).traits.length)) }, null, 2))
