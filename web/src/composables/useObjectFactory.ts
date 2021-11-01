// TODO: should replace src/3D/factories.ts
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Object3D } from "three/src/core/Object3D"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { Line } from "three/src/objects/Line"
import { Mesh } from "three/src/objects/Mesh"

const yellowishMaterial = new LineBasicMaterial({ color: 0xffff66 })

interface LineParams {
  points?: THREE.Vector3[]
  visible?: boolean
  name?: string
}

export default function useObjectFactory() {
  const cube = () => {
    const geometry = new BoxGeometry(0.1, 0.1, 5)
    const material = new MeshBasicMaterial({ color: 0x666666, wireframe: true })
    const cube = new Mesh(geometry, material)

    cube.position.set(0, 0, 2.5)
    const pivot = new Object3D()
    pivot.add(cube)
    return pivot
  }

  const line = (params: LineParams = {}) => {
    const { name, points, visible = true } = params
    const geometry = new BufferGeometry()
    points && geometry.setFromPoints(points)
    const line = new Line(geometry, yellowishMaterial)
    line.frustumCulled = false
    name && (line.name = name)
    line.visible = visible
    return line
  }

  return {
    cube,
    line,
  }
}
