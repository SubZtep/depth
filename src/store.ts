import { createGlobalState, useStorage } from "@vueuse/core"
import { reactive } from "vue"

const defaultState = {
  camera: {
    on: true,
    deviceId: "",
  },
  videos: [
    { id: "v1", src: "", visible: false },
    { id: "v2", src: "mask.webm", visible: false },
  ]
}

export const useGlobalState = createGlobalState(
  () => reactive(defaultState)
  // () => useStorage("depth-store", defaultState)
)
