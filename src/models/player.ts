import * as THREE from "three"

export function videoMesh(video: HTMLVideoElement) {
  const geometry = new THREE.PlaneBufferGeometry()
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const texture = new THREE.VideoTexture(video)
  material.map = texture
  material.needsUpdate = true
  const mesh = new THREE.Mesh(geometry, material)
  // mesh.name = "video-player"
  mesh.name = video.id
  return mesh
}
