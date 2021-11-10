// TODO: should replace src/3D/factories.ts
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Object3D } from "three/src/core/Object3D"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { SphereGeometry } from "three/src/geometries/SphereGeometry"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { Line } from "three/src/objects/Line"
import { Mesh } from "three/src/objects/Mesh"

const yellowishMaterial = new LineBasicMaterial({ color: 0xffff66 })
const redMaterial = new LineBasicMaterial({ color: 0xff0000 })
const blueMaterial = new LineBasicMaterial({ color: 0x0000ff })

interface LineParams {
  points?: THREE.Vector3[]
  visible?: boolean
  name?: string
  color?: "yellowish" | "red" | "blue"
}

export default function useObjectFactory() {
  const cube = () => {
    const geometry = new BoxGeometry(0.1, 0.1, 2)
    const material = new MeshBasicMaterial({ color: 0x666666, wireframe: true })
    const cube = new Mesh(geometry, material)

    cube.position.set(0, 0, 1)
    const pivot = new Object3D()
    pivot.add(cube)
    return pivot
  }

  const line = (params: LineParams = {}) => {
    const { name, points, visible = true, color = "yellowish" } = params
    const geometry = new BufferGeometry()
    points && geometry.setFromPoints(points)

    let material: LineBasicMaterial
    switch (color) {
      case "yellowish":
        material = yellowishMaterial
        break
      case "red":
        material = redMaterial
        break
      case "blue":
        material = blueMaterial
        break
    }

    const line = new Line(geometry, material)
    line.frustumCulled = false
    name && (line.name = name)
    line.visible = visible
    return line
  }

  const sphere = () => {
    // const geometry = new SphereGeometry(15, 32, 16)
    const geometry = new SphereGeometry(1)
    const material = new MeshBasicMaterial({ color: 0x00ff00, opacity: 0.1, transparent: true })
    const sphere = new Mesh(geometry, material)
    return sphere
  }

  return {
    cube,
    line,
    sphere,
  }
}
