const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split(',')
  .map(nbr => parseInt(nbr))

const getOpAddr = (memory, pos, mode, relativeBase) => {
  switch (mode) {
    case 0:
      return memory.get(pos)
    case 1:
      return pos
    case 2:
      return memory.get(pos) + relativeBase
  }
}

const getOp = (memory, pos, mode, relativeBase) => {
  return memory.get(getOpAddr(memory, pos, mode, relativeBase))
}

const binOp = ({ memory, ptr, mode1, mode2, mode3, relativeBase }, func) => {
  const op1 = getOp(memory, ptr + 1, mode1, relativeBase)
  const op2 = getOp(memory, ptr + 2, mode2, relativeBase)
  const resultAddr = getOpAddr(memory, ptr + 3, mode3, relativeBase)

  memory.set(resultAddr, func(op1, op2))
  return ptr + 4
}

const br = ({ memory, ptr, mode1, mode2, relativeBase }, cond) => {
  const op1 = getOp(memory, ptr + 1, mode1, relativeBase)
  const op2 = getOp(memory, ptr + 2, mode2, relativeBase)
  return cond(op1) ? op2 : ptr + 3
}

const computerFactory = () => {
  const memory = new Map(input.map((val, idx) => [idx, val]))
  let ptr = 0
  let relativeBase = 0

  return (inputs) => {
    let inputPtr = 0
    const output = []

    while (memory.get(ptr) !== 99) {
      const opcode = memory.get(ptr) % 100
      const mode1 = Math.floor((memory.get(ptr) % 1000) / 100)
      const mode2 = Math.floor((memory.get(ptr) % 10000) / 1000)
      const mode3 = Math.floor((memory.get(ptr) % 100000) / 10000)

      const ctx = {
        memory,
        ptr,
        mode1,
        mode2,
        mode3,
        relativeBase
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

          memory.set(getOpAddr(memory, ptr + 1, mode1, relativeBase), inputs[inputPtr++])

          ptr += 2
          break
        }
        case 4: {
          output.push(getOp(memory, ptr + 1, mode1, relativeBase))
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
        case 9: {
          relativeBase += getOp(memory, ptr + 1, mode1, relativeBase)
          ptr += 2
          break
        }
      }
    }

    return [output, true]
  }
}

console.log('Part 1: ' + computerFactory()([1])[0][0])
console.log('Part 2: ' + computerFactory()([2])[0][0])
