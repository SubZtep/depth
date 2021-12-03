import useThreeJs from "../src/useThreeJs"
// import { default as useThreeJs } from "../dist/useThreeJs"
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const useThreeJs = require("../dist/useThreeJs").default

describe("init renderer", () => {
  const canvas = document.createElement("canvas")
  const { renderer } = useThreeJs(canvas)

  it("doesn't do", () => {
    expect(true).toBe(true)
    // expect(renderer).toBe(true)
  })
  // useThreeJs()
})

export {}
