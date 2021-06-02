import type { BlazePoseModelConfig } from "@tensorflow-models/pose-detection/dist/blazepose_mediapipe/types"
import type {
  Pose,
  PoseDetector,
  PoseDetectorInput,
  BlazePoseMediaPipeEstimationConfig,
  Keypoint,
} from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { useRafFn, useUserMedia, useDocumentVisibility } from "@vueuse/core"
import { watchEffect, watch, reactive, computed, ComputedRef } from "vue"
import { useVideoTag } from "./useVideoTag"

export type KeypointName =
  | "nose"
  | "left_eye_inner"
  | "left_eye"
  | "left_eye_outer"
  | "right_eye_inner"
  | "right_eye"
  | "right_eye_outer"
  | "left_ear"
  | "right_ear"
  | "mouth_left"
  | "mouth_right"
  | "left_shoulder"
  | "right_shoulder"
  | "left_elbow"
  | "right_elbow"
  | "left_wrist"
  | "right_wrist"
  | "left_pinky"
  | "right_pinky"
  | "left_index"
  | "right_index"
  | "left_thumb"
  | "right_thumb"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle"
  | "right_ankle"
  | "left_heel"
  | "right_heel"
  | "left_foot_index"
  | "right_foot_index"

/** create detector for estimating poses */
async function initDetector() {
  return await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
    runtime: "mediapipe",
    solutionPath: "../node_modules/@mediapipe/pose",
  })
}

/** estimate pose per frame */
const poser = (detector: PoseDetector) => (image: PoseDetectorInput) => async () => {
  const config: Partial<BlazePoseMediaPipeEstimationConfig & BlazePoseModelConfig> = {
    enableSmoothing: true,
  }
  return await detector.estimatePoses(image, config)
}

const detector: PoseDetector = await initDetector()

export function usePoser() {
  const { stream, start: startCam, stop: stopCam } = useUserMedia({ enabled: true, audioDeviceId: false })
  const { el, onLoadedData } = useVideoTag()
  const visibility = useDocumentVisibility()

  // stream.value?.getVideoTracks()[0].getCapabilities().width

  const normalizeKeypoint = (point: Keypoint): Keypoint => ({ x: ~~(point.x / 2), y: 0, z: -3 })

  const pose = reactive<Pick<Pose, "keypoints">>({ keypoints: [] })
  const body = computed(
    () => new Map(pose.keypoints.map(point => [point.name, normalizeKeypoint(point)]))
  ) as ComputedRef<Map<KeypointName, ReturnType<typeof normalizeKeypoint>>>

  let getPoses: () => Promise<Pose[]>

  const { pause: stopUpdate, resume: startUpdate } = useRafFn(
    async () => {
      if (getPoses) {
        if (el.value!.readyState === 4) {
          let poses = await getPoses()
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
    await startCam()
    startUpdate()
  })

  watch(visibility, async (current, previous) => {
    if (current === "visible") {
      await startCam()
      startUpdate()
    } else if (previous === "visible") {
      stopUpdate()
      stopCam()
    }
  })

  watchEffect(() => {
    if (el.value && stream.value) {
      el.value.srcObject = stream.value
    }
  })

  return {
    pose,
    body,
  }
}
