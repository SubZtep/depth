export function disposeObjectTree(root: THREE.Object3D) {
  //TODO: test with material etc
  root.traverse(obj => {
    // @ts-ignore
    if (obj.geometry !== undefined) {
      // @ts-ignore
      obj.geometry.dispose()
    }
    // // @ts-ignore
    // if (obj.material !== undefined) {
    //   // @ts-ignore
    //   if (obj.material.length) {
    //     // @ts-ignore
    //     for (const material in obj.material) {
    //       // @ts-ignore
    //       material.dispose()
    //     }
    //   } else {
    //     // @ts-ignore
    //     obj.material.dispose()
    //   }
    // }
  })
}
