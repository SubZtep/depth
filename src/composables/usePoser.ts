import type { PoseDetector } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import { useAsyncState } from "@vueuse/core"
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"

export function usePoser(options: PoserOptions = {}) {
  const {
    modelConfig = { enableSmoothing: true, flipHorizontal: true },
  } = options

  let detector: PoseDetector | undefined = undefined
  let inputImage: HTMLVideoElement // PoseDetectorInput

  const { state, isReady, execute } = useAsyncState(
    async () => {
      if (inputImage.readyState !== 4) {
        return Promise.reject(new Error("no video input"))
      }
      return await detector!.estimatePoses(inputImage, modelConfig)
    },
    [],
    {
      // delay: 2000,
      immediate: false,
      resetOnExecute: false,
      // onError: e => {
      //   console.log("estimate poses error", e.message)
      //   // state.value = []
      // }
    }
  )

  const initPoser = async (image: HTMLVideoElement) => {
    inputImage = image

    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: "mediapipe",
      solutionPath: "../node_modules/@mediapipe/pose",
    })
  }

  return {
    initPoser,
    state,
    isReady,
    execute,
  }
}
