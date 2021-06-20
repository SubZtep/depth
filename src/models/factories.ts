import * as THREE from "three"

const sphereGeometry = new THREE.SphereGeometry(0.05, 6, 5)
export const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
export const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })

export function keypointFactory(): KeypointMesh {
  return new THREE.Mesh(sphereGeometry, whiteMaterial)
}

const boneMaterial = new THREE.LineBasicMaterial({ color: 0xe3dac9 })
export function lineFactory(points?: THREE.Vector3[]) {
  const geometry = new THREE.BufferGeometry()
  if (points) {
    geometry.setFromPoints(points)
  }
  return new THREE.Line(geometry, boneMaterial)
}
