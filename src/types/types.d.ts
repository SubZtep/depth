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

interface InputGroup {
  id: string
  f: dat.GUI
  showEl: boolean
  showObj: boolean
  width: number
  zMulti: number
  position: {
    x: number
    y: number
    z: number
  }
}

interface Pile extends InputGroup {
  input: {
    webcam: boolean
    deviceId: string
    videoSrc: string
  }
}

interface MediaInputGroup extends InputGroup {
  deviceId: string
}

interface VideoInputGroup extends InputGroup {
  src: string
}