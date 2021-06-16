interface HTMLVideoElement {
  isPlaying: boolean
}

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

/** there are defaults */
interface PoserOptions {
  modelConfig?: {
    enableSmoothing?: boolean
    flipHorizontal?: boolean
  }
}

interface ThreeJsObjects {
  clock: THREE.Clock
  cameraControls: import("camera-controls").default
  renderer: THREE.Renderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  resume: Fn
}

interface ComponentTogglers {
  videoDeviceId: string
  webcam: boolean
  videoPreview: boolean
}

interface VideoPlayerDistortion {
  scale: number
  flipX?: boolean
  flipY?: boolean
  transparent?: boolean
}


declare type JointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>
declare type VideoPlayerMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

declare type UpdateJointsFn = (poses: /*Pose*/any[], distortion: VideoPlayerDistortion) => void
declare type SetMeshFn = (video: HTMLVideoElement) => Proimise<void>
