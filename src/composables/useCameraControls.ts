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

  inject<EventHook<RouterEvent>>("routerHook")?.on(({ position, lookAt, enableTransition }) => {
    cameraControls.setLookAt(...position, ...lookAt, enableTransition)
  })

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
          // window.history.pushState({}, "", "")
          cameraControls.setLookAt(2, 1, -4, 2, 2, 0, true)
        break
        case "frames":
          // window.history.pushState({}, "", "frames")
          cameraControls.setLookAt(10, 2, -20, -30, 2, -20, true)
          break
          case "record":
            // window.history.pushState({}, "", "record")
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
