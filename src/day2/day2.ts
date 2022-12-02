import { A, O, F, pipe, Option, N } from '@mobily/ts-belt'

type Move = "A" | "B" | "C"
type Strategy = "X" | "Y" | "Z"
type Round = {
  opponent: Move,
  player: Strategy
}

const parse = (input: string) : readonly Round[] => {
  return pipe(
    input.split('\n'),
    A.map(line => {
      const data = line.split(' ')
      return {
        opponent: data[0],
        player: data[1]
      } as Round
    })
  )
}

const reducer = (acc:number, x: Round) : number => {
  const [ win, lose, draw ] = [ 6, 0, 3 ]
  let score = 0
  // win lose draw
  switch (x.opponent) {
    case "A":
      score += x.player == "Y" ? win : (x.player == "Z" ? lose : draw)
      break
    case "B":
      score += x.player == "Z" ? win : (x.player == "X" ? lose : draw)
      break
    case "C":
      score += x.player == "X" ? win : (x.player == "Y" ? lose : draw)
      break
  }

  const bonus = { "X": 1, "Y": 2, "Z": 3 }
  return acc + (score + bonus[x.player])
}

const reducer2 = (acc:number, x: Round) : number => {
  const [ win, lose, draw ] = [ 6, 0, 3 ]
  const bonus = { "A": 1, "B": 2, "C": 3 }
  let score = 0

  // win lose draw
  switch (x.player) {
    case "X":
      score += lose
      const moveLose = x.opponent == "A" ? "C" : (x.opponent == "B" ? "A" : "B")
      score += bonus[moveLose]
      break
    case "Y":
      score += draw
      score += bonus[x.opponent]
      break
    case "Z":
      score += win
      const moveWin = x.opponent == "A" ? "B" : (x.opponent == "B" ? "C" : "A")
      score += bonus[moveWin]
      break
  }

  return acc + score
}

export const scorePart2 = (input: string) : number => {

  return pipe(
    input,
    parse,
    A.reduce(0, reducer2)
  )
}

export const score = (input: string) : number => {

  return pipe(
    input,
    parse,
    A.reduce(0, reducer)
  )
}