const fs = require('fs')
const [a, b] = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => row.split(','))

const toStr = (x, y) => `${x},${y}`
const fromStr = (str) => str.split(',').map(Number)

const manhattanDistance = ([x1, y1], [x2, y2]) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

const directions = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1]
}

const traverse = (path) => {
  let x = 0
  let y = 0
  let dist = 0

  const coords = new Map()

  for (const step of path) {
    const [, dir, strLen] = /^([UDRL])(\d+)$/.exec(step)
    const len = Number(strLen)
    const [dx, dy] = directions[dir]

    for (let i = 0; i < len; i++) {
      dist++
      x += dx
      y += dy

      const coord = toStr(x, y)

      if (coords.has(coord)) continue
      coords.set(coord, dist)
    }
  }

  return coords
}

const aCoords = traverse(a)

let minA = Infinity
let minB = Infinity

for (const [coord, distance] of traverse(b)) {
  if (aCoords.has(coord)) {
    minA = Math.min(minA, manhattanDistance([0, 0], fromStr(coord)))
    minB = Math.min(minB, distance + aCoords.get(coord))
  }
}

console.log('Part 1: ' + minA)
console.log('Part 2: ' + minB)
