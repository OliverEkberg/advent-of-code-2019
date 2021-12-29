const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split(',')
  .map(nbr => parseInt(nbr))

const getOps = (memory, ptr, mode1, mode2) => {
  const op1 = mode1 === 1 ? memory[ptr + 1] : memory[memory[ptr + 1]]
  const op2 = mode2 === 1 ? memory[ptr + 2] : memory[memory[ptr + 2]]
  return [op1, op2]
}

const binOp = ({ memory, ptr, mode1, mode2 }, func) => {
  const [op1, op2] = getOps(memory, ptr, mode1, mode2)
  const resultAddr = memory[ptr + 3]

  memory[resultAddr] = func(op1, op2)
  return ptr + 4
}

const br = ({ memory, ptr, mode1, mode2 }, cond) => {
  const [op1, op2] = getOps(memory, ptr, mode1, mode2)
  return cond(op1) ? op2 : ptr + 3
}

const run = (INPUT) => {
  const numbers = [...input]

  let ptr = 0
  while (numbers[ptr] !== 99) {
    const opcode = numbers[ptr] % 100
    const mode1 = Math.floor((numbers[ptr] % 1000) / 100)
    const mode2 = Math.floor((numbers[ptr] % 10000) / 1000)

    const ctx = {
      memory: numbers,
      ptr,
      mode1,
      mode2
    }

    switch (opcode) {
      case 1: {
        ptr = binOp(ctx, (a, b) => a + b)
        break
      }
      case 2: {
        ptr = binOp(ctx, (a, b) => a * b)
        break
      }
      case 3: {
        numbers[numbers[ptr + 1]] = INPUT
        ptr += 2
        break
      }
      case 4: {
        console.log(numbers[numbers[ptr + 1]])
        ptr += 2
        break
      }
      case 5: {
        ptr = br(ctx, a => a !== 0)
        break
      }
      case 6: {
        ptr = br(ctx, a => a === 0)
        break
      }
      case 7: {
        ptr = binOp(ctx, (a, b) => a < b ? 1 : 0)
        break
      }
      case 8: {
        ptr = binOp(ctx, (a, b) => a === b ? 1 : 0)
        break
      }
    }
  }
}

console.log('Part 1:')
run(1)
console.log('Part 2:')
run(5)
