import type { IStore, StoreProps, Statem } from "./store"
import { Store } from "./store"

export default Store
export { type IStore, type StoreProps, type Statem }

export function stateMake(initialState: { [key: string]: any }) {
  const store = new Store<typeof initialState>(initialState)
  return store as IStore<typeof initialState>
}

// PUBLIC STATE

// export { type CanvasStatem } from "./global/canvas-state"
export { default as canvasState } from "./global/canvas-state"

// export { type InputStatem } from "./global/input-state"
// export { default as inputState } from "./global/input-state"
