import { getEntries, getKeys, getSelected, getOptionsListTpl } from "../src/reactive"
import type { NormalizedSelectItems } from "../src/reactive"

describe("reactivity helpers", () => {
  const simpleEntries: NormalizedSelectItems = [
    ["a", "a"],
    ["b", "b"],
    ["c", "c"],
  ]
  const complexEntries: NormalizedSelectItems = [
    ["a", "aa"],
    ["b", "bb"],
    ["c", "cc"],
  ]

  it("array become object entries", () => {
    expect(getEntries(["a", "b", "c"])).toEqual(simpleEntries)
  })

  it("object become object entries", () => {
    expect(getEntries({ a: "a", b: "b", c: "c" })).toEqual(simpleEntries)
  })

  it("object keys and values can be different", () => {
    expect(getEntries({ a: "aa", b: "bb", c: "cc" })).toEqual(complexEntries)
  })

  const keys = getKeys(complexEntries)

  it("entry keys are consistent", () => {
    expect(getKeys(simpleEntries)).toEqual(keys)
  })

  const getSel = getSelected(keys)
  const sel = getSel("b")

  it("valid selected stays", () => {
    expect(sel).toBe("b")
  })

  it("invalid selected become valid", () => {
    expect(getSel("x")).toBe("a")
  })

  it("template has concurrent item number", () => {
    expect(getOptionsListTpl(simpleEntries)).toHaveLength(3)
  })
})
