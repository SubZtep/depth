import { SphereGeometry, MeshStandardMaterial, Mesh } from "@depth/three.js"

export default function () {
  const sphereGeometry = new SphereGeometry(1, 32, 32)
  const sphereMaterial = new MeshStandardMaterial({ color: 0xff0000 })
  const sphere = new Mesh(sphereGeometry, sphereMaterial)
  sphere.position.setY(5).setX(2)
  sphere.castShadow = true
  return sphere
}
