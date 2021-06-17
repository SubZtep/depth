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
      estimatePoses: false, //true,
      visibleEl: false,
      visibleObj: true,
      model: SupportedModels.BlazePose,
      addX: 0,
      addY: 0,
      addZ: 0,
    },
  ],
  options: {
    skybox: 14,
  },
}

export const useGlobalState = createGlobalState(
  (): GlobalState => reactive(defaultState)
  // () => useStorage("depth-store", defaultState)
)
