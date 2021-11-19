import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"

export const usePlayerStore: StoreDefinition = defineStore("player", {
  state: () => ({
    speed: 100,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
