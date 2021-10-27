import { noDotFiles, pngOnly } from "../src/filters"

describe("filter", () => {
  const fileList = [".", "..", "index.jpg", "index.png"]

  it("keep real filenames only", () => {
    expect(fileList.filter(noDotFiles)).toEqual(["index.jpg", "index.png"])
  })

  it("keep pngs only", () => {
    expect(fileList.filter(pngOnly)).toEqual(["index.png"])
  })
})
