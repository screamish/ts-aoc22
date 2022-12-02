import { A, O, pipe, Option, N } from '@mobily/ts-belt'

const parse = (input: string) : Option<number> => {
  return pipe(
    input,
    parseInt,
    O.fromFalsy
  )
}

// type Acc = [ReadonlyArray<ReadonlyArray<number>>,ReadonlyArray<number>]
// type Acc = readonly [number[][],number[]]
type Acc = [number[][],number[]]

export const mostCalories = (input: string) : number => {
  // const emptyAcc = [A.make<ReadonlyArray<number>>(1, A.makeEmpty<number>()),A.makeEmpty<number>()]
  const emptyAcc: Acc = [[[]],[]]

  const x = input.split('\n')
  const y = A.map(x, parse)
  const a = A.reduce(emptyAcc, reducer)(y)
  const b = A.concat(a[0], [a[1]])
  const c = A.map(b, A.reduce(0, N.add))

  console.log(c)

  return A.reduce(0, (a : number, b : number) : number => a > b ? a : b)(c)
  // return pipe(
  //   input.split('\n'),
  //   A.map(parse),
  //   A.reduce(emptyAcc, reducer),
  //   A.map(A.reduce(0, N.add)),
  //   A.reduce(0, (a, b) => a > b ? a : b)
  // )
}

const reducer = (acc:[number[][],number[]], x: Option<number>) : [number[][],number[]] => {
  return O.match(x,
    n => [acc[0], A.concat(acc[1], [n])],
    () => [A.concat(acc[0],[acc[1]]), A.makeEmpty()]
  ) as [number[][],number[]]
}

export const mostCaloriesTop3 = (input: string) : number => {
  const emptyAcc: Acc = [[[]],[]]

  const x = input.split('\n')
  const y = A.map(x, parse)
  const a = A.reduce(emptyAcc, reducer)(y)
  const b = A.concat(a[0], [a[1]])
  const sum = A.reduce(0, N.add)
  const c = A.map(b, sum)
  const d = A.sort(c, (a : number, b : number) : number => a - b)

  // console.log(d)

  return pipe(d, A.reverse, A.take(3), sum)
}