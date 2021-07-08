type Fn = () => void
type PrFn = () => Promise<void>
type IsFn = () => boolean

type KeypointMesh = THREE.Mesh<THREE.SphereGeometry, THREE.Material>

type SkyboxNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

type InputDimensions = {
  videoWidth: number
  videoHeight: number
}

type ErrorHandler = (e: Error) => void


/** initFN return record's key become variable in tick, should it */
type InitFn = (scene: Scene) => Record<string, Object3D>

interface TickFnProps {
  scene: Scene
  cameraControls: import("camera-controls").default
  isRunning: Ref<boolean>
  toggleRun: IsFn
  light: THREE.SpotLight
}
type TickFn = (props: TickFnProps) => Promise<void>

type TickRunner = (fn: TickFn) => Promise<void>
