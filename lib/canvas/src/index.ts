export * from "./startup"

interface CanvasStatem {
  fps: number
  // width: number
  // height: number
  running: boolean
  offscreen: boolean
  // scene: THREE.Scene | any
  // scene: THREE.Scene | any
  scene?: string
  cameraPosition?: [number, number, number]
}

interface StartLoopingReturn {
  exec3D: (fn: CanvasInjectedFn) => void
  loop3D: (fn: CanvasInjectedFn) => void
  scene: THREE.Scene
}

export type { CanvasStatem, StartLoopingReturn }
