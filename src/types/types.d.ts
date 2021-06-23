type Fn = import("@vueuse/core").Fn
type PrFn = () => Promise<void>
type CameraControls = import("camera-controls").default

interface HTMLVideoElement {
  isPlaying: boolean
}

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>
type VideoPlayerMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

interface UseThreeJsReturn {
  tickFns: Set<PrFs>
  pauseTickLoop: Fn
  resumeTickLoop: Fn
  onThreeReady: EventHookOn<void>
}

interface PileOpts {
  showEl: boolean
  showObj: boolean
  width: number
  zMulti: number
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
