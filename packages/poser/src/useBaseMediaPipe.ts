import type { MaybeRef, Fn } from "@vueuse/core"
import type { Ref } from "vue"
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
  throttle?: number
}

export function useBaseMediaPipe({ solution, video, streaming, throttle }: BaseOptions) {
  /** ms per detection */
  const t = ref(0)
  let image: HTMLVideoElement
  let stop: Fn

  const setVideoElement = (el: MaybeRef<HTMLVideoElement>) => {
    image = unrefElement(el) as HTMLVideoElement
  }

  if (video) {
    setVideoElement(video)
  }

  watch(streaming, active => {
    if (active) {
      let t_ = 0
      exec3D(async () => {
        await solution.send({ image })
        stop = loop3D(
          async () => {
            if (image.readyState < 3) return
            if (throttle && performance.now() - t_ < throttle) return
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
