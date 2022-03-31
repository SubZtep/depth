import { describe, expect, it, vi } from "vitest"
import { statem } from "@depth/statem"

const obj = {
  cb() {},
}

describe("Execute callbacks", () => {
  const callbackSpy = vi.spyOn(obj, "cb")

  const state = statem("x", { a: 1 })

  afterEach(() => {
    vi.resetAllMocks()
  })

  state?.subscribe(obj.cb)

  it("can subscribe", () => {
    // @ts-ignore
    state.a = 2
    expect(callbackSpy).toHaveBeenCalled()
  })

  it("unsubscribe with callback", () => {
    state?.unsubscribe(obj.cb)
    // @ts-ignore
    state.a = 3
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it("unsubscribe with returned", () => {
    const un = state?.subscribe(obj.cb)

    // @ts-ignore
    state.a = 4
    expect(callbackSpy).toHaveBeenCalled()

    vi.resetAllMocks()
    un?.()
    expect(callbackSpy).not.toHaveBeenCalled()
  })
})
