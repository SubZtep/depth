import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"
import type { Vector, Rotation } from "@dimforge/rapier3d-compat"
import { useStorage } from "@vueuse/core"
// import { v4 as uuidv4 } from "uuid"

export const usePlayerStore: StoreDefinition = defineStore("player", {
  state: () => ({
    uuid: useStorage("player.uuid", ""),
    position: { x: 0, y: 0, z: 0 } as Vector,
    rotation: { x: 0, y: 0, z: 0, w: 0 } as Rotation,
  }),
  supabase: {
    table: "metasnail",
    fields: ["uuid", "position", "rotation"],
    notEmptyField: "uuid",
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
