import * as THREE from "three"

const pool: KeypointMesh[] = []

const poolSize = 66
const geometry = new THREE.SphereGeometry(0.05, 6, 5)

for (let i = 0; i < poolSize; i++) {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
  const simpleSphere = new THREE.Mesh(geometry, material)
  pool.push(simpleSphere)
}

/** retreive an object */
export function pop() {
  if (pool.length === 0) {
    throw new Error("empty object pool")
  }
  return pool.pop()!
}

/** return an object */
export function push(obj: KeypointMesh) {
  pool.push(obj)
}
