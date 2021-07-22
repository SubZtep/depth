import { set, tryOnUnmounted, unrefElement, tryOnMounted } from "@vueuse/core"
import type { Pose, PoseConfig, ResultsListener, Results } from "../../../public/pose"
import { reactive, ref, watch } from "vue"
import Stats from "stats.js"
import { useStats } from "../Stats/plugin"
import "../../../public/pose"

let dstat: Stats.Panel | undefined

const Poser = window.Pose

export function useBlazePose(el: Ref<HTMLVideoElement | undefined>, cb?: ResultsListener) {
  const detectorReady = ref(false)
  const results: Partial<Results> = reactive({})
  let solution: Pose

  if (dstat === undefined) {
    const stats = useStats()
    dstat = stats.addPanel(new Stats.Panel("ms/pose", "#f9d71c", "#191970"))
  }

  watch(el, (_newEl, oldEl) => {
    if (oldEl !== undefined && solution) {
      solution.reset()
    }
  })

  const poseResult: ResultsListener = res => {
    Object.assign(results, res)
  }

  const estimatePose = async (): Promise<Results> => {
    const elem = unrefElement(el)

    return new Promise(async (resolve, reject) => {
      solution.onResults(results => {
        return resolve(results)
      })

      if (elem === undefined) {
        return reject("no video input")
      }

      if (elem.readyState !== elem.HAVE_ENOUGH_DATA) {
        return reject("not enough data")
      }

      if (solution === undefined) {
        return reject("no pose detector")
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
    })

    solution.onResults(cb ? cb : poseResult)

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
