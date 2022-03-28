interface HTMLCanvasElement {
  /** https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen */
  transferControlToOffscreen?: () => OffscreenCanvas & MessagePort
}

type Fn = () => void
type WebGLCanvas = NonNullable<import("three").WebGLRendererParameters["canvas"]>
type CanvasStatem = import("./src/index").CanvasStatem
type CanvasStatemSerialised = string

interface InitMessage {
  type: "init"
  canvasRef: Ref<HTMLCanvasElement>
  injectedFunctions: InjectedFunctions
  statem: CanvasStatem
  scene: any
}

interface StatemMessage {
  type: "updateStatem"
  statem: CanvasStatemSerialised
}

interface Exec3DMessage {
  type: "exec3D"
  fn: CanvasInjectedEval
}

interface Loop3DMessage {
  type: "loop3D"
  fn: CanvasInjectedEval
}

type MessageType = InitMessage["type"] | StatemMessage["type"] | Exec3DMessage["type"] | Loop3DMessage["type"]

type CanvasMessage<T = MessageType> = T extends InitMessage["type"]
  ? InitMessage
  : T extends StatemMessage["type"]
  ? StatemMessage
  : T extends Exec3DMessage["type"]
  ? Exec3DMessage
  : T extends Loop3DMessage["type"]
  ? Loop3DMessage
  : never

type CanvasCallback<T = Pick<MessageType, "init" | "updateStatem">> = (data: CanvasMessage<T>) => void

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

interface InjectedFunctions<T = CanvasInjectedFn | CanvasInjectedEval> {
  singleFns: T[]
  loopFns: T[]
}

interface StartLoopingProps {
  // canvas: HTMLCanvasElement
  canvasRef: import("lit/directives/ref.js").Ref<HTMLCanvasElement>
  statem: CanvasStatem & import("@depth/statem").Statem
  cameraView?: boolean
  cameraPosition?: [number, number, number]
  scene: any
}

interface StartMainProps extends StartLoopingProps {
  injectedFunctions: InjectedFunctions //<CanvasInjectedFn>
}

interface StartWorkerProps extends StartLoopingProps {
  injectedFunctions: InjectedFunctions //<CanvasInjectedEval>
  worker: Worker
}

type StartLoopingReturn = import("./src/index").StartLoopingReturn

type WorkerStatemFn = (seriStatem: CanvasStatemSerialised) => void
