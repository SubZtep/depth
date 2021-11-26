import type { Ref } from "@vue/reactivity"
import type { Options, FaceMeshConfig, ResultsListener } from "@mediapipe/face_mesh"
import type { Fn } from "@vueuse/core"
import { MaybeRef, tryOnBeforeUnmount, unrefElement } from "@vueuse/core"
import { FaceMesh } from "@mediapipe/face_mesh"
import { loop3D, exec3D } from "@depth/three.js"
import { ref } from "@vue/reactivity"
import { watch } from "@vue/runtime-core"

interface FaceMeshOptions {
  /** Video element */
  video?: MaybeRef<HTMLVideoElement>

  /** Callback function with the latest detected pose */
  handler?: ResultsListener

  /** Is camera feed active? */
  streaming: Ref<boolean>
}

const options: Options = {
  selfieMode: true,
  enableFaceGeometry: false,
  maxNumFaces: 1,
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const isDev = process.env.NODE_ENV === "development"

const config: FaceMeshConfig = {
  locateFile: file => (isDev ? `/libs/face_mesh/${file}` : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`),
}

export function useFaceMesh({ video, handler, streaming }: FaceMeshOptions) {
  const faceMesh: FaceMesh = isDev ? new FaceMesh(config) : new globalThis.FaceMesh(config)
  faceMesh.setOptions(options)

  /** ms per detection */
  const t = ref(0)

  let image: HTMLVideoElement

  const setVideoElement = (el: MaybeRef<HTMLVideoElement>) => {
    image = unrefElement(el) as HTMLVideoElement
  }

  const setHandler = (fn: ResultsListener) => {
    faceMesh.onResults(fn)
  }

  if (video) setVideoElement(video)
  if (handler) setHandler(handler)

  let stop: Fn

  watch(streaming, active => {
    if (active) {
      exec3D(async () => {
        await faceMesh.send({ image })
        stop = loop3D(
          async () => {
            if (image.readyState < 3) return
            const t0 = performance.now()
            await faceMesh.send({ image })
            const t1 = performance.now()
            t.value = t1 - t0
          },
          { inject: "rendered" }
        )
      })
    } else {
      stop?.()
    }
  })

  tryOnBeforeUnmount(async () => {
    await faceMesh.close()
  })

  return {
    setVideoElement,
    setHandler,
    t,
  }
}
