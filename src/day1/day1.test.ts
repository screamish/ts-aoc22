import test from 'ava'
import { mostCalories, mostCaloriesTop3 } from './day1'
import { readFileSync } from 'fs';

test.before(async t => {
  console.log('Day1 tests!')
})

let input = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`.trim()

test('can find which elf has the most calories', async t => {


  let result = mostCalories(input)

  t.is(result, 24000)
})

const file = readFileSync('./src/day1/data.txt', 'utf-8');

test('can get answer for part 1', async t => {
    let result = mostCalories(file)
    t.is(result, 0)
})

test('can get the top 3 most calories', async t => {
    let result = mostCaloriesTop3(input)
    t.is(result, 45000)
})

test('can get answer for part 2', async t => {
    let result = mostCaloriesTop3(file)
    t.is(result, 0)
})