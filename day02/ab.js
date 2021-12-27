const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split(',')
  .map(nbr => parseInt(nbr))

const MIN = 0
const MAX = 99

const run = (noun, verb) => {
  const numbers = [...input]

  numbers[1] = noun
  numbers[2] = verb

  let ptr = 0
  while (numbers[ptr] !== 99) {
    const op = numbers[ptr] === 1 ? (a, b) => a + b : (a, b) => a * b

    const op1 = numbers[numbers[ptr + 1]]
    const op2 = numbers[numbers[ptr + 2]]
    const resultAddr = numbers[ptr + 3]

    numbers[resultAddr] = op(op1, op2)
    ptr += 4
  }

  return numbers[0]
}

console.log('Part 1: ' + run(12, 2))

for (let noun = MIN; noun <= MAX; noun++) {
  for (let verb = MIN; verb <= MAX; verb++) {
    if (run(noun, verb) === 19690720) {
      console.log('Part 2: ' + (noun * 100 + verb))
      process.exit(0)
    }
  }
}
