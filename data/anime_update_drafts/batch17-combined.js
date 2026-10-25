import { groups as firstHalf } from './batch17-part1.js'
import { groups as secondHalf } from './batch17-part2.js'
import { groups as missingFive } from './batch17-part3.js'

export const groups = [...firstHalf, ...secondHalf, ...missingFive]

// Keep search traits independent of other character names in the same title.
for (const group of groups) {
  const names = group.characters.map(x => x.name).filter(x => x.length > 1).sort((a, b) => b.length - a.length)
  for (const character of group.characters) {
    character.traits = [...new Set(character.traits.map(trait => {
      let result = trait
      for (const name of names) if (name !== character.name) result = result.replaceAll(name, '同伴')
      return result
    }))]
  }
}
