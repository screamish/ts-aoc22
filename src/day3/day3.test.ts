import test from 'ava'
import { sumPriorities, sumPrioritiesOfBadges } from './day3'
import { readFileSync } from 'fs';

let input = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`.trim()

test('can sum the priorities of shared items', async t => {
  let result = sumPriorities(input)

  t.is(result, 157)
})

const file = readFileSync('./src/day3/data.txt', 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = sumPriorities(file)
    t.is(result, 7742)
})

test('can sum the priorities of badges', async t => {
  let result = sumPrioritiesOfBadges(input)

  t.is(result, 70)
})

test('can get answer for part 2', async t => {
    let result = sumPrioritiesOfBadges(file)
    t.is(result, 2276)
})
