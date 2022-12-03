import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'
import { Set } from 'immutable';

const sharedItem = (items:string) : string => {
  const [a, b] = S.splitAt(items, items.length / 2)
  return Set.of(...a.split('')).intersect(Set.of(...b.split(''))).join('')
}

const itemPriority = (item:string) : number => {
  // Lowercase item types a through z have priorities 1 through 26.
  // Uppercase item types A through Z have priorities 27 through 52.
  // > "a".charCodeAt(0)
  // 97
  // > "z".charCodeAt(0)
  // 122
  // > "A".charCodeAt(0)
  // 65
  // > "Z".charCodeAt(0)
  // 90
  const code = item.charCodeAt(0)
  return code < 97 ? code - 65 + 27 : code - 96
}

export const sumPriorities = (input: string) : number => {
  const rucksacks = input.split('\n')
  const sharedItems = A.map(rucksacks, sharedItem)
  // console.log(sharedItems)
  const itemPriorities = A.map(sharedItems, itemPriority)
  // console.log(itemPriorities)
  return A.reduce(itemPriorities, 0, (sum, n) => sum + n)
}