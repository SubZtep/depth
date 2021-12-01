import { exec3D } from "@depth/three.js"
import type { Object3D } from "three/src/core/Object3D"

interface Pool<T> {
  creator?: () => T

  objects: T[]

  /** Index of the last assigned object */
  assigned: number
}

const pools = new Map<string, Pool<unknown>>()

interface ObjectPoolParameters<T> {
  /** Name of the pool */
  modelType?: string
  /** Factory that generate a pool item */
  creator?: () => T
  /** Set for fixed size pool */
  size?: number
}

/** More than pool. */
export default function useObjectPool<T extends Object3D>(parameters: ObjectPoolParameters<T> = {}) {
  const { modelType = "base", creator, size } = parameters
  let pool: Pool<T>

  if (pools.has(modelType)) {
    pool = pools.get(modelType) as Pool<T>
  } else {
    const objects: T[] = []
    const autoSize = size === undefined

    if (!autoSize && creator) {
      for (let index = 0; index < size; index++) {
        objects.push(creator())
      }

      exec3D(({ scene }) => scene.add(...objects))
      onBeforeUnmount(() => {
        exec3D(({ scene }) => scene.remove(...objects))
        // objects.forEach(o => o.dispose() somehow)
      })
    }

    pool = {
      creator,
      objects,
      assigned: -1,
    }

    pools.set(modelType, pool)
  }

  const getByIndex = (index: number) => pool.objects[index]

  const acquire = () => {
    if (pool.objects.length - 1 === pool.assigned) {
      throw new Error("No more pool object")
    }

    const object = pool.objects[++pool.assigned]
    exec3D(({ scene }) => scene.add(object))
    return object
  }

  const release = () => {
    // FIXME: rename to dispose (?)
    if (pool.assigned === -1) {
      throw new Error("Nothing to return")
    }

    const object = pool.objects[pool.assigned--]
    exec3D(({ scene }) => scene.remove(object))
  }

  return {
    getByIndex,
    acquire,
    release,
    assigned: () => pool.assigned,
  }
}
