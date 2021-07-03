import { Ref } from "vue"
import type { Pose, PoseDetector, BlazePoseMediaPipeModelConfig } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { invoke, get, set, useTimeoutFn, tryOnUnmounted } from "@vueuse/core"
import { reactive, watch, ref, toRef, inject } from "vue"
import { tickFns } from "./useThreeJs"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import Stats from "stats.js"
import { delay } from "../misc/utils"

interface Params {
  el: Ref<HTMLVideoElement | undefined>
}

let dstat: Stats.Panel | undefined = undefined

export function useBlazePose(params: Params) {
  const el = toRef(params, "el")
  const ready = ref(false)
  let detector: PoseDetector
  const pose: Pose = reactive({ keypoints: [] })
  const errors = new Set<string>()
  let firstPose = true

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
      const elem = get(el)

      if (elem === undefined) {
        return rejectReason("no video input")
      }

      if (elem.readyState !== elem.HAVE_ENOUGH_DATA) {
        return rejectReason("not enough data")
      }

      if (detector === undefined) {
        return rejectReason("no pose detector")
      }

      const t0 = performance.now()
      if (firstPose) {
        // set(ready, false)
        const {done} = useNProgress(0.5)
        setTimeout(async () => {
          await delay(69)
          await detector.estimatePoses(elem, {
            flipHorizontal: false,
            maxPoses: 1,
          })
          firstPose = false
          done()
        }, 0)
      }

      const poses = await detector.estimatePoses(elem, {
        flipHorizontal: false,
        maxPoses: 1,
      })
      
      const t1 = performance.now()
      dstat?.update(t1 - t0, 120)
      // if (firstPose) {
      //   done()
      //   firstPose = false
      // } else {
      //   dstat?.update(t1 - t0, 120)
      // }

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
    // const fakeImage = new Image(640, 480)
    // fakeImage.src = "no-video.png"
    // detector.estimatePoses(fakeImage) // first pose is very slow
    set(ready, true)

    watch(
      el,
      elem => {
        if (elem === undefined) {
          tickFns.delete(estimatePose)
        } else {
          tickFns.add(estimatePose)
        }
      },
      { immediate: true }
    )
  })

  tryOnUnmounted(() => {
    detector?.dispose()
  })

  return { pose, ready }
}
