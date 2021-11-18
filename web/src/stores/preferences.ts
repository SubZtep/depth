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
    guiScale: 1.4, // useStorage("preferences.guiScale", 1, undefined, guiScaleOptions),
    horizontalLock: false, // useStorage("preferences.horizontalLock", true),
    ambientColor: 0xffff00, // useStorage("preferences.ambientColor", 0xbb_bb_bb),
    ambientIntensity: 0.1, // useStorage("preferences.ambientIntensity", 1),
  }),
})
