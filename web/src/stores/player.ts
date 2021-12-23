import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useStorage } from "@vueuse/core"

export const usePlayerStore: StoreDefinition = defineStore("player", {
  state: () => ({
    uuid: useStorage("player.uuid", ""),
    name: useStorage("player.name", ""),
    color: useStorage("player.color", 0xffffff),
    wireframe: useStorage("player.wireframe", false),
    roughness: useStorage("player.roughness", 0),
    position: [0, 0, 0] as PositionTuple,
    rotation: [0, 0, 0, 1] as RotationTuple,
    rigidBodyHandle: null as null | number,
    colliderHandle: null as null | number,
  }),
  supabase: {
    table: "metasnail",
    fields: ["uuid", "name", "color", "wireframe", "roughness", "position", "rotation"],
    truthyField: "uuid",
  },
}) // as StoreDefinition

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
