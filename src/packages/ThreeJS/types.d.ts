type AlterInit   = { cmd: "initScene", payload: THREE.Scene }
type AlterScene  = { cmd: "addToScene"    | "deleteFromScene",  payload: THREE.Object3D }
type AlterTick   = { cmd: "addToTickFn"   | "deleteFromTickFn", payload: TickFn }
type AlterTickPr = { cmd: "addToTickFn"   | "deleteFromTickFn", payload: TickFnPr }
type AlterEvent  = AlterScene | AlterTick | AlterTickPr | AlterInit

type InitFn = (scene: THREE.Scene) => void
type ErrorHandler = (e: Error) => void

interface TickFnProps {
  toggleRun: FnIs
  isRunning: Ref<boolean>
  cameraControls: import("camera-controls").default
  scene: Scene
  // light: THREE.SpotLight
}

type TickFn       = (props: TickFnProps)           => void
type TickFnPr     = (props: TickFnProps)           => Promise<void>
type TickFnRunner = (...fn: (TickFn | TickFnPr)[]) => unknown
