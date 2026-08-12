import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const D=[
['碧蓝航线',148767,'翔鹤',['翔鹤','Shoukaku'],'https://s4.anilist.co/file/anilistcdn/character/large/b148767-PMpgH3XZy47o.png'],
['碧蓝航线',130070,'贝尔法斯特',['Belfast','ベルファスト'],'https://s4.anilist.co/file/anilistcdn/character/large/n130070-aFSpprHYoWNn.jpg'],
['碧蓝航线',148768,'瑞鹤',['Zuikaku','瑞鹤'],'https://s4.anilist.co/file/anilistcdn/character/large/b148768-sMFFXEej6ttf.png'],
['碧蓝航线',137056,'绫波',['Ayanami','綾波'],'https://s4.anilist.co/file/anilistcdn/character/large/b137056-hDdmwlcAzprB.jpg'],
['公主连结Re:Dive',160247,'佩可莉姆',['Pecorine','ペコリーヌ'],'https://s4.anilist.co/file/anilistcdn/character/large/b160247-MeZX1W0Vgvo1.png'],
['公主连结Re:Dive',160246,'凯露',['Karyl','キャル'],'https://s4.anilist.co/file/anilistcdn/character/large/b160246-g44lB2ZlqdiT.png'],
['公主连结Re:Dive',160248,'可可萝',['Kokkoro','コッコロ'],'https://s4.anilist.co/file/anilistcdn/character/large/b160248-Q37H6ZX30iwj.png'],
['公主连结Re:Dive',160249,'佑树',['Yuuki','ユウキ'],'https://s4.anilist.co/file/anilistcdn/character/large/b160249-CXTSduncrRLJ.png'],
['路人女主的养成方法',88747,'安艺伦也',['Tomoya Aki','安艺伦也'],'https://s4.anilist.co/file/anilistcdn/character/large/b88747-QKs2TbCGlZr0.png'],
['路人女主的养成方法',88748,'加藤惠',['Megumi Katou','加藤惠','圣人惠'],'https://s4.anilist.co/file/anilistcdn/character/large/b88748-zPL68ZFgFRH8.png'],
['路人女主的养成方法',88749,'泽村·斯宾塞·英梨梨',['Eriri Sawamura','英梨梨'],'https://s4.anilist.co/file/anilistcdn/character/large/b88749-loy0rBIbAcIC.png'],
['路人女主的养成方法',88750,'霞之丘诗羽',['Utaha Kasumigaoka','诗羽','学姐'],'https://s4.anilist.co/file/anilistcdn/character/large/b88750-s7ZxVssLyP0p.png'],
['龙王的工作',120673,'雏鹤爱',['Ai Hinatsuru','雏鹤爱'],'https://s4.anilist.co/file/anilistcdn/character/large/b120673-cRr2ClHTLnfL.png'],
['龙王的工作',120675,'九头龙八一',['Yaichi Kuzuryu','九头龙八一','龙王'],'https://s4.anilist.co/file/anilistcdn/character/large/b120675-R6J5yrex6lrH.png'],
['盾之勇者成名录',88817,'岩谷尚文',['Naofumi Iwatani','尚文','盾之勇者'],'https://s4.anilist.co/file/anilistcdn/character/large/b88817-Aku5CuN6wO2z.png'],
['盾之勇者成名录',88889,'拉芙塔莉雅',['Raphtalia','ラフタリア'],'https://s4.anilist.co/file/anilistcdn/character/large/b88889-CWYytVbCOPsV.png'],
['盾之勇者成名录',126828,'菲洛',['Filo','フィーロ','菲洛鸟'],'https://s4.anilist.co/file/anilistcdn/character/large/b126828-nZDnMK4Bw7f9.png'],
['慎重勇者',141624,'莉丝妲黛',['Ristarte','リスタルテ','女神'],'https://s4.anilist.co/file/anilistcdn/character/large/b141624-gTy9Jhhc9UAk.png'],
['慎重勇者',141625,'龙宫院圣哉',['Seiya Ryuguin','圣哉','慎重勇者'],'https://s4.anilist.co/file/anilistcdn/character/large/b141625-oYFYH78dmAkz.png'],
['平凡职业成就世界最强',132848,'南云始',['Hajime Nagumo','南云始'],'https://s4.anilist.co/file/anilistcdn/character/large/b132848-HsUfgM0nr2Dz.jpg'],
['平凡职业成就世界最强',132847,'月',['Yue','ユエ','吸血鬼姬'],'https://s4.anilist.co/file/anilistcdn/character/large/b132847-rxYUEsbcLxTm.png'],
['贤者之孙',138191,'西恩·沃夫德',['Shin Wolford','西恩'],'https://s4.anilist.co/file/anilistcdn/character/large/b138191-a5pX21jLduAb.jpg'],
['贤者之孙',138192,'西希莉·冯·克劳德',['Sicily von Claude','西希莉'],'https://s4.anilist.co/file/anilistcdn/character/large/b138192-3ITi9SS5XXvp.jpg'],
['带着智慧型手机闯荡异世界',122730,'望月冬夜',['Touya Mochizuki','冬夜'],'https://s4.anilist.co/file/anilistcdn/character/large/b122730-SC9en2JOxQ6y.jpg'],
// Magic Knight Rayearth
[519,{n:'龙咲海',a:'魔法骑士',img:'https://s4.anilist.co/file/anilistcdn/character/large/b519-JCCrNQZ1aLKO.png',dsc:'被选为魔法骑士的少女之一——剑术高超的优等生。性格冷静高傲但在伙伴遇到危险时会第一个拔剑而出。操纵水之魔法的蓝色魔法骑士。',tr:['蓝发','剑术','水之魔法','冷静','高傲','魔法骑士'],nk:['Umi Ryuuzaki','龙咲海']}],
[518,{n:'狮堂光',a:'魔法骑士',img:'https://s4.anilist.co/file/anilistcdn/character/large/b518-6f794qZNytCx.png',dsc:'被召唤到异世界的少女之一——短发的元气少女。操纵火之魔法的红色魔法骑士。性格直率勇敢是三人中的领袖。为了拯救被囚禁的公主而战斗。',tr:['红发','短发','火之魔法','元气','勇敢','领袖','魔法骑士'],nk:['Hikaru Shidou','狮堂光']}],
[520,{n:'凤凰寺风',a:'魔法骑士',img:'https://s4.anilist.co/file/anilistcdn/character/large/b520-saKwduKX3WEx.png',dsc:'被选为魔法骑士的少女之一——金发的温柔少女。操纵风之魔法的绿色魔法骑士。性格温柔善良但当需要保护朋友时毫不退缩。擅长用弓箭进行远程支援。',tr:['金发','风之魔法','弓箭','温柔','善良','魔法骑士'],nk:['Fuu Hououji','凤凰寺风']}],
// 持续狩猎史莱姆三百年
['持续狩猎史莱姆三百年',135592,'相泽梓',['Azusa Aizawa','梓','高原魔女'],'https://s4.anilist.co/file/anilistcdn/character/large/b135592-jmc9t87YdKAZ.png'],
['持续狩猎史莱姆三百年',135593,'莱卡',['Laika','ライカ','龙族'],'https://s4.anilist.co/file/anilistcdn/character/large/b135593-czzOPefhnjw5.png'],
['持续狩猎史莱姆三百年',135594,'哈鲁卡拉',['Halkara','ハルカラ','精灵'],'https://s4.anilist.co/file/anilistcdn/character/large/b135594-ilPDl72ZLtjj.png'],
// 熊熊勇闯异世界
['熊熊勇闯异世界',156323,'优奈',['Yuna','ユナ','熊装'],'https://s4.anilist.co/file/anilistcdn/character/large/b156323-JZbBp6YPZhmN.png'],
['熊熊勇闯异世界',156324,'菲娜',['Fina','フィナ'],'https://s4.anilist.co/file/anilistcdn/character/large/b156324-ZUNzdQ5BGOVK.png'],
// 黑之召唤师
['黑之召唤师',264355,'凯尔文',['Kelvin Celsius','Kelvin'],'https://s4.anilist.co/file/anilistcdn/character/large/b264355-vlje2vtFOM0B.png'],
['黑之召唤师',264356,'艾菲尔',['Efil','エフィル'],'https://s4.anilist.co/file/anilistcdn/character/large/b264356-ZZo7OqbQbUv4.png'],
]
let c=0
for(const e of D){
  let id,name,a,nk,img,dsc=[],tr=[],v=null
  if(typeof e[0]==='string'){a=e[0];id=e[1];name=e[2];nk=e[3];img=e[4]}else{id=e[0];const o=e[1];name=o.n;a=o.a;nk=o.nk;img=o.img;dsc=o.dsc||'';tr=o.tr||[];v=o.v}
  const data={id,name,anime_title:a,image:img,nicknames:nk,traits:tr,description:dsc}
  if(!img.startsWith('http'))data.image='https://s4.anilist.co/file/anilistcdn/character/large/b'+id+'.jpg'
  const{error}=await supabase.from('characters').upsert(data,{onConflict:'id'})
  if(v){await supabase.from('voice_actors').delete().eq('character_id',id);for(const[nm,im]of v)await supabase.from('voice_actors').insert({character_id:id,name:nm,image:im||'',language:'日语'})}
  process.stdout.write(error?'❌':'+');c++
}
console.log('\n重建search_text...')
const{data:chs}=await supabase.from('characters').select('id,name,anime_title,nicknames,traits,voice_actors(name)')
for(const x of chs||[]){const s=[x.name,x.anime_title||'',...(x.nicknames||[]),...(x.traits||[]),...(x.voice_actors||[]).map(v=>v.name)].join(' ');await supabase.from('characters').update({search_text:s}).eq('id',x.id)}
console.log('✅',c)
