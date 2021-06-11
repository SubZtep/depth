import type { PoseDetector } from "@tensorflow-models/pose-detection"
import type { Ref } from "vue"
import "@mediapipe/pose"
import { useAsyncState, get } from "@vueuse/core"
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"

export function useMediaPipePose(videoRef: Ref<HTMLVideoElement | undefined>, options: PoserOptions = {}) {
  const { modelConfig = { enableSmoothing: true, flipHorizontal: false } } = options
  let detector: PoseDetector

  const {
    state: poses,
    isReady: isDetectorReady,
    execute: estimatePoses,
  } = useAsyncState(
    async () => {
      if (typeof detector === undefined) return Promise.reject("no detector")
      const video = get(videoRef)!

      if (video.readyState !== 4) {
        return Promise.reject(new Error("no video input"))
      }

      return await detector.estimatePoses(video, modelConfig)
    },
    [],
    {
      immediate: false,
      resetOnExecute: false,
      onError: e => {
        console.error("estimate poses error", e)
      },
    }
  )

  const initPoseDetector = async () => {
    if (!!detector || get(isDetectorReady)) {
      // console.log("MAR VAGYOK")
      return
    }
    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: "mediapipe",
      solutionPath: "../node_modules/@mediapipe/pose",
    })
    console.info("pose detector is ready")
  }

  return {
    poses,
    estimatePoses,
    isDetectorReady,
    initPoseDetector,
  }
}
