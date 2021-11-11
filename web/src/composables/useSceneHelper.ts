import useSingleton from "~/composables/useSingleton"
import { exec3D } from "@depth/three.js"
import { Color } from "three/src/math/Color"

type SceneBackground = THREE.Color | THREE.Texture | null

export default function useSceneHelper() {
  const single = useSingleton()

  const removeForPage = (singletonName: string) => {
    if (!single.has(singletonName)) return

    const obj = single.get(singletonName)

    onMounted(() => {
      exec3D(({ scene }) => scene.remove(obj))
    })
    onBeforeUnmount(() => {
      exec3D(({ scene }) => scene.add(obj))
    })
  }

  const bgForPage = (tempBackground: SceneBackground | number) => {
    let bg: SceneBackground
    onMounted(() =>
      exec3D(({ scene }) => {
        bg = scene.background
        scene.background = typeof tempBackground === "number" ? new Color(tempBackground) : tempBackground
      })
    )
    onBeforeUnmount(() => {
      exec3D(({ scene }) => {
        scene.background = bg
      })
    })
  }

  return {
    removeForPage,
    bgForPage,
  }
}
