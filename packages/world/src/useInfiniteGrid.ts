import { onScopeDispose, effectScope, toRefs, reactive } from "vue"
import { watch } from "vue"
import { useSingleton } from "@depth/misc"
import { exec3D } from "@depth/three.js"
import type { InfiniteGridParameters } from "./infiniteGrid"
import { infiniteGrid } from "./infiniteGrid"
import { Color } from "three/src/math/Color"

export function useInfiniteGrid(parameters: Partial<InfiniteGridParameters> = {}) {
  const { singleton } = useSingleton()
  let grid: { mesh: ReturnType<typeof infiniteGrid> } & InfiniteGridParameters

  if (singleton.has("InfiniteGrid")) {
    grid = singleton.get("InfiniteGrid")
  } else {
    const { size = 1, color = new Color(0x00_00_00), distance = 8000 } = parameters
    grid = { mesh: infiniteGrid({ size, color, distance }), size, color, distance }
    exec3D(({ scene }) => scene.add(mesh))
    singleton.set("InfiniteGrid", grid)
  }

  const { mesh, ...p } = grid
  const { size, color, distance } = toRefs(reactive(p))
  const scope = effectScope()

  scope.run(() => {
    watch(size, v => {
      mesh.material.uniforms.uSize.value = v
    })

    watch(distance, v => {
      mesh.material.uniforms.uDistance.value = v
    })
  })

  onScopeDispose(() => {
    scope.stop()
  })

  return { size, color, distance }
}
