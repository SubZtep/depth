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

type TFModel = Omit<import("@tensorflow-models/pose-detection").SupportedModels, "PoseNet">

declare type Fn = import("@vueuse/core").Fn
