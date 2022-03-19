// import { exec3D, loop3D } from "@depth/canvas"
import * as THREE from "three"

console.log("page")

const numberOfCubes = 10

/** min and max included */
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function createCube(i: number) {
  const width = i * 10
  const segments = Math.trunc(numberOfCubes / 2) + Math.trunc(i / 2)
  const normal = 1 - i / numberOfCubes

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(width, width, width, segments, segments, segments),
    // new THREE.BoxGeometry(width, width, width, Math.floor(width / 5), Math.floor(width / 5), Math.floor(width / 5)),
    new THREE.MeshPhongMaterial({ color: 0x669913, transparent: true, wireframe: true, opacity: normal })
    // new THREE.MeshPhongMaterial({ color: 0x669913, transparent: true, wireframe: true, opacity: normal })
  )

  cube.receiveShadow = true
  cube.castShadow = true
  // const light = new THREE.PointLight(0x69ff69, 1)
  // light.power = 10
  // light.decay = 2
  // light.distance = width // Number.POSITIVE_INFINITY
  // light.position.setZ(width / 2 + 1)
  // cube.add(light)
  cube.position.set(randomInt(-50, 50), randomInt(-50, 50), randomInt(-50, 50))
  return cube
}

function rotateObject(cube: THREE.Mesh, time: number, speed = 0.05) {
  const rot = time * speed
  cube.rotation.x = rot
  cube.rotation.y = rot
}

let cubes: THREE.Mesh[]

const startwithme = ({ scene }: any) => {
  // const light = new THREE.DirectionalLight(0xff0000, 0.2)
  // light.position.set(0, 10, 0)
  // light.target.position.set(-5, 0, 0)
  // scene.add(light, light.target, ...cubes)

  cubes = Array.from({ length: numberOfCubes }, (_, i) => createCube(i))
  scene.add(...cubes)
}

const loopWithMe = ({ time }: any) => {
  // console.log("T", [time, deltaTime])
  for (const [index, cube] of cubes.entries()) rotateObject(cube, time, (cubes.length - index) * 0.1)
}

export default () => {
  console.log("testplay")
  // exec3D(startwithme)
  // loop3D(loopWithMe)
}
