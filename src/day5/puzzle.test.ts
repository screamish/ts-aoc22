import test from 'ava'
import { go, go2 } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'

let stack = `
    [D]    
[N] [C]    
[Z] [M] [P]
`

let moves = `
move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`.trim()

// test('can pass the spec in the instructions for part 1', async t => {
//   let result = go(stack, moves)

//   t.is(result, 'CMZ')
// })

let biggerStack = `
                [V]     [C]     [M]
[V]     [J]     [N]     [H]     [V]
[G] [G] [F] [S] [D] [H] [B] [R] [S]
`
test('can parse another bigger sparse stack', async t => {
  let result = go(biggerStack, 'move 1 from 1 to 2')

  t.is(result, 'GVJSVHCRM')
})

const stacksFile = readFileSync(path.join(__dirname,'./stacks.txt'), 'utf-8')
const movesFile = readFileSync(path.join(__dirname,'./moves.txt'), 'utf-8')

test('can get answer for part 1', async t => {
  let result = go(stacksFile, movesFile)
  t.is(result, 'JRVNHHCSJ')
})

test('can pass the spec in the instructions for part 2', async t => {
  let result = go2(stack, moves)

  t.is(result, '')
})

test('can get answer for part 2', async t => {
  let result = go2(stack, moves)
  t.is(result, '')
})