import { useCameraControls } from "@depth/controller"
import * as THREE from "three"

const objects = new Set<THREE.Object3D>()

/**
 * Bounding box of objects
 * @param objects 3D objects
 * @returns bounding box
 */
function boundingBox(objects: THREE.Object3D[] | Set<THREE.Object3D>): THREE.Box3 {
  const box = new THREE.Box3()
  for (const obj of objects) {
    const obox = new THREE.Box3().setFromObject(obj)
    box.union(obox)
  }
  return box
}

export function useCameraFit() {
  const cc = useCameraControls()

  const fit = (expand?: Vector3) => {
    if (objects.size > 0) {
      const box = boundingBox(objects)

      if (expand) {
        box.expandByPoint(expand)
      }

      if (!box.isEmpty()) {
        cc.fitToBox(box, true, { paddingLeft: 0.1, paddingRight: 0.1, paddingTop: 0.1, paddingBottom: 0.1 })
      }
    }
  }

  return {
    add(obj: THREE.Object3D, fitting = false) {
      objects.add(obj)
      if (fitting) fit()
    },
    remove(obj: THREE.Object3D, fitting = false) {
      objects.delete(obj)
      if (fitting) fit()
    },
    fit,
  }
}
