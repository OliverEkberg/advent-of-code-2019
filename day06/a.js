const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const objectOrbitsMap = new Map()

for (const row of input) {
  const [center, orbiter] = row.split(')')
  if (!objectOrbitsMap.has(center)) {
    objectOrbitsMap.set(center, [])
  }

  objectOrbitsMap.get(center).push(orbiter)
}

let curr = ['COM']
let count = 0
let depth = 0

while (curr.length) {
  const _curr = []
  for (const center of curr) {
    const orbiters = objectOrbitsMap.get(center)
    count += depth
    if (orbiters?.length) {
      _curr.push(...orbiters)
    }
  }

  depth++
  curr = _curr
}

console.log(count)
