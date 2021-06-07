import type { BlazePoseModelConfig } from "@tensorflow-models/pose-detection/dist/blazepose_mediapipe/types"
import type {
  Pose,
  PoseDetector,
  PoseDetectorInput,
  BlazePoseMediaPipeEstimationConfig,
  Keypoint,
} from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import { useWebWorkerFn, useAsyncState } from "@vueuse/core"
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"

// export function usePoser(image: Ref<PoseDetectorInput | undefined>, options: PoserOptions = {}) {
export function usePoser(options: PoserOptions = {}) {
  const {
    // focusJoints = ["left_eye_inner", "left_eye", "left_eye_outer", "right_eye"],
    // interval = 1666,
    // minScore = 0.69,
    // normalizer = (w, h) => p => [(p.x / w) * 100, (p.y / h) * 0, 0],
    modelConfig = { enableSmoothing: true, flipHorizontal: true },
  } = options

  let detector: PoseDetector | undefined = undefined
  let _image: HTMLVideoElement // PoseDetectorInput

  const { state, isReady, execute } = useAsyncState(async () => {
      if (_image.readyState !== 4) {
        return Promise.reject(new Error("no video input"))
      }
      return await detector!.estimatePoses(_image, modelConfig)
    }, [], {
    immediate: false,
    resetOnExecute: false,
    // onError: e => console.log(e.message)
  })

  const initPoser = async (image: HTMLVideoElement) => {
    _image = image

    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: "mediapipe",
      solutionPath: "../node_modules/@mediapipe/pose",
    })
    // await execute()
  }

  return {
    initPoser,
    state,
    isReady,
    execute
  }
}
