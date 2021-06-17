import { group } from "console"
import * as THREE from "three"

export function videoMeshFactory(video: HTMLVideoElement) {
  const geometry = new THREE.PlaneBufferGeometry()
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const texture = new THREE.VideoTexture(video)
  material.map = texture
  material.needsUpdate = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = `video-player-${video.id}`
  return mesh
}

const sphereGeometry = new THREE.SphereGeometry(0.05, 6, 5)

export function sphereFactory() {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
  return new THREE.Mesh(sphereGeometry, material)
}


export function lineFactory(points?: THREE.Vector3[]) {
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  if (points) {
    geometry.setFromPoints(points)
  }
  return new THREE.Line(geometry, material)
}
