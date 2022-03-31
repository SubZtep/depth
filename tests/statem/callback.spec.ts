import { describe, expect, it, vi } from "vitest"
import { statem } from "@depth/statem"

const obj = {
  cb() {},
}

describe("Execute callbacks", () => {
  const callbackSpy = vi.spyOn(obj, "cb")

  const state = statem("x", { a: 1, b: 1 })!

  afterEach(() => {
    vi.resetAllMocks()
  })

  state.subscribe(obj.cb, { key: "a" })

  it("can subscribe", () => {
    state.a = 2
    expect(callbackSpy).toHaveBeenCalled()
  })

  it("can filter to key", () => {
    state.b = 2
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it("unsubscribe with callback", () => {
    state.unsubscribe(obj.cb)
    state.a = 3
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it("unsubscribe with returned", () => {
    const un = state.subscribe(obj.cb)

    state.a = 4
    expect(callbackSpy).toHaveBeenCalled()

    vi.resetAllMocks()
    un()
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  // it("callback with specified key change", () => {
  //   const un = state.subscribe(obj.cb, { key: "a" })
  // })
})
