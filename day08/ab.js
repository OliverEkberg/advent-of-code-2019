const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split('')
  .map(nbr => parseInt(nbr))

const countDigit = (arr, digit) => arr.filter(item => item === digit).length

const WIDTH = 25
const HEIGHT = 6

// Part 1
let minZeroDigits = Infinity
let result = null

// Part 2
const decodedImage = new Array(HEIGHT).fill(null).map(_ => new Array(WIDTH).fill(null))

let from = 0
while (from < input.length) {
  const layer = input.slice(from, from + WIDTH * HEIGHT)

  // Part 1
  const zeroDigits = countDigit(layer, 0)
  if (zeroDigits < minZeroDigits) {
    minZeroDigits = zeroDigits
    result = countDigit(layer, 1) * countDigit(layer, 2)
  }

  // Part 2
  for (let i = 0; i < layer.length; i++) {
    const x = i % WIDTH
    const y = Math.floor(i / WIDTH)

    if (decodedImage[y][x] !== null || layer[i] === 2) continue
    decodedImage[y][x] = layer[i] === 0 ? '.' : '#'
  }

  from += WIDTH * HEIGHT
}

console.log(`Part 1:\n${result}\n`)

console.log('Part 2:')
for (const row of decodedImage) {
  console.log(row.join(''))
}
