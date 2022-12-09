import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'
import { fromJS, Set } from 'immutable'

type Direction = 'R' | 'U' | 'L' | 'D'
type Instruction = {
    dir: Direction
    steps: number
}
export const parse = (input: string) : Instruction => {
    const pattern = /(\w) (\d+)/
    const [, dir, steps] = pattern.exec(input) || []
    return { dir: dir as Direction, steps: Number(steps) } as Instruction
}

export type Point = { x: number, y: number }

export const moveHead = (pos: Point, dir: Direction) : Point => {
    switch (dir) {
        case 'R':
            return {...pos, x: pos.x + 1}
        case 'U':
            return {...pos, y: pos.y + 1}
        case 'L':
            return {...pos, x: pos.x - 1}
        case 'D':
            return {...pos, y: pos.y - 1}
    
        default:
            throw new Error(`Unexpected direction: ${JSON.stringify(dir)}`)
    }
}

// computes the position the tail needs to be in to maintain rope physics.
// this may mean it stays in the same position
export const keepTailNearHead = (head: Point, tail: Point) : Point => {
    // same spot
    if ( head.x === tail.x && head.y === tail.y ) {
        return tail
    }
    // only move if further than 1 away in at least 1 dimension
    if ( Math.abs(head.y - tail.y) < 2 && Math.abs(head.x - tail.x) < 2) {
        return tail
    }

    // same row
    if ( head.x === tail.x) {
        const newY = (tail.y < head.y) ? head.y - 1 : head.y + 1
        return {...tail, y: newY }
    }
    // same column
    if ( head.y === tail.y) {
        const newX = (tail.x < head.x) ? head.x - 1 : head.x + 1
        return {...tail, x: newX }
    }
    // diagonal

    // get larger gap
    const xFurther = Math.abs(head.x - tail.x) > Math.abs(head.y - tail.y)
    if (xFurther) {
        // catch up on the X axis, so move to same y
        const newX = (tail.x < head.x) ? head.x - 1 : head.x + 1
        return {y: head.y, x: newX }
    }
    // catch up on the Y axis, so move to same x
    const newY = (tail.y < head.y) ? head.y - 1 : head.y + 1
    return {y: newY, x: head.x }
}

// ARGH cannot work out Sets with custom types for keys, equality checking seems borked, so going with strings ugh
type Acc = { tailVisited: Set<string>, head: Point, tail: Point }
const zero : Acc = { tailVisited: Set<string>(['0,0']), head: {x:0, y:0}, tail: {x:0, y:0}}
const pp = (p:Point) : string => `${p.x},${p.y}`

export const go = (input:string) : number => {
    // parse
    const instrs = A.map(input.split('\n'), parse)
    // console.log(`INPUT: ${JSON.stringify(instrs)}`)
    // for each instruction
    const result = pipe(
        instrs,
        A.reduce(zero, (acc: Acc, instr: Instruction) => {
            const visited = acc.tailVisited.asMutable()
            let head = acc.head
            let tail = acc.tail
            for (let step = 0; step < instr.steps; step++) {
                head = moveHead(head, instr.dir)
                tail = keepTailNearHead(head, tail)
                visited.add(`${tail.x},${tail.y}`)
                // console.log(`STEP: ins:[${instr.dir} ${instr.steps}] step:${step} head:${pp(head)} tail:${pp(tail)}`)
            }
            return { tailVisited: visited, head: head, tail: tail }
        })
    )
      // for each step
        // compute new H position
        // compute new T position (may not move)
        // add T position to visited
    // console.log(`TAIL VISITED: ${JSON.stringify(result.tailVisited.valueSeq().toArray(), null, 2)}`)
    return result.tailVisited.count()
}

export const go2 = (input:string) : number => {
    return 0
}










///// THE BUGS THAT NIGHTMARES ARE MADE OF! or... why we TDD things haha

export const moveHeadWithALovelyBug = (pos: Point, dir: Direction) : Point => {
    switch (dir) {
        case 'R':
            return {...pos, x: pos.x + 1}
        case 'U':
            return {...pos, y: pos.y + 1}
        case 'L':
            return {...pos, x: pos.x - 1}
        case 'D':
            return {...pos, x: pos.y - 1}
    
        default:
            throw new Error(`Unexpected direction: ${JSON.stringify(dir)}`)
    }
}