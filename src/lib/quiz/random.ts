export type RandomFn = () => number

export function shuffle<T>(items: T[], random: RandomFn = Math.random) {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  return copy
}

export function weightedSampleWithoutReplacement<T>(
  items: T[],
  count: number,
  getWeight: (item: T) => number,
  random: RandomFn = Math.random
) {
  const pool = [...items]
  const chosen: T[] = []

  while (pool.length > 0 && chosen.length < count) {
    const weights = pool.map((item) => Math.max(0, getWeight(item)))
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

    if (totalWeight <= 0) {
      break
    }

    let threshold = random() * totalWeight
    let pickedIndex = 0

    for (let index = 0; index < pool.length; index += 1) {
      threshold -= weights[index]

      if (threshold <= 0) {
        pickedIndex = index
        break
      }
    }

    chosen.push(pool[pickedIndex])
    pool.splice(pickedIndex, 1)
  }

  return chosen
}

export function createSeededRandom(seed: number): RandomFn {
  let value = seed >>> 0

  return () => {
    value += 0x6d2b79f5
    let temp = value
    temp = Math.imul(temp ^ (temp >>> 15), temp | 1)
    temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61)
    return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296
  }
}
