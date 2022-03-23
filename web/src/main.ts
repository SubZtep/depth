/* eslint-disable @typescript-eslint/no-unused-vars */
import basicCube from "./canvas3ds/basic-cube"
import "@depth/ui"
import "./styles/main.css"
import * as THREE from "three"

const numberOfCubes = 13

function createCube(i: number) {
  const width = i * 10
  const segments = Math.trunc(numberOfCubes / 10) + Math.trunc(i / 10)
  const normal = 1 - i / numberOfCubes

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(width, width, width, segments, segments, segments),
    // new THREE.BoxGeometry(width, width, width, Math.floor(width / 5), Math.floor(width / 5), Math.floor(width / 5)),
    new THREE.MeshPhongMaterial({ color: 0x669913, transparent: true, wireframe: true, opacity: normal })
    // new THREE.MeshPhongMaterial({ color: 0x669913, transparent: true, wireframe: true, opacity: normal })
  )

  /** min and max included */
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  cube.receiveShadow = true
  cube.castShadow = true
  const light = new THREE.PointLight(0x69ff69, 1)
  light.power = 10
  light.decay = 2
  light.distance = width // Number.POSITIVE_INFINITY
  light.position.setZ(width / 2 + 1)
  cube.add(light)
  cube.position.set(randomInt(-50, 50), randomInt(-50, 50), randomInt(-50, 50))
  return cube
}

function rotateObject(cube: THREE.Mesh, time: number, speed = 0.05) {
  const rot = time * speed
  cube.rotation.x = rot
  cube.rotation.y = rot
}

globalThis.mc = (sid: string) => {
  const el = document.createElement("d-canvas")
  el.classList.add("paused")
  el.setAttribute("sid", sid)
  el.setAttribute("offscreen", "true")
  el.setAttribute("autoplay", "true")
  document.querySelector(".holes")?.append(el)
  setTimeout(() => el.classList.add("zoom"), 1000)

  // el.addEventListener("start", (xxx) => {
  // el.addEventListener("start", ({ detail: { exec3D, loop3D } }) => {
  //   // console.log({ xxx })
  //   exec3D(({ scene }) => {
  //     const cubes = Array.from({ length: 10 }, (_, i) => createCube(i))
  //     const light = new THREE.DirectionalLight(0xff0000, 0.2)
  //     light.position.set(0, 10, 0)
  //     light.target.position.set(-5, 0, 0)
  //     scene.add(light, light.target, ...cubes)
  //   })
  //   loop3D(({ scene, deltaTime }) => {
  //     for (const [index, cube] of scene.cubes.entries()) {
  //       rotateObject(cube, deltaTime, (cubes.length - index) * 0.1)
  //     }
  //   })
  // })

  // console.log(el)
  return el
}

const canvases = Array.from({ length: numberOfCubes }, () => globalThis.mc("666"))
document.querySelector(".holes")?.append(...canvases)


for (const el of document.querySelectorAll("d-canvas")) {
  el.addEventListener("start", basicCube)
  // el.addEventListener("start", ({ detail }) => basicCube(detail))
}

export {}
