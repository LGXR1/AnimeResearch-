import { groups as part1 } from './new_anime_curated_batch38_part1.js'
import { groups as part2 } from './new_anime_curated_batch38_part2.js'
import { groups as part3 } from './new_anime_curated_batch38_part3.js'
import { groups as part4 } from './new_anime_curated_batch38_part4.js'

export const groups = [...part1, ...part2, ...part3, ...part4]

if (groups.length !== 20) throw new Error(`预期 20 部动漫，实际 ${groups.length} 部`)
const characterCount = groups.reduce((total, group) => total + group.characters.length, 0)
if (characterCount !== 121) throw new Error(`预期 121 位角色，实际 ${characterCount} 位`)
