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

const computerFactory = (setting) => {
  const memory = [...input]
  let settingUsed = false
  let ptr = 0

  return (inputs) => {
    let inputPtr = 0
    const output = []

    while (memory[ptr] !== 99) {
      const opcode = memory[ptr] % 100
      const mode1 = Math.floor((memory[ptr] % 1000) / 100)
      const mode2 = Math.floor((memory[ptr] % 10000) / 1000)

      const ctx = {
        memory,
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
          if (inputs?.[inputPtr] === undefined) return [output, false]

          memory[memory[ptr + 1]] = settingUsed ? inputs[inputPtr++] : setting
          settingUsed = true

          ptr += 2
          break
        }
        case 4: {
          output.push(memory[memory[ptr + 1]])
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

    return [output, true]
  }
}

const permute = (xs) => {
  const ret = []

  for (let i = 0; i < xs.length; i++) {
    const rest = permute([...xs.slice(0, i), ...xs.slice(i + 1)])

    if (!rest.length) {
      ret.push([xs[i]])
    } else {
      for (let j = 0; j < rest.length; j++) {
        ret.push([xs[i], ...rest[j]])
      }
    }
  }

  return ret
}

const findMax = (validSettings) => {
  let max = -Infinity

  for (const settingSequence of permute(validSettings)) {
    const amps = settingSequence.map(setting => computerFactory(setting))
    let carry = [0]

    let idx = 0
    while (true) {
      const amp = amps[idx]
      const [output, isExit] = amp(carry)
      carry = output

      if (isExit && amp === amps.at(-1)) {
        max = Math.max(max, ...carry)
        break
      }

      idx = idx === amps.length - 1 ? 0 : idx + 1
    }
  }

  return max
}

console.log('Part 1: ' + findMax([0, 1, 2, 3, 4]))
console.log('Part 2: ' + findMax([5, 6, 7, 8, 9]))
