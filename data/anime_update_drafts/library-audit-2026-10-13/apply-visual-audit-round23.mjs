import fs from 'node:fs'

const root = 'data/anime_update_drafts/library-audit-2026-10-13'
const fullPath = 'data/characters_full.json'
const slimPath = 'data/characters_slim.json'
const colorRegex = /(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)(?:色)?(?:长|短)?(?:发|头发|瞳|眼|眼睛)/
const fixes = [
  [157690,'粉','蓝'],[157691,'银','蓝'],[157692,'金','棕'],[158331,'紫','紫'],[160249,'灰','蓝'],
  [161229,'棕','棕'],[161230,'黑','金'],[161698,'白','红'],[161730,'金','绿'],[162213,'黑','金'],
  [162242,'棕','蓝'],[162244,'棕','棕'],[162777,'紫','粉'],[166472,'棕','蓝'],[167444,'红','蓝'],
  [167670,'粉','红'],[167671,'黑','金'],[168774,'白','红'],[168866,'黑','灰'],[169409,'黑','金'],
  [169410,'红','蓝'],[169411,'棕','绿'],[170483,'金','绿'],[171836,'棕','棕'],[172523,'棕','棕'],
  [173570,'白','棕'],[173572,'白','紫'],[173574,'黑','蓝'],[173575,'紫','蓝'],[174191,'棕','蓝'],
  [174594,'黑','红'],[174746,'棕','蓝'],[174777,'绿','蓝'],[174801,'棕','蓝'],[174874,'金','绿'],
  [175746,'紫','棕'],[179809,'粉','蓝'],[179810,'金','红'],[180694,'白','紫'],[180884,'紫','灰'],
  [181262,'金',null],[181440,'棕','蓝'],[181964,'白','紫'],[181965,'紫','红'],[183417,'蓝','红'],
  [183884,'粉','蓝'],[183965,'紫','紫'],[184310,'金',null],[185046,'金','棕'],[188783,'粉','红'],
  [190374,'金','红'],[191857,'粉','绿'],[191858,'白','红'],[191859,'金','绿'],[192589,'白','紫'],
  [192769,'紫','棕'],[192974,'棕','蓝'],[193215,'黑',null],[194201,'黑','红'],[194203,'黑','灰'],
  [194304,'黑','紫'],[194305,'白','粉'],[194354,'棕','棕'],[194356,'黑','蓝'],[195917,'白','紫'],
  [197585,'紫','粉'],[197799,'蓝','灰'],[198499,'粉','紫'],[198501,'黑','蓝'],[198502,'紫','蓝'],
  [198505,'金','紫'],[198507,'棕','金'],[198508,'蓝','蓝'],[198883,'棕','绿'],[198884,'粉','紫'],
  [199702,'棕','蓝'],[199866,'橙','金'],[201323,'黑','金'],[203119,'金','绿'],[203120,'白','紫'],
  [203384,'紫','蓝'],[203655,'棕','蓝'],[203656,'黑','灰'],[203657,'棕','棕'],[203658,'黑','棕'],
  [204293,'金','绿'],[205567,'棕','灰'],[205568,'棕','灰'],[205569,'银','蓝'],[205570,'绿','绿'],
  [205571,'棕','紫'],[206490,'金','绿'],[207937,'粉','紫'],[209027,'棕','蓝'],[210911,'金','绿'],
  [210912,'棕','棕'],[210915,'金','绿'],[210916,'橙','蓝'],[210920,'灰','蓝'],[210922,'蓝','紫'],
  [210923,'银','绿'],[211567,'白','蓝'],[212199,'棕',null],[212201,'棕','绿'],[212416,'红','棕'],
  [215099,'紫','蓝'],[215100,'紫','棕'],[215101,'蓝','粉'],[215498,'灰','绿'],[215602,'蓝','紫'],
  [215603,'棕','棕'],[215605,'金','棕'],[215606,'金','绿'],[221145,'粉','棕'],[221478,'棕',null],
  [222104,'红','棕'],[222105,'白','蓝'],[222106,'金','紫'],[222107,'白','蓝'],[222594,'红','粉'],
  [224075,'红','棕'],[229290,'紫','红'],[229291,'金','棕'],[231851,'银','红'],[234824,'粉','绿'],
  [239687,'none','金'],[239956,'白','金'],[244317,'黑','灰'],[245613,'蓝','绿'],[247458,'白','红'],
  [247735,'红',null],[249256,'银','金'],[250490,'棕','金'],[252292,'黑','红'],[253608,'棕','棕'],
  [253609,'棕','蓝'],[253611,'金','红'],[253612,'红','紫'],[253614,'蓝','紫'],[253964,'粉','金'],
  [253965,'棕','棕'],[253966,'金','绿'],[253967,'白','紫'],[253968,'粉','棕'],[253969,'蓝','蓝'],
  [254925,'黑','棕'],[255890,'紫','蓝'],[256378,'棕','棕'],[257297,'橙','红'],[257298,'蓝','金'],
  [257301,'粉','蓝'],[257303,'棕','紫'],[257306,'金','红'],[257307,'黑','紫'],[258506,'红','棕'],
  [259352,'棕','蓝'],[259510,'棕','棕'],[260329,'白','红'],[261674,'金','红'],[262496,'棕',null],
  [262497,'黑','金'],[262498,'黑','紫'],[262535,'黑','棕'],[262822,'粉','紫'],[264356,'金','绿'],
  [265474,'棕','蓝'],[265475,'绿','绿'],[265476,'蓝','蓝'],[265477,'黑','棕'],[265478,'紫','蓝'],
  [266041,'红','金'],[267616,'红','灰'],[268676,'黑','蓝'],[269129,'金','蓝'],[269961,'黑','棕'],
  [269962,'金','棕'],[271367,'none','红'],[272240,'棕',null],[272241,'黑',null],[273090,'棕','棕'],
  [274195,'蓝','绿'],[274773,'蓝','绿'],[275215,'棕','金'],[279505,'绿','绿'],[279506,'粉','蓝'],
  [279507,'红','蓝'],[279508,'银','棕'],[281883,'棕','棕'],[283404,'绿','红'],[283420,'蓝','灰'],
  [283421,'金','金'],[283422,'红','绿'],[283680,'红','黑'],[284157,'银','蓝'],[284158,'棕','灰'],
  [284165,'紫','紫'],[284260,'黑','蓝'],[284850,'黑',null],[286806,'紫','粉'],[287673,'红','蓝'],
  [287678,'黑','红'],[287679,'紫','粉'],[288473,'棕','蓝'],[288474,'白','棕'],[288810,'蓝','红'],
  [288851,'白','蓝'],[289531,'紫','紫'],[290302,'蓝','紫'],[290375,'黑','绿'],[290383,'金','棕'],
  [290387,'黑','灰'],[292677,'棕','红'],[293201,'黑','紫'],[293203,'金','金'],[293204,'粉','蓝'],
  [293976,'银','红'],[294909,'棕','金'],[294910,'金','紫'],[295452,'棕','金'],[295878,'金','红'],
  [295879,'蓝','绿'],[295881,'金','紫'],[297346,'黑',null],[297902,'黑','灰'],[298261,'金','蓝'],
  [298263,'银','红'],[298378,'粉','粉'],[299335,'白','蓝'],[299336,'红','蓝'],[299337,'黑','黑'],
  [299340,'红','棕'],[299341,'绿','绿'],[300088,'粉','蓝'],[300735,'粉','绿'],[300736,'黑','紫'],
  [300737,'白','粉'],[301078,'棕','蓝'],[301090,'棕','棕'],[306614,'棕','蓝'],[306616,'银','蓝'],
  [306618,'黑','紫'],[306619,'灰','红'],[307323,'橙','粉'],[307324,'粉','金'],[308017,'灰',null],
  [309267,'黑','棕'],[309268,'金','蓝'],[309270,'黑','蓝'],[309274,'金','粉'],[309275,'金','蓝'],
  [309517,'蓝','红'],[309518,'棕','红'],[310325,'none','金'],[311059,'棕','棕'],[311061,'黑','棕'],
  [312168,'none',null],[312410,'蓝','金'],[312746,'白','紫'],[312797,'金',null],[312798,'银',null],
  [313382,'蓝','蓝'],[314493,'粉',null],[316946,'金','蓝'],[320605,'金','蓝'],[320610,'绿','蓝'],
  [322841,'红','蓝'],[322842,'蓝','棕'],[322852,'蓝','绿'],[322858,'银','紫'],[323589,'棕','棕'],
  [323821,'棕','棕'],[323822,'金','蓝'],[323823,'粉','粉'],[323824,'紫','棕'],[324418,'白','金'],
  [326377,'金','紫'],[326378,'黑','紫'],[326408,'橙','棕'],[327305,'黑','蓝'],[327970,'棕','绿'],
  [327971,'黑','蓝'],[327972,'黑','紫'],[332269,'黑','蓝'],[334149,'金','蓝'],[339201,'红','金'],
  [339202,'蓝','棕'],[339204,'紫','粉'],[339524,null,'绿'],[341279,'紫','棕'],[341282,'绿','金'],
  [344105,'红','绿'],[346702,'棕','紫'],[349717,'金','绿'],[349718,'蓝','蓝'],[349719,'紫','金'],
  [349720,'金','棕'],[354000,'银','红'],[354001,'紫','蓝'],[354002,'绿','红'],[355641,'黑','紫'],
  [357387,'黑','蓝'],[358224,'紫',null],[358225,'蓝',null],[369593,'棕','绿'],[369594,'蓝','蓝'],
  [370389,'none','金'],[370390,'金','绿'],[376812,'none','金'],[376813,'白','紫'],[378865,'黑','蓝'],
  [379689,'棕','蓝'],[379790,'黑','灰'],[380871,'金','蓝'],[380872,'紫',null],[381931,'紫','紫'],
  [386687,'棕','棕'],[394843,'红','金'],[400732,'紫','紫'],
]
const pendingIds = new Set([
  157882,161231,161236,174778,182729,199191,210921,234805,251839,257300,262536,272642,
  287144,289824,320607,320614,342879,342880,352060,360516,
])

