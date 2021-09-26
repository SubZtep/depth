import type { MaybeRef } from "@vueuse/core"
import { set, tryOnUnmounted, unrefElement, tryOnMounted } from "@vueuse/core"
import type { Pose, PoseConfig, ResultsListener, Results, Options } from "../../../public/pose"
import { reactive, ref, watch } from "vue"
import Stats from "stats.js"
import { useStats } from "../Stats/plugin"
import "../../../public/pose"

interface MediapipePoseOptions {
  /** Video element */
  video: MaybeRef<HTMLVideoElement>

  // /** If true (default), pose estimation fn return, otherwise `results` updated */
  estimateReturns?: boolean

  // /** Callback when detector is ready */
  onDetectorReady?: Fn

  /** mediapipe pose options */
  options?: Options
}

let dstat: Stats.Panel | undefined
const Poser = window.Pose

export function useMediapipePose(options: MediapipePoseOptions) {
  const { video, estimateReturns = true, onDetectorReady } = options

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

  const estimatePose = async (): Promise<Results> => {
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

    return new Promise(async resolve => {
      if (estimateReturns) {
        solution.onResults(results => {
          return resolve(results)
        })
      }

      const t0 = performance.now()
      await solution.send({ image: elem })
      const t1 = performance.now()

      dstat?.update(t1 - t0, 120)
    })
  }

  tryOnMounted(async () => {
    // @ts-ignore
    solution = new Poser({ locateFile: fn => `/pose/${fn}` } as PoseConfig)
    solution.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      selfieMode: false,
      ...options.options,
    })
    solution.onResults(poseResult)

    await solution.initialize()
    set(detectorReady, true)
    onDetectorReady?.call(null)
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