import * as THREE from "three"
import { getCurrentInstance } from "vue"

type PositionTuple = [number, number, number]
type RotationTuple = [number, number, number, number]
type Vector = { x: number; y: number; z: number }

export function rotationFromQuaternion(obj: THREE.Object3D, rot: RotationTuple) {
  obj.setRotationFromQuaternion({ x: rot[0], y: rot[1], z: rot[2], w: rot[3] } as THREE.Quaternion)
}

// TODO: reaname to `get3DScene`
/** Get Three.js Scene or die */
export function useScene(): THREE.Scene {
  const instance = getCurrentInstance()
  if (!instance) throw new Error("Not in Vue scope")
  const { $scene } = instance.appContext.app.config.globalProperties
  return $scene
}

export function toVector(position: PositionTuple): Vector {
  return { x: position[0], y: position[1], z: position[2] }
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

export function disposeMesh(mesh: { geometry: THREE.BufferGeometry; material: THREE.Material | THREE.Material[] }) {
  mesh.geometry.dispose()
  if (Array.isArray(mesh.material)) {
    for (const m of mesh.material) {
      m.dispose()
    }
  } else {
    mesh.material.dispose()
  }
}
