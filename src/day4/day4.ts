import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'
import { Set, Range } from 'immutable';

// 2-4,6-8
const parseLine = (input:string) : Set<number>[] => {
  return pipe(
    input.split(','),
    A.map((r => {
      const [from, to] = A.map(r.split('-'), i => Number(i))
      // console.log(`${from}-${to}`)
      return Set.of(...Range(from, (to || 0) + 1))
    })),
    F.toMutable
  )
}

const anyPairwiseWith = <X>(array: X[], p: (a: X, b: X) => boolean ) : boolean => {
  // A.forEach(sets, s => console.log(s.toArray()))
  return pipe(
    array,
    A.mapWithIndex((i, s) => A.any(A.removeAt(array, i), ss => p(s, ss))),
    A.any(i => i)
  )
}

const completelyOverlapping = (sets: Set<number>[]) : boolean => anyPairwiseWith(sets, (a, b) => a.isSubset(b))
const overlapping           = (sets: Set<number>[]) : boolean => anyPairwiseWith(sets, (a, b) => !a.intersect(b).isEmpty())

const processInputWith = (f: (sets: Set<number>[]) => boolean) => (input:string) : number => {
  const ranges = A.map(input.split('\n'), parseLine)
  // console.log(ranges)
  return A.filter(ranges, f).length
}

export const go = processInputWith(completelyOverlapping)
export const go2 = processInputWith(overlapping)