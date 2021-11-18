import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"

export default function () {
  const plane = new Mesh(new PlaneGeometry(10, 10), new MeshLambertMaterial({ color: 0x001000 }))
  plane.position.setY(-0.1)
  plane.rotateX(-Math.PI / 2)
  plane.receiveShadow = true
  return plane
}
