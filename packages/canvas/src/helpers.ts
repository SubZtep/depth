import type { Object3D } from "three/src/core/Object3D"
import type { Quaternion } from "three/src/math/Quaternion"

export function rotationFromQuaternion(obj: Object3D, rot: { x: number; y: number; z: number; w: number }) {
  obj.setRotationFromQuaternion({ x: rot.x, y: rot.y, z: rot.z, w: rot.w } as Quaternion)
}
