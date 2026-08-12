import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

const variants = {
  '为美好的世界献上祝福': ['为美好世界献上祝福','Konosuba','素晴','このすば'],
  '辉夜大小姐想让我告白': ['辉夜大小姐','辉夜','かぐや様'],
  '青春猪头少年不会梦到兔女郎学姐': ['青春猪头少年','兔女郎学姐','青ブタ'],
  '关于我转生变成史莱姆这档事': ['转生史莱姆','転スラ'],
  '我的英雄学院': ['我英','英雄学院','ヒロアカ'],
  '鬼灭之刃': ['鬼滅之刃','鬼灭','きめつのやいば'],
  '咒术回战': ['呪術廻戦','じゅじゅつかいせん'],
  '间谍过家家': ['間諜過家家','スパイファミリー','SPYFAMILY'],
  '钢之炼金术师': ['鋼の錬金術師','钢炼','ハガレン'],
  '命运石之门': ['Steins Gate','シュタインズゲート','石头门'],
  'Re:从零开始的异世界生活': ['从零开始','Re零','リゼロ','Re:Zero'],
  '新世纪福音战士': ['EVA','エヴァンゲリオン'],
  '魔法少女小圆': ['まどマギ','小圆','Madoka'],
  '某科学的超电磁炮': ['超电磁炮','レールガン','Railgun'],
  '无职转生': ['無職転生','Mushoku Tensei'],
  '五等分的花嫁': ['五等分の花嫁','五等分'],
  '古见同学有交流障碍症': ['古见同学','コミュ症'],
  '轻音少女': ['けいおん','K-ON','KON'],
  'Fate系列': ['Fate','Fate/stay night','Fate/Zero','フェイト'],
  '吹响吧上低音号': ['吹响吧','上低音号','響けユーフォニアム','Hibike Euphonium'],
  '进击的巨人': ['進擊的巨人','進撃の巨人','Attack on Titan'],
  '葬送的芙莉莲': ['葬送のフリーレン','Frieren'],
  '妖精的尾巴': ['Fairy Tail','フェアリーテイル','妖尾'],
  '物语系列': ['物語シリーズ','Monogatari','化物语'],
  '全职猎人': ['Hunter x Hunter','ハンター×ハンター','猎人'],
  '灌篮高手': ['SLAM DUNK','スラムダンク','篮球飞人'],
  '天元突破红莲螺岩': ['天元突破','グレンラガン','Gurren Lagann'],
  '斩服少女': ['Kill la Kill','キルラキル'],
  '剑风传奇': ['Berserk','ベルセルク','烙印战士'],
  '黑礁': ['BLACK LAGOON','ブラックラグーン'],
  '混沌武士': ['Samurai Champloo','サムライチャンプルー'],
  '你的名字。': ['君の名は','Your Name','Kimi no Na wa'],
  '天气之子': ['天気の子','Weathering With You'],
  '未麻的部屋': ['Perfect Blue','パーフェクトブルー'],
  '阿基拉': ['AKIRA','アキラ'],
  '千与千寻': ['千と千尋の神隠し','Spirited Away'],
  '排球少年': ['Haikyuu','ハイキュー'],
  '黑子的篮球': ['黒子のバスケ','Kuroko no Basket'],
  '精灵宝可梦': ['Pokemon','ポケモン','宠物小精灵','神奇宝贝'],
  '魔卡少女樱': ['カードキャプターさくら','Cardcaptor Sakura','百变小樱'],
  '寄生兽': ['寄生獣','Kiseijuu','Parasyte'],
  '冰菓': ['Hyouka','氷菓'],
  '凉宫春日的忧郁': ['涼宮ハルヒ','凉宫','Haruhi'],
}

const {data: chars} = await supabase.from('characters').select('id, anime_title, name, nicknames, traits, voice_actors(name)')
for (const c of chars||[]) {
  const extra = variants[c.anime_title] || []
  const st = [c.name, c.anime_title||'', ...extra, ...(c.nicknames||[]), ...(c.traits||[]), ...(c.voice_actors||[]).map(v=>v.name)].join(' ')
  await supabase.from('characters').update({ search_text: st }).eq('id', c.id)
}

const {data: t1} = await supabase.from('characters').select('name').ilike('search_text','%为美好世界献上祝福%')
console.log('搜"为美好世界献上祝福":', t1?.length, t1?.map(c=>c.name).join(', '))
const {data: t2} = await supabase.from('characters').select('name').ilike('search_text','%素晴%')
console.log('搜"素晴":', t2?.length, t2?.map(c=>c.name).join(', '))
console.log('✅ done')
