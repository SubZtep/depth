import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore } from "pinia"

export const useEnvironmentStore: StoreDefinition = defineStore("environment", {
  state: () => ({
    // skybox
    skybox: useStorage<number>("environment.skybox", 2),
    compressed: useStorage<boolean>("environment.compressed", true),
    // grid
    size1: useStorage<number>("environment.size1", 1),
    size2: useStorage<number>("environment.size2", 10),
    color: useStorage<number>("environment.color", 0),
    distance: useStorage<number>("environment.color", 8000),
  }),
})
