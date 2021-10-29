import { normalizeDeviceLabel, basename, kebabToTitle } from "../src/textuals"

describe("device label parse", () => {
  it("has magic number at the end", () => {
    const original = "c922 Pro Stream Webcam (046d:085c)"
    const parsed = "c922 Pro Stream Webcam"
    expect(normalizeDeviceLabel(original)).toBe(parsed)
  })

  it("good as it is", () => {
    const original = "OBS Virtual Camera"
    const parsed = "OBS Virtual Camera"
    expect(normalizeDeviceLabel(original)).toBe(parsed)
  })
})

describe("filename from path", () => {
  const paths = ["hello.html", "/var/hello.html", "/var/hello.html?x"]
  it("with extension", () => {
    paths.forEach(url => void expect(basename(url, true)).toBe("hello.html"))
  })
  it("without extension", () => {
    paths.forEach(url => void expect(basename(url)).toBe("hello"))
  })
  it("empty string", () => {
    expect(basename("")).toBe("")
  })
})

describe("string mutation", () => {
  it("kebab case to human readable", () => {
    const strings = [
      ["hello", "Hello"],
      ["hello-WORLD", "Hello World"],
      ["hello-WORLD", "Hello World"],
      ["Hello-world-program", "Hello World Program"],
    ]
    for (const [k, v] of strings) {
      expect(kebabToTitle(k)).toBe(v)
    }
  })
})
