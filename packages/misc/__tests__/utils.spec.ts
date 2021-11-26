import { sleep, hasDifferences } from "../src/utils"

describe("utility", () => {
  const t = 69
  it(`should wait for ${t} ms`, async () => {
    const t1 = performance.now()
    await sleep(t)
    const t2 = performance.now()
    const slept = t2 - t1 - t
    expect(slept).toBeLessThanOrEqual(33)
  })
})

describe("has differences", () => {
  const oldState = {
    position: { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, z: Number.POSITIVE_INFINITY },
    rotation: {
      x: Number.POSITIVE_INFINITY,
      y: Number.POSITIVE_INFINITY,
      z: Number.POSITIVE_INFINITY,
      w: Number.POSITIVE_INFINITY,
    },
  }
  const newState = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 0 },
  }

  it("should have differences", () => {
    expect(hasDifferences(oldState.position, newState.position)).toBe(true)
  })

  it("is the same", () => {
    expect(hasDifferences(oldState.position, oldState.position)).toBe(false)
    expect(hasDifferences(newState.position, newState.position)).toBe(false)
  })
})
