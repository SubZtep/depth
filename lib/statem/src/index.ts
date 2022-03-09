import type { IStore, StoreProps, Statem } from "./store"
import { Store } from "./store"

export default Store
export { type IStore, type StoreProps, type Statem }

export function stateMake<T extends object>(props: StoreProps<T>) {
  const store = new Store<T>(props)
  return store as IStore<T>
}

// PUBLIC STATE

export { type CanvasStatem } from "./global/canvas-state"
export { default as canvasState } from "./global/canvas-state"

export { type InputStatem } from "./global/input-state"
export { default as inputState } from "./global/input-state"
