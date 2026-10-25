import { groups as part1 } from './new_anime_curated_batch37_part1.js'
import { groups as part2 } from './new_anime_curated_batch37_part2.js'
import { groups as part3 } from './new_anime_curated_batch37_part3.js'
import { groups as part4 } from './new_anime_curated_batch37_part4.js'
import { groups as part5 } from './new_anime_curated_batch37_part5.js'
import { groups as part6 } from './new_anime_curated_batch37_part6.js'
import { groups as part7 } from './new_anime_curated_batch37_part7.js'

export const groups = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7]
if (groups.length !== 30 || new Set(groups.map(x => x.mediaId)).size !== 30 || groups.some(x => x.characters.length < 5)) throw new Error('本批作品数量不完整')
