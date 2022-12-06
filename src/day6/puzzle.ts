import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'
import { Record, Set } from 'immutable';

function* windowGenerator<A>(inputArray: A[], size: number) { 
    for(let index = 0; index+size <= inputArray.length; index++) {
      yield inputArray.slice(index, index+size);
    }
}
  
function toWindows<A>(inputArray: A[], size: number) {
    return Array.from(windowGenerator(inputArray, size))
}

export const go = (input:string) : number => {
    const indexed = pipe(
        input.split(''),
        A.mapWithIndex((i, s) : [number, string] => [i, s]),
        F.toMutable
    )
    const firstUnique = pipe(
        toWindows(indexed, 4),
        A.find(window => {
            const vals = pipe(window, A.map(([i, s]) => s), s => Set.of(...s))
            return vals.count() === 4
        })
    )
    const offset = pipe(
        firstUnique,
        O.flatMap(window => A.last(window)),
        O.map(([i, s]) => i + 1),
        O.getExn
    )
    // return 0
    return offset
}

export const go2 = (input:string) : number => {
    const indexed = pipe(
        input.split(''),
        A.mapWithIndex((i, s) : [number, string] => [i, s]),
        F.toMutable
    )
    const firstUnique = pipe(
        toWindows(indexed, 14),
        A.find(window => {
            const vals = pipe(window, A.map(([i, s]) => s), s => Set.of(...s))
            return vals.count() === 14
        })
    )
    const offset = pipe(
        firstUnique,
        O.flatMap(window => A.last(window)),
        O.map(([i, s]) => i + 1),
        O.getExn
    )
    // return 0
    return offset
}