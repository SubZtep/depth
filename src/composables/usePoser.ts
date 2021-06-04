import type { BlazePoseModelConfig } from "@tensorflow-models/pose-detection/dist/blazepose_mediapipe/types"
import type {
  Pose,
  PoseDetector,
  PoseDetectorInput,
  BlazePoseMediaPipeEstimationConfig,
  Keypoint,
} from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import { useRafFn, useIntervalFn, useUserMedia, useDocumentVisibility, pausableWatch } from "@vueuse/core"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { useNProgress } from "@vueuse/integrations"
import { useVideoTag } from "./useVideoTag"
import { reactive, onMounted, computed } from "vue"
import * as THREE from "three"

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

interface NamedKeypoint extends Omit<Keypoint, "name"> {
  name: KeypointName
}

export type BodyPoint = {
  position: THREE.Vector3Tuple
}

export type BodyPoints = {
  [name in KeypointName]?: BodyPoint
}

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

function filterKeypoints(poses: Pose[], residualKeypoints?: KeypointName[], minScore?: number): NamedKeypoint[] {
  if (poses.length === 0) {
    throw new Error("no pose")
  }
  let keypoints = poses[0].keypoints as NamedKeypoint[]
  if (residualKeypoints !== undefined) {
    keypoints = keypoints.filter(({ name }) => residualKeypoints!.includes(name))
  }
  if (minScore !== undefined && keypoints.some(({ score }) => !score || score < minScore)) {
    throw new Error("bad keypoint scores")
  }
  return keypoints
}

interface PoserOptions {
  /** delay ms between frames */
  interval?: number
  /** filter to keypoint names */
  residualKeypoints?: KeypointName[]
  /** minimum score to reach for update */
  minScore?: number
  /** callback function for normalise data */
  normalize?: (keypoint: NamedKeypoint, width: number, height: number) => NamedKeypoint
}

// export function usePoser({ interval, residualKeypoints, minScore, normalize }: PoserOptions) {
export function usePoser(options: PoserOptions) {
  const { done: loadingDone } = useNProgress().start()
  const { stream, start: startCam, stop: stopCam } = useUserMedia({ enabled: false, audioDeviceId: false })
  const { el: videoEl, onLoadedData: onVideoLoaded } = useVideoTag()
  const visibility = useDocumentVisibility()

  let body: BodyPoints = reactive({})
  let getPoses: () => Promise<Pose[]>
  let detector: PoseDetector
  let width = 0
  let height = 0

  const update = async () => {
    let poses = await getPoses()

    //console.log("PPP", poses)

    let keypoints: NamedKeypoint[]

    try {
      keypoints = filterKeypoints(poses, options.residualKeypoints, options.minScore)
    } catch (e)  {
      console.error(e.message)
      return
    }

    console.log("OOP", keypoints)

    Object.assign(body, Object.fromEntries(
      keypoints.map(kp => {
        if (options.normalize) {
          kp = options.normalize(kp, width, height)
        }
        return [kp.name, { position: [kp.x, kp.y, kp.z || 0] }]
      })
    ))
  }

  const { pause: pauseUpdate, resume: resumeUpdate } =
    options.interval !== undefined ? useIntervalFn(update, options.interval, false) : useRafFn(update, { immediate: false })

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

    loadingDone()

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
    console.time("init detector")
    detector = await initDetector()
    console.timeEnd("init detector")
    resumeWatchStreamStatus()
    startCam()
  })

  return computed<BodyPoints>(() => body)
  // return {
  //   body: computed<BodyPoints>(() => body),
  //   // body: reactive(bodyMap),
  // }
}
