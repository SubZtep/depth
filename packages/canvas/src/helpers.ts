import type { Object3D } from "three/src/core/Object3D"
import type { Quaternion } from "three/src/math/Quaternion"
import { getCurrentInstance } from "vue"

export function rotationFromQuaternion(obj: Object3D, rot: [number, number, number, number]) {
  obj.setRotationFromQuaternion({ x: rot[0], y: rot[1], z: rot[2], w: rot[3] } as Quaternion)
}

export function useScene() {
  const instance = getCurrentInstance()
  if (!instance) throw new Error("Not in Vue scope")
  const { $scene } = instance.appContext.app.config.globalProperties
  return $scene
}
