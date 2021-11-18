// import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore } from "pinia"

export const useEnvironmentStore: StoreDefinition = defineStore("environment", {
  state: () => ({
    // skybox
    skybox: 1, // useStorage<number>("environment.skybox", 2),
    compressed: true, // useStorage<boolean>("environment.compressed", true),
    // grid
    size: 4, // useStorage<number>("environment.size", 1),
    color: 0x357335, // useStorage<number>("environment.color", 0x135113),
    distance: 666, // useStorage<number>("environment.distance", 669),
  }),
})
