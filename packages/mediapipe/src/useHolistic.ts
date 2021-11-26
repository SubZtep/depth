// import typ{ HolisticConfig } from "@mediapipe/holistic"
import type { Ref } from "@vue/reactivity"
import type { HolisticConfig, Options, ResultsListener } from "@mediapipe/holistic"
import { watch } from "@vue/runtime-core"
import { Holistic } from "@mediapipe/holistic"
import { MaybeRef, unrefElement } from "@vueuse/core"

const options: Options = {
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
}

export function useHolistic({ video, handler, streaming }: HolisticOptions) {
  const holistic = isDev ? new Holistic(config) : new globalThis.Holistic(config)
  holistic.setOptions(options)
  holistic.onResults(handler)

  // const image = unrefElement(video) as HTMLVideoElement
  let image: HTMLVideoElement

  const setVideoElement = (el: MaybeRef<HTMLVideoElement>) => {
    image = unrefElement(el) as HTMLVideoElement
  }

  if (video) {
    setVideoElement(video)
    // image = unrefElement(video) as HTMLVideoElement
  }

  watch(streaming, active => {
    if (active) {
      // holistic.startVideo(el)
      holistic.send({ image })
    }
  })

  return {
    setVideoElement,
  }
}
