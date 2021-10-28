import { sleep } from "../src/utils"

describe("utility", () => {
  const t = 69
  it(`should wait for ${t} ms`, async () => {
    const start = Date.now()
    await sleep(t)
    const slept = Date.now() - start - t
    expect(slept).toBeLessThanOrEqual(13)
  })
})
