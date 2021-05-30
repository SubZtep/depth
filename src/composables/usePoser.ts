import type { BlazePoseMediaPipeEstimationConfig, PoseDetector } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { useRafFn } from "@vueuse/core"
import type { Ref } from "vue"
import { onMounted } from "vue"

export function usePoser(video: Ref<HTMLVideoElement | undefined>) {
  let detector: PoseDetector
  onMounted(async () => {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
      runtime: "mediapipe",
      solutionPath: "../node_modules/@mediapipe/pose",
    })
  })
  const { pause, resume } = useRafFn(async () => {
    if (detector && video.value && video.value.readyState === 4) {
      //TODO: do poses
      const poses = await detector.estimatePoses(video.value, { enableSmoothing: true } as BlazePoseMediaPipeEstimationConfig)
      console.log(poses)
    }
  })

  return {
    pause,
    resume,
    // estimateImage,
  }
}
