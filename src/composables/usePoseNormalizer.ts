import type { Keypoint, Pose } from "@tensorflow-models/pose-detection"
import type { Ref } from "vue"
import { reactive, watch } from "vue"

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

export function usePoseNormalizer(poses: Ref<Pose[]>, options: PoseNormalizerOptions = {}) {
  let w = 0
  let h = 0

  const {
    minScore = 0.69,
    focusJoints = ["left_eye_inner", "left_eye", "left_eye_outer", "right_eye"],
    normalizer = p => [(p.x / w) * 100, (p.y / h) * 0, 0],
  } = options

  const body = reactive<JointPoints>({})

  watch(poses, newPoses => {
    if (newPoses.length === 0) return

    const keypoints = filterKeypoints(newPoses, focusJoints, minScore)
    Object.assign(body, Object.fromEntries(keypoints.map(kp => [kp.name, normalizer(kp)])))
  })

  const setStreamDimensions = (settings: MediaTrackSettings) => {
    w = settings.width!
    h = settings.height!
  }

  return {
    body,
    setStreamDimensions,
  }
}
