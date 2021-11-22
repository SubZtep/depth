// TODO: should replace src/3D/factories.ts
import {
  BoxGeometry,
  ConeGeometry,
  SphereGeometry,
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshPhongMaterial,
  BufferGeometry,
  Object3D,
  Line,
  Mesh,
} from "@depth/three.js"

const yellowishMaterial = new LineBasicMaterial({ color: 0xff_ff_66 })
const redMaterial = new LineBasicMaterial({ color: 0xff_00_00 })
const blueMaterial = new LineBasicMaterial({ color: 0x00_00_ff })

interface LineParameters {
  points?: THREE.Vector3[]
  visible?: boolean
  name?: string
  color?: "yellowish" | "red" | "blue"
}

const cube = () => {
  const geometry = new BoxGeometry(0.1, 0.1, 2)
  const material = new MeshBasicMaterial({ color: 0x66_66_66, wireframe: true })
  const cube = new Mesh(geometry, material)

  cube.position.set(0, 0, 1)
  const pivot = new Object3D()
  pivot.add(cube)
  return pivot
}

const line = (parameters: LineParameters = {}) => {
  const { name, points, visible = true, color = "yellowish" } = parameters
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
  const material = new MeshBasicMaterial({ color: 0x00_ff_00 })
  const sphere = new Mesh(geometry, material)
  return sphere
}

const cone = () => {
  const geometry = new ConeGeometry(0.2, 2, 4)
  const material = new MeshPhongMaterial({ color: 0xaa_aa_00 })
  const cone = new Mesh(geometry, material)
  cone.position.set(0, 1, 0)
  return cone
}

export default function useObjectFactory() {
  return {
    cube,
    line,
    sphere,
    cone,
  }
}
