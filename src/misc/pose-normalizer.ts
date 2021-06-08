import type { Keypoint, Pose } from "@tensorflow-models/pose-detection"

let w = 0
let h = 0

const options = {
  minScore: 0.69,
  focusJoints: ["left_eye_inner", "left_eye", "left_eye_outer", "right_eye"],
  normalizer: (p: Keypoint) => [(p.x / w) * 100, (p.y / h) * 0, 666],
}

export function setStreamDimensions(settings: MediaTrackSettings) {
  w = settings.width!
  h = settings.height!
}

function filterKeypoints(poses: Pose[]): Keypoint[] {
  if (poses.length === 0) {
    return []
  }
  let { keypoints } = poses[0]
  if (options.focusJoints) {
    keypoints = keypoints.filter(({ name }) => options.focusJoints.includes(name as Joint))
  }
  if (options.minScore && keypoints.some(({ score }) => (score || 0) < options.minScore)) {
    throw new Error("bad keypoint scores")
  }
  return keypoints
}

export function poseNormalizer(poses: Pose[]) {
  const body: JointPoints = {}
  const keypoints = filterKeypoints(poses)

  Object.assign(body, Object.fromEntries(keypoints.map(kp => [kp.name, options.normalizer(kp)])))

  return body
}
