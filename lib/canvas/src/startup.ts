import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker({ canvas, state, worker }): SendSizeFn {
  const offscreen = canvas.transferControlToOffscreen!()
  const message = { type: "init", canvas: offscreen, state }

  worker.postMessage(message, [offscreen])

  return (statem) => {
    worker.postMessage({
      type: "size",
      width: statem.width,
      height: statem.height,
    })
  }
}

function startMainPage({ canvas, state, statem }): SendSizeFn {
  init({
    type: "init",
    canvas,
    state,
    statem,
  })

  return (_statem) => {
    // statem.width = statem.width
    // statem.height = statem.height
  }
}

interface Properties {
  canvas: HTMLCanvasElement
  state?: RendererState
  statem?: any
  worker?: any
}

interface StartLoopingReturn {
  stopLooping: Fn
  exec3D: (fn: CanvasInjectedFn) => void
  loop3D: (fn: CanvasInjectedFn) => void
}

export function startLooping({ canvas, statem }: Properties): StartLoopingReturn {
  statem.offscreen = "transferControlToOffscreen" in canvas && statem.offscreen
  console.log(statem.offscreen ? "3D render in worker thread" : "3D render on main thread")

  const state: RendererState = {
    singleEvals: [],
    loopEvals: [],
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker | undefined
  let sendSize: SendSizeFn

  if (statem.offscreen) {
    worker = new OffscreenWorker()
    sendSize = startWorker({ canvas, state, worker })
  } else {
    sendSize = startMainPage({ canvas, state, statem })
  }

  statem.subscribe((s) => {
    sendSize(s)
  })

  return {
    stopLooping: () =>
      statem.offscreen ? worker!.postMessage({ type: "stop" }) : (statem.running = false) /* * * * * */,
    exec3D: (fn: CanvasInjectedFn) =>
      statem.offscreen ? worker?.postMessage({ type: "exec3D", fn: fn.toString() }) : state.singleFns.push(fn),
    loop3D: (fn: CanvasInjectedFn) =>
      statem.offscreen ? worker?.postMessage({ type: "loop3D", fn: fn.toString() }) : state.loopFns.push(fn),
  }
}
