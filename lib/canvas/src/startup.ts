import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"

function startWorker({ canvas, injectedFunctions, statem, worker }): SendSizeFn {
  const offscreen = canvas.transferControlToOffscreen!()
  const message = {
    type: "init",
    canvas: offscreen,
    injectedFunctions,
    statem: { running: statem.running, fps: statem.fps, width: statem.width, height: statem.height },
  }

  worker.postMessage(message, [offscreen])

  return (statem) => {
    worker.postMessage({
      type: "size",
      width: statem.width,
      height: statem.height,
    })
  }
}

function startMainPage({ canvas, injectedFunctions, statem }): SendSizeFn {
  init({
    type: "init",
    canvas,
    injectedFunctions,
    statem,
  })

  return (_statem) => {
    // statem.width = statem.width
    // statem.height = statem.height
  }
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

  let worker: Worker | undefined
  let sendSize: SendSizeFn

  if (statem.offscreen) {
    worker = new OffscreenWorker()
    sendSize = startWorker({ canvas, injectedFunctions, statem, worker })
  } else {
    sendSize = startMainPage({ canvas, injectedFunctions, statem })
  }

  statem.subscribe((s) => {
    // console.log("SENDSIZECB", s)
    sendSize(s)
  })

  return {
    stopLooping: () => {
      statem.offscreen ? worker!.postMessage({ type: "stop" }) : (statem.running = false)
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
