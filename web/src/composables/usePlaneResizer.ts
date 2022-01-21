export default function usePlaneResizer(mesh: THREE.Mesh, dimensions: Ref<[number, number]>, segments = ref([1, 1])) {
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
