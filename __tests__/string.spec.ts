import { kebabToTitle } from "~/misc/transformers"

describe("string mutations", () => {
  test("kebab case to human readable", () => {
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
