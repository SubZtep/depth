import * as THREE from "three"

// TODO: make proper singleton (?)
const pool: THREE.Mesh[] = []

export function useObjectPool(options: ObjectPoolOptions = {}) {
  const { size = 10 /* 33 */ } = options

  const geometry = new THREE.SphereGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x8a0303 })

  for (let i = 0; i < size; i++) {
    const simpleSphere = new THREE.Mesh(geometry, material)
    pool.push(simpleSphere)
  }

  /** retreive an object */
  const pop = () => {
    if (pool.length === 0) {
      throw new Error("empty object pool")
    }
    return pool.pop()!
  }

  /** return an object */
  const push = (obj: THREE.Mesh) => {
    pool.push(obj)
  }

  return {
    push,
    pop,
  }
}
