import type { Ref } from "vue"
import type { Pose, PoseDetector, BlazePoseMediaPipeModelConfig } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { invoke, get, set, useTimeoutFn, tryOnUnmounted, unrefElement } from "@vueuse/core"
import { reactive, ref, inject } from "vue"
import Stats from "stats.js"

interface Params {
  el: Ref<HTMLVideoElement | undefined>
}

let dstat: Stats.Panel | undefined = undefined

export function useBlazePose(params: Params) {
  const ready = ref(false)
  let detector: PoseDetector
  const pose: Pose = reactive({ keypoints: [] })
  const errors = new Set<string>()
  // let firstPose = true

  if (dstat === undefined) {
    const stats = inject<Stats>("stats")!
    dstat = stats.addPanel(new Stats.Panel("ms/pose", "#f9d71c", "#191970"))
    stats.showPanel(3)
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
      const elem = unrefElement(params.el)

      if (elem === undefined) {
        return rejectReason("no video input")
      }

      if (elem.readyState !== elem.HAVE_ENOUGH_DATA) {
        return rejectReason("not enough data")
      }

      if (detector === undefined) {
        return rejectReason("no pose detector")
      }

      // if (firstPose) {
      //   const { done } = useNProgress(0.5)
      //   nextTick(() => {
      //     detector
      //       .estimatePoses(elem, {
      //         flipHorizontal: false,
      //         maxPoses: 1,
      //       })
      //       .then(() => {
      //         firstPose = false
      //         done()
      //       })
      //   })
      // }

      const t0 = performance.now()
      const poses = await detector.estimatePoses(elem, {
        flipHorizontal: false,
        maxPoses: 1,
      })
      const t1 = performance.now()
      dstat?.update(t1 - t0, 120)

      if (poses === undefined) {
        return rejectReason("poses are undefined")
      }

      if (poses.length > 0) {
        Object.assign(pose, poses[0])
        return resolve()
      } else {
        return rejectReason("no pose detected")
      }
    })
  }

  invoke(async () => {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
      solutionPath: "../node_modules/@mediapipe/pose",
      runtime: "mediapipe",
      modelType: "heavy",
    } as BlazePoseMediaPipeModelConfig)
    set(ready, true)
  })

  tryOnUnmounted(() => {
    detector?.dispose()
  })

  return { pose, ready, estimatePose }
}
