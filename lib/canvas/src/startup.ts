// import { statem } from "@depth/statem"
// import { init, state } from "./renderer"
import { init } from "./renderer"
// import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

// let sendSize: any
// let sendSize: Fn
// let canvas: HTMLCanvasElement

// let canvasWidth = 0
// let canvasHeight = 0

// let worker: Worker | undefined
// const resize = new ResizeObserver(([entry]) => {
//   const { blockSize: width, inlineSize: height } = entry.contentBoxSize[0]
//   console.log("RESIZE", [width, height])
//   canvasWidth = width
//   canvasHeight = height
//   canvas.width = width
//   canvas.height = height
//   console.log(sendSize)
//   sendSize.call(canvas)
// })

// function startWorker({ canvas, state, worker }: StartLoopingProps) {
function startWorker({ canvas, state, worker }) {
  // worker = new OffscreenWorker()
  const offscreen = canvas.transferControlToOffscreen!()
  const message = { type: "init", canvas: offscreen, state }

  // @ts-ignore
  worker.postMessage(message, [offscreen])

  return statem => {
    const msg = {
      type: "size",
      // width: canvas.clientWidth,
      // height: canvas.clientHeight,
      // width: canvasWidth,
      // height: canvasHeight,
      width: statem.width,
      height: statem.height,
    }
    worker!.postMessage(msg)
  }
}

// function startMainPage({ canvas, state }: Required<StartLoopingProps>) {
// function startMainPage({ canvas, state }: StartLoopingProps) {
function startMainPage({ canvas, state }) {
  // console.log(statem)
  init({
    canvas,
    type: "init",
    state,
  })

  return statem => {
    state.width = statem.width //canvas.clientWidth
    state.height = statem.height //canvas.clientHeight
    // state.width = canvasWidth
    // state.height = canvasHeight
    // state.width = canvas.parentElement!.clientWidth
    // state.height = canvas.parentElement!.clientHeight
  }
}

interface StartLoopingProps {
  canvas: HTMLCanvasElement
  // offscreen: boolean
  state?: RendererState
  statem?: any
  worker?: any
}

interface StartLoopingReturn {
  stopLooping: () => void
  exec3D: (fn: CanvasInjectedFn) => void
  loop3D: (fn: CanvasInjectedFn) => void
}

export function startLooping({ canvas, statem }: StartLoopingProps): StartLoopingReturn {
  const useWorker = statem.offscreen && "transferControlToOffscreen" in canvas
  console.log(useWorker ? "3D render in worker thread" : "3D render on main thread")

  const state: RendererState = {
    // fps: Number.POSITIVE_INFINITY,
    fps: 30,
    width: 320,
    height: 200,
    running: false,
    singleEvals: [],
    loopEvals: [],
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker | undefined
  // let worker: Worker | null = null

  // sendSize = useWorker ? startWorker() : startMainPage(statem)
  let sendSize: (s: typeof statem) => void

  if (useWorker) {
    // alert("Boo")
    worker = new OffscreenWorker()
    sendSize = startWorker({ canvas, state, worker })
  } else {
    sendSize = startMainPage({ canvas, state })
    // console.log({ canvas })
    // init({
    //   canvas,
    //   type: "init",
    //   statem,
    // })
  }

  // sendSize({ width: 320, height: 200 })

  statem.subscribe(s => {
    // console.log([s.width, s.height])
    sendSize(s)
  })
  // resize.observe(canvas)
  // sendSize.call(canvas)
  // sendSize.canvas()
  // @ts-ignore
  // window.addEventListener("resize", sendSize, true)

  return {
    stopLooping: () => {
      // resize.disconnect()
      worker?.postMessage({ type: "stop" }) ?? (state.running = false)
    },

    exec3D: (fn: CanvasInjectedFn) => {
      // console.log("AJJAJAJJA", worker)
      worker?.postMessage({ type: "exec3D", fn: fn.toString() }) ?? state.singleFns.push(fn)
    },
    loop3D: (fn: CanvasInjectedFn) => {
      worker?.postMessage({ type: "loop3D", fn: fn.toString() }) ?? state.loopFns.push(fn)
    },
  }
}

// export function stopLooping() {
//   // resize.disconnect()
//   worker?.postMessage({ type: "stop" }) ?? (state.running = false)
// }

// export function exec3D(fn: CanvasInjectedFn) {
//   worker?.postMessage({ type: "exec3D", fn: fn.toString() }) ?? state.singleFns.push(fn)
// }

// export function loop3D(fn: CanvasInjectedFn) {
//   worker?.postMessage({ type: "loop3D", fn: fn.toString() }) ?? state.loopFns.push(fn)
// }
