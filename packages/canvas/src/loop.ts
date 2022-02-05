// @ts-ignore
import OffscreenWorker from "./offscreen.js?worker&inline"
import { init, state } from "./sharender"

function startWorker(canvas: HTMLCanvasElement) {
  const offscreen = canvas.transferControlToOffscreen!()
  const worker: Worker = new OffscreenWorker()
  worker.postMessage({ type: "init", canvas: offscreen }, [offscreen])

  return () => {
    worker.postMessage({
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    })
  }

  // window.addEventListener("resize", sendSize)
  // sendSize()
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({ canvas, type: "init" })

  return () => {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
}

export function startLooping(canvas: HTMLCanvasElement, preferOffscreen = true) {

  const hasWorker = preferOffscreen && canvas.transferControlToOffscreen
  const sendSize = hasWorker ? startWorker(canvas) : startMainPage(canvas)
  console.log("ENV", hasWorker ? "Worker" : "Main thread")
  // sendSize.call(canvas)

  window.addEventListener("resize", sendSize, true)
  // window.addEventListener("resize", () => sendSize.call(null, canvas), true)
  // window.dispatchEvent(new Event("resize"))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const stop = sendSize(canvas)
}
