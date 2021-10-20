import { sleep } from "../src/misc/utils"

async function inlineReturns(error: boolean): Promise<number> {
  if (error) {
    return Promise.reject("failed")
  }
  await sleep(1000)
  // return Promise.resolve(1)
  return 1
}

async function normalReturns(error: boolean): Promise<number> {
  return new Promise((resolve, reject) => {
    if (error) {
      return reject("failed")
    }
    sleep(1000).then(() => resolve(1))
  })
}

describe("inline returns", () => {
  test("resolve", async () => {
    await expect(inlineReturns(false)).resolves.toBe(1)
  })
  test("reject", async () => {
    await expect(inlineReturns(true)).rejects.toBe("failed")
  })
})

describe("normal returns", () => {
  test("reject", async () => {
    await expect(normalReturns(false)).resolves.toBe(1)
  })
  test("reject", async () => {
    await expect(normalReturns(true)).rejects.toBe("failed")
  })
  // test("reject", () => {
  //   expect(() => normalReturns(true)).toThrowError(Error("failed"))
  // })
})
