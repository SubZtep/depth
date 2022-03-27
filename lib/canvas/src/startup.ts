import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"
import * as THREE from "three"

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

function startMainPage({ canvas, injectedFunctions, statem, scene }: StartMainProps) {
  init({
    type: "init",
    canvas,
    injectedFunctions,
    statem,
    scene,
  })
}

export function startLooping({ canvas, statem, cameraView, scene }: StartLoopingProps): StartLoopingReturn {
  statem.offscreen = "transferControlToOffscreen" in canvas && statem.offscreen

  if (!scene) {
    scene = new THREE.Scene()
  }

  const injectedFunctions: InjectedFunctions | undefined = cameraView
    ? undefined
    : {
        singleFns: [],
        loopFns: [],
      }

  let worker: Worker
  let sendStatem: WorkerStatemFn

  if (statem.offscreen) {
    worker = new OffscreenWorker()
    sendStatem = startWorker({ canvas, injectedFunctions, statem, worker, scene })
    const unsubscribe = statem.subscribe((s: CanvasStatem) => {
      if (!s.running) {
        unsubscribe()
        worker.terminate()
        return
      }
      sendStatem(JSON.stringify(s))
    })
  } else {
    startMainPage({ canvas, injectedFunctions, statem, scene })
  }

  if (cameraView) {
    return {
      scene,
      exec3D: (fn) => {
        console.log("NO EXEC", fn)
      },
      loop3D: (fn) => {
        console.log("NO LOOP", fn)
      },
    }
  }

  return {
    scene,
    exec3D: (fn: CanvasInjectedFn) =>
      statem.offscreen
        ? worker?.postMessage({ type: "exec3D", fn: fn.toString() })
        : injectedFunctions!.singleFns.push(fn),
    loop3D: (fn: CanvasInjectedFn) =>
      statem.offscreen
        ? worker?.postMessage({ type: "loop3D", fn: fn.toString() })
        : injectedFunctions!.loopFns.push(fn),
  }
}
