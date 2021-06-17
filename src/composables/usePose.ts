import type { Pose, PoseDetector } from "@tensorflow-models/pose-detection"
// import * as tf from "@tensorflow/tfjs"
import { createDetector, SupportedModels, movenet } from "@tensorflow-models/pose-detection"
import { onMounted, ref } from "vue"
import { set } from "@vueuse/core"
import "@mediapipe/pose"
// import "@tensorflow/tfjs-backend-wasm"
import "@tensorflow/tfjs-backend-webgl"

export function usePose(options: PoserOptions = {}) {
  const { modelConfig = { enableSmoothing: true, flipHorizontal: false } } = options
  let detectors = new Map<TFModel, PoseDetector>()
  const ready = ref(true)

  // onMounted(async () => {
  //   detectors.set(
  //     SupportedModels.BlazePose,
  //     await createDetector(SupportedModels.BlazePose, {
  //       runtime: "mediapipe",
  //       solutionPath: "../node_modules/@mediapipe/pose",
  //     })
  //   )
  //   detectors.set(
  //     SupportedModels.MoveNet,
  //     await createDetector(SupportedModels.MoveNet, {
  //       modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
  //       // modelType: movenet.modelType.SINGLEPOSE_THUNDER,
  //     })
  //   )
  //   ready.value = true
  // })

  // onMounted(async () => {
  //   await tf.setBackend("wasm")
  // })

  const initDetector = async (model: TFModel): Promise<PoseDetector> => {
    set(ready, false)
    let detector: PoseDetector | undefined = undefined

    switch (model) {
      case SupportedModels.BlazePose:
        detector = await createDetector(SupportedModels.BlazePose, {
          runtime: "mediapipe",
          // runtime: "tfjs",
          solutionPath: "../node_modules/@mediapipe/pose",
        })
        break
      case SupportedModels.MoveNet:
        // await tf.setBackend("wasm")
        detector = await createDetector(SupportedModels.MoveNet, {
          // modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
          modelType: movenet.modelType.SINGLEPOSE_THUNDER,
        })
        break
    }

    if (detector === undefined) {
      throw new Error("unkown pose detector")
    }

    detectors.set(model, detector)
    set(ready, true)
    return detector
  }

  const estimatePoses = async (video: HTMLVideoElement, model: TFModel): Promise<Pose> => {
    return new Promise(async (resolve, reject) => {
      if (video.readyState !== 4) {
        return reject(new Error("no video input"))
      }

      let detector = detectors.get(model)
      if (detector === undefined) {
        detector = await initDetector(model)
      }

      const poses = await detector.estimatePoses(video, modelConfig)
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
