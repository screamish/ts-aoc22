import test from 'ava'
import { score, scorePart2 } from './day2'
import { readFileSync } from 'fs';

let input = `
A Y
B X
C Z
`.trim()

test('can score a strategy', async t => {
  let result = score(input)

  t.is(result, 15)
})

const file = readFileSync('./src/day2/data.txt', 'utf-8');

test('can get answer for part 1', async t => {
    let result = score(file)
    t.is(result, 13052)
})

test('can score a strategy part 2', async t => {
  let result = scorePart2(input)

  t.is(result, 12)
})

test('can get answer for part 2', async t => {
    let result = scorePart2(file)
    t.is(result, 13693)
})