const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'))
const byId = new Map(full.map(row => [Number(row.id), row]))
const slimById = new Map(slim.map(row => [Number(row.id), row]))
const manifest = JSON.parse(fs.readFileSync(`${root}/visual-audit-round23/manifest.json`, 'utf8'))
const auditIds = new Set(manifest.map(item => Number(item.id)))
if (auditIds.size !== 424) throw new Error(`图像核验范围变化：${auditIds.size}`)
const correctionMap = new Map(fixes.map(([id, hair, eye]) => [id, { hair, eye }]))
for (const id of correctionMap.keys()) if (!auditIds.has(id)) throw new Error(`修正 ID 不在图片审核范围：${id}`)

const stamp = new Date().toISOString()
const changed = []
const colorMap = { 黑:'黑', 棕:'棕', 褐:'褐', 金:'金', 黄:'黄', 蓝:'蓝', 青:'青', 绿:'绿', 红:'红', 紫:'紫', 粉:'粉', 白:'白', 银:'银', 灰:'灰', 橙:'橙', 栗:'栗' }
function stripChangedVisualWords(trait, changeHair, changeEye) {
  let result = trait
  const colors = '(?:黑|棕|褐|金|黄|蓝|青|绿|红|紫|粉|白|银|灰|橙|栗)'
  if (changeHair) result = result.replace(new RegExp(`(?:${colors})(?:色)?(?:头发|发)`, 'g'), '')
  if (changeEye) result = result.replace(new RegExp(`(?:${colors})(?:色)?(?:眼睛|眼瞳|瞳色|瞳|眼)`, 'g'), '')
  result = result.replace(/拥有|和/g, '').replace(/[色、；;，,\s]/g, '').trim()
  if (result.endsWith('的')) result = result.slice(0, -1)
  const length = trait.match(/^(长|短)/)?.[1]
  if (changeHair && length && result.length < 2) result = `${length}发`
  return result.length >= 2 ? result : ''
}

