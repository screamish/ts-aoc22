import test from 'ava'
import { allCycles, go, go2 } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'

let input = `
noop
addx 3
addx -5
`.trim()

test('can generate a small set of cycles from instructions', async t => {
  let result = allCycles(input)

  t.deepEqual(result, [1,1,1,4,4,-1])
})

let input2 = `
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`.trim()

test('can pass the spec in the instructions for part 1', async t => {
  let result = go(input2)

  t.deepEqual(result, 13140)
})

const file = readFileSync(path.join(__dirname,'./data.txt'), 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 14560)
})

test('can pass the spec in the instructions for part 2', async t => {
  let result = go2(input2)

  const expectedCrtOutput =`
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`.trim()

  t.deepEqual(result, expectedCrtOutput)
})

test('can get answer for part 2', async t => {
    let result = go2(file)
    t.is(result, `
####.#..#.###..#..#.####.###..#..#.####.
#....#.#..#..#.#..#.#....#..#.#..#....#.
###..##...#..#.####.###..#..#.#..#...#..
#....#.#..###..#..#.#....###..#..#..#...
#....#.#..#.#..#..#.#....#....#..#.#....
####.#..#.#..#.#..#.####.#.....##..####.
    `.trim())
})