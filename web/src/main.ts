import * as THREE from "three"
import { canvasState } from "@depth/statem"
import { startLooping, stopLooping, exec3D, loop3D } from "@depth/canvas"
import "@depth/ui/dist/canvas-toolbar"
import Page from "./pages/testplay"

const tpl = document.querySelector("#tpl-ui")!
document.querySelector("#ui")!.innerHTML = tpl.innerHTML
tpl.remove()

const scene = document.querySelector<HTMLDivElement>("#scene")!
let canvas: HTMLCanvasElement

const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0x669913 }))
cube.position.setZ(95)

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

    loop3D(({ camera, time, deltaTime }) => {
      console.log([time, deltaTime])
      camera.rotateY(0.05)
    })
  } else {
    stopLooping()
    canvas.remove()
  }
}, "running")

// canvasState.subscribe(v => {
//   console.log("PF", v)
// })

Page()

export {}
