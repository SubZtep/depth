import { statem } from "@depth/statem"
import { init, state } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

let sendSize: Fn
let canvas: HTMLCanvasElement

let canvasWidth = 0
let canvasHeight = 0

let worker: Worker | undefined
const resize = new ResizeObserver(([entry]) => {
  const { blockSize: width, inlineSize: height } = entry.contentBoxSize[0]
  console.log("RESIZE", [width, height])
  // canvasWidth = width
  // canvasHeight = height
  canvas.width = width
  canvas.height = height
  // sendSize.call(canvas)
})

function startWorker() {
  worker = new OffscreenWorker()
  const offscreen = canvas.transferControlToOffscreen!()
  const message = { type: "init", canvas: offscreen }
  // @ts-ignore
  worker.postMessage(message, [offscreen])

  return () => {
    const msg = {
      type: "size",
      // width: canvas.clientWidth,
      // height: canvas.clientHeight,
      width: canvasWidth,
      height: canvasHeight,
    }
    worker!.postMessage(msg)
  }
}

function startMainPage(statem: any) {
  // console.log(statem)
  init({
    canvas,
    type: "init",
    statem,
  })

  return () => {
    // state.width = canvas.clientWidth
    // state.height = canvas.clientHeight
    state.width = canvasWidth
    state.height = canvasHeight
    // state.width = canvas.parentElement!.clientWidth
    // state.height = canvas.parentElement!.clientHeight
  }
}

interface StartLoopingProps {
  /** Canvas with the potential of WebGL2 context */
  canvas: HTMLCanvasElement
  /** Prefer offscreen */
  offscreen: boolean
  /** Statem ID */
  statem: any
}

export async function startLooping({ canvas: c, offscreen, statem }: StartLoopingProps) {
  canvas = c
  // resize.observe(canvas)
  // console.log("SDCGVERGR", statem)

  // const sss = statem(statemId)
  // state.subscribe(fps => {
  //   //
  // }, "fps")

  const useWorker = offscreen && "transferControlToOffscreen" in canvas
  console.log(useWorker ? "Using worker" : "Using main page")
  sendSize = useWorker ? startWorker() : startMainPage(statem)

  resize.observe(canvas)
  // sendSize.call(canvas)
  // sendSize.canvas()
  // @ts-ignore
  // window.addEventListener("resize", sendSize, true)
}

export function stopLooping() {
  resize.disconnect()
  worker?.postMessage({ type: "stop" }) ?? (state.running = false)
}

export function exec3D(fn: CanvasInjectedFn) {
  worker?.postMessage({ type: "exec3D", fn: fn.toString() }) ?? state.singleFns.push(fn)
}

export function loop3D(fn: CanvasInjectedFn) {
  worker?.postMessage({ type: "loop3D", fn: fn.toString() }) ?? state.loopFns.push(fn)
}
