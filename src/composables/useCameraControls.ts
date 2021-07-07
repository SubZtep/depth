import type CameraControls from "camera-controls"
import { MathUtils } from "three"
import { CameraShake } from "../models/camerashake"
import { useOnRouterEvent } from "../plugins/router"
import { useOnCameraEvent } from "../plugins/datGUI"

export function useCameraControls(cameraControls: CameraControls) {
  let shaker = 0
  const shakes = [
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5),
  ]

  useOnRouterEvent(({ position, lookAt, transition }) => {
    cameraControls.setLookAt(...position, ...lookAt, transition)
  })

  useOnCameraEvent(({ cmd, go }) => {
    switch (cmd) {
      case "rotate":
        cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true)
        break
      case "shake":
        shakes[shaker++ % shakes.length].shake()
        break
    }
  })
}
