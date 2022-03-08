import type { IStore, StoreProps, Statem } from "./store"
import { Store } from "./store"

export default Store
export { type IStore, type StoreProps, type Statem }

export function stateMake<T extends object>(props: StoreProps<T>) {
  const store = new Store<T>(props)
  return store as IStore<T>
}
