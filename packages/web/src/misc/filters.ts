export function pngOnly(filename: string) {
  return filename.endsWith(".png")
}

export function noDotFiles(filename: string) {
  return ![".", ".."].includes(filename)
}

export function truthyFilter(value: any) {
  return (invoke: Fn) => value && invoke()
}

export function regexpFilter(filter: RegExp, value: string) {
  return (invoke: Fn) => filter.test(value) && invoke()
}
