interface RenderLoopProps {
  renderer: WebGLRenderer
  cameraControls: CameraControls
  scene: Scene
  toggleRun: FnIs
  isRunning: Ref<boolean>
}

type ThreeJSEvent = { cmd: "pauseLoop" | "resumeLoop" }

type InitFn = (scene: THREE.Scene) => void

interface LoopFnProps {
  cameraControls: import("camera-controls").default
  scene: Scene
}

type LoopFn = (props: LoopFnProps) => void
type LoopFnRunner = (...fn: LoopFn[]) => unknown
type LoopFnPr = (props: LoopFnProps) => Promise<void>
type LoopFnPrRunner = (...fn: LoopFnPr[]) => Promise<void>
