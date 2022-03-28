/* eslint-disable no-constant-condition */
import { init } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"
import * as THREE from "three"

function startWorker({ canvas, injectedFunctions, statem, worker, scene }: StartWorkerProps) {
  const offscreen = canvas.transferControlToOffscreen!()
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

function startMainPage({ canvas, injectedFunctions, statem, scene, width, height }: StartMainProps) {
  init({
    type: "init",
    canvas,
    injectedFunctions,
    statem,
    scene,
    width,
    height,
  })
}

export function startLooping(props: StartLoopingProps): StartLoopingReturn {
  // statem.offscreen = "transferControlToOffscreen" in canvasRef.value && statem.offscreen
  const offscreen = false

  // if (!scene) {
  //   // scene = new THREE.Scene()
  //   // scene = new THREE.ObjectLoader().parse(statem.scene!)
  // }

  const injectedFunctions: InjectedFunctions = {
    singleFns: [],
    loopFns: [],
  }

  let worker: Worker
  let sendStatem: WorkerStatemFn

  if (offscreen) {
    // worker = new OffscreenWorker()
    // sendStatem = startWorker({ canvasRef, injectedFunctions, statem, worker, scene })
    // const unsubscribe = statem.subscribe((s: CanvasStatem) => {
    //   if (!s.running) {
    //     unsubscribe()
    //     worker.terminate()
    //     return
    //   }
    //   sendStatem(JSON.stringify(s))
    // })
  } else {
    startMainPage(props as StartMainProps)
  }

  // if (props.statem.scene) {
  //   /* eslint-disable @typescript-eslint/no-empty-function */
  //   return {
  //     scene: props.statem.scene,
  //     exec3D: () => {},
  //     loop3D: () => {},
  //   }
  // }

  return {
    scene: new THREE.Scene(), //props.statem.scene,
    exec3D: (fn: CanvasInjectedFn) =>
      false
        ? worker?.postMessage({ type: "exec3D", fn: fn.toString() })
        : injectedFunctions!.singleFns.push(fn),
    loop3D: (fn: CanvasInjectedFn) =>
      false
        ? worker?.postMessage({ type: "loop3D", fn: fn.toString() })
        : injectedFunctions!.loopFns.push(fn),
  }
}
