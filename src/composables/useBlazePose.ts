import type { Ref } from "vue"
import type { Pose, PoseDetector, BlazePoseMediaPipeModelConfig } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { invoke, get, set, useTimeoutFn } from "@vueuse/core"
import { reactive, watch, ref, toRef } from "vue"
import { tickFns } from "./useThreeJs"

interface Params {
  el: Ref<HTMLVideoElement | undefined>
}

export function useBlazePose(params: Params) {
  const el = toRef(params, "el")
  const ready = ref(false)
  let detector: PoseDetector
  const pose: Pose = reactive({ keypoints: [] })
  const errors = new Set<string>()

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

      const poses = await detector.estimatePoses(elem, {
        flipHorizontal: false,
        maxPoses: 1,
      })

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
      modelType: "lite",
    } as BlazePoseMediaPipeModelConfig)
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

  return { pose, ready }
}
