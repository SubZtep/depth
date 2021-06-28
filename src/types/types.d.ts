type PrFn = () => Promise<void>

interface HTMLVideoElement {
  isPlaying: boolean
}

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>
type VideoPlayerMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

abstract class InputGroupBase {
  id: string
  open: Fn
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

interface Pile extends InputGroupBase {
  input: {
    webcam: boolean
    deviceId: string
    videoSrc: string
  }
}

interface MediaInputGroup extends InputGroupBase {
  deviceId: string
}

interface VideoInputGroup extends InputGroupBase {
  src: string
}

type InputGroup = MediaInputGroup | VideoInputGroup
type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
