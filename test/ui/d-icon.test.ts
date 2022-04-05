import { beforeEach, describe, expect, it } from "vitest"
import "../../lib/ui/src/d-icon"

describe("SVG icon", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<d-icon name="hamburger"></d-icon>`
    await window.happyDOM.whenAsyncComplete()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it("exists", () => {
    expect(document.body.querySelector("d-icon")).toBeDefined()
  })

  it("has aria-label", () => {
    const tag = document.body.querySelector("d-icon")?.shadowRoot?.querySelector("svg")
    expect(tag?.hasAttribute("aria-label")).toBe(true)
  })

  it("empty without name", async () => {
    document.body.innerHTML = `<d-icon></d-icon>`
    await window.happyDOM.whenAsyncComplete()
    const tag = document.body.querySelector("d-icon")
    expect(tag?.children).toHaveLength(0)
  })
})
