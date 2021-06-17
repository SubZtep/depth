import { createGlobalState, useStorage } from "@vueuse/core"
import { reactive } from "vue"
import { SupportedModels } from "@tensorflow-models/pose-detection"

const defaultState: GlobalState = {
  camera: {
    on: true,
    deviceId: "",
  },
  videos: [
    {
      id: "v1",
      src: "",
      estimatePoses: true,
      visibleEl: false,
      visibleObj: true,
      model: SupportedModels.BlazePose,
      addX: 0,
      addY: 0,
      addZ: 0,
    },
  ],
}

export const useGlobalState = createGlobalState(
  () => reactive(defaultState)
  // () => useStorage("depth-store", defaultState)
)
