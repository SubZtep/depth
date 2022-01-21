import type { Plugin } from "vue"
import CameraControls from "camera-controls"
import * as THREE from "three"
import { loop3D } from "@depth/canvas"
import FollowCamera from "./components/FollowCamera"

export const ControllerPlugin: Plugin = function (app) {
  CameraControls.install({ THREE })

  app.config.globalProperties.$initCameraControls = (
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    canvas: HTMLCanvasElement
  ) => {
    const cameraControls = new CameraControls(camera, canvas)
    // cameraControls.setPosition(0, 2, 5, false) // FIXME: camera controls (bug?), has to move to become interactive
    app.config.globalProperties.$cameraControls = cameraControls

    loop3D(({ deltaTime }) => {
      cameraControls.update(deltaTime)
    })
  }

  app.component("FollowCamera", FollowCamera)
}
