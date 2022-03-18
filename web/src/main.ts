import * as THREE from "three"
// import { sleep } from "@depth/misc"
// // import { canvasState } from "@depth/statem"
// import { statem } from "@depth/statem"
import { exec3D, loop3D } from "@depth/canvas"
// import "@depth/ui/dist/d-button"
import "./state"
import "@depth/ui/dist/d-gaze-click"
import "@depth/ui/dist/d-canvas"
import "@depth/ui/dist/d-toolbar"
import "@depth/ui/dist/d-button"
import "@depth/ui/dist/d-icon"
// import Page from "./pages/testplay"
import "./styles/main.css"

// const tpl = document.querySelector("#tpl-ui")!
// document.querySelector("#ui")!.innerHTML = tpl.innerHTML
// tpl.remove()

// const scene = document.querySelector<HTMLDivElement>("#scene")!
// let canvas: HTMLCanvasElement

document.querySelector("d-canvas")!.addEventListener("start", () => {
  exec3D(({ scene }) => {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x669913, wireframe: true })
    )
    cube.position.setZ(-2)
    scene.add(cube)
  })

  loop3D(({ camera, deltaTime }) => {
    camera.rotateZ(0.5 * deltaTime)
  })
})

// console.log("XXX", )

// const canvasState = statem("aaa")

// canvasState.subscribe(async running => {
//   if (running) {
//     // canvas = document.createElement("canvas")
//     // scene.append(canvas)

//     // await startLooping({ canvas, offscreen: canvasState.offscreen })

//     console.log("RUNNING")

//     exec3D(({ scene }) => {
//       const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0x669913 }))
//       cube.position.setZ(95)
//       scene.add(cube)
//     })

//     loop3D(({ camera, deltaTime }) => {
//       console.log({ deltaTime })
//       camera.rotateY(0.05 * deltaTime)
//     })
//   } else {
//     // stopLooping()
//     // canvas.remove()
//   }
// }, "running")

// canvasState.subscribe(async running => {
//   if (running) {
//     canvas = document.createElement("canvas")
//     scene.append(canvas)

//     await startLooping({ canvas, offscreen: canvasState.offscreen })

//     exec3D(({ scene }) => {
//       const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0x669913 }))
//       cube.position.setZ(95)
//       scene.add(cube)
//     })

//     loop3D(({ camera, deltaTime }) => {
//       console.log({ deltaTime })
//       camera.rotateY(0.05 * deltaTime)
//     })
//   } else {
//     stopLooping()
//     canvas.remove()
//   }
// }, "running")

// canvasState.subscribe(async () => {
//   if (canvasState.running) {
//     canvasState.running = false
//     await sleep(100)
//     canvasState.running = true
//   }
// }, "offscreen")

// Page()

export {}
