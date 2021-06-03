import type { WritableComputedRef } from "vue"
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
import { useRafFn, useIntervalFn, useUserMedia, useDocumentVisibility, pausableWatch } from "@vueuse/core"
import { computed, onMounted, ref } from "vue"
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
    flipHorizontal: true,
  }
  return async () => await detector.estimatePoses(image, config)
}

interface PoserConfig {
  /** update to loading state */
  isLoading?: WritableComputedRef<boolean>
  /** delay ms between frames */
  interval?: number
  /** filter to keypoint names */
  filterKeypointNames?: KeypointName[]
  /** minimum score to reach for update */
  minScore?: number
  /** callback function for normalise data */
  normalize?: (keypoint: Keypoint, width: number, height: number) => Keypoint
}

export function usePoser(config: PoserConfig) {
  const { stream, start: startCam, stop: stopCam } = useUserMedia({ enabled: false, audioDeviceId: false })
  const { el: videoEl, onLoadedData: onVideoLoaded } = useVideoTag()
  const visibility = useDocumentVisibility()

  const bodyMap = ref<Map<KeypointName, Keypoint>>(new Map())
  let getPoses: () => Promise<Pose[]>
  let detector: PoseDetector
  let width = 0
  let height = 0

  const update = async () => {
    let poses = await getPoses()
    if (poses.length === 0) {
      return
    }
    let keypoints = poses[0].keypoints
    if (config.filterKeypointNames !== undefined) {
      keypoints = keypoints.filter(({ name }) => config.filterKeypointNames!.includes(name as KeypointName))
    }
    if (config.minScore !== undefined && keypoints.some(({ score }) => !score || score < config.minScore!)) {
      return
    }
    bodyMap.value = new Map(
      keypoints.map(kp => {
        delete kp.score
        const { name } = kp
        delete kp.name
        if (config.normalize) {
          kp = config.normalize(kp, width, height)
        }
        return [name as KeypointName, kp]
      })
    )
  }

  const { pause: pauseUpdate, resume: resumeUpdate } = config.interval
    ? useIntervalFn(update, 1000, false)
    : useRafFn(update, { immediate: false })

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
    width = loaded.width
    height = loaded.height
    getPoses = poser(detector, loaded.el)

    console.time("first pose")
    await getPoses()
    console.timeEnd("first pose")

    if (config.isLoading) {
      config.isLoading.value = false
    }

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
    value => (videoEl.value!.srcObject = value || null),
    { immediate: false }
  )

  pauseWatchVisible()
  pauseWatchStreamStatus()
  pauseUpdate() // no need?

  onMounted(async () => {
    if (config.isLoading) {
      config.isLoading.value = true
    }
    console.time("init detector")
    detector = await initDetector()
    console.timeEnd("init detector")
    resumeWatchStreamStatus()
    startCam()
  })

  return {
    body: computed<Map<KeypointName, Keypoint>>(() => bodyMap.value),
  }
}
