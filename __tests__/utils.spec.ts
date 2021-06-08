import { normalizeDeviceLabel } from "../src/misc/utils"

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
