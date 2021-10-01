import { defineStore } from "pinia"

interface PreferencesState {
  guiScale: number
  skybox: SkyboxNumber
}

export const usePreferencesStore = defineStore<"preferences", PreferencesState>("preferences", {
  state: () => ({
    guiScale: 1,
    skybox: 2,
  }),
})
