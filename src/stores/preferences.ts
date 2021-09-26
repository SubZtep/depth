import { defineStore } from "pinia"

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    guiScale: 1,
    skybox: 2,
  }),
})
