/**
 * Delays the process execution for the given amount of time.
 * @param ms - Do nothing for adjusted milliseconds long
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @param max - inclusive
 * @param min - inclusive
 * @returns random number between min and max
 */
export function rand<T = number>(max: number, min = 1): T {
  return Math.floor(Math.random() * (max - min + 1) + min) as unknown as T
}

export function sumValue(object: any): number {
  return Object.values<number>(object).reduce((sum, value) => sum + value, 0)
}

export function multiValues<T>(object: T, multi: number): T {
  return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, v * multi])) as unknown as T
}

export function fixedValues<T>(object: T, toFixed: number): T {
  return Object.fromEntries(Object.entries(object).map(([k, v]) => [k, +v.toFixed(toFixed)])) as unknown as T
}

export function hasDifferences<T = any>(o1: { [K in keyof T]: T[K] }, o2: { [K in keyof T]: T[K] }): boolean {
  return Object.keys(o1).some(key => o1[key] !== o2[key])
}
