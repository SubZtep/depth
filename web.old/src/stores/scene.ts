import { acceptHMRUpdate, defineStore } from "pinia"

export const useSceneStore = defineStore<"scene", SceneState>("scene", {
  state: () => {
    return {
      hierarchy: [],
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSceneStore, import.meta.hot))
}
