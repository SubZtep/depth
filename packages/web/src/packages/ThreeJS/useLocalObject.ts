import { singleFns } from "../ThreeJS/useRenderLoop"
import type { Object3D } from "three"

export function useLocalObject(...obj: Object3D[]) {
  singleFns.add(({ scene }) => {
    scene.add(...obj)
  })

  onBeforeUnmount(() => {
    singleFns.add(({ scene }) => scene.remove(...obj))
  })
}
