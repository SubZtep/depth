import { onScopeDispose, effectScope, toRefs, reactive } from "@vue/reactivity"
import { watch } from "@vue/runtime-core"
import { useSingleton } from "@depth/misc"
import { exec3D } from "@depth/three.js"
import { Color } from "three/src/math/Color"
import type { InfiniteGridParams } from "./infiniteGrid"
import { infiniteGrid } from "./infiniteGrid"

export function useInfiniteGrid(params: Partial<InfiniteGridParams> = {}) {
  const singleton = useSingleton()
  let grid: { mesh: ReturnType<typeof infiniteGrid> } & InfiniteGridParams

  if (singleton.has("InfiniteGrid")) {
    grid = singleton.get("InfiniteGrid")
  } else {
    const { size1 = 1, size2 = 10, color = new Color(0x000000), distance = 8_000 } = params
    grid = { mesh: infiniteGrid({ size1, size2, color, distance }), size1, size2, color, distance }
    exec3D(({ scene }) => scene.add(mesh))
    singleton.set("InfiniteGrid", grid)
  }

  const { mesh, ...p } = grid
  const { size1, size2, color, distance } = toRefs(reactive(p))
  const scope = effectScope()

  scope.run(() => {
    watch(size1, v => {
      mesh.material.uniforms.uSize1.value = v
    })

    watch(size2, v => {
      mesh.material.uniforms.uSize2.value = v
    })

    watch(distance, v => {
      mesh.material.uniforms.uDistance.value = v
    })
  })

  onScopeDispose(() => {
    scope.stop()
  })

  return { size1, size2, color, distance }
}
