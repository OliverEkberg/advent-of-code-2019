const fs = require('fs')
const input = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const graph = new Map()

for (const row of input) {
  const [center, orbiter] = row.split(')')

  if (!graph.has(center)) {
    graph.set(center, [])
  }

  if (!graph.has(orbiter)) {
    graph.set(orbiter, [])
  }

  graph.get(center).push(orbiter)
  graph.get(orbiter).push(center)
}

const from = graph.get('YOU')[0]
const to = graph.get('SAN')[0]

const paths = []
const visited = new Set([from])

let neighbours = graph.get(from)
let depth = 1

while (neighbours.length) {
  const _neighbours = []

  for (const neighbour of neighbours) {
    if (visited.has(neighbour)) continue
    if (neighbour === to) paths.push(depth)

    _neighbours.push(...(graph.get(neighbour) ?? []))
    visited.add(neighbour)
  }

  depth++
  neighbours = _neighbours
}

console.log(Math.min(...paths))
