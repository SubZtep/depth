import type { BlazePoseModelConfig } from "@tensorflow-models/pose-detection/dist/blazepose_mediapipe/types"
import type {
  Pose,
  PoseDetector,
  PoseDetectorInput,
  BlazePoseMediaPipeEstimationConfig,
} from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { useRafFn, useUserMedia, useDocumentVisibility, set, pausableWatch } from "@vueuse/core"
import { onMounted, reactive, ref } from "vue"
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
function poser(detector: PoseDetector, image: PoseDetectorInput) {
  const config: Partial<BlazePoseMediaPipeEstimationConfig & BlazePoseModelConfig> = {
    enableSmoothing: true,
  }
  return async () => await detector.estimatePoses(image, config)
}

export function usePoser() {
  const { stream, start: startCam, stop: stopCam } = useUserMedia({ enabled: false, audioDeviceId: false })
  const { el: videoEl, onLoadedData: onVideoLoaded } = useVideoTag()
  const visibility = useDocumentVisibility()
  let detector: PoseDetector

  const width = ref<number>()
  const height = ref<number>()
  const pose = reactive<Pick<Pose, "keypoints">>({ keypoints: [] })

  let getPoses: () => Promise<Pose[]>

  const { pause: pauseUpdate, resume: resumeUpdate } = useRafFn(
    async () => {
      let poses = await getPoses()
      if (poses.length > 0) {
        pose.keypoints = poses[0].keypoints
      }
    },
    { immediate: false }
  )

  const {
    pause: pauseWatchVisible,
    resume: resumeWatchVisible,
    isActive: isWatchVisibleActive,
  } = pausableWatch(
    visibility,
    async value => {
      if (value === "visible") {
        await startCam()
      } else {
        pauseUpdate()
        stopCam()
      }
    },
    { immediate: false }
  )

  onVideoLoaded(async loaded => {
    set(width, loaded.width)
    set(height, loaded.height)
    getPoses = poser(detector, loaded.el)

    console.time("first pose")
    await getPoses()
    console.timeEnd("first pose")

    if (visibility.value === "visible") {
      resumeUpdate()
    } else {
      stopCam()
    }

    if (!isWatchVisibleActive.value) {
      resumeWatchVisible()
    }
  })

  const { pause: pauseWatchStreamStatus, resume: resumeWatchStreamStatus } = pausableWatch(
    stream,
    value => {
      videoEl.value!.srcObject = value || null
    },
    { immediate: false }
  )

  pauseWatchVisible()
  pauseWatchStreamStatus()
  pauseUpdate() // no need?

  onMounted(async () => {
    console.time("init detector")
    detector = await initDetector()
    console.timeEnd("init detector")
    resumeWatchStreamStatus()
    startCam()
  })

  return {
    pose,
    width,
    height,
  }
}
