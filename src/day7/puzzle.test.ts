import test from 'ava'
import { go, go2 } from './puzzle'
import { readFileSync } from 'fs'
import path from 'path'

let input = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`.trim()

test('can pass the spec in the instructions for part 1', async t => {
  let result = go(input)

  t.is(result, 95437)
})

const file = readFileSync(path.join(__dirname,'./data.txt'), 'utf-8').trim();

test('can get answer for part 1', async t => {
    let result = go(file)
    t.is(result, 1086293)
})

test('can pass the spec in the instructions for part 2', async t => {
  let result = go2(input)

  t.is(result, 24933642)
})

test('can get answer for part 2', async t => {
    let result = go2(file)
    t.is(result, 0)
})