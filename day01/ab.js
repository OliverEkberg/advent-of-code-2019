const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => parseInt(row))

const getCost = (w) => Math.floor(w / 3) - 2

const getCostRecursive = (w) => {
  const cost = getCost(w)

  if (cost < 0) return 0

  return cost + getCostRecursive(cost)
}

let sumA = 0
let sumB = 0

for (const nbr of input) {
  sumA += getCost(nbr)
  sumB += getCostRecursive(nbr)
}

console.log('Part 1: ' + sumA)
console.log('Part 2: ' + sumB)
