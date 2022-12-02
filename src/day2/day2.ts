import { A, O, F, pipe, Option, N } from '@mobily/ts-belt'

type Opponent = "A" | "B" | "C"
type Player = "X" | "Y" | "Z"
type Round = {
  opponent: Opponent,
  player: Player
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

export const score = (input: string) : number => {

  return pipe(
    input,
    parse,
    A.reduce(0, reducer)
  )
}