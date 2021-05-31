import type { BlazePoseModelConfig } from "@tensorflow-models/pose-detection/dist/blazepose_mediapipe/types"
import type {
  Pose,
  PoseDetector,
  PoseDetectorInput,
  BlazePoseMediaPipeEstimationConfig,
} from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { useRafFn, useUserMedia, useDocumentVisibility } from "@vueuse/core"
import { watchEffect, watch, reactive } from "vue"
import { useVideoTag } from "./useVideoTag"

async function initDetector() {
  return await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
    runtime: "mediapipe",
    solutionPath: "../node_modules/@mediapipe/pose",
  })
}

const poser = (detector: PoseDetector) => (image: PoseDetectorInput) => async () => {
  const config: Partial<BlazePoseMediaPipeEstimationConfig & BlazePoseModelConfig> = {
    enableSmoothing: true,
  }
  const poses = await detector.estimatePoses(image, config)
  return poses
}

const detector: PoseDetector = await initDetector()

export function usePoser() {
  const { stream, start, stop } = useUserMedia({ enabled: true, audioDeviceId: false })
  const { el, onLoadedData } = useVideoTag()
  const visibility = useDocumentVisibility()
  const pose = reactive<Partial<Pose>>({})
  let getPoses: () => Promise<Pose[]>

  const { pause, resume } = useRafFn(
    async () => {
      if (getPoses) {
        if (el.value!.readyState === 4) {
          const poses = await getPoses()
          if (poses.length > 0) {
            pose.keypoints = poses[0].keypoints
          }
        }
      } else {
        getPoses = poser(detector)(el.value!)
      }
    },
    {
      immediate: false,
    }
  )

  onLoadedData(async () => {
    await start()
    resume()
  })

  watch(visibility, async (current, previous) => {
    if (current === "visible") {
      await start()
      resume()
    } else if (previous === "visible") {
      pause()
      stop()
    }
  })

  watchEffect(() => {
    if (el.value && stream.value) {
      el.value.srcObject = stream.value
    }
  })

  return {
    pose,
  }
}
