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
    position: [0, 0, 0] as [number, number, number],
    rotation: [1, 0, 0, 0] as [number, number, number, number],
  }),
  // supabase: {
  //   table: "metasnail",
  //   fields: ["uuid", "position", "rotation", "name", "color"],
  //   truthyField: "uuid",
  // },
}) // as StoreDefinition

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot))
}
