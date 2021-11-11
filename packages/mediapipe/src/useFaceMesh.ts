import type { Ref } from "vue"
import type { Options, FaceMeshConfig, Results, ResultsListener } from "@mediapipe/face_mesh"
import { MaybeRef, unrefElement, useRafFn, tryOnMounted, tryOnBeforeUnmount } from "@vueuse/core"
import { Stats } from "@depth/stats.js"
import { FaceMesh } from "@mediapipe/face_mesh"
import { sleep } from "@depth/misc"
import { watch } from "vue"

export type FaceMeshResultsListener = ResultsListener
export type FaceMeshResults = Results

interface FaceMeshOptions {
  /** Video element */
  video: MaybeRef<HTMLVideoElement | undefined>

  /** Callback function with the latest detected pose */
  handler: ResultsListener

  /** Is camera feed active? */
  streaming: Ref<boolean>

  /** Add Stats.js panel */
  stats?: Stats
}

const solutionOptions: Options = {
  selfieMode: true,
  enableFaceGeometry: false,
  maxNumFaces: 1,
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const config: FaceMeshConfig = {
  locateFile: file =>
    process.env.NODE_ENV === "development"
      ? `/face_mesh/${file}`
      : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
}

export async function useFaceMesh({ video, handler, streaming, stats }: FaceMeshOptions) {
  let faceMesh: FaceMesh

  tryOnMounted(async () => {
    faceMesh = new globalThis.FaceMesh(config)
    faceMesh.setOptions(solutionOptions)
    faceMesh.onResults(handler)
    await faceMesh.initialize()
  })

  let statPanel: Stats.Panel
  if (stats) {
    statPanel = stats.addPanel(new Stats.Panel("ms/face", "#f9d71c", "#191970"))
  }

  const { pause, resume } = useRafFn(
    async () => {
      const t0 = performance.now()
      await faceMesh.send({ image: unrefElement(video) as HTMLVideoElement })
      const t1 = performance.now()
      statPanel?.update(t1 - t0, 60)
    },
    { immediate: false }
  )

  watch(streaming, async isStreaming => {
    if (isStreaming) {
      await sleep(100)
      resume()
    } else {
      pause()
    }
  })

  tryOnBeforeUnmount(() => {
    if (statPanel) {
      statPanel.dom.parentElement?.removeChild(statPanel.dom)
    }
  })
}
