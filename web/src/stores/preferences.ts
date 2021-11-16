import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore } from "pinia"

export const usePreferencesStore: StoreDefinition = defineStore("preferences", {
  state: () => ({
    guiScale: useStorage("preferences.guiScale", 1),
    // fullscreen: useStorage("preferences.fullscreen", false),
    horizontalLock: useStorage("preferences.horizontalLock", true),
    ambientColor: useStorage("preferences.ambientColor", 0xbbbbbb),
    ambientIntensity: useStorage("preferences.ambientIntensity", 1),
  }),
})
