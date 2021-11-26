import type { Object3D } from "three/src/core/Object3D"
import { Camera } from "three/src/cameras/Camera"
import { Vector3 } from "three/src/math/Vector3"

/**
 * Get the window position of an object from the 3D space.
 * @param object3d - Object to get the position of
 * @param camera - Active camera in 3D space
 * @param canvasSize - WebGL canvas width and height (defaults to window size)
 * @returns 2D position tuple
 */
export function object3dTo2d(object3d: Object3D, camera: Camera, canvasSize?: [number, number]): [number, number] {
  const temporaryPos = new Vector3()
  object3d.updateWorldMatrix(true, false)
  object3d.getWorldPosition(temporaryPos)
  temporaryPos.project(camera)

  const [width, height] = canvasSize ?? [window.innerWidth, window.innerHeight]
  const x = (temporaryPos.x * 0.5 + 0.5) * width
  const y = (temporaryPos.y * -0.5 + 0.5) * height
  return [x, y]
}
