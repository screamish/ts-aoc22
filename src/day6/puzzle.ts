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

const inner = (windowSize: number) => (input:string) : number => {
    const indexed = pipe(
        input.split(''),
        A.mapWithIndex((i, s) : [number, string] => [i, s]),
        F.toMutable
    )
    const firstUnique = pipe(
        toWindows(indexed, windowSize),
        A.find(window =>
            pipe(
                window,
                // I wish I knew more ways to work nicely with tuples in typescript
                A.map(([i, s]) => s),
                s => Set.of(...s).count() === window.length
            )
        )
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

export const go = inner(4)
export const go2 = inner(14)