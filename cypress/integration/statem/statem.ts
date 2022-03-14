//import type { StoreProps as StoreProperties } from "../../../lib/statem/src/store"
import { stateMake } from "../../../lib/statem/src/index"

describe("Statem", () => {
  const state1 = stateMake({
    running: false,
    txt: "test",
  })
  const state2 = stateMake({
    running: false,
    txt: "test",
  })

  it("set and get with property", () => {
    state1.txt = "test2"
    expect(state1.txt).to.equal("test2")
  })

  it("another state kept it's original value", () => {
    expect(state2.txt).to.equal("test")
  })
})
