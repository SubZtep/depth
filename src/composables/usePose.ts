import type { Pose, PoseDetector } from "@tensorflow-models/pose-detection"
import { invoke, set } from "@vueuse/core"
import { onBeforeUnmount, ref } from "vue"
import "@mediapipe/pose"
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"

export function usePose() {
  let detector: PoseDetector | undefined = undefined
  const detectorReady = ref(false)

  const initDetector = async (): Promise<PoseDetector> => {
    detector = await createDetector(SupportedModels.BlazePose, {
      solutionPath: "../node_modules/@mediapipe/pose",
      runtime: "mediapipe",
      modelType: "heavy"
    })
    if (detector === undefined) {
      throw new Error("unable to create pose detector")
    }
    return detector
  }

  const estimatePoses = async (video: HTMLVideoElement): Promise<Pose> => {
    return new Promise(async (resolve, reject) => {
      if (video.readyState !== 4) {
        return reject(new Error("no video input"))
      }

      if (detector === undefined) {
        return reject(new Error("no detector"))
      }

      const poses = await detector.estimatePoses(video, {
        maxPoses: 1,
      })

      if (poses.length > 0) {
        return resolve(poses[0])
      } else {
        reject(new Error("no pose detected"))
      }
    })
  }

  invoke(async () => {
    detector = await initDetector()
    console.info("pose detector is ready")
    set(detectorReady, true)
  })

  onBeforeUnmount(() => {
    detector?.dispose()
    console.info("detector disposed")
  })

  return {
    estimatePoses,
    detectorReady,
  }
}
