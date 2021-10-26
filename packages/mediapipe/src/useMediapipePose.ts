import type { MaybeRef } from "@vueuse/core"
import { set, tryOnUnmounted, unrefElement, tryOnMounted } from "@vueuse/core"
import type { ResultsListener, Results, Options } from "@mediapipe/pose"
import { Pose } from "@mediapipe/pose"
import { isRef, reactive, ref, watch } from "vue"
// import { Stats, useStats } from "@depth/stats.js"

interface MediapipePoseOptions {
  /** Video element */
  video: MaybeRef<HTMLVideoElement | undefined>

  /** Mediapipe pose options */
  options?: Options

  /** Callback function with the latest detected pose */
  handler?: ResultsListener
}

// let dstat: Stats.Panel | undefined

export function useMediapipePose({ video, options, handler }: MediapipePoseOptions) {
  const detectorReady = ref(false)
  const results: Partial<Results> = reactive({})
  let solution: Pose

  // if (dstat === undefined) {
  //   const { stats } = useStats()
  //   dstat = stats.addPanel(new Stats.Panel("ms/pose", "#f9d71c", "#191970"))
  // }

  if (isRef(video)) {
    watch(video, (_, oldEl) => {
      if (oldEl && solution) {
        set(detectorReady, false)
        solution.reset()
        set(detectorReady, true)
      }
    })
  }

  const poseResult: ResultsListener = res => {
    Object.assign(results, res)
  }

  const estimatePose = async (at?: number) => {
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

    // const t0 = performance.now()
    // FIXME: doublecheck `at` parameter
    // https://github.com/google/mediapipe/blob/33d683c67100ef3db37d9752fcf65d30bea440c4/mediapipe/util/filtering/one_euro_filter.cc#L26
    // https://nodatime.org/3.0.x/api/NodaTime.Duration.html#NodaTime_Duration_ToInt64Nanoseconds
    await solution.send({ image: elem }, at)
    // const t1 = performance.now()

    // dstat?.update(t1 - t0, 120)
  }

  tryOnMounted(async () => {
    solution = new Pose({ locateFile: path => `/pose/${path}` })
    solution.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      selfieMode: false,
      ...options,
    })

    solution.onResults(handler ?? poseResult)

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
