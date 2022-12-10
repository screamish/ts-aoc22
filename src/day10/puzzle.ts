import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'
import _ from 'lodash'

type Addx = { val: number }
type Command = 'Noop' | Addx

const parse = (line:string) : Command => {
    if (line === 'noop')
        return 'Noop'
    const pattern = /addx (-?\d+)/
    const [, val] = pattern.exec(line) || []
    return { val: Number(val) }
}

type Result = {
    val: number,
    cycles: number
}
const exec = (c: Command, register: number) : Result => {
    if (c === 'Noop')
        return { val: register, cycles: 1 }
    // addx
    return { val: register + c.val, cycles: 2 }
}

type Acc = {
    register: number,
    outputCycles: number[]
}

export const allCycles = (input:string) : number[] => {
    const zero : Acc = { register: 1, outputCycles: [] }
    const result = pipe(
        input.split('\n'),
        A.map(parse),
        A.reduce(zero, ({ register, outputCycles }, c) => {
            const res = exec(c, register)
            return { register: res.val, outputCycles: outputCycles.concat(Array(res.cycles).fill(register))}
        })
    )
    return result.outputCycles.concat([result.register])
}

// no streaming at all today... memory hungry, inefficient, but easy to bang out quickly
export const go = (input:string) : number => {
    const cycles = allCycles(input)
    const peeks = [20, 60, 100, 140, 180, 220]
    const result = pipe(
        peeks,
        A.map(p => {
            const val = A.getUnsafe(cycles, p - 1)
            return val * p
        }),
        A.reduce(0, (a, b) => a + b)
    )
    return result
}

// so inefficient, but it works!
export const go2 = (input:string) : string => {
    const cycles = allCycles(input).slice(0, -1)
    const result = pipe(
        A.splitEvery(cycles, 40),
        A.map((line) => {
            const output : string[] = []
            for (let i = 0; i < line.length; i++) {
                const val = A.getUnsafe(line, i)
                if ((i >= val - 1) && (i <= val + 1))
                    output.push('#')
                else
                    output.push('.')
            }
            return output.join('')
        }),
        A.join('\n')
    )
    return result
}