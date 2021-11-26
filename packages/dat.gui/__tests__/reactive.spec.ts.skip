import { toEntries, toKeys, getSelected, toOptionsTpl } from "../src/reactive"
import type { SelectOptionsEntries } from "../src/reactive"

describe("reactivity helpers", () => {
  const simpleEntries: SelectOptionsEntries = [
    ["a", "a"],
    ["b", "b"],
    ["c", "c"],
  ]
  const complexEntries: SelectOptionsEntries = [
    ["a", "aa"],
    ["b", "bb"],
    ["c", "cc"],
  ]

  it("array become object entries", () => {
    expect(toEntries(["a", "b", "c"])).toEqual(simpleEntries)
  })

  it("object become object entries", () => {
    expect(toEntries({ a: "a", b: "b", c: "c" })).toEqual(simpleEntries)
  })

  it("object keys and values can be different", () => {
    expect(toEntries({ a: "aa", b: "bb", c: "cc" })).toEqual(complexEntries)
  })

  const keys = toKeys(complexEntries)

  it("entry keys are consistent", () => {
    expect(toKeys(simpleEntries)).toEqual(keys)
  })

  const getSel = getSelected(keys)!
  const sel = getSel("b")

  it("valid selected stays", () => {
    expect(sel).toBe("b")
  })

  it("invalid selected become valid", () => {
    expect(getSel("x")).toBe("a")
  })

  it("template has concurrent item number", () => {
    expect(toOptionsTpl(simpleEntries)).toHaveLength(3)
  })
})
