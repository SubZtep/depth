interface HTMLCanvasElement {
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen */
  transferControlToOffscreen?: () => OffscreenCanvas & MessagePort
}

type Fn = () => void

type WebGLCanvas = NonNullable<import("three").WebGLRendererParameters["canvas"]>

type CanvasStatem = import("./src/index").CanvasStatem

interface InitMessage {
  type: "init"
  canvas: HTMLCanvasElement
  injectedFunctions: InjectedFunctions
  statem: CanvasStatem
  // canvasState?: import("@depth/statem").CanvasState & import("@depth/statem").Statem
  // statem: any
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
  camera: import("three").Camera
}

type CanvasInjectedFn = (props: CanvasInjectedFnProps) => void
type CanvasInjectedEval = string

interface InjectedFunctions {
  singleEvals: CanvasInjectedEval[]
  loopEvals: CanvasInjectedEval[]
  singleFns: CanvasInjectedFn[]
  loopFns: CanvasInjectedFn[]
}

type SendSizeFn = ({ width, height }: { width: number; height: number }) => void
