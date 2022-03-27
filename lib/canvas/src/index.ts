export * from "./startup"

interface CanvasStatem {
  fps: number
  width: number
  height: number
  running: boolean
  offscreen: boolean
}

interface StartLoopingReturn {
  exec3D: (fn: CanvasInjectedFn) => void
  loop3D: (fn: CanvasInjectedFn) => void
  scene: THREE.Scene
}

export type { CanvasStatem, StartLoopingReturn }
