import { onBeforeUnmount, ref } from "vue"
import { invoke, set } from "@vueuse/core"
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
// import * as tf from "@tensorflow/tfjs-core"
// import "@tensorflow/tfjs-backend-webgl"
// import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm"
// tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`)
// tf.setBackend("wasm")

export function usePose() {
  let detector: PoseDetector | undefined = undefined
  const detectorReady = ref(false)

  const initDetector = async (): Promise<PoseDetector> => {
    detector = await createDetector(SupportedModels.BlazePose, {
      solutionPath: "../node_modules/@mediapipe/pose",
      // runtime: "tfjs",
      runtime: "mediapipe",
      // modelType: "heavy"
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
