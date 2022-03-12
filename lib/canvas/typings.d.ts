interface HTMLCanvasElement {
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen */
  transferControlToOffscreen?: () => OffscreenCanvas & MessagePort
}

type WebGLCanvas = NonNullable<import("three").WebGLRendererParameters["canvas"]>

interface InitMessage {
  type: "init"
  canvas: HTMLCanvasElement
  canvasState?: import("@depth/statem").CanvasState & import("@depth/statem").Statem
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

interface Dimensions {
  width: number
  height: number
}

interface CanvasInjectedFnProps {
  renderer: import("three").WebGLRenderer
  /** Three.js scene */
  scene: import("three").Scene
  /** Three.js internal clock. */
  clock: import("three").Clock
  /** Get delta from THREE.Clock at frame start. */
  deltaTime: number
  /** requestAnimationFrame attr. */
  time: DOMHighResTimeStamp
  camera: import("three").PerspectiveCamera | import("three").OrthographicCamera
}

type CanvasInjectedFn = (props: CanvasInjectedFnProps) => void
type CanvasInjectedEval = string

interface RendererState {
  width: number
  height: number
  running: boolean
  singleEvals: CanvasInjectedEval[]
  loopEvals: CanvasInjectedEval[]
  singleFns: CanvasInjectedFn[]
  loopFns: CanvasInjectedFn[]
}
