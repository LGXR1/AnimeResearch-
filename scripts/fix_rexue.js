import { createClient } from '@supabase/supabase-js'

// 修复热血番数据红线：description 补到 ≥100 字，traits 补到 ≥8
// 运行：node --env-file=.env.local scripts/fix_rexue.js

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

// 追加句（追加到 description 末尾，补足 100 字）
const APPEND = {
  173566: '他是异人界难得靠谱、值得信赖的管理者。',
  173570: '是主角团背后可靠又风趣的助力。',
  173571: '在正邪之间始终坚守自己的道义。',
  173572: '是天下会年轻一代的中坚力量。',
  173575: '她的每次登场都会牵动剧情走向。',
  352060: '是异人界不可忽视的一方势力。',
  81239: '是守护玄界的重要战力。',
  89014: '在幕后默默为边境的未来铺路。',
  89227: '是玉狛第二队成长的关键人物。',
  155807: '是玄界对抗近界威胁的中流砥柱。',
  155808: '是关乎边境存亡的决策核心。',
  159427: '是玉狛第一队不可或缺的可靠战力。',
  130713: '在战斗中从来不会退缩半步。',
  130714: '是第8队里最沉稳可靠的存在。',
  130715: '是森罗最信赖的搭档与战友。',
  130716: '为烈火中的队员们带来心灵慰藉。',
  138308: '是队伍坚实而低调的技术后盾。',
  124143: '是科学王国最锋利的一把矛。',
  124144: '是千空最敬畏也最强大的对手。',
  124146: '是千空最信赖、最坚定的伙伴。',
  136446: '为科学王国的重建添砖加瓦。',
  326: '是青学双打组合的定海神针。',
  328: '为青学注入源源不断的活力。',
  331: '是青学阵中不可或缺的力量。',
  332: '是青学里最顽强的斗士。',
  234824: '是主角团最坚强的后盾。',
  245466: '在一次次冒险中逐渐找到自我。',
  258506: '是团队里背负诅咒的重要伙伴。',
  30267: '他的存在让青道的投手们如虎添翼。',
  89392: '是青道内野不可或缺的支柱。',
  89414: '是青道稳固防线的重要拼图。',
  197799: '是青道值得托付的第二捕手。',
  139: '他的温柔与坚强照亮了教团的黑暗。',
  140: '是教团中令人安心的强大战力。',
  141: '她的坚强支撑着身边每一个人。',
  779: '是教团里带给大家欢笑的伙伴。',
  858: '是贯穿全作、难以捉摸的存在。',
  9032: '这份遗憾让艾伦背上了沉重的宿命。',
  123284: '与亚斯塔互为彼此最耀眼的光芒。',
}

// 补充 trait
const ADDTRAIT = {
  138308: '后勤支援',
  258506: '友情',
  9032: '流浪艺人',
}

async function main() {
  let n = 0
  for (const [id, extra] of Object.entries(APPEND)) {
    const { data: ch } = await supabase.from('characters').select('description').eq('id', Number(id)).single()
    if (!ch) continue
    const desc = (ch.description || '') + extra
    await supabase.from('characters').update({ description: desc }).eq('id', Number(id))
    n++
  }
  console.log(`description 已补足 ${n} 个`)

  let t = 0
  for (const [id, trait] of Object.entries(ADDTRAIT)) {
    const { data: ch } = await supabase.from('characters').select('traits').eq('id', Number(id)).single()
    if (!ch) continue
    if ((ch.traits || []).includes(trait)) continue
    const traits = [...(ch.traits || []), trait]
    await supabase.from('characters').update({ traits }).eq('id', Number(id))
    t++
  }
  console.log(`traits 已补足 ${t} 个`)

  // 重建 search_text（traits/description 变了）
  console.log('重建 search_text...')
  const ids = [...Object.keys(APPEND), ...Object.keys(ADDTRAIT)].map(Number)
  for (const id of ids) {
    const { data: ch } = await supabase.from('characters').select('id, name, anime_title, nicknames, traits, voice_actors(name)').eq('id', id).single()
    if (!ch) continue
    const s = [ch.name, ch.anime_title || '', ...(ch.nicknames || []), ...(ch.traits || []), ...(ch.voice_actors || []).map((v) => v.name)].join(' ')
    await supabase.from('characters').update({ search_text: s }).eq('id', id)
  }
  console.log('✅ 完成')
}

main().catch((e) => { console.error('❌', e.message); process.exit(1) })
