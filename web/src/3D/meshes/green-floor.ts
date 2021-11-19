import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"

export default function () {
  const geometry = new PlaneGeometry(10, 10)
  const material = new MeshLambertMaterial({ color: 0x001000 })
  const plane = new Mesh(geometry, material)
  plane.position.setY(-0.1)
  plane.rotateX(-Math.PI / 2)
  plane.matrixAutoUpdate = false
  plane.updateMatrix()
  plane.receiveShadow = true
  return plane
}
