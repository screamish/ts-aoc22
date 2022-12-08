import test from 'ava'
import { go,
  visible,
  visible2,
  go2,
  inputToMatrix,
  walk,
  down,
  walkPluck,
  walkIdentity,
  flip,
  walkRight,
  walkUp,
  MatrixCell } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'
import { Map } from 'immutable'

let input = `
30373
25512
65332
33549
35390
`.trim()

test('can get visible for a single row a', async t => {
  let result = visible('30373'.split('').map(Number))

  t.deepEqual(result.toArray(), [[0,3], [3, 7]])
})

test('can get visible for a single row new method', async t => {
  let result = visible2(inputToMatrix('30373')[0] || [])

  t.deepEqual(result.toArray(), [[0,0], [0,3]])
})

test('can do a single line b', async t => {
  let result = visible('123352'.split('').map(Number))

  t.deepEqual(result.toArray(), [[0,1], [1, 2], [2, 3], [4, 5]])
})

const c = (x: number, y: number, d: number) : MatrixCell => ({ coord: [x, y], data: d } as MatrixCell)

test('can matrix represent the input data', async t => {
  let alphaInput = `
123
456
  `.trim()
  let result = inputToMatrix(alphaInput)

  t.deepEqual(result, [
    [ c(0,0,1),
      c(0,1,2),
      c(0,2,3),
    ],
    [ c(1,0,4),
      c(1,1,5),
      c(1,2,6),
    ],
  ])

})

let small = [
  [1,2],
  [4,5],
  [7,8]
]

test('can walk a matrix from the right', async t => {
  let result = walkRight(small)

  t.deepEqual(result, [
    [2,1],
    [5,4],
    [8,7]
  ])
})

test('can walk a matrix from the bottom', async t => {
  let result = walkUp(small)

  t.deepEqual(result, [
    [7,4,1],
    [8,5,2]
  ])
})

test('can walk a matrix from the top', async t => {
  let result = flip(small)

  t.deepEqual(result, [
    [1,4,7],
    [2,5,8]
  ])
})

test('can pass the spec in the instructions for part 1', async t => {
  let result = go(input)

  // 21 trees visible from outside the grid
  t.is(result, 21)
})

const file = readFileSync(path.join(__dirname,'./data.txt'), 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 1840)
})

// test('can pass the spec in the instructions for part 2', async t => {
//   let result = go2(input)

//   t.is(result, 0)
// })

// test('can get answer for part 2', async t => {
//     let result = go2(file)
//     t.is(result, 0)
// })