import type CameraControls from "camera-controls"
import { getCurrentInstance } from "vue"

export function useCameraControls(): CameraControls {
  const instance = getCurrentInstance()
  if (!instance) throw new Error("Not in Vue scope")
  return instance.appContext.app.config.globalProperties.$cameraControls
}

export function useFpsControls(cameraControls: CameraControls): void {
  const EPS = 1e-5
  // in order to archive FPS look, set EPSILON for the distance to the center
  cameraControls.camera.position.set(0, 0, EPS)
  cameraControls.minDistance = cameraControls.maxDistance = 1
  cameraControls.azimuthRotateSpeed = -0.3 // negative value to invert rotation direction
  cameraControls.polarRotateSpeed = -0.3 // negative value to invert rotation direction
  cameraControls.truckSpeed = 10
}
