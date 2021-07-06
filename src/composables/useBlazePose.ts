import type { Ref } from "vue"
import { set, useTimeoutFn, tryOnUnmounted, unrefElement, tryOnMounted } from "@vueuse/core"
import { reactive, ref, inject, watch } from "vue"
import Stats from "stats.js"
import type { Pose, PoseConfig, ResultsListener, Results } from "../../public/pose/index.d"
import "../../public/pose"

let dstat: Stats.Panel | undefined = undefined

// @ts-ignore
const Poser = window.Pose

export function useBlazePose(el: Ref<HTMLVideoElement | undefined>) {
  const ready = ref(false)
  const errors = new Set<string>()
  // let firstPose = true

  // const results: Results = reactive({
  //   poseLandmarks: [],
  //   poseWorldLandmarks: [],
  //   image: HTMLCanvasElement.prototype,
  // })
  const results: Partial<Results> = reactive({})

  let solution: Pose

  if (dstat === undefined) {
    const stats = inject<Stats>("stats")!
    dstat = stats.addPanel(new Stats.Panel("ms/pose", "#f9d71c", "#191970"))
    stats.showPanel(3)
  }

  watch(el, (_newEl, oldEl) => {
    if (oldEl !== undefined && solution) {
      solution.reset()
    }
  })

  const poseResult: ResultsListener = res => {
    // console.log("RES", res)
    Object.assign(results, res)
  }

  const singleErrors = (cb: (reason?: any) => void) => (reason: string) => {
    if (errors.has(reason)) return cb()
    errors.add(reason)
    useTimeoutFn(() => void errors.delete(reason), 1000)
    return cb(new Error(reason))
  }

  const estimatePose = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const rejectReason = singleErrors(reject)
      const elem = unrefElement(el)

      if (elem === undefined) {
        return rejectReason("no video input")
      }

      if (elem.readyState !== elem.HAVE_ENOUGH_DATA) {
        return rejectReason("not enough data")
      }

      if (solution === undefined) {
        return rejectReason("no pose detector")
      }

      // // if (firstPose) {
      // //   const { done } = useNProgress(0.5)
      // //   nextTick(() => {
      // //     detector
      // //       .estimatePoses(elem, {
      // //         flipHorizontal: false,
      // //         maxPoses: 1,
      // //       })
      // //       .then(() => {
      // //         firstPose = false
      // //         done()
      // //       })
      // //   })
      // // }

      const t0 = performance.now()
      // console.log("T1", performance.now())
      await solution.send({ image: elem })
      // console.log("T2", performance.now())

      // const poses = await detector.estimatePoses(elem, {
      //   flipHorizontal: false,
      //   maxPoses: 1,
      // })
      const t1 = performance.now()
      dstat?.update(t1 - t0, 120)
      return resolve()

      // if (poses === undefined) {
      //   return rejectReason("poses are undefined")
      // }

      // if (poses.length > 0) {
      //   Object.assign(pose, poses[0])
      //   return resolve()
      // } else {
      //   return rejectReason("no pose detected")
      // }
      // return reject("test")
    })
  }

  tryOnMounted(async () => {
    solution = new Poser({ locateFile: fn => `/pose/${fn}` } as PoseConfig)
    solution.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      selfieMode: false,
    })
    // solution.onResults(params.results)
    solution.onResults(poseResult)
    await solution.initialize()

    set(ready, true)
  })

  tryOnUnmounted(() => {
    solution?.close()
  })

  return {
    results,
    ready,
    estimatePose,
  }
}
