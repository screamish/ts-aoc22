import { A, S, O, D, F, pipe, Option, N } from '@mobily/ts-belt'
import { stringify } from 'querystring'
import _ from 'lodash'
import crypto from 'crypto'

// $ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k

type MyDir = any // Record<string, SimpleFile | ?????????

type ParseState = 'AwaitingLs' | 'Ready'

type Dirname = string
type Filename = string
type Filesize = number
type LineParseResult =
    { kind: 'file', name: Filename, size: Filesize } |
    { kind: 'dir', dir: Dirname } |
    { kind: 'ls' } |
    { kind: 'cd', path: string }

const parseLine = (i: string) : LineParseResult => {
    const cdPattern = /\$ cd ([\w\.\/]+)/
    if (cdPattern.test(i)) {
        const [, path] = cdPattern.exec(i) || []
        return { kind: 'cd', path: path || 'cd missing path' } as LineParseResult
    }
    const lsPattern = /\$ ls/
    if (lsPattern.test(i)) {
        return { kind: 'ls' } as LineParseResult
    }
    const filePattern = /(\d+)\s([\w\.]+)/
    if (filePattern.test(i)) {
        const [, size, name] = filePattern.exec(i) || []
        // avoid collision with the lodash path syntax - ugh, poor choices
        const sanitisedName = (name || 'file missing name').replace('.', '-')
        return { kind: 'file', name: sanitisedName , size: Number(size) || -1 } as LineParseResult
    }
    const dirPattern = /dir (\w+)/
    if (dirPattern.test(i)) {
        const [, path] = dirPattern.exec(i) || []
        return { kind: 'dir', dir: path || 'dir missing path' as Dirname } as LineParseResult
    }
    throw new Error(`parse error on line: ${i}`);
}

const newDir = () : MyDir => ({ 'root': {} })

type Cwd = { path: string[] }
type Acc = {
    state: ParseState
    cwd: Cwd
    dir: MyDir
}
const executeLine = (acc: Acc, line: LineParseResult) : Acc => {
    const {state, cwd, dir} = acc
    // console.log(`acc: ${JSON.stringify(acc)}, line: ${JSON.stringify(line)}`)
    switch (state) {
        case 'Ready':
            // console.log(`PROCESSING LINE: ${JSON.stringify(line)}`)
            if(line.kind === 'cd') {
                    // console.log(`EXEC: cd with ${JSON.stringify(acc)}`)
                    const path = line.path
                    if (path === '..') {
                        cwd.path.pop()
                    } else if (path === '/') {
                        cwd.path = ['root']
                    } else {
                        cwd.path.push(path)
                    }
                    return acc
            }
            if(line.kind === 'file') {
                    const filePath = cwd.path.join('.') + '.' + line.name
                    // console.log(`FILE: path: ${filePath}, name:${line.name}`)
                    _.set(dir, filePath, line.size)
                    // console.log(`NEWDIR: ${JSON.stringify(dir)}`)
                    return acc
            }
            switch (line.kind) {
                // case 'ls':
                //     console.log(`exec: ls with ${JSON.stringify(acc)}`)
                //     return { ...acc, state: 'AwaitingLs' }
                // case 'cd':
                //     console.log(`exec: cd with ${JSON.stringify(acc)}`)
                //     const path = line.path
                //     if (path === '..') {
                //         cwd.path.pop()
                //     } else if (path === '/') {
                //         cwd.path = []
                //     } else {
                //         cwd.path.push(path)
                //     }
                //     return { state: 'Ready', dir, cwd }
                //     // console.log()
                // case 'file':
                    // const filePath = cwd.path.join('.')
                    // const dir1 = _.update(dir, filePath, d => _.set(d, line.name, ({ size: line.size} as SimpleFile)))
                    // return { state, dir: dir1, cwd }
                default:
                    // console.log(`IGNORING: ${JSON.stringify(line)}`)
                    // console.error(`Unexpected input in Ready state, got: ${JSON.stringify(line)}`)
                    break
                }
            break
        case 'AwaitingLs':
            switch (line.kind) {
                // case 'file':
                //     const filePath = cwd.path.join('.')
                //     const dir1 = _.update(dir, filePath, d => _.set(d, line.name, ({ size: line.size} as SimpleFile)))
                //     return { state, dir: dir1, cwd }
                // case 'dir':
                //     console.log(`IGNORING: dir entry for ${line.dir}`)
                //     break
                default:
                    console.error(`Unexpected input in AwaitingLs state, got: ${JSON.stringify(line)}`)
                    break
            }
            break
    
        default:
            console.error(`Unexpected state, got: ${JSON.stringify(acc)}`)
            break
    }
    return { state, dir, cwd }
}

const parse = (input: string) : MyDir => {
    const initialState = {
        state: 'Ready',
        cwd: { path: ['root'], contents: newDir() },
        dir: newDir()
    } as Acc
    const x = pipe(
        input.split('\n'),
        A.map(parseLine),
        // console.log(`line: ${line} | ${JSON.stringify(lineResult)} | state: ${state}`)
        A.reduce(initialState, executeLine),
        (x => x.dir)
    )
    return x
}

type WalkResult = { size: number, subdirs: Record<string, number> }
const walkDir = (dir: any): WalkResult  => {
    const zero: WalkResult = { size: 0, subdirs: D.fromPairs([]) }
    const d = pipe(
        D.toPairs(dir),
        A.reduce(zero, (({ size, subdirs }, [name, entry]) => {
            // console.log(`walk iter name:${name} & entry:${entry}`)
            if (typeof(entry) === 'number') {
                return { size: size + entry, subdirs }
            }
            if (typeof(entry) === 'object') {
                const r = walkDir(entry)
                const obfuscatedName = crypto.randomUUID()
                const newsubdirs = pipe(
                    subdirs,
                    D.set(obfuscatedName, r.size),
                    D.merge(r.subdirs)
                )
                // console.log(`NEW SUBDIRS: ${JSON.stringify(newsubdirs)}`)
                return { size: size + r.size, subdirs: newsubdirs }
            }
            throw new Error(`unexpected entry in walkDir: ${JSON.stringify(entry)}`)
        }))
    )
    return d
}

export const go = (input:string) : number => {
    const dir = parse(input)
    console.log(`DIR: ${JSON.stringify(dir, null, 2)}`)
    const sizes = walkDir(dir)
    console.log(`FLATTENED DIR SIZES: ${JSON.stringify(sizes, null, 2)}`)
    const result = pipe(
        sizes.subdirs,
        D.values,
        A.filter(i => i <= 100000)
    )
    console.log(`FILTERED DIR SIZES: ${JSON.stringify(result, null, 2)}`)
    return _.sum(result)
}

export const go2 = (input:string) : number => {
    const dir = parse(input)
    console.log(`DIR: ${JSON.stringify(dir, null, 2)}`)
    const sizes = walkDir(dir)
    console.log(`FLATTENED DIR SIZES: ${JSON.stringify(sizes, null, 2)}`)
    const spaceToFree = Math.abs(70000000 - 30000000 - sizes.size)
    const result = pipe(
        sizes.subdirs,
        D.values,
        A.filter(i => i > spaceToFree),
        A.sort((a, b) => a - b),
        A.head,
        O.getExn
    )
    return result
}