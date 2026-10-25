import { groups as part1 } from './new_anime_curated_batch22_part1.js'
import { groups as originalPart2 } from './new_anime_curated_batch22_part2.js'
import { groups as killOfLove } from './new_anime_curated_batch22_kill_of_love.js'
import { groups as part3 } from './new_anime_curated_batch22_part3.js'

const part2 = originalPart2.map(group => group.mediaId === 127050 ? killOfLove[0] : group)
export const groups = [...part1, ...part2, ...part3]
