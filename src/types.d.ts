interface HTMLVideoElement {
  isPlaying: boolean
}

/** there are defaults */
interface PoserOptions {
  modelConfig?: {
    enableSmoothing?: boolean
    flipHorizontal?: boolean
  }
}

interface ThreeJsObjects {
  scene: THREE.Scene
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

declare type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>
declare type VideoPlayerMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

declare type UpdateJointsFn = (poses: /*Pose*/ any[], distortion: VideoPlayerDistortion) => void
declare type SetMeshFn = (video: HTMLVideoElement) => Proimise<void>

interface CameraState {
  on: boolean
  deviceId: string
}

type TFModel = Omit<import("@tensorflow-models/pose-detection").SupportedModels, "PoseNet">

interface VideoState {
  id: string
  src: string
  visibleEl: boolean
  visibleObj: boolean
  model: TFModel
  addX: number
  addY: number
  addZ: number
}

interface GlobalState {
  camera: CameraState
  videos: VideoState[]
}

declare type Fn = import("@vueuse/core").Fn
