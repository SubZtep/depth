interface RenderLoopProps {
  renderer: WebGLRenderer
  cameraControls: CameraControls
  scene: Scene
}


// type SingleRun   = { cmd: "singleRun", payload: LoopFn }
type AlterScene  = { cmd: "addToScene"    | "deleteFromScene",  payload: THREE.Object3D }
// type AlterLoop   = { cmd: "addToLoopFn"   | "deleteFromLoopFn", payload: LoopFn }
// type AlterLoopPr = { cmd: "addToLoopFn"   | "deleteFromLoopFn", payload: LoopFnPr }

// type ThreeJSEvent = AlterScene | AlterLoop | AlterLoopPr | SingleRun
type ThreeJSEvent = AlterScene

type InitFn = (scene: THREE.Scene) => void

interface LoopFnProps {
  toggleRun: FnIs
  isRunning: Ref<boolean>
  cameraControls: import("camera-controls").default
  scene: Scene
  // light: THREE.SpotLight
}

type LoopFn       = (props: LoopFnProps)           => void
type LoopFnRunner = (...fn: LoopFn[]) => unknown
type LoopFnPr     = (props: LoopFnProps)           => Promise<void>
type LoopFnPrRunner = (...fn: LoopFnPr[]) => Promise<void>
