import { beforeEach, describe, expect, it } from "vitest"
import "../../wc/svg-icon/src/index"

describe("SVG icon", async () => {
  beforeEach(async () => {
    document.body.innerHTML = '<svg-icon·name="hamburger"></svg-icon>'
    await window.happyDOM.whenAsyncComplete()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it("exists", () => {
    expect(document.body.querySelector("svg-icon")).toBeDefined()
  })

  it("has aria-label", () => {
    const tag = document.body.querySelector("svg-icon")?.shadowRoot?.querySelector("svg")
    expect(tag?.hasAttribute("aria-label")).toBe(true)
  })

  it("empty without name", async () => {
    document.body.innerHTML = "<svg-icon></svg-icon>"
    await window.happyDOM.whenAsyncComplete()
    const tag = document.body.querySelector("svg-icon")
    expect(tag?.children).toHaveLength(0)
  })
})
