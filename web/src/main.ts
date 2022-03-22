import * as THREE from "three"
import { degInRad } from "@depth/misc"
// // import { canvasState } from "@depth/statem"
// import { statem } from "@depth/statem"
// import { exec3D, loop3D } from "@depth/canvas"
// import "@depth/ui/dist/d-button"
// import "./state"
import "@depth/ui/dist/d-gaze-click"
import "@depth/ui/dist/d-canvas"
import "@depth/ui/dist/d-toolbar"
import "@depth/ui/dist/d-icon"
// import Page from "./pages/testplay"
import "./styles/main.css"

// const tpl = document.querySelector("#tpl-ui")!
// document.querySelector("#ui")!.innerHTML = tpl.innerHTML
// tpl.remove()

// const scene = document.querySelector<HTMLDivElement>("#scene")!
// let canvas: HTMLCanvasElement

for (const el of document.querySelectorAll("d-canvas")) {
  el.addEventListener("start", (ev) => {
    const { exec3D, loop3D } = ev.detail
    exec3D(({ scene }) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshPhongMaterial({ color: 0x669913, wireframe: true })
      )
      cube.position.setZ(-2)
      scene.add(cube)
    })

    loop3D(({ camera, deltaTime }) => {
      // camera.rotateZ(0.5 * deltaTime)
      // camera.rotateZ(0.5 * deltaTime)
      // console.log({ deltaTime })
      camera.rotation.z += degInRad(100) * deltaTime
    })
  })
}

// Page()

export {}
