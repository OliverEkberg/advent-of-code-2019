const fs = require('fs')
const [min, max] = fs.readFileSync('data.txt', 'utf8')
  .split('-')
  .map(nbr => parseInt(nbr))

const isValid = (nbr, part2 = true) => {
  const nbrStr = nbr.toString()

  let valid = false
  for (let i = 0; i < nbrStr.length - 1; i++) {
    if (Number(nbrStr[i]) > Number(nbrStr[i + 1])) return false
    if (nbrStr[i] === nbrStr[i + 1]) {
      if (!part2 || (nbrStr?.[i - 1] !== nbrStr[i] && nbrStr?.[i + 2] !== nbrStr[i])) {
        valid = true
      }
    }
  }

  return valid
}

let numValidA = 0
let numValidB = 0
for (let candidate = min; candidate <= max; candidate++) {
  if (isValid(candidate, false)) numValidA++
  if (isValid(candidate, true)) numValidB++
}

console.log('Part 1: ' + numValidA)
console.log('Part 2: ' + numValidB)
