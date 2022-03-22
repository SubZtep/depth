import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker({ canvas, injectedFunctions, statem, worker }: StartWorkerProps) {
  const offscreen = canvas.transferControlToOffscreen!()
  const message = {
    type: "init",
    canvas: offscreen,
    injectedFunctions,
  }
  const updateStatem: WorkerStatemFn = (seriStatem: CanvasStatemSerialised) => {
    worker.postMessage({
      type: "updateStatem",
      statem: seriStatem,
    })
  }
  updateStatem(statem.toString())
  worker.postMessage(message, [offscreen])
  return updateStatem
}

function startMainPage({ canvas, injectedFunctions, statem }: StartMainProps) {
  init({
    type: "init",
    canvas,
    injectedFunctions,
    statem,
  })
}

export function startLooping({ canvas, statem }: StartLoopingProps): StartLoopingReturn {
  statem.offscreen = "transferControlToOffscreen" in canvas && statem.offscreen

  const injectedFunctions: InjectedFunctions = {
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker
  let sendStatem: WorkerStatemFn

  if (statem.offscreen) {
    worker = new OffscreenWorker()
    sendStatem = startWorker({ canvas, injectedFunctions, statem, worker })
    const unsubscribe = statem.subscribe((s: CanvasStatem) => {
      if (!s.running) {
        unsubscribe()
        worker.terminate()
        return
      }
      sendStatem(JSON.stringify(s))
    })
  } else {
    startMainPage({ canvas, injectedFunctions, statem })
  }

  return {
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
