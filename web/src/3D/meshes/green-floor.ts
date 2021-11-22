import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"

interface Paramerters {
  planeWidth?: number
  opacity?: number
}

export default function (parameters: Paramerters = {}) {
  const { planeWidth = 20, opacity = 1 } = parameters
  const geometry = new PlaneGeometry(planeWidth, planeWidth)
  const material = new MeshLambertMaterial({ color: 0x000300 })
  if (opacity < 1) material.alphaTest = opacity
  const plane = new Mesh(geometry, material)
  plane.position.setY(-0.2)
  plane.rotateX(-Math.PI / 2)
  plane.matrixAutoUpdate = false
  plane.updateMatrix()
  plane.receiveShadow = true
  return plane
}
