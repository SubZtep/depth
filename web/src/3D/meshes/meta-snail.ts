import { Object3D } from "three"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"

export default function (color: number) {
  const geometry = new TorusKnotGeometry(0.12, 0.08, 24, 5, 4, 1)
  const material = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
  const mesh = new Mesh(geometry, material)
  mesh.position.setY(0.25)
  const pivot = new Object3D()
  pivot.add(mesh)
  return pivot
}
