import { useSingleton } from "@depth/misc"
import { init, state } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

const { singleton } = useSingleton()

function startWorker(canvas: HTMLCanvasElement) {
  const offscreen = canvas.transferControlToOffscreen!()
  const worker: Worker = new OffscreenWorker()

const message = { type: "init", canvas: offscreen /*, canvasState: singleton.get("canvasState")*/ }
  worker.postMessage(message, [offscreen])

  return () => {
    const msg = {
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }
    worker.postMessage(msg)
  }
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({ canvas, type: "init", canvasState: singleton.get("canvasState") })

  return () => {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
}

interface LoopProps {
  canvas: HTMLCanvasElement
  preferOffscreen?: boolean
}

export function startLooping({ canvas, preferOffscreen = true }: LoopProps) {
  const useWorker = preferOffscreen && "transferControlToOffscreen" in canvas
  const sendSize = useWorker ? startWorker(canvas) : startMainPage(canvas)
  console.log("ENV", useWorker ? "Worker" : "Main thread")

  sendSize.call(canvas)
  window.addEventListener("resize", sendSize, true)
}
