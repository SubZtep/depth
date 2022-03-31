/* eslint-disable no-var */
import { Store } from "./store.js"

declare global {
  /** All the states. */
  var statem: Map<string, typeof Store>
}

// export default Store
globalThis.statem = new Map()

export function statem(name: string, values?: Record<string, any> | null) {
  let state // : Store | undefined
  if (values === null) {
    globalThis.statem.delete(name)
  } else if (globalThis.statem.has(name)) {
    state = globalThis.statem.get(name)
    if (values) {
      state?.patch(values)
    }
  } else {
    state = new Store(values ?? {})
    globalThis.statem.set(name, state)
  }
  return state
}
