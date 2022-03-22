import * as THREE from "three"
// import { exec3D, loop3D } from "@depth/canvas"

// import "./state"
import "@depth/ui"
// import Page from "./pages/testplay"
import "./styles/main.css"

// const tpl = document.querySelector("#tpl-ui")!
// document.querySelector("#ui")!.innerHTML = tpl.innerHTML
// tpl.remove()

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
      // camera.rotation.z += degInRad(100) * deltaTime
      camera.rotation.z += 100 * (Math.PI / 180) * deltaTime
    })
  })
}

// Page()

export {}
