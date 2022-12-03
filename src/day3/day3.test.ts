import test from 'ava'
import { sumPriorities } from './day3'
import { readFileSync } from 'fs';

test.before(async t => {
  console.log('Day3 tests!')
})

let input = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`.trim()

test('can score a strategy', async t => {
  let result = sumPriorities(input)

  t.is(result, 157)
})

const file = readFileSync('./src/day3/data.txt', 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = sumPriorities(file)
    t.is(result, 7742)
})
