export function pngOnly(filename: string) {
  return filename.endsWith(".png")
}

export function noDotFiles(filename: string) {
  return ![".", ".."].includes(filename)
}
