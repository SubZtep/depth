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
