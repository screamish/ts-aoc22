import { A, S, O, D, F, pipe, flow, Option, N } from '@mobily/ts-belt'
import { Map, Set, Range, Seq } from 'immutable'
import _ from 'lodash'

export const visible = (input:number[]) : Map<number, number> => {
    // const t = Map([[1,2], [2,3]])
    const zero = { result: Map<number, number>(), max: -1 }
    return pipe(
        input,
        A.reduceWithIndex(zero, ({ result, max }, height, index) => {
            return height > max ?
                { result: result.set(index, height), max: height }
              : { result, max }
        }),
        (r => r.result)
    )
}

export const visible2 = (input:MatrixCell[]) : Set<Coord> => {
    // const t = Map([[1,2], [2,3]])
    const zero = { result: Set<Coord>(), max: -1 }
    return pipe(
        input,
        A.reduce(zero, ({ result, max }, cell) => {
            return cell.data > max ?
                { result: result.add(cell.coord), max: cell.data }
              : { result, max }
        }),
        (r => r.result)
    )
}

export type Coord = [number, number]
export type MatrixCell = {
    coord: Coord 
    data: number
}
export type MatrixWithData = MatrixCell[][]

export const inputToMatrix = (input: string) : MatrixWithData => {
    return pipe(
        input.split('\n'),
        A.mapWithIndex((x, line) => {
            return pipe(
                line.split(''),
                A.mapWithIndex((y, height) => {
                    return { coord: [x,y], data: Number(height) } as MatrixCell
                }),
                F.toMutable
            )
        }),
        F.toMutable
    )
}

export const flip = <T>(data: T[][]) : T[][] => {
    return _.zip(...data) as T[][]
}

export const reverseRows = <T>(data: T[][]) : T[][] => {
    return pipe(
        data,
        A.map(row => F.toMutable(A.reverse(row))),
        F.toMutable
    )
}

export const walkDown = flip
export const walkUp = flow(flip, reverseRows)
export const walkRight = reverseRows

export const allVisible = (data: MatrixWithData) : Set<Coord> => {
    const rows = pipe(
        data,
        A.map(visible2),
        F.toMutable
    )
    return Set.union(rows)
}

export const go = (input:string) : number => {
    // get visible trees (in x,y co-ords) for each direction
    const data = inputToMatrix(input)
    const visibleLeft = allVisible(data)
    const visibleRight = allVisible(walkRight(data))
    const visibleDown = allVisible(walkDown(data))
    const visibleUp = allVisible(walkUp(data))

    // union those sets of co-ords
    const result = visibleLeft.union(visibleRight).union(visibleDown).union(visibleUp)
    return result.count()
}

///// part 2

// return the scenery score looking along the direction of the array for every coord
// ARRRRRRRRGH I have nfi how these Maps treat tuple types for equality but it don't seem like what I expect
// back to strings it is

const c2s = (coord: Coord) : string => `${coord[0]}.${coord[1]}`

// I really bashed my head against this for ages. What a waste of effort. There's definitely bugs in here
// Something to do with the ordering in the array processing gets out of whack I think.
export const sceneryScoreFunctional = (input:MatrixCell[]) : Map<string, number> => {
    // const t = Map([[1,2], [2,3]])
    const zero = Map<string, number>()
    return pipe(
        input,
        A.reduceWithIndex(zero, (acc: Map<string, number>, cell, i) => {
            const remainder = pipe(input, A.drop(i + 1))
            const v = pipe(remainder, A.takeWhile(t => t.data < cell.data))
            // console.log(`The view for:${cell.coord} of height ${cell.data} is: ${JSON.stringify(remainder)}`)
            const score = A.length(v) + (A.isEmpty(remainder) ? 0 : 1)
            if(cell.coord[0] === 3 && cell.coord[1] === 2) {
                console.log(`ROW FOR SCORING: ${JSON.stringify(input)}`)
                console.log(`REMAINDER:${JSON.stringify(remainder)}`)
                console.log(`SCORE for:${cell.coord} score:${score} height:${cell.data} view: ${JSON.stringify(v)}`)
                console.log(`-------------`)
            }
            return acc.set(c2s(cell.coord), score)
        }),
    )
}

// In the end this nasty old for loop version came together very quickly and easily
export const sceneryScore = (input:MatrixCell[]) : Map<string, number> => {
    // const t = Map([[1,2], [2,3]])
    const result = Map<string, number>().asMutable()
    for (let index = 0; index < input.length; index++) {
        const cell = A.getUnsafe(input, index)
        let score = 0
        for (let i2 = index + 1; i2 < input.length; i2++) {
            const n = input[i2]
            if (n === undefined) {
                break
            }
            score++
            if (cell.data <= n.data) {
                break
            }
        }
        result.set(c2s(cell.coord), score)
    }
    return result
}

export const allScores = (data: MatrixWithData) : Map<string, number> => {
    const rows = pipe(
        data,
        A.map(sceneryScore),
        F.toMutable
    )
    return Map<string, number>().merge(...rows)
}

export const merger = (oldVal: number, newVal: number, key: any) => {
    // console.log(`MERGING: key: ${key}, old:${oldVal} new:${newVal}`)
    return oldVal * newVal
}

export const go2 = (input:string) : number => {
    // get tree scenery scores (in x,y co-ords) for each direction
    const data = inputToMatrix(input)
    const left = allScores(data)
    const right = allScores(walkRight(data))
    const down = allScores(walkDown(data))
    const up = allScores(walkUp(data))

    // union those sets of co-ords
    const result = left.mergeWith(merger, right).mergeWith(merger, down).mergeWith(merger, up)
    // console.log(`FINAL RESULT: ${JSON.stringify(result.valueSeq().toArray(), null, 2)}`)
    return result.valueSeq().max() || -1
}






































/////// the graveyard of broken dreams and forgotten garbage

type Order = {
    outer: Seq.Indexed<number>
    inner: Seq.Indexed<number>
}

// export const flip = <T>(data: number[][]) : number[][] => {
//     const rows = data.length
//     const columns = A.getUnsafe(data, 0).length
//     const m = new Matrix(rows, columns, data)
//     return m.transpose().values
// }

export const down = (xSize: number, ySize: number) : Order => {
    return {
        outer: Range(xSize, 0),
        inner: Range(0, ySize),
    }
}

export const walk = <T, U>(f: (outer: number, inner: number, data: T[][]) => U) => 
                (data: T[][], setOrder: (x: number, y: number) => Order) : U[][] => {
    const order = setOrder(A.getUnsafe(data, 0).length, data.length)
    return pipe(
        order.outer.toArray(),
        A.map(outer => {
            return pipe(
                order.inner.toArray(),
                A.map(inner => f(outer, inner, data)),
                F.toMutable
            )
        }),
        F.toMutable
    )
}

const pluck = <T>(outer: number, inner: number, data: T[][]) => {
        return A.getUnsafe(A.getUnsafe(data, outer), inner)
    }


// export const walkPluck = (forest: number[][]) : number[][] => {
export const walkPluck = walk(pluck)
export const walkIdentity = walk((outer, inner, data) => [outer, inner])
