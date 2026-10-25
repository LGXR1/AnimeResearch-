import { groups as sourceGroups } from './new_anime_curated_batch27_part1.js'

// 《武士阿非》的 AniList 角色快照未收录日语配音，无法按本库规则核实日配与头像，暂缓整部。
// 卡莫是非人类配角，AniList 没有声优条目；保留该作品其余已核实角色。
export const groups = sourceGroups
  .filter(group => group.mediaId !== 1292)
  .map(group => group.mediaId === 20475
    ? { ...group, characters: group.characters.filter(character => character.id !== 88466), excluded: ['卡莫：AniList未提供声优记录'] }
    : group)
