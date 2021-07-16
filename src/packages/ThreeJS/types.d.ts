interface RenderLoopProps {
  renderer: THREE.WebGLRenderer
  cameraControls: import("camera-controls").default
  scene: THREE.Scene
  isRunning: import("vue").Ref<boolean>
  isRenderAllFrames: import("vue").Ref<boolean>
}

type ThreeJSEvent = { cmd: "pauseLoop" | "resumeLoop" | "doRenderAllFrames" | "dontRenderAllFrames" }

type InitFn = (scene: THREE.Scene) => void

interface LoopFnProps {
  cameraControls: import("camera-controls").default
  scene: Scene
}

type LoopFn = (props: LoopFnProps) => void
type LoopFnPr = (props: LoopFnProps) => Promise<void>
