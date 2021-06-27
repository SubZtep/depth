import { SphereGeometry, MeshBasicMaterial, Mesh, BufferGeometry, LineBasicMaterial, Line } from "three"

const sphereGeometry = new SphereGeometry(0.05, 6, 5)
export const whiteMaterial = new MeshBasicMaterial({ color: 0xffffff })
export const redMaterial = new MeshBasicMaterial({ color: 0xff0000 })

export function keypointFactory(): KeypointMesh {
  return new Mesh(sphereGeometry, whiteMaterial)
}

const boneMaterial = new LineBasicMaterial({ color: 0xe3dac9 })
export function lineFactory(points?: THREE.Vector3[]) {
  const geometry = new BufferGeometry()
  if (points) {
    geometry.setFromPoints(points)
  }
  return new Line(geometry, boneMaterial)
}
