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

/** sequence of body parts, normalized to 3D position */
declare type JointPoints = {
  [name in Joint]?: THREE.Vector3Tuple
}

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

interface ThreeJsObjects {
  clock: THREE.Clock
  cameraControls: import("camera-controls").default
  renderer: THREE.Renderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}

interface ComponentTogglers {
  videoDeviceId: string
  webcam: boolean
  videoPreview: boolean
}

interface ObjectPoolOptions {
  /** number of initialized objects */
  size?: number
}

/** skeleton */
declare type ToPosFn = ([name, pos]: [name: Joint, pos: THREE.Vector3Tuple]) => void
