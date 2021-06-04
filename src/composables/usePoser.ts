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
import { createDetector, SupportedModels } from "@tensorflow-models/pose-detection"
import { useNProgress } from "@vueuse/integrations"
import { useVideoTag } from "./useVideoTag"
import { reactive, onMounted } from "vue"

/** estimate pose per frame */
function poser(detector: PoseDetector, image: PoseDetectorInput) {
  const config: Partial<BlazePoseMediaPipeEstimationConfig & BlazePoseModelConfig> = {
    enableSmoothing: true,
    flipHorizontal: true,
  }
  return async () => await detector.estimatePoses(image, config)
}

function filterKeypoints(poses: Pose[], focusJoints: Joint[], minScore: number): Keypoint[] {
  if (poses.length === 0) {
    throw new Error("no pose")
  }
  let { keypoints } = poses[0]
  if (focusJoints) {
    keypoints = keypoints.filter(({ name }) => focusJoints.includes(name as Joint))
  }
  if (minScore && keypoints.some(({ score }) => (score || 0) < minScore)) {
    throw new Error("bad keypoint scores")
  }
  return keypoints
}

export function usePoser(normalizer: NormalizerFn, options: PoserOptions = {}) {
  const { interval = 0, minScore = 0.69, focusJoints = [] } = options

  const { done: loadingDone } = useNProgress().start()
  const { stream, start: startCam, stop: stopCam } = useUserMedia({ enabled: false, audioDeviceId: false })
  const { el: videoEl, onLoadedData: onVideoLoaded } = useVideoTag()
  const visibility = useDocumentVisibility()

  let detector: PoseDetector
  let getPoses: () => Promise<Pose[]>
  let norm: ReturnType<NormalizerFn>
  const body = reactive<JointPoints>({})

  const update = async () => {
    const poses = await getPoses()
    const keypoints = filterKeypoints(poses, focusJoints, minScore)
    Object.assign(body, Object.fromEntries(keypoints.map(kp => [kp.name, norm(kp)])))
  }

  const { pause: pauseUpdate, resume: resumeUpdate } = interval
    ? useIntervalFn(update, interval, false)
    : useRafFn(update, { immediate: false })

  const { pause, resume: watchVisibility } = pausableWatch(
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
  pause()

  onVideoLoaded(async loaded => {
    norm = normalizer(loaded.width, loaded.height)
    getPoses = poser(detector, loaded.el)

    await getPoses() // slooow 1st time
    loadingDone()

    visibility.value === "visible" ? resumeUpdate() : stopCam()
    watchVisibility() // TODO: add parameter to run cb right away and the line could be piontless above
  })

  const { pause: pauseWatchStreamStatus, resume: resumeWatchStreamStatus } = pausableWatch(
    stream,
    value => (videoEl.value!.srcObject = value || null),
    { immediate: false }
  )

  pauseWatchStreamStatus()
  pauseUpdate() // TODO: add extra parameter to not start just for fn call

  onMounted(async () => {
    detector = await createDetector(SupportedModels.BlazePose, {
      runtime: "mediapipe",
      solutionPath: "../node_modules/@mediapipe/pose",
    })
    resumeWatchStreamStatus()
    startCam()
  })

  return {
    body,
  }
}
