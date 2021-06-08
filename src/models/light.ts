import * as THREE from "three"

export function getLights() {
  const ambient = new THREE.AmbientLight(0x222222)
  const directional = new THREE.DirectionalLight(0xffffff, 1)
  directional.position.set(80, 80, 80)
  return [ambient, directional]
}
