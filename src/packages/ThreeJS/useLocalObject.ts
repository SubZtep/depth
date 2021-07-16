import { singleFns } from "../../packages/ThreeJS/useRenderLoop"

export function useLocalObject(...obj: THREE.Object3D[]) {
  singleFns.add(({ scene }) => {
    scene.add(...obj)
  })

  onBeforeUnmount(() => {
    singleFns.add(({ scene }) => scene.remove(...obj))
  })
}
