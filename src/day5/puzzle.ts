import { A, S, O, G, F, pipe, Option, N } from '@mobily/ts-belt'
import { Stack, Range } from 'immutable'

//     [D]    
// [N] [C]    
// [Z] [M] [P]
const parseStack = (stack:string) : Stack<string>[] => {
    const stacks = new Array<Stack<string>>()
    pipe(
        stack.split('\n'),
        A.reverse,
        A.forEach((line) => {
            const l = pipe(
                line.split(''),
                A.splitEvery(4),
                A.map(c => c[1] || ' '),
                A.forEachWithIndex((i, c) : Stack<string> =>
                    stacks[i] = c === ' '
                        ? (stacks[i] || Stack())
                        : (stacks[i] || Stack()).unshift(c)
                )
            )
        })
    )
    return stacks
}

const printStacks = (stacks: Stack<string>[]) : void => {
    A.forEachWithIndex(stacks, (i, s) => console.log(`stack ${i} is ${s}`))
}

type Move = {
    quantity: number
    from: number
    to: number
}

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2
const parseMoves = (movesInput:string) : Move[] => {
    const moves = pipe(
        movesInput.split('\n'),
        A.map(line => {
            const [, q, , f, , t] = line.split(' ')
            return {
                quantity: Number(q),
                from: Number(f),
                to: Number(t)
            } as Move
        }),
        F.toMutable
    )
    return moves 
}

const performMovesOnStacks = (stacks: Stack<string>[], moves: Move[]) : Stack<string>[] => {
    A.forEach(moves, move => {
        const from = move.from - 1
        const to = move.to - 1
        pipe(
            Range(1, move.quantity + 1).toArray(),
            A.forEach(m => {
                // console.log(`iter ${m} for move ${JSON.stringify(move)}`)
                const crate = stacks[from]?.first() || '{BUG}'
                stacks[from] = (stacks[from] || Stack()).shift()
                stacks[to] = (stacks[to] || Stack()).unshift(crate)
            })
        )
        // console.log(`after move ${JSON.stringify(move)}`)
        // printStacks(stacks)
    })
    return stacks
}

const getTopCrate = (stacks: Stack<string>[]) : string => {
    return pipe(
        stacks,
        A.map(s => s.first() || '_'), // _ for empty stack, helpful in debugging
        A.join('')
    )
}

export const inner = (f: (stacks: Stack<string>[], moves: Move[]) => Stack<string>[] ) => 
                            (stackInput:string, movesInput:string) : string => {
    const stacks = parseStack(stackInput)
    const moves = parseMoves(movesInput)
    // console.log(moves)

    // console.log(`Stacks at the start`)
    // printStacks(stacks)

    const result = f(stacks, moves)

    // console.log(`Stacks after performing moves`)
    // printStacks(stacks)

    return getTopCrate(result)
}

export const go = inner(performMovesOnStacks)

// Hilarious. the part 2 today made the fact that I chose Stacks a complete waste of time!
// Ah well, it wasn't too hard to bust out of the Stacks back into Arrays to actually do
// the work for this part.
const performMovesOnStacks9001 = (stacks: Stack<string>[], moves: Move[]) : Stack<string>[] => {
    A.forEach(moves, move => {
        const from = move.from - 1
        const to = move.to - 1

        const moving = (stacks[from] || Stack()).toArray()
        const [toMove, remain] = F.toMutable(O.getExn(A.splitAt(moving, move.quantity)))

        stacks[to] = (stacks[to] || Stack()).unshift(...toMove)
        stacks[from] = Stack(remain)
        // console.log(`after move ${JSON.stringify(move)}`)
        // printStacks(stacks)
    })
    return stacks
}

export const go2 = inner(performMovesOnStacks9001)