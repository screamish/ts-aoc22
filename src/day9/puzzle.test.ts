import test from 'ava'
import { go, go2, keepTailNearHead, Point } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'

let input = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`.trim()

test('can pass the spec in the instructions for part 1', async t => {
  let result = go(input)

  // ..##..
  // ...##.
  // .####.
  // ....#.
  // s###..

  t.is(result, 13)
})

const p = (x:number, y:number) : Point => ({x:x, y:y})
test('can handle diagonal catchup ', async t => {
  let result = keepTailNearHead(p(2,4), p(4,3))

  t.deepEqual(result, p(3,4))
})

const file = readFileSync(path.join(__dirname,'./data.txt'), 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 6354)
})

// test('can pass the spec in the instructions for part 2', async t => {
//   let result = go2(input)

//   t.is(result, 0)
// })

// test('can get answer for part 2', async t => {
//     let result = go2(file)
//     t.is(result, 0)
// })