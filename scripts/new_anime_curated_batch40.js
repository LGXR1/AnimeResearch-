import { groups as reused } from './new_anime_curated_batch39_part5.js'
import { groups as part1 } from './new_anime_curated_batch40_part1.js'
import { groups as part2 } from './new_anime_curated_batch40_part2.js'
import { groups as part3 } from './new_anime_curated_batch40_part3.js'
import { groups as part4 } from './new_anime_curated_batch40_part4.js'
import { groups as part5 } from './new_anime_curated_batch40_part5.js'

export const groups = [...reused, ...part1, ...part2, ...part3, ...part4, ...part5]

if (groups.length !== 30) throw new Error(`本批应有30部动漫，实际为${groups.length}部`)
if (new Set(groups.map(group => group.mediaId)).size !== 30) throw new Error('本批存在重复动漫')
if (groups.reduce((count, group) => count + group.characters.length, 0) !== 150) {
  throw new Error('本批应有150位角色')
}
