import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker({ canvas, injectedFunctions, statem, worker }) {
  const offscreen = canvas.transferControlToOffscreen!()
  const message = {
    type: "init",
    canvas: offscreen,
    injectedFunctions,
  }
  const updateStatem = (seriStatem: string) => {
    worker.postMessage({
      type: "updateStatem",
      statem: seriStatem,
    })
  }
  updateStatem(statem.toString())
  worker.postMessage(message, [offscreen])
  return updateStatem
}

function startMainPage({ canvas, injectedFunctions, statem }) {
  init({
    type: "init",
    canvas,
    injectedFunctions,
    statem,
  })
}

interface Properties {
  canvas: HTMLCanvasElement
  injectedFunctions?: InjectedFunctions
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

  const injectedFunctions: InjectedFunctions = {
    singleEvals: [],
    loopEvals: [],
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker
  let sendStatem: Fn

  if (statem.offscreen) {
    worker = new OffscreenWorker()
    sendStatem = startWorker({ canvas, injectedFunctions, statem, worker })
    statem.subscribe((s: CanvasStatem) => {
      if (!s.running) {
        worker.terminate()
        return
      }
      sendStatem(JSON.stringify(s))
    })
  } else {
    startMainPage({ canvas, injectedFunctions, statem })
  }

  return {
    stopLooping: () => {
      statem.running = false
    },
    exec3D: (fn: CanvasInjectedFn) =>
      statem.offscreen
        ? worker?.postMessage({ type: "exec3D", fn: fn.toString() })
        : injectedFunctions.singleFns.push(fn),
    loop3D: (fn: CanvasInjectedFn) =>
      statem.offscreen
        ? worker?.postMessage({ type: "loop3D", fn: fn.toString() })
        : injectedFunctions.loopFns.push(fn),
  }
}
