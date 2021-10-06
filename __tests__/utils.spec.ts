// import { normalizeDeviceLabel } from "../src/misc/utils"
import * as utils from "../src/misc/utils"

describe("device label parse", () => {
  test("has no-idea-what at the end", () => {
    const original = "c922 Pro Stream Webcam (046d:085c)"
    const parsed = "c922 Pro Stream Webcam"
    expect(utils.normalizeDeviceLabel(original)).toBe(parsed)
  })

  test("good as it is", () => {
    const original = "OBS Virtual Camera"
    const parsed = "OBS Virtual Camera"
    expect(utils.normalizeDeviceLabel(original)).toBe(parsed)
  })
})

describe("string functions", () => {
  test("basename", () => {
    const urls = ["hello.html", "/var/hello.html", "/var/hello.html?x"]
    urls.forEach(url => void expect(utils.basename(url, true)).toBe("hello.html"))
    urls.forEach(url => void expect(utils.basename(url)).toBe("hello"))
    expect(utils.basename("")).toBe("")
  })
})
