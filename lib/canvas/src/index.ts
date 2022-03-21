export { startLooping } from "./startup"

interface CanvasStatem {
  fps: number
  width: number
  height: number
  running: boolean
  offscreen: boolean
}

export type { CanvasStatem }
