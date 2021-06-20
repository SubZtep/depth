import type { Pose, PoseDetector } from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs-core"
// import "@tensorflow/tfjs-backend-webgl"
import "@mediapipe/pose"
import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm"
tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`)
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"
import { invoke, set } from "@vueuse/core"
import { onBeforeUnmount, ref } from "vue"

export function usePose() {
  let detector: PoseDetector | undefined = undefined
  const detectorReady = ref(false)

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

  const initDetector = async (): Promise<PoseDetector> => {
    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: "mediapipe",
      // runtime: "tfjs",
      solutionPath: "../node_modules/@mediapipe/pose",
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
        // detector = await initDetector()
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
    await resetBackend("wasm")
    console.info("pose backend is wasm")
    detector = await initDetector()
    console.info("pose detector is ready")
    set(detectorReady, true)
  })

  onBeforeUnmount(() => {
    detector?.dispose()
    console.log("detector disposed")
  })

  return {
    estimatePoses,
    detectorReady,
  }
}
