import type CameraControls from "camera-controls"
import type { EventHook } from "@vueuse/core"
import { MathUtils } from "three"
import { inject } from "vue"
import { CameraShake } from "../models/camerashake"

export function useCameraControls(cameraControls: CameraControls) {
  const shakes = [
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5),
  ]
  let shaker = 0
  let happened = false

  inject<EventHook<GUIEvent.Camera>>("cameraHook")?.on(({ cmd, go }) => {
    switch (cmd) {
      case "rotate":
        cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true)
        break
      case "shake":
        shakes[shaker++ % shakes.length].shake()
        break
    }
    switch(go) {
      case "group":
        cameraControls.setLookAt(2, 1, -4, 2, 2, 0, true)
        break
      case "record":
        cameraControls.setLookAt(10, 2, 20, 0, 2, 20, true)
        const shk = () => {
          new CameraShake(cameraControls, 500, 10, 0.5).shake()
          cameraControls.removeEventListener("sleep", shk)
          happened = true
        }
        if (!happened) cameraControls.addEventListener("sleep", shk)
        break

    }
  })
}
