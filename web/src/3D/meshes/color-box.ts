import { Object3D } from "three/src/core/Object3D"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"

interface Parameters {
  edge: number
  color: number
  wireframe?: boolean
}

export default function ({ edge, color, wireframe }: Parameters) {
  const geometry = new BoxGeometry(edge, edge, edge)
  const material = new MeshLambertMaterial({ color, wireframe: !!wireframe })
  const mesh = new Mesh(geometry, material)
  mesh.position.setY(edge / 2)
  const pivot = new Object3D()
  pivot.add(mesh)
  return pivot
}
