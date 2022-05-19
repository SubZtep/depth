import { Store } from "./store.js"
// import type { Statem } from "../typings.d"
// export type { Statem }

globalThis.statem = new Map<string, object>()

// export function statem<T extends object>(name: string, values?: T | null): Statem<T> {
export function statem<T extends object>(name: string, values?: T | null) {
  if (values === null) {
    return globalThis.statem.delete(name)
  }

  if (globalThis.statem.has(name)) {
    // return globalThis.statem.get(name) as Statem<T>
    return globalThis.statem.get(name)
  }

  if (typeof values === "object") {
    // const state = new Store<T>(values) as Statem<T>
    const state = new Store<T>(values)
    globalThis.statem.set(name, state)
    return state
  }

  throw new TypeError(`State "${name}" does not exist.`)
}
