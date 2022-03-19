import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker({ canvas, state, worker }): SendSizeFn {
  const offscreen = canvas.transferControlToOffscreen!()
  const message = { type: "init", canvas: offscreen, state }

  worker.postMessage(message, [offscreen])

  return statem => {
    const msg = {
      type: "size",
      width: statem.width,
      height: statem.height,
    }
    worker.postMessage(msg)
  }
}

function startMainPage({ canvas, state }): SendSizeFn {
  init({
    canvas,
    type: "init",
    state,
  })

  return statem => {
    state.width = statem.width
    state.height = statem.height
  }
}

interface StartLoopingProps {
  canvas: HTMLCanvasElement
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
    fps: statem.fps,
    width: statem.width,
    height: statem.height,
    running: false,
    singleEvals: [],
    loopEvals: [],
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker | undefined
  let sendSize: SendSizeFn

  if (useWorker) {
    worker = new OffscreenWorker()
    sendSize = startWorker({ canvas, state, worker })
  } else {
    sendSize = startMainPage({ canvas, state })
  }

  statem.subscribe(s => {
    sendSize(s)
  })

  return {
    stopLooping: () => {
      worker?.postMessage({ type: "stop" }) ?? (state.running = false)
    },
    exec3D: (fn: CanvasInjectedFn) => {
      worker?.postMessage({ type: "exec3D", fn: fn.toString() }) ?? state.singleFns.push(fn)
    },
    loop3D: (fn: CanvasInjectedFn) => {
      worker?.postMessage({ type: "loop3D", fn: fn.toString() }) ?? state.loopFns.push(fn)
    },
  }
}
