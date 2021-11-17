import type { StorageOptions } from "@vueuse/core"
import type { StoreDefinition } from "pinia"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"

function setGuiScaleCSS(scale: string) {
  try {
    window.document.documentElement.style.setProperty("--gui-scale", scale)
  } catch {
    console.error("Failed to set gui scale")
  }
}

const guiScaleOptions: StorageOptions<number> = {
  serializer: {
    read: (v: any) => {
      setGuiScaleCSS(String(v))
      return Number.parseFloat(v)
    },
    write: (v: any) => {
      const sv = String(v)
      setGuiScaleCSS(sv)
      return sv
    },
  },
}

export const usePreferencesStore: StoreDefinition = defineStore("preferences", {
  state: () => ({
    guiScale: useStorage("preferences.guiScale", 1, undefined, guiScaleOptions),
    horizontalLock: useStorage("preferences.horizontalLock", true),
    ambientColor: useStorage("preferences.ambientColor", 0xbbbbbb),
    ambientIntensity: useStorage("preferences.ambientIntensity", 1),
  }),
})
