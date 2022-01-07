import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Mesh } from "three/src/objects/Mesh"

export default function usePlaneResizer(mesh: Mesh, dimensions: Ref<[number, number]>, segments = ref([1, 1])) {
  // watch(
  //   [dimensions, segments],
  //   ([dv], [sv]) => {
  //     const helperPlane = new PlaneGeometry(...(dv as [number, number]), ...(sv as [number, number]))
  //     mesh.geometry.copy(helperPlane)
  //     helperPlane.dispose()
  //   },
  //   { immediate: true, deep: true }
  // )
}
