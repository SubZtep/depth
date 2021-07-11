import type CameraControls from "camera-controls"
import { useIdle, whenever } from "@vueuse/core"
import { CameraShake } from "../../models/camerashake"
import { useOnRouterEvent } from "../router/plugin"

export function useCameraControls(cameraControls: CameraControls) {
  let shaker = 0
  const shakes = [
    new CameraShake(cameraControls, 500, 10, 0.5),
    new CameraShake(cameraControls, 1000, 10, 1),
    new CameraShake(cameraControls, 5000, 2, 0.5),
  ]

  const { idle } = useIdle()
  whenever(idle, () => shakes[shaker++ % shakes.length].shake())

  useOnRouterEvent(({ position, lookAt, transition }) => {
    cameraControls.setLookAt(...position, ...lookAt, transition)
  })

  // useOnCameraEvent(({ cmd, go }) => {
  //   switch (cmd) {
  //     case "rotate":
  //       cameraControls.rotate(0, 20 * MathUtils.DEG2RAD, true)
  //       break
  //     case "shake":
  //       shakes[shaker++ % shakes.length].shake()
  //       break
  //   }
  // })
}
