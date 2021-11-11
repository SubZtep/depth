// TODO: should replace src/3D/factories.ts
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Object3D } from "three/src/core/Object3D"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"
import { SphereGeometry } from "three/src/geometries/SphereGeometry"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
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
    // const material = new MeshBasicMaterial({ color: 0x00ff00, opacity: 0.1, transparent: true })
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    const sphere = new Mesh(geometry, material)
    return sphere
  }

  const cone = () => {
    const geometry = new ConeGeometry(0.2, 2, 4)
    const material = new MeshPhongMaterial({ color: 0xaaaa00 })
    const cone = new Mesh(geometry, material)
    cone.position.set(0, 1, 0)
    return cone
  }

  return {
    cube,
    line,
    sphere,
    cone,
  }
}
