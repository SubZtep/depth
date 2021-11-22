import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useStorage } from "@vueuse/core"

// export const usePlayerStore: StoreDefinition = defineStore("player", {
// export const usePlayerStore = defineStore("player", {
export const usePlayerStore: StoreDefinition = defineStore("player", {
  state: () => ({
    uuid: useStorage("player.uuid", ""),
    name: useStorage("player.name", ""),
    color: useStorage("player.color", 0xffffff),
    position: { x: 0, y: 0, z: 0 } as Vector,
    rotation: { x: 0, y: 0, z: 0, w: 0 } as Rotation,
  }),
  supabase: {
    table: "metasnail",
    fields: ["uuid", "position", "rotation", "name", "color"],
    truthyField: "uuid",
  },
}) as StoreDefinition

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
