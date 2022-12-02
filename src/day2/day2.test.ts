import test from 'ava'
import { score } from './day2'
import { readFileSync } from 'fs';

test.before(async t => {
  console.log('Day2 tests!')
})

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

// test('can get answer for part 1', async t => {
//     let result = score(file)
//     t.is(result, 0)
// })
