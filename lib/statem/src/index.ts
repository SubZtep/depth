// import type { StoreProps, Statem } from "./store"
import { Store } from "./store"
import { v4 as uuidv4 } from "uuid"

export default Store

// interface Statem<T extends object> {

// }

// export { Statem }

globalThis.statem = new Map()

export function stateMake<T extends object>(initialState: T, sid?: string): Store<T> & T {
  if (!sid) {
    sid = uuidv4()
  }
  const store = new Store<T>(initialState)
  globalThis.statem.set(sid, store)
  return store as Store<T> & T
}

export function statem(sid: string) {
  return globalThis.statem.get(sid)
}
