import { createGlobalState } from "@vueuse/core"
import { reactive } from "vue"

const defaultState: GlobalState = {
  camera: {
    on: true,
    deviceId: "",
  },
  piles: [
    // {
    //   id: "XXX",
    //   position: new THREE.Vector3(1, 1, 1),
    //   videoPlayer: {
    //     visibleEl: true,
    //     visibleObj: true,
    //     width: 3,
    //   },
    // },
  ],
}

export const useGlobalState = createGlobalState((): GlobalState => reactive(defaultState))
