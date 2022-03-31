/* eslint-disable no-var */
import { Store } from "./store.js"
import type { Statem, State } from "./store.js"
export type { Statem }

declare global {
  /** All the states. */
  var statem: Map<string, Statem>
}

// export default Store
globalThis.statem = new Map()

export function statem(name: string, values?: State | null) {
  let state!: Statem
  if (values === null) {
    globalThis.statem.delete(name)
  } else if (globalThis.statem.has(name)) {
    state = globalThis.statem.get(name)!
    if (values) {
      state?.patch(values)
    }
  } else {
    state = new Store(values ?? {})
    globalThis.statem.set(name, state)
  }
  return state
}
