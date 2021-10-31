import { exec3D } from "@depth/three.js"
import type { Object3D } from "three"

interface Pool<T> {
  creator: () => T
  objects: T[]

  /** Index of the last assigned object */
  assigned: number
}

const pools = new Map<string, Pool<unknown>>()

export default function useObjectPool<T>(modelType: string, creator: () => T, size: number) {
  let pool: Pool<T>

  if (pools.has(modelType)) {
    pool = pools.get(modelType) as Pool<T>
  } else {
    const objects: T[] = []

    for (let i = 0; i < size; i++) {
      objects.push(creator())
    }

    pool = {
      creator,
      objects,
      assigned: -1,
    }

    pools.set(modelType, pool)
  }

  const acquire = () => {
    if (pool.objects.length - 1 === pool.assigned) {
      throw new Error("No more pool object")
    }

    const obj = pool.objects[++pool.assigned]
    exec3D(({ scene }) => (scene.add(obj as unknown as Object3D)))
    return obj
  }

  const release = () => {
    if (pool.assigned === -1) {
      throw new Error("Nothing to return")
    }

    const obj = pool.objects[pool.assigned--]
    exec3D(({ scene }) => (scene.remove(obj as unknown as Object3D)))
  }

  return {
    acquire,
    release,
    assigned: () => pool.assigned,
  }
}
