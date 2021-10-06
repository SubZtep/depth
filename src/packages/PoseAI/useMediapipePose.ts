import type { MaybeRef } from "@vueuse/core"
import { set, tryOnUnmounted, unrefElement, tryOnMounted } from "@vueuse/core"
import type { Pose, PoseConfig, ResultsListener, Results, Options } from "public/pose"
import { reactive, ref, watch } from "vue"
import Stats from "stats.js"
import { useStats } from "~/packages/Stats"

interface MediapipePoseOptions {
  /** Video element */
  video: MaybeRef<HTMLVideoElement>

  /** mediapipe pose options */
  options?: Options
}

let dstat: Stats.Panel | undefined

export function useMediapipePose({ video, options }: MediapipePoseOptions) {
  const detectorReady = ref(false)
  const results: Partial<Results> = reactive({})
  let solution: Pose

  if (dstat === undefined) {
    const { stats } = useStats()
    dstat = stats.addPanel(new Stats.Panel("ms/pose", "#f9d71c", "#191970"))
  }

  watch(video, (_, oldEl) => {
    if (oldEl && solution) {
      solution.reset()
    }
  })

  const poseResult: ResultsListener = res => {
    Object.assign(results, res)
  }

  const estimatePose = async () => {
    const elem = unrefElement(video) as HTMLVideoElement

    if (elem === undefined) {
      return Promise.reject(new Error("no video input"))
    }

    if (elem.readyState === elem.HAVE_NOTHING) {
      return Promise.reject(new Error("no data"))
    }

    if (solution === undefined) {
      return Promise.reject(new Error("no pose detector"))
    }

    const t0 = performance.now()
    await solution.send({ image: elem })
    const t1 = performance.now()

    dstat?.update(t1 - t0, 120)
  }

  tryOnMounted(async () => {
    // @ts-ignore
    solution = new window.Pose({ locateFile: fn => `/pose/${fn}` } as PoseConfig)
    solution.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      selfieMode: false,
      ...options,
    })
    solution.onResults(poseResult)

    await solution.initialize()
    set(detectorReady, true)
  })

  tryOnUnmounted(() => {
    solution?.close()
  })

  return {
    results,
    detectorReady,
    estimatePose,
  }
}
