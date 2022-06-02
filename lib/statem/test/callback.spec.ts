import type { SpyInstance } from "vitest"
// import type { Statem } from "@depth-lib/statem"
import { beforeAll, afterAll, afterEach, describe, expect, it, vi } from "vitest"
import { statem } from "../src"

const obj = {
  cb() {},
}

describe("Execute callbacks", () => {
  let state!: any
  let callbackSpy!: SpyInstance

  beforeAll(() => {
    callbackSpy = vi.spyOn(obj, "cb")
    state = statem("test", { a: 1 })!
    state.subscribe(obj.cb)
  })

  afterAll(() => {
    statem("test", null)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("can subscribe", () => {
    state.a = 2
    expect(callbackSpy).toHaveBeenCalled()
  })

  it("unsubscribe with callback", () => {
    state.unsubscribe(obj.cb)
    state.a = 3
    expect(callbackSpy).not.toHaveBeenCalledOnce()
  })

  it("unsubscribe with returned", () => {
    const un = state.subscribe(obj.cb)

    state.a = 4
    expect(callbackSpy).toHaveBeenCalledOnce()

    vi.resetAllMocks()
    un()
    expect(callbackSpy).not.toHaveBeenCalled()
  })
})

describe("Callback options", () => {
  let state!: any
  let callbackSpy!: SpyInstance

  beforeAll(() => {
    callbackSpy = vi.spyOn(obj, "cb")
    state = statem("test", { a: 1, b: 1 })!
    state.subscribe(obj.cb, { key: "a" })
  })

  afterAll(() => {
    statem("test", null)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("skip unsubscribed key", () => {
    state.b = 2
    expect(callbackSpy).not.toHaveBeenCalled()
  })

  it("callback with subscribed key", () => {
    state.a = 2
    expect(callbackSpy).toHaveBeenCalledOnce()
  })

  it("run callback immediate", () => {
    state.subscribe(obj.cb, { immediate: true })
    state.b++
    expect(callbackSpy).toHaveBeenCalledTimes(2)
  })
})
