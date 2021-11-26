import type { Ref } from "vue"
import type { HolisticConfig, Options, ResultsListener } from "@mediapipe/holistic"
import { Holistic } from "@mediapipe/holistic"
import type { MaybeRef } from "@vueuse/core"
import { useBaseMediaPipe } from "./useBaseMediaPipe"

const baseOptions: Options = {
  // modelComplexity: 1,
  // // smoothLandmarks: true,
  // // enableSegmentation: true,
  // // smoothSegmentation: true,
  // // refineFaceLandmarks: true,
  // minDetectionConfidence: 0.5,
  // minTrackingConfidence: 0.5,
  enableFaceGeometry: false,
  selfieMode: true,
  modelComplexity: 0,
  smoothLandmarks: false,
  enableSegmentation: false,
  smoothSegmentation: false,
  refineFaceLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const isDev = process.env.NODE_ENV === "development"

const config: HolisticConfig = {
  locateFile: file => (isDev ? `/libs/holistic/${file}` : `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`),
}

interface HolisticOptions {
  /** Video element */
  video?: MaybeRef<HTMLVideoElement>

  /** Callback function for handle detections */
  handler: ResultsListener

  /** Is camera feed active? */
  streaming: Ref<boolean>

  options?: Options
}

export function useHolistic({ video, handler, streaming, options }: HolisticOptions) {
  const holistic: Holistic = isDev ? new Holistic(config) : new globalThis.Holistic(config)
  holistic.setOptions(Object.assign(baseOptions, options))
  holistic.onResults(handler)

  return useBaseMediaPipe({ solution: holistic, video, streaming })
}
