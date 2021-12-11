import type CameraControls from "camera-controls"
import { getCurrentInstance } from "vue"

export function useCameraControls(): CameraControls {
  const instance = getCurrentInstance()
  if (!instance) throw new Error("Not in Vue scope")
  const { $cameraControls } = instance.appContext.app.config.globalProperties
  return $cameraControls
}
