type Fn = () => void

interface Dimensions {
  width: number
  height: number
}

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
