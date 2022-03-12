import * as THREE from "three"
import { sleep } from "@depth/misc"
import { canvasState } from "@depth/statem"
import { startLooping, stopLooping, exec3D, loop3D } from "@depth/canvas"
// import "@depth/ui/dist/d-button"
import "@depth/ui/dist/canvas-toolbar"
// import Page from "./pages/testplay"

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.remove()

const scene = document.querySelector<HTMLDivElement>("#scene")!
let canvas: HTMLCanvasElement

canvasState.subscribe(async running => {
  if (running) {
    canvas = document.createElement("canvas")
    scene.append(canvas)

    await startLooping({ canvas, offscreen: canvasState.offscreen })

    exec3D(({ scene }) => {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0x669913 }))
      cube.position.setZ(95)
      scene.add(cube)
    })

    loop3D(({ camera, deltaTime }) => {
      console.log({ deltaTime })
      camera.rotateY(10.05 * deltaTime)
    })
  } else {
    stopLooping()
    canvas.remove()
  }
}, "running")

canvasState.subscribe(async () => {
  if (canvasState.running) {
    canvasState.running = false
    await sleep(100)
    canvasState.running = true
  }
}, "offscreen")

// Page()

export {}
