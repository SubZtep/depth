import type { Pose, PoseDetector } from "@tensorflow-models/pose-detection"
import { createDetector, SupportedModels, movenet } from "@tensorflow-models/pose-detection"
import { onMounted, ref } from "vue"
import "@mediapipe/pose"
import "@tensorflow/tfjs-backend-webgl"

export function usePose(options: PoserOptions = {}) {
  const { modelConfig = { enableSmoothing: true, flipHorizontal: false } } = options
  let detectors = new Map<TFModel, PoseDetector>()
  const ready = ref(false)

  onMounted(async () => {
    detectors.set(
      SupportedModels.BlazePose,
      await createDetector(SupportedModels.BlazePose, {
        runtime: "mediapipe",
        solutionPath: "../node_modules/@mediapipe/pose",
      })
    )
    detectors.set(
      SupportedModels.MoveNet,
      await createDetector(SupportedModels.MoveNet, {
        modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
        // modelType: movenet.modelType.SINGLEPOSE_THUNDER,
      })
    )
    ready.value = true
  })

  const estimatePoses = async (video: HTMLVideoElement, model: TFModel): Promise<Pose> => {
    return new Promise(async (resolve, reject) => {
      if (video.readyState !== 4) {
        return reject(new Error("no video input"))
      }

      const poses = await detectors.get(model)!.estimatePoses(video, modelConfig)
      if (poses.length > 0) {
        return resolve(poses[0])
      } else {
        reject("no poses")
      }
    })
  }

  return {
    ready,
    estimatePoses,
  }
}
