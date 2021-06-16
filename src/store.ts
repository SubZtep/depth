import { createGlobalState, useStorage } from "@vueuse/core"
import { reactive } from "vue"
import { SupportedModels } from "@tensorflow-models/pose-detection"

const defaultState: GlobalState = {
  camera: {
    on: true,
    deviceId: "",
  },
  videos: [
    { id: "v1", src: "", visible: false, model: SupportedModels.MoveNet },
    // { id: "v2", src: "mask.webm", visible: false },
  ]
}

export const useGlobalState = createGlobalState(
  () => reactive(defaultState)
  // () => useStorage("depth-store", defaultState)
)
