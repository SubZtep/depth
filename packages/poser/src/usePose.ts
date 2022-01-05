import { Ref, watch } from "vue"
import type { Options, PoseConfig, ResultsListener } from "@mediapipe/pose"
import type { MaybeRef } from "@vueuse/core"
import { Pose } from "@mediapipe/pose"
import { useBaseMediaPipe } from "./useBaseMediaPipe"

interface PoseOptions {
  /** Video element */
  video?: MaybeRef<HTMLVideoElement>

  /** Callback function with the latest detected pose */
  handler: ResultsListener

  /** Is camera feed active? */
  streaming: Ref<boolean>

  /** Throttle detection request */
  throttle?: Ref<number>

  /** FaceMesh options */
  options?: Partial<Options>
}

const defaultOptions: Options = {
  // selfieMode: true,
  // enableFaceGeometry: false,
  // maxNumFaces: 1,
  // refineLandmarks: false,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const isDev = process.env.NODE_ENV === "development"
// console.log({ isDev})

const config: PoseConfig = {
  // locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  // locateFile: file => `/libs/pose/${file}`,
  locateFile: file => (isDev ? `/libs/pose/${file}` : `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`),
}

export function usePose({ video, handler, streaming, throttle, options }: PoseOptions) {
  const pose: Pose = isDev ? new Pose(config) : new globalThis.Pose(config)
  pose.onResults(handler)

  watch(
    () => options,
    newOptions => {
      pose.setOptions({ ...defaultOptions, ...newOptions })
    },
    { immediate: true, deep: true }
  )

  return useBaseMediaPipe({ solution: pose, video, streaming, throttle })
}
