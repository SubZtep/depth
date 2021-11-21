import { useSingleton } from "@depth/misc"
import { exec3D } from "@depth/three.js"
import { Color } from "three/src/math/Color"
import { Object3D } from "three/src/core/Object3D"

type SceneBackground = THREE.Color | THREE.Texture | null

const bgForPage = (temporaryBackground: SceneBackground | number) => {
  let bg: SceneBackground
  onMounted(() =>
    exec3D(({ scene }) => {
      bg = scene.background
      scene.background = typeof temporaryBackground === "number" ? new Color(temporaryBackground) : temporaryBackground
    })
  )
  onBeforeUnmount(() => {
    exec3D(({ scene }) => {
      scene.background = bg
    })
  })
}

const addForPage = (...object: Object3D[]): Promise<void> => {
  const promise: Promise<void> = new Promise(resolve => {
    tryOnMounted(() =>
      exec3D(({ scene }) => {
        scene.add(...object)
        resolve()
      })
    )
  })
  tryOnBeforeUnmount(() =>
    exec3D(({ scene }) => {
      scene.remove(...object)
    })
  )
  return promise
}

export default function useSceneHelper() {
  const single = useSingleton()

  const removeForPage = (singletonName: string) => {
    if (!single.has(singletonName)) return

    const object = single.get(singletonName)

    onMounted(() => {
      exec3D(({ scene }) => scene.remove(object))
    })
    onBeforeUnmount(() => {
      exec3D(({ scene }) => scene.add(object))
    })
  }

  return {
    removeForPage,
    bgForPage,
    addForPage,
  }
}
