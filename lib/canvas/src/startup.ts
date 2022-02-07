import { init, state } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker(canvas: HTMLCanvasElement) {
  const offscreen = canvas.transferControlToOffscreen!()
  const worker: Worker = new OffscreenWorker()
  worker.postMessage({ type: "init", canvas: offscreen }, [offscreen])

  return () => {
    const msg = {
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }
    worker.postMessage(msg)
  }

  // // window.addEventListener("resize", sendSize)
  // // sendSize()
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({ canvas, type: "init" })

  return () => {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
}

export function startLooping({
  canvas,
  preferOffscreen = true,
  state,
}: {
  canvas: HTMLCanvasElement
  preferOffscreen?: boolean
  state: RendererState
}) {
  console.log([preferOffscreen, "transferControlToOffscreen" in canvas])
  const hasWorker = preferOffscreen && "transferControlToOffscreen" in canvas
  const sendSize = hasWorker ? startWorker(canvas) : startMainPage(canvas)
  console.log("ENV", hasWorker ? "Worker" : "Main thread")

  // hack to mutate readonly property
  Object.assign(state, { useOffscreen: hasWorker })

  sendSize.call(canvas)

  // window.addEventListener("resize", sendSize, true)
  // window.addEventListener("resize", () => sendSize.call(null, canvas), true)
  // window.dispatchEvent(new Event("resize"))˛
  const stop = sendSize()
}
