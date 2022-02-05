import { init, state } from "./sharender"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker(canvas: HTMLCanvasElement) {
  const offscreen = canvas.transferControlToOffscreen()
  // const worker = new Worker("/offscreen.ts", { type: "module" })
  const worker = new OffscreenWorker()
  // worker.
  // console.log({ worker })
  worker.postMessage({ type: "init", canvas: offscreen }, [offscreen])

  function sendSize() {
    worker.postMessage({
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    })
  }

  window.addEventListener("resize", sendSize)
  sendSize()

  console.log("using OffscreenCanvas")
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({ canvas, type: "init" })

  function sendSize() {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }

  window.addEventListener("resize", sendSize)
  sendSize()

  console.log("using regular canvas")
}

export function startLooping(canvas: HTMLCanvasElement, tryOffscreen = true) {
  // @ts-ignore
  if (tryOffscreen && canvas.transferControlToOffscreen) {
    startWorker(canvas)
  } else {
    startMainPage(canvas)
  }
}
