// import type { StoreProps, Statem } from "./store"
import { Store } from "./store"
import { v4 as uuidv4 } from "uuid"

export default Store

globalThis.statem = new Map()

export function stateMake(initialState: { [key: string]: any }, uuid?: string) {
  if (!uuid) {
    uuid = uuidv4()
  }
  const store = new Store(initialState)
  globalThis.statem.set(uuid, store)
  return store
}

export function statem(uuid: string) {
  return globalThis.statem.get(uuid)
}
