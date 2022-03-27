import { Store } from "./store"
import { v4 as uuidv4 } from "uuid"

export default Store
globalThis.statem = new Map()

export function stateMake<T extends object>(initialState: T, sid = uuidv4()): Store<T> & T {
  let store: Store<T>
  if (globalThis.statem.has(sid)) {
    store = globalThis.statem.get(sid)
  } else {
    store = new Store<T>(initialState)
    store.sid = sid
    globalThis.statem.set(sid, store)
  }
  return store as Store<T> & T
}

export function statem(sid: string) {
  return globalThis.statem.get(sid)
}

export type { Statem } from "./store"
