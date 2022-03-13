import { init, state } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

let worker: Worker | undefined

async function startWorker(canvas: HTMLCanvasElement) {
  worker = new OffscreenWorker()
  const offscreen = canvas.transferControlToOffscreen!()
  const message = { type: "init", canvas: offscreen }
  // @ts-ignore
  worker.postMessage(message, [offscreen])

  return () => {
    const msg = {
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }
    worker!.postMessage(msg)
  }
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({
    canvas,
    type: "init",
  })

  return () => {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
}

interface StartLoopingProps {
  /** Canvas with the potential of WebGL2 context */
  canvas: HTMLCanvasElement
  /** Prefer offscreen */
  offscreen: boolean
}

export async function startLooping({ canvas, offscreen }: StartLoopingProps) {
  const useWorker = offscreen && "transferControlToOffscreen" in canvas
  console.log(useWorker ? "Using worker" : "Using main page")
  const sendSize = useWorker ? await startWorker(canvas) : startMainPage(canvas)
  sendSize.call(canvas)
  // sendSize.canvas()
  // @ts-ignore
  // window.addEventListener("resize", sendSize, true)
}

export function stopLooping() {
  worker?.postMessage({ type: "stop" }) ?? (state.running = false)
}

export function exec3D(fn: CanvasInjectedFn) {
  worker?.postMessage({ type: "exec3D", fn: fn.toString() }) ?? state.singleFns.push(fn)
}

export function loop3D(fn: CanvasInjectedFn) {
  worker?.postMessage({ type: "loop3D", fn: fn.toString() }) ?? state.loopFns.push(fn)
}
