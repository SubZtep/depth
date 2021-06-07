// import { Keypoint } from "@tensorflow-models/pose-detection"

// import CameraControls from "camera-controls"

// import type { Ref } from "vue"

// import { Keypoint } from "@tensorflow-models/pose-detection"

// import { Keypoint } from "@tensorflow-models/pose-detection"

/** all the blaze joints */
declare type Joint =
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

// interface NamedKeypoint extends Omit<Keypoint, "name"> {
//   name: KeypointName
// }

// declare type BodyPoint = {
//   position: THREE.Vector3Tuple
// }

/** sequence of body parts, normalized to 3D position */
declare type JointPoints = {
  [name in Joint]?: THREE.Vector3Tuple
}

// interface NamedKeypoint extends Omit<Keypoint, "name"> {
//   name: KeypointName
// }

// export type BodyPoint = {
//   position: THREE.Vector3Tuple
// }

// export type BodyPoints = Ref({
//   //[name in KeypointName]?: BodyPoint // rotation calc later
//   [name in KeypointName]?: THREE.Vector3Tuple
// })

/** make canvas to the scene */
declare type NormalizerFn = (
  streamWidth: number,
  streamHeight: number
) => ({ x, y, z }: { x: number; y: number; z?: number }) => THREE.Vector3Tuple

type InvokeUpdater = Set<(deltaTime: number) => void>

/** there are defaults */
interface PoserOptions {
  modelConfig?: {
    enableSmoothing: boolean
    flipHorizontal: boolean
  }
}

interface PoseNormalizerOptions {
  /** delay ms between frames, zero request animation frames */
  interval?: number
  /** filter to keypoint names */
  focusJoints?: Joint[]

  /** filter keypoints by score 0-1 — minimum score to reach for update */
  minScore?: number

  normalizer?: ({ x, y, z }: { x: number; y: number; z?: number }) => THREE.Vector3Tuple //NormalizerFn
}

interface ThreeProps {
  clock: THREE.Clock
  cameraControls: import("camera-controls").default
  renderer: THREE.Renderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}
