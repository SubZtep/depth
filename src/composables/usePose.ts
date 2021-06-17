import type { Pose, PoseDetector } from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs-core"
import { onMounted, ref } from "vue"
import { set } from "@vueuse/core"
import "@tensorflow/tfjs-backend-webgl"
import "@mediapipe/pose"
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm"
tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`)
import { createDetector, SupportedModels, movenet } from "@tensorflow-models/pose-detection"

export function usePose() {
  let detector: PoseDetector | undefined = undefined
  let detectorModel: TFModel | undefined = undefined
  
  const ready = ref(true)

  const resetBackend = async (name: "webgl" | "wasm") => {
    const engine = tf.engine()
    if (!(name in engine.registryFactory)) {
      throw new Error(`backend ${name} is not registered`)
    }
    if (name in engine.registry) {
      const bf = tf.findBackendFactory(name)
      tf.removeBackend(name)
      tf.registerBackend(name, bf)
    }
    await tf.setBackend(name)
  }

  onMounted(async () => {
    set(ready, false)
    await resetBackend("wasm")
    set(ready, true)
  })

  const initDetector = async (model: TFModel): Promise<PoseDetector> => {
    set(ready, false)

    if (detector !== undefined) {
      detector.dispose()
    }

    switch (model) {
      case SupportedModels.BlazePose:
        detector = await createDetector(SupportedModels.BlazePose, {
          runtime: "mediapipe",
          // runtime: "tfjs",
          solutionPath: "../node_modules/@mediapipe/pose",
        })
        break
      case SupportedModels.MoveNet:
        detector = await createDetector(SupportedModels.MoveNet, {
          enableSmoothing: true,
          modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
          // modelType: movenet.modelType.SINGLEPOSE_THUNDER,
        })
        break
    }

    if (detector === undefined) {
      throw new Error("unable to create pose detector")
    }
    
    detectorModel = model
    set(ready, true)
    return detector
  }

  const estimatePoses = async (video: HTMLVideoElement, model: TFModel): Promise<Pose> => {
    if (model !== detectorModel) {
      await initDetector(model)
    }

    return new Promise(async (resolve, reject) => {
      if (video.readyState !== 4) {
        return reject(new Error("no video input"))
      }

      if (detector === undefined) {
        detector = await initDetector(model)
      }

      const poses = await detector.estimatePoses(video, {
        maxPoses: 1
      })
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
