import type { StoreDefinition } from "pinia"
import { defineStore } from "pinia"

export const useEnvironmentStore: StoreDefinition = defineStore("player", {
  state: () => ({
    speed: 100,
  }),
})
