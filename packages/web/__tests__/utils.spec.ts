import { normalizeDeviceLabel } from "../src/misc/transformers"
import { basename } from "../src/misc/transformers"

describe("device label parse", () => {
  test("has no-idea-what at the end", () => {
    const original = "c922 Pro Stream Webcam (046d:085c)"
    const parsed = "c922 Pro Stream Webcam"
    expect(normalizeDeviceLabel(original)).toBe(parsed)
  })

  test("good as it is", () => {
    const original = "OBS Virtual Camera"
    const parsed = "OBS Virtual Camera"
    expect(normalizeDeviceLabel(original)).toBe(parsed)
  })
})

describe("string functions", () => {
  test("basename", () => {
    const urls = ["hello.html", "/var/hello.html", "/var/hello.html?x"]
    urls.forEach(url => void expect(basename(url, true)).toBe("hello.html"))
    urls.forEach(url => void expect(basename(url)).toBe("hello"))
    expect(basename("")).toBe("")
  })
})