interface InitMessage {
  type: "init"
  canvas: HTMLCanvasElement | OffscreenCanvas
}

interface SizeMessage extends Dimensions {
  type: "size"
}

type CanvasMessage<T = any> = T extends InitMessage["type"]
  ? InitMessage
  : T extends SizeMessage["type"]
  ? SizeMessage
  : InitMessage | SizeMessage
type CanvasCallback<T = InitMessage["type"] | SizeMessage["type"] | any> = (data: CanvasMessage<T>) => void

/** Three.js settings */
interface RendererState {
  /** Render Three.js in Worker or Main thread. */
  readonly useOffscreen?: boolean
  antialias?: import("three").WebGLRendererParameters["antialias"]
}
