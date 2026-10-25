import fs from 'node:fs'

const candidates = JSON.parse(fs.readFileSync('data/anime_update_drafts/batch43-search-candidates.json', 'utf8'))
const norm = value => String(value || '').trim().toLocaleLowerCase().replace(/[\s:：・!！?？‐‑–—]/g, '')
const knownTitles = new Set(JSON.parse(fs.readFileSync('data/characters_full.json', 'utf8')).map(row => norm(row.anime_title)))
const zhTitles = {
  110277: ['进击的巨人 最终季', ['进击的巨人 The Final Season', '进击的巨人 第四季']],
  104276: ['我的英雄学院 第四季', ['我的英雄学院 4th Season']],
  20594: ['刀剑神域 第二季', ['刀剑神域II', 'SAO II']],
  3588: ['噬魂师', ['SOUL EATER']],
  9989: ['未闻花名', ['我们仍未知道那天所看见的花的名字。']],
  10087: ['Fate/Zero', []],
  20829: ['终结的炽天使', ['终结的炽天使 名古屋决战篇']],
  103572: ['五等分的花嫁', ['五等分的新娘']],
  11617: ['恶魔高校D×D', ['High School DxD']],
  119661: ['Re:从零开始的异世界生活 第二季 后半', ['Re:Zero 第二季 Part 2']],
  100240: ['东京喰种:re', ['东京食尸鬼:re']],
  6746: ['无头骑士异闻录', ['无头骑士异闻录 DuRaRaRa!!']],
  20799: ['JOJO的奇妙冒险 星尘斗士 埃及篇', ['JOJO的奇妙冒险：星尘斗士 埃及篇']],
  100182: ['刀剑神域 Alicization', ['刀剑神域 爱丽丝篇']],
  8074: ['学园默示录', ['学园黙示录 HIGHSCHOOL OF THE DEAD']],
  99539: ['七大罪 戒律的复活', ['七大罪 第二季']],
  889: ['黑礁', ['BLACK LAGOON']],
  6880: ['死囚乐园', ['亡灵幻境']],
  101474: ['OVERLORD III', ['OVERLORD 第三季']],
  16592: ['弹丸论破 希望的学园和绝望的高中生 The Animation', ['弹丸论破 希望的学园与绝望的高中生']],
  97938: ['BORUTO -火影新世代-', ['博人传 火影忍者新时代']],
  4181: ['CLANNAD ～AFTER STORY～', ['CLANNAD After Story']],
  21127: ['命运石之门 0', ['Steins;Gate 0']],
  20770: ['晨曦公主', ['拂晓的尤娜']],
  131586: ['86 -不存在的战区- 第2部分', ['86 Eighty-Six 第二季']],
  20631: ['七人魔法使', ['Trinity Seven']],
  15451: ['恶魔高校D×D NEW', ['High School DxD NEW']],
  105228: ['异兽魔都', ['Dorohedoro']],
  21595: ['在下坂本，有何贵干？', ['坂本ですが?']],
  2251: ['永生之酒', ['Baccano!']],
  100112: ['贤者之孙', ['Wise Man’s Grandchild']],
  18671: ['中二病也要谈恋爱！恋', ['中二病也要谈恋爱 第二季']],
  934: ['寒蝉鸣泣之时', ['暮蝉悲鸣时']],
  2025: ['黑之契约者', ['DARKER THAN BLACK -黑之契约者-']],
  124194: ['水果篮子 The Final', ['新水果篮子 最终季']],
  17074: ['物语系列 第二季', ['〈物语〉系列 第二季']],
  21093: ['魔物娘的同居日常', ['魔物娘的相伴日常']],
  116566: ['全员恶玉', ['阿库达玛Drive']],
  114745: ['来自深渊 烈日的黄金乡', ['来自深渊 第二季']],
  16742: ['我不受欢迎，怎么想都是你们的错！', ['丧女']],
  19163: ['约会大作战 II', ['约会大作战 第二季']],
  104647: ['转生恶役只好拔除破灭旗标', ['转生恶役只好拔除破灭旗标…']],
  20513: ['心理测量者 2', ['PSYCHO-PASS 第二季']],
  97767: ['恶魔高校D×D HERO', ['High School DxD HERO']],
  8525: ['只有神知道的世界', ['神のみぞ知るセカイ']],
  20955: ['六花的勇者', ['六花勇者']],
  127399: ['终末的女武神', ['Record of Ragnarok']],
  98035: ['Fate/Apocrypha', []],
  21455: ['NEW GAME!', ['新游戏！']],
  21860: ['末日时在做什么？有没有空？可以来拯救吗？', ['末日时在做什么？有没有空？要不要来拯救呢？']],
  21394: ['魔笛MAGI 辛巴达的冒险', ['辛巴达的冒险']],
  6347: ['笨蛋、测验、召唤兽', ['笨蛋测试召唤兽']],
  15051: ['Love Live! 学园偶像计划', ['Love Live! School Idol Project']],
  20812: ['白箱', ['SHIROBAKO']],
  20652: ['无头骑士异闻录×2 承', ['无头骑士异闻录 第二季 承']],
  21639: ['竞女!!!!!!!!', ['Keijo!!!!!!!!']],
  110270: ['异种族风俗娘评鉴指南', ['异种族レビュアーズ']],
  9513: ['恶魔奶爸', ['Beelzebub']],
  103302: ['一弦定音！', ['Kono Oto Tomare!']],
  107663: ['彼方的阿斯特拉', ['Astra Lost in Space']],
  6707: ['黑执事II', ['黑执事 第二季']],
  101903: ['强风吹拂', ['风が強く吹いている']],
  1604: ['家庭教师HITMAN REBORN!', ['家庭教师REBORN!']],
  21676: ['在地下城寻求邂逅是否搞错了什么 外传 剑姬神圣谭', ['剑姬神圣谭']],
  6956: ['迷糊餐厅', ['WORKING!!']],
  21509: ['弹丸论破3 未来篇', ['Danganronpa 3: The End of Hope’s Peak High School - Future Arc']],
  119683: ['伊甸星原', ['EDENS ZERO']],
  12413: ['军火女王', ['Jormungand']],
  21825: ['弹丸论破3 绝望篇', ['Danganronpa 3: The End of Hope’s Peak High School - Despair Arc']],
  20614: ['Free! -Eternal Summer-', ['Free! 第二季']],
  481: ['游戏王 怪兽之决斗', ['Yu-Gi-Oh! Duel Monsters']],
  103275: ['Fate/Grand Order -绝对魔兽战线巴比伦尼亚-', ['FGO 巴比伦尼亚']],
  57: ['BECK 摇滚新乐团', ['BECK: Mongolian Chop Squad']],
  97889: ['银魂。', ['银魂 第四季']],
  116605: ['约会大作战 IV', ['约会大作战 第四季']],
  18247: ['IS〈无限斯特拉托斯〉2', ['Infinite Stratos 2']],
  13663: ['出包王女DARKNESS', ['To LOVE-Ru Darkness']],
  118465: ['终末的后宫', ['World’s End Harem']],
  21560: ['剑风传奇 (2016)', ['Berserk 2016']],
  100185: ['魔法禁书目录 III', ['魔法的禁书目录 第三季']],
  98292: ['NEW GAME!!（新游戏！）', ['NEW GAME!!']],
  108307: ['心理测量者3', ['PSYCHO-PASS 3']],
  104463: ['某科学的一方通行', ['A Certain Scientific Accelerator']],
  110733: ['佐贺偶像是传奇 Revenge', ['佐贺偶像是传奇 第二季']],
  14829: ['Fate/kaleid liner 魔法少女☆伊莉雅', ['魔法少女☆伊莉雅']],
  104462: ['某科学的超电磁炮T', ['某科学的超电磁炮 第三季']],
  4214: ['十字架与吸血鬼 CAPU2', ['十字架与吸血鬼 第二季']],
  11285: ['黑岩射手', ['Black Rock Shooter (TV)']],
  10790: ['这个是僵尸吗？OF THE DEAD', ['这个是僵尸吗？ 第二季']],
  20913: ['K RETURN OF KINGS', ['K 第二季']],
  6573: ['黑之契约者 流星的双子', ['DARKER THAN BLACK -流星的双子-']],
  20853: ['ALDNOAH.ZERO 第二季', ['ALDNOAH.ZERO Season 2']],
  21717: ['Fate/EXTRA Last Encore', ['Fate EXTRA Last Encore']],
  154: ['通灵王', ['Shaman King']],
  16: ['蜂蜜与四叶草', ['Honey and Clover']],
  104051: ['魔法纪录 魔法少女小圆外传', ['Magia Record']],
  104159: ['碧蓝航线', ['Azur Lane']],
  108522: ['刃牙 大擂台赛篇', ['Baki: The Great Raitai Tournament Saga']],
  101117: ['Free! -Dive to the Future-', ['Free! 第三季']],
  20635: ['龙珠改 魔人布欧篇', ['龙珠改 最终章']],
  118465: ['终末的后宫', ['World’s End Harem']],
  21560: ['剑风传奇 (2016)', ['烙印战士 2016']],
  104051: ['魔法纪录 魔法少女小圆外传', ['Magia Record']],
  110733: ['佐贺偶像是传奇 Revenge', ['佐贺偶像是传奇 第二季']],
  20913: ['K RETURN OF KINGS', ['K 第二季']],
}
if (candidates.length < 50) throw new Error(`应至少有50个候选，实际${candidates.length}`)
const anime = []
const duplicateDb = []
const omittedForVariety = new Set([20594, 15451, 97767, 19163, 98035])
for (const item of candidates) {
  if (omittedForVariety.has(item.id)) continue
  const [title, extraAliases] = zhTitles[item.id] || []
  if (!title) throw new Error(`缺少中文译名：${item.id}`)
  const aliases = [...new Set([item.title.english, item.title.romaji, item.title.native, ...(item.synonyms || []), ...extraAliases].filter(Boolean))]
  if ([title, ...aliases].some(alias => knownTitles.has(norm(alias)))) {
    duplicateDb.push({ id: item.id, title })
    continue
  }
  anime.push({ mediaId: item.id, title, titleAliases: aliases,
    references: [`https://anilist.co/anime/${item.id}`], snapshotPath: `data/anime_update_drafts/batch43-sources/anime-source-${item.id}.json` })
}
console.log(`本地标题重复 ${duplicateDb.length} 部：${duplicateDb.map(x => `${x.title}(${x.id})`).join('、') || '无'}`)
if (anime.length < 50) throw new Error(`过滤本地重复后仅剩${anime.length}部，需要继续补充${50 - anime.length}部`)
const selected = anime.slice(0, 50)
const titleMap = new Map()
for (const item of selected) for (const title of [item.title, ...item.titleAliases]) {
  const key = norm(title)
  const old = titleMap.get(key)
  if (old && old !== item.mediaId) throw new Error(`本批作品名/别名重复：${title} (${old}/${item.mediaId})`)
  titleMap.set(key, item.mediaId)
}
const selection = { selectedAt: new Date().toISOString(), anime: selected }
fs.writeFileSync('data/anime_update_drafts/batch43-selection.json', JSON.stringify(selection, null, 2))
console.log(`已整理 ${selected.length} 部候选作品中文名和AniList来源`)
for (const item of selected) console.log(`${item.mediaId}\t${item.title}`)
