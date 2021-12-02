// import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"

export const useEnvironmentStore: StoreDefinition = defineStore("environment", {
  state: () => ({
    // skybox
    skybox: 1, // useStorage<number>("environment.skybox", 2),
    compressed: true, // useStorage<boolean>("environment.compressed", true),
    // grid
    size: 1, // useStorage<number>("environment.size", 1),
    color: 0x357335, // useStorage<number>("environment.color", 0x357335),
    distance: 100, // useStorage<number>("environment.distance", 669),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEnvironmentStore, import.meta.hot))
}
