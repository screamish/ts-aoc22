import { A, S, O, F, pipe, Option, N } from '@mobily/ts-belt'
import { InvalidOptionArgumentError } from 'commander';
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

const completelyOverlapping = (sets: Set<number>[]) : boolean => {
  // A.forEach(sets, s => console.log(s.toArray()))
  return pipe(
    sets,
    A.mapWithIndex((i, s) => A.any(A.removeAt(sets, i), ss => {
      return s.isSubset(ss)
    })),
    A.any(i => i)
  )
}

const overlapping = (sets: Set<number>[]) : boolean => {
  // A.forEach(sets, s => console.log(s.toArray()))
  return pipe(
    sets,
    A.mapWithIndex((i, s) => A.any(A.removeAt(sets, i), ss => {
      return !s.intersect(ss).isEmpty()
    })),
    A.any(i => i)
  )
}

export const go = (input: string) : number => {
  const ranges = A.map(input.split('\n'), parseLine)
  // console.log(ranges)
  return A.filter(ranges, completelyOverlapping).length
}

export const go2 = (input: string) : number => {
  const ranges = A.map(input.split('\n'), parseLine)
  // console.log(ranges)
  return A.filter(ranges, overlapping).length
}