for (const [id, patch] of correctionMap) {
  const row = byId.get(id)
  if (!row) throw new Error(`本地角色不存在：${id}`)
  const before = (row.traits || []).slice()
  const updated = []
  let removed = false
  for (const trait of before) {
    const hasColor = colorRegex.test(trait)
    const touchesHair = patch.hair != null && /发|头发/.test(trait)
    const touchesEye = patch.eye != null && /眼|瞳/.test(trait)
    const removesHair = patch.hair === 'none' && /发|头发/.test(trait)
    if (hasColor && (touchesHair || touchesEye || removesHair)) {
      const residue = stripChangedVisualWords(trait, touchesHair || removesHair, touchesEye)
      if (residue) updated.push(residue)
      removed = true
    } else updated.push(trait)
  }
  if (patch.hair && patch.hair !== 'none') updated.push(`${colorMap[patch.hair]}发`)
  if (patch.eye) updated.push(`${colorMap[patch.eye]}瞳`)
  row.traits = [...new Set(updated)]
  if ((patch.hair == null && patch.eye == null) || JSON.stringify(before) === JSON.stringify(row.traits)) throw new Error(`角色 ${id} 没有可应用的颜色核对结果`)
  row.search_text = [row.name, row.anime_title, ...(row.nicknames || []), ...row.traits, ...(row.voice_actors || []).map(actor => actor.name)].join(' ')
  if (row.search_text.includes(row.description || '\u0000')) throw new Error(`角色 ${id} 简介进入搜索索引`)
  const slimRow = slimById.get(id)
  if (!slimRow) throw new Error(`精简导出缺少角色 ${id}`)
  slimRow.traits = row.traits
  slimRow.search_text = row.search_text
  changed.push({ id, name: row.name, anime: row.anime_title, beforeColorTraits: before.filter(value => colorRegex.test(value)), afterColorTraits: row.traits.filter(value => colorRegex.test(value)), image: row.image })
}

