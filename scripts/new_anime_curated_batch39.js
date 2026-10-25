import { groups as part1 } from './new_anime_curated_batch39_part1.js'
import { groups as part2 } from './new_anime_curated_batch39_part2.js'
import { groups as part3 } from './new_anime_curated_batch39_part3.js'
import { groups as part4 } from './new_anime_curated_batch39_part4.js'

export const groups = [...part1, ...part2, ...part3, ...part4]

if (groups.length !== 20) throw new Error(`本批应有20部动漫，实际为${groups.length}部`)
if (new Set(groups.map(group => group.mediaId)).size !== 20) throw new Error('本批存在重复动漫')
if (groups.reduce((count, group) => count + group.characters.length, 0) !== 105) {
  throw new Error('本批角色数与已核对清单不符')
}
