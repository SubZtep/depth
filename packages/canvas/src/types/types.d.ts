interface Dimensions {
  width: number
  height: number
}

interface InitMessage {
  type?: "init"
  canvas: HTMLCanvasElement | OffscreenCanvas
}

interface SizeMessage extends Dimensions {
  type?: "size"
}

type CanvasMessage = InitMessage | SizeMessage

type CanvasCallback = (param: Omit<CanvasMessage, "type">) => void
// type CanvasCallback = (param: Omit<InitMessage, "type"> | Omit<SizeMessage, "type">) => void
