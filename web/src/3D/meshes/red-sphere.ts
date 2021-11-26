import { SphereGeometry } from "three/src/geometries/SphereGeometry"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Mesh } from "three/src/objects/Mesh"

export default function () {
  const sphereGeometry = new SphereGeometry(1, 32, 32)
  const sphereMaterial = new MeshStandardMaterial({ color: 0xff0000 })
  const sphere = new Mesh(sphereGeometry, sphereMaterial)
  sphere.position.setY(5).setX(2)
  sphere.castShadow = true
  return sphere
}
