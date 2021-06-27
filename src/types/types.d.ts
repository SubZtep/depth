type PrFn = () => Promise<void>

interface HTMLVideoElement {
  isPlaying: boolean
}

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>
type VideoPlayerMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

abstract class InputGroup {
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

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
