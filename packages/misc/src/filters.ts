import type { EventFilter, Fn } from "@vueuse/core"

/** Map filter to show png files only. */
export function pngOnly(filename: string) {
  return filename.endsWith(".png")
}

/** Map filter for hiding needless dot files in directory list. */
export function noDotFiles(filename: string) {
  return ![".", ".."].includes(filename)
}

/** Filter VueUse watcher until parameter is truthy. */
export function truthyFilter(source: any): EventFilter {
  return (invoke: Fn) => source && invoke()
}

/** Filter VueUse watcher until parameter is matches. */
export function regexpFilter(filter: RegExp, value: string) {
  return (invoke: Fn) => filter.test(value) && invoke()
}
