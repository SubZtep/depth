import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"
import * as THREE from "three"

function startWorker({ canvasRef, injectedFunctions, statem, worker, scene }: StartWorkerProps) {
  const offscreen = canvasRef.value.transferControlToOffscreen!()
  const message = {
    type: "init",
    canvas: offscreen,
    injectedFunctions,
    scene: scene.toJSON(),
    // scene: JSON.stringify(scene),
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

function startMainPage({ canvasRef, injectedFunctions, statem, scene }: StartMainProps) {
  init({
    type: "init",
    canvasRef,
    injectedFunctions,
    statem,
    scene,
  })
}

export function startLooping({ canvasRef, statem, cameraView, scene }: StartLoopingProps): StartLoopingReturn {
  statem.offscreen = "transferControlToOffscreen" in canvasRef.value && statem.offscreen

  if (!scene) {
    scene = new THREE.Scene()
    // scene = new THREE.ObjectLoader().parse(statem.scene!)
  }

  const injectedFunctions: InjectedFunctions = {
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker
  let sendStatem: WorkerStatemFn

  if (statem.offscreen) {
    worker = new OffscreenWorker()
    sendStatem = startWorker({ canvasRef, injectedFunctions, statem, worker, scene })
    const unsubscribe = statem.subscribe((s: CanvasStatem) => {
      if (!s.running) {
        unsubscribe()
        worker.terminate()
        return
      }
      sendStatem(JSON.stringify(s))
    })
  } else {
    startMainPage({ canvasRef, injectedFunctions, statem, scene })
  }

  if (cameraView) {
    /* eslint-disable @typescript-eslint/no-empty-function */
    return {
      scene,
      exec3D: () => {},
      loop3D: () => {},
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
