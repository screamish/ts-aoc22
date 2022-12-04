import test from 'ava'
import { go, go2 } from './day4'
import { readFileSync } from 'fs';

test.before(async t => {
  console.log('Day4 tests!')
})

let input = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`.trim()

test('can find completely overlapping ranges', async t => {
  let result = go(input)

  t.is(result, 2)
})

const file = readFileSync('./src/day4/data.txt', 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 459)
})

test('can find partially overlapping ranges', async t => {
  let result = go2(input)

  t.is(result, 4)
})

test('can get answer for part 2', async t => {
    let result = go2(file)
    t.is(result, 779)
})