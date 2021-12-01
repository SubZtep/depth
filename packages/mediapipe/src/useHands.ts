import type { Ref } from "vue"
import { MaybeRef } from "@vueuse/core"
import { useBaseMediaPipe } from "./useBaseMediaPipe"
import type { HandsConfig, Options, ResultsListener } from "@mediapipe/hands"
import { Hands } from "@mediapipe/hands"

const baseOptions: Options = {
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const isDev = process.env.NODE_ENV === "development"

const config: HandsConfig = {
  locateFile: file => (isDev ? `/libs/hands/${file}` : `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`),
}

interface HandsOptions {
  /** Video element */
  video?: MaybeRef<HTMLVideoElement>

  /** Callback function for handle detections */
  handler: ResultsListener

  /** Is camera feed active? */
  streaming: Ref<boolean>

  options?: Options
}

export function useHands({ video, handler, streaming, options }: HandsOptions) {
  const hands: Hands = isDev ? new Hands(config) : new globalThis.Hands(config)
  hands.setOptions(Object.assign(baseOptions, options))
  hands.onResults(handler)

  return useBaseMediaPipe({ solution: hands, video, streaming })
}
