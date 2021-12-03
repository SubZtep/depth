import { useStorage } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { defineStore, acceptHMRUpdate } from "pinia"
import UAParser from "ua-parser-js"

type PlayerInputMethod = "keyboard" | "mouse" | "gamepad" | "head"

export const usePreferencesStore: StoreDefinition = defineStore("preferences", {
  state: () => ({
    isMobile: new UAParser().getDevice().type === "mobile",
    activeInput: "keyboard" as PlayerInputMethod,
    showDebug: true, // useStorage("preferences.showDebug", true),
    guiScale: 1.4, // useStorage("preferences.guiScale", 1, undefined, guiScaleOptions),
    horizontalLock: true, // useStorage("preferences.horizontalLock", true),
    ambientColor: 0xffff00, // useStorage("preferences.ambientColor", 0xbb_bb_bb),
    ambientIntensity: 0.1, // useStorage("preferences.ambientIntensity", 1),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
