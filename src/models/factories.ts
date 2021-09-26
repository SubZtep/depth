import type { ColorRepresentation } from "three"
import { SphereGeometry, MeshPhongMaterial, Mesh, BufferGeometry, LineBasicMaterial, Line } from "three"

interface KeypointFactoryOptions {
  name?: string
  color: ColorRepresentation
  visible?: boolean
}

const sphereGeometry = new SphereGeometry(0.06, 8, 6)
export const whiteMaterial = new MeshPhongMaterial({ color: 0x69ffff, flatShading: true })
export const redMaterial = new MeshPhongMaterial({ color: 0xff0000, flatShading: true })

const materials = new Map<ColorRepresentation, MeshPhongMaterial>()


export function keypointFactory(options: KeypointFactoryOptions): KeypointMesh {
  if (!materials.has(options.color)) {
    materials.set(options.color, new MeshPhongMaterial({ color: options.color, flatShading: true }))
  }

  const mesh = new Mesh(sphereGeometry, materials.get(options.color))
  mesh.castShadow = true
  mesh.receiveShadow = true
  if (options.name !== undefined) {
    mesh.name = options.name
  }
  if (options.visible !== undefined) {
    mesh.visible = options.visible
  }
  return mesh
}

export const boneMaterial = new LineBasicMaterial({ color: 0xe3dac9 })
export const badBoneMaterial = new LineBasicMaterial({ color: 0xcc0033 })

export function lineFactory(name?: string, visible = true, points?: THREE.Vector3[]) {
  const geometry = new BufferGeometry()
  if (points) {
    geometry.setFromPoints(points)
  }
  const line = new Line(geometry, boneMaterial)
  line.frustumCulled = false
  if (name !== undefined) {
    line.name = name
  }
  line.visible = visible
  return line
}
