import type { IStore, StoreProps } from "./store"
import { Store } from "./store"

export default Store
export { type IStore, type StoreProps }

export function stateMake<T extends object>(props: StoreProps<T>) {
  const store = new Store<T>(props)
  return store as IStore<T>
}
