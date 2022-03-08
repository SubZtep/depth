// import type { CanvasState } from "../../../web/src/store"
import { useSingleton } from "@depth/misc"
import { init, state } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

const { singleton } = useSingleton()
// console.log("AAA", singleton.get("canvasState"))
// const canvasState = singleton.get("canvasState")

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
  // console.log("YYY", canvasState)
  init({ canvas, type: "init", canvasState: singleton.get("canvasState") })

  return () => {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
}

interface LoopProps {
  canvas: HTMLCanvasElement
  preferOffscreen?: boolean
  // canvasState: CanvasState
  // state: RendererState
}

// export function startLooping({ canvas, preferOffscreen = true, state }: LoopProps) {
export function startLooping({ canvas, preferOffscreen = true }: LoopProps) {
  const useWorker = preferOffscreen && "transferControlToOffscreen" in canvas
  const sendSize = useWorker ? startWorker(canvas) : startMainPage(canvas)
  console.log("ENV", useWorker ? "Worker" : "Main thread")

  // Object.assign(state, { useOffscreen: useWorker }) // hack to mutate readonly property

  sendSize.call(canvas)
  window.addEventListener("resize", sendSize, true)
  // const stop = sendSize()
  // return stop
}
