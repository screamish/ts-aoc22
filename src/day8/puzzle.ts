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

export const go2 = (input:string) : number => {
    return 0
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
