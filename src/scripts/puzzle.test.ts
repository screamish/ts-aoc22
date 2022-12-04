import test from 'ava'
import { go, go2 } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'

let input = `

`.trim()

test('can pass the spec in the instructions for part 1', async t => {
  let result = go(input)

  t.is(result, -1)
})

const file = readFileSync(path.join(__dirname,'./data.txt'), 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 0)
})

test('can pass the spec in the instructions for part 2', async t => {
  let result = go2(input)

  t.is(result, -1)
})

test('can get answer for part 2', async t => {
    let result = go2(file)
    t.is(result, 0)
})