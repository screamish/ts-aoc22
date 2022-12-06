import test from 'ava'
import { go, go2 } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'

test('can pass the spec in the instructions for part 1 a', async t => {
  let result = go(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`)
  t.is(result, 7)
})

test('can pass the spec in the instructions for part 1 b', async t => {
  let result = go(`bvwbjplbgvbhsrlpgdmjqwftvncz `)
  t.is(result, 5)
})

test('can pass the spec in the instructions for part 1 c', async t => {
  let result = go(`nppdvjthqldpwncqszvftbrmjlhg`)
  t.is(result, 6)
})


test('can pass the spec in the instructions for part 1 d', async t => {
  let result = go(`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`)
  t.is(result, 10)
})

test('can pass the spec in the instructions for part 1 e', async t => {
  let result = go(`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`)
  t.is(result, 11)
})

const file = readFileSync(path.join(__dirname,'./data.txt'), 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 1134)
})

test('can pass the spec in the instructions for part 2', async t => {
  let result = go2(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`)

  t.is(result, 19)
})

test('can get answer for part 2', async t => {
    let result = go2(file)
    t.is(result, 2263)
})