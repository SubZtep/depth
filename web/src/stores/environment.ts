import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"

export const useEnvironmentStore: StoreDefinition = defineStore("environment", {
  state: () => ({
    // skybox
    skybox: 1, // useStorage<number>("environment.skybox", 2),
    // grid
    size: useStorage<number>("environment.size", 1),
    color: useStorage<number>("environment.color", 0x357335),
    distance: useStorage<number>("environment.distance", 100),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEnvironmentStore, import.meta.hot))
}
