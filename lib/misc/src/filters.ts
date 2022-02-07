// import { typeEventFilter } from '@vueuse/core';
// import type { EventFilter, Fn } from "@vueuse/core"

// type Fn = () => void
// type EventFilter = (invoke: Fn) => any

/** Map filter to show png files only. */
// export function pngOnly(filename: string) {
//   return filename.endsWith(".png")
// }

// /** Map filter for hiding needless dot files in directory list. */
// export function noDotFiles(filename: string) {
//   return ![".", ".."].includes(filename)
// }

/** Filter VueUse watcher until parameter is truthy. */
// export function truthyFilter(source: any): EventFilter {
//   return (invoke: Fn) => source && invoke()
// }

// /** Filter VueUse watcher until parameter is matches. */
// export function regexpFilter(filter: RegExp, value: string) {
//   return (invoke: Fn) => filter.test(value) && invoke()
// }

/**
 * Usage:
 * - ```
 *   function saveInput(){
 *     console.log('Saving data');
 *   }
 *   const processChange = debounce(() => saveInput());
 *   ```
 * - ```js
 *    <button onclick="processChange()">Click me</button>
 *    ```
 * - ```js
 *    window.addEventListener("scroll", processChange);
 *    ```
 */
// export function debounce(func: Fn, timeout = 300) {
export function debounce(func: Fn, timeout = 300) {
  // let timer: NodeJS.Timeout
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}
