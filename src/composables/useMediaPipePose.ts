import type { Pose, PoseDetector } from "@tensorflow-models/pose-detection"
import { onMounted } from "vue"
import "@mediapipe/pose"
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"

let detector: PoseDetector
export function useMediaPipePose(options: PoserOptions = {}) {
  const { modelConfig = { enableSmoothing: true, flipHorizontal: false } } = options

  onMounted(async () => {
    if (detector !== undefined) {
      return
    }
    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: "mediapipe",
      solutionPath: "../node_modules/@mediapipe/pose",
    })
  })

  const estPoses = async (video: HTMLVideoElement): Promise<Pose> => {
    return new Promise(async (resolve, reject) => {
      if (detector === undefined) {
        return reject("no detector")
      }
  
      if (video.readyState !== 4) {
        return reject(new Error("no video input"))
      }
  
      const poses = await detector.estimatePoses(video, modelConfig)
      if (poses.length > 0) {
        return resolve(poses[0])
      } else {
        reject("no poses")
      }
      // return detector.estimatePoses(video, modelConfig)
    })
  }

  return {
    estPoses,
  }
}
