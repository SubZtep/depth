import * as THREE from "three"

const canvas = document.querySelector("#green")!
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
  logarithmicDepthBuffer: true,
})
export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {

  exec3D(({ scene, renderer }) => {
    const cam = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    cam.position.set(0, 5, 0)
    cam.lookAt(0, 0, 0)
    scene.add(cam)
    return
  })

  loop3D(({ scene }) => {
    const cam = scene.children.at(-1)
    renderer.render(scene, cam)
  })
}