const verifiedIds = [...auditIds].filter(id => !pendingIds.has(id))
for (const id of pendingIds) if (!auditIds.has(id)) throw new Error(`待核 ID 不在 424 张图片内：${id}`)
const reportPaths = Array.from({ length: 44 }, (_, index) => `${root}/batch${index + 85}-audit-report.json`)
for (const path of reportPaths) {
  const report = JSON.parse(fs.readFileSync(path, 'utf8'))
  const batchIds = report.checkedIds.map(Number)
  const reviewed = batchIds.filter(id => auditIds.has(id))
  report.pendingVisualVerificationIds = batchIds.filter(id => pendingIds.has(id))
  report.pendingColorTraitKeywordIds = batchIds.filter(id => {
    const row = byId.get(id)
    return (row?.traits || []).some(trait => colorRegex.test(trait))
  })
  report.localFollowup ||= {}
  report.localFollowup.visualImageAuditRound23 = {
    checkedAt: stamp,
    source: '逐张检查 AniList 官方角色头像；图片与角色链接见 visual-audit-round23/manifest.json',
    reviewedIds: reviewed,
    colorCorrections: changed.filter(item => batchIds.includes(item.id)),
    pendingIds: batchIds.filter(id => pendingIds.has(id)),
  }
  if (reviewed.length) report.note = '角色图像已逐张目视复核；可辨认的颜色错误已修正，图片无法确认的记录继续待核。'
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
fs.writeFileSync(`${root}/visual-audit-round23-results.json`, JSON.stringify({ auditedAt: stamp, total: auditIds.size, visuallyVerified: verifiedIds.length, retainedForFollowup: [...pendingIds].sort((a,b)=>a-b), corrected: changed.length, corrections: changed, verifiedIds: verifiedIds.sort((a,b)=>a-b) }, null, 2))

const summaryPath = `${root}/batch85-128-audit-summary.md`
const additions = `\n\n## 角色头像发色/瞳色目视复核（${stamp.slice(0, 10)}）\n\n- 逐张核验 AniList 官方头像 ${auditIds.size} 张；对照头像修正 ${changed.length} 位角色的发色/瞳色标签。\n- ${verifiedIds.length} 位图像与当前可见颜色相符或已纠正；${pendingIds.size} 位因黑白漫画图、脸部遮挡、非人类角色图片或头像缺失而无法可靠确认，继续保留待核。\n- 每条修正前后特征、头像 URL 和逐批审核 ID 已记录在 visual-audit-round23-results.json；本地 search_text 已重建并确认不含简介。\n`
fs.writeFileSync(summaryPath, fs.readFileSync(summaryPath, 'utf8') + additions)
console.log(JSON.stringify({ total: auditIds.size, visuallyVerified: verifiedIds.length, retainedForFollowup: [...pendingIds].sort((a,b)=>a-b), correctedCharacters: changed.length }, null, 2))
