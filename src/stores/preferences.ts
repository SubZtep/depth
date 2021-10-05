import { defineStore } from "pinia"

interface PreferencesState {
  guiScale: number
  skybox: SkyboxNumber
  horizontalLock: boolean
  fullscreen: boolean
}

export const usePreferencesStore = defineStore<"preferences", PreferencesState>("preferences", {
  state: () => ({
    guiScale: 1,
    skybox: 2,
    horizontalLock: true,
    fullscreen: false,
  }),
})
