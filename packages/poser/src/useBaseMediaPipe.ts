import type { MaybeRef, Fn } from "@vueuse/core"
import { Ref, unref } from "vue"
import { tryOnBeforeUnmount, unrefElement } from "@vueuse/core"
import { ref, watch } from "vue"
import { loop3D, exec3D } from "@depth/canvas"
import type { Holistic } from "@mediapipe/holistic"
import type { FaceMesh } from "@mediapipe/face_mesh"
import type { Hands } from "@mediapipe/hands"

interface BaseOptions {
  solution: Holistic | FaceMesh | Hands
  video?: MaybeRef<HTMLVideoElement>
  streaming: Ref<boolean>
  throttle?: MaybeRef<number>
}

export function useBaseMediaPipe({ solution, video, streaming, throttle }: BaseOptions) {
  /** ms per detection */
  const t = ref(0)
  let image: HTMLVideoElement
  let stop: Fn

  const oldDimensions = [0, 0]

  const setVideoElement = (el: MaybeRef<HTMLVideoElement>) => {
    image = unrefElement(el) as HTMLVideoElement
  }

  if (video) {
    setVideoElement(video)
  }

  watch(streaming, v => {
    if (v) {
      if (oldDimensions[0] !== image.videoWidth || oldDimensions[1] !== image.videoHeight) {
        solution.reset()
      }
    } else {
      oldDimensions[0] = image.videoWidth
      oldDimensions[1] = image.videoHeight
    }
  })

  // watch(
  //   video,
  //   el => {
  //     console.log("VIDEO CHANGE", el)
  //     image = el
  //   },
  //   { immediate: true }
  // )

  // FIXME: error if video element is deleted ("Cannot pass deleted object as a pointer of type SolutionWasm")
  watch(streaming, active => {
    if (active) {
      let t_ = 0
      let throttleMs = 0
      exec3D(async () => {
        await solution.send({ image })
        stop = loop3D(
          async () => {
            if (image.readyState < 3) return
            throttleMs = unref(throttle) ?? 0
            if (throttleMs && performance.now() - t_ < throttleMs) return
            t_ = performance.now()

            const t0 = performance.now()
            await solution.send({ image })
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
    await solution.close()
  })

  return {
    setVideoElement,
    t,
  }
}
