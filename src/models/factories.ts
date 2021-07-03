import { SphereGeometry, MeshBasicMaterial, Mesh, BufferGeometry, LineBasicMaterial, Line } from "three"

const sphereGeometry = new SphereGeometry(0.05, 6, 5)
export const whiteMaterial = new MeshBasicMaterial({ color: 0xffffff })
export const redMaterial = new MeshBasicMaterial({ color: 0xff0000 })

export function keypointFactory(name?: string, visible = true): KeypointMesh {
  const mesh = new Mesh(sphereGeometry, whiteMaterial)
  if (name !== undefined) {
    mesh.name = name
  }
  mesh.visible = visible
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
