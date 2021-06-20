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

// declare type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshLambertMaterial>
declare type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>
declare type VideoPlayerMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

declare type UpdateJointsFn = (poses: /*Pose*/ any[], distortion: VideoPlayerDistortion) => void
declare type SetMeshFn = (video: HTMLVideoElement) => Proimise<void>

type TickLoopFn = (params: {
  scene: import("three").Scene
  cameraControls: import("camera-controls").default
}) => Promise<void>

declare type PileToSingleton = (pile: Pile) => void
declare type FrozenPiles = Map<string, Pile>

declare type Fn = import("@vueuse/core").Fn

interface PileOpts {
  showEl: boolean
  showObj: boolean
  width: number
  input: {
    webcam: boolean
    deviceId: string
    videoSrc: string
  }
  position: {
    x: number
    y: number
    z: number
  }
}

// type PileFn = (opts: PileOpts) => void

// type AddPileFn = <T extends undefined | PileFn>(id: string, cb: T) => T extends PileFn ? void : PileOpts

type RescaleFn = (width: number) =>  { height: number, scale: number }