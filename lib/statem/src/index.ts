import { Store } from "./store"
import type { Statem } from "../typings.d"
export type { Statem }

globalThis.statem = new Map<string, object>()

export function statem<T extends object>(name: string, values?: T | null): Statem<T> {
  if (values === null) {
    globalThis.statem.delete(name)
    throw new Error("delete's for pussies")
  }

  if (globalThis.statem.has(name)) {
    return globalThis.statem.get(name) as Statem<T>
  }

  if (typeof values === "object") {
    const state = new Store<T>(values) as Statem<T>
    globalThis.statem.set(name, state)
    return state
  }

  throw new TypeError(`State "${name}" does not exist.`)
}
