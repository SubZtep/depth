// /**
//  * Delays the process execution for the given amount of time.
//  * @param ms - Do nothing for adjusted milliseconds long
//  */
// export function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// /**
//  * Debounce function.
//  * @param fn - The function to be executed
//  * @param delay - The delay in milliseconds
//  */
// export function debounce<T extends Fn, K = any>(fn: T, delay = 100) {
//   let timer: NodeJS.Timer
//   return function (...args: K[]) {
//     clearTimeout(timer)
//     timer = setTimeout(() => fn(...args), delay)
//   }
// }

// /**
//  * @param max - inclusive
//  * @param min - inclusive
//  * @returns random number between min and max
//  */
// export function rand<T = number>(max: number, min = 1): T {
//   return Math.floor(Math.random() * (max - min + 1) + min) as unknown as T
// }

// export function sumValue(object: any): number {
//   return Object.values<number>(object).reduce((sum, value) => sum + value, 0)
// }

// export function multiValues<T>(object: T, multi: number): T {
//   return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, v * multi])) as unknown as T
// }

// export function fixedValues<T>(object: T, toFixed: number): T {
//   return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, +v.toFixed(toFixed)])) as unknown as T
// }

// // export function hasDifferences<T = any>(o1: { [K in keyof T]: T[K] }, o2: { [K in keyof T]: T[K] }): boolean {
// //   return Object.keys(o1).some(key => o1[key] !== o2[key])
// // }

// export function normalise(min: number, max: number) {
//   return (x: number) => (x - min) / (max - min)
// }

export {}
