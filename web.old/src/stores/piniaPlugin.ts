import type { PiniaPluginContext } from "pinia"
import { useStorage } from "@vueuse/core"

export function stateToLocalStorage({ store }: PiniaPluginContext) {
  const storage = useStorage(`store:${store.$id}`, store)
  store.$patch(storage.value)
  store.$subscribe((_, state) => set(storage, state))
}
