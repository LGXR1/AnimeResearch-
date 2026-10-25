import { groups as part1 } from './new_anime_curated_batch41_part1.js'
import { groups as part2 } from './new_anime_curated_batch41_part2.js'
import { groups as part3 } from './new_anime_curated_batch41_part3.js'
import { groups as part4 } from './new_anime_curated_batch41_part4.js'
import { groups as part5 } from './new_anime_curated_batch41_part5.js'

export const groups = [...part1, ...part2, ...part3, ...part4, ...part5]
if (groups.length !== 30) throw new Error(`本批应有30部动漫，实际为${groups.length}部`)
if (new Set(groups.map(group => group.mediaId)).size !== groups.length) throw new Error('本批存在重复动漫')
const ids = groups.flatMap(group => group.characters.map(character => character.id))
if (new Set(ids).size !== ids.length) throw new Error('本批存在重复角色ID')
if (groups.some(group => group.characters.length < 5)) throw new Error('每部动漫至少需要5位角色')
console.log(`资料完成：${groups.length}部作品、${ids.length}位角色`)
