import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore } from "pinia"

export const useEnvironmentStore: StoreDefinition = defineStore("environment", {
  state: () => ({
    // skybox
    skybox: useStorage<number>("environment.skybox", 2),
    compressed: useStorage<boolean>("environment.compressed", true),
    // grid
    size: useStorage<number>("environment.size", 1),
    color: useStorage<number>("environment.color", 0x000000),
    distance: useStorage<number>("environment.distance", 8000),
  }),
})
