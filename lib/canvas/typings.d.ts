interface HTMLCanvasElement {
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen */
  transferControlToOffscreen?: () => OffscreenCanvas & MessagePort
}

// type CanvasState = import("../../web/src/store").CanvasState

interface InitMessage {
  type: "init"
  canvas: HTMLCanvasElement | OffscreenCanvas
  canvasState: import("../../web/src/store").CanvasState & import("@depth/statem").Statem
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

// /** Three.js settings */
// interface RendererState {
//   /** Render Three.js in Worker or Main thread. */
//   readonly useOffscreen?: boolean
//   antialias?: import("three").WebGLRendererParameters["antialias"]
// }

interface Dimensions {
  width: number
  height: number
}
