import { describe, expect, it } from "vitest"
import { statem } from "@depth/statem"

describe("Global Statem Map", () => {
  it("exists", () => {
    expect(globalThis.statem).toBeDefined()
  })
  it("empty by default", () => {
    expect(globalThis.statem.size).toBe(0)
  })
  it("store created", () => {
    statem("test", {
      abc: 123,
    })
    expect(globalThis.statem.size).toBe(1)
  })

  it("don't recreate", () => {
    statem("test")
    expect(globalThis.statem.size).toBe(1)
  })

  it("multiple states", () => {
    statem("test2")
    expect(globalThis.statem.size).toBe(2)
  })

  it("whatever async call", async () => {
    expect.assertions(1)
    await Promise.resolve()
    // @ts-ignore
    expect(statem("test").abc).toBe(123)
  })

  it("deletable state", () => {
    statem("test2", null)
    expect(globalThis.statem.size).toBe(1)
  })
})
