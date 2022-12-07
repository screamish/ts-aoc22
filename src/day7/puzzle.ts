import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'

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

type SimpleFile = {
    name: string
    size: number
}

type MyDir = {
    name: string
    contents: (MyDir | SimpleFile)[]
}

type Command = cd | 'ls'
type cd = { path: string }

type ParseState =
    'AwaitingOutputForLS' |
    'Ready'

type Dirname = string
type LineParseResult =
    SimpleFile |
    Dirname |
    Command

const parseLine = (i: string) : LineParseResult => {
    const cdPattern = /\$ cd ([\w\.\/]+)/
    if (cdPattern.test(i)) {
        const [, path] = cdPattern.exec(i) || []
        return { path: path || 'cd missing path' } as cd
    }
    const lsPattern = /\$ ls/
    if (lsPattern.test(i)) {
        return 'ls'
    }
    const filePattern = /(\d+)\s([\w\.]+)/
    if (filePattern.test(i)) {
        const [, size, name] = filePattern.exec(i) || []
        return { name: name || 'file missing name', size: size || -1 } as SimpleFile
    }
    const dirPattern = /dir (\w+)/
    if (dirPattern.test(i)) {
        const [, path] = dirPattern.exec(i) || []
        return path || 'dir missing path' as Dirname
    }
    throw new Error(`parse error on line: ${i}`);
}

const parse = (input: string) : MyDir => {
    const x = pipe(
        input.split('\n'),
        A.reduce({ state: 'Ready', dir: { name: 'root', contents: [] } as MyDir }, 
            ({ state, dir }, line) => {
                const lineResult = parseLine(line)
                console.log(`line: ${line} | ${JSON.stringify(lineResult)}`)
                return { state, dir }
                // switch (state) {
                //     case 'Ready':
                        
                //         break
                //     case 'AwaitingOutputForLS':

                //         break
                
                //     default:
                //         break
                // }
            }),
        (x => x.dir )
    )
    return x
}

export const go = (input:string) : number => {
    const dir = parse(input)
    return 0
}

export const go2 = (input:string) : number => {
    return 0
}