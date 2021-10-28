/**
 * Delays the process execution for the given amount of time.
 * @param ms - Do nothing for adjusted milliseconds long
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
