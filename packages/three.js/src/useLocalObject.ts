// import { singleFns } from "../ThreeJS/useRenderLoop"
import { singleFns } from "./useRenderLoop"
import type { Object3D } from "three"
import { onBeforeUnmount } from "vue"

export function useLocalObject(...obj: Object3D[]) {
  singleFns.add(({ scene }) => {
    scene.add(...obj)
  })

  onBeforeUnmount(() => {
    singleFns.add(({ scene }) => scene.remove(...obj))
  })
}
