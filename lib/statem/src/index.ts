import type { StoreProps, Statem } from "./store"
import { Store } from "./store"
import { v4 as uuidv4 } from "uuid"

export default Store
// export { type StoreProps, type Statem }

globalThis.statem = new Map()

export function stateMake(initialState: { [key: string]: any }, uuid?: string) {
  if (!uuid) {
    uuid = uuidv4()
  }
  const store = new Store(initialState)
  globalThis.statem.set(uuid, store)
  // return uuid
  return store
}

export function statem(uuid: string) {
  return globalThis.statem.get(uuid)
}

// PUBLIC STATE

// export { type CanvasStatem } from "./global/canvas-state"
// export { default as canvasState } from "./global/canvas-state"

// export { type InputStatem } from "./global/input-state"
// export { default as inputState } from "./global/input-state"
