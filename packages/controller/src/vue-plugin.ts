import type { Plugin } from "vue"
import CameraControls from "camera-controls"
import { Vector2 } from "three/src/math/Vector2"
import { Vector3 } from "three/src/math/Vector3"
import { Vector4 } from "three/src/math/Vector4"
import { Quaternion } from "three/src/math/Quaternion"
import { Matrix4 } from "three/src/math/Matrix4"
import { Spherical } from "three/src/math/Spherical"
import { Box3 } from "three/src/math/Box3"
import { Sphere } from "three/src/math/Sphere"
import { Raycaster } from "three/src/core/Raycaster"
import { DEG2RAD, clamp } from "three/src/math/MathUtils"
import { MOUSE } from "three/src/constants"
import { loop3D } from "@depth/canvas"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { OrthographicCamera } from "three/src/cameras/OrthographicCamera"

export const ControllerPlugin: Plugin = function (app) {
  CameraControls.install({
    THREE: {
      Box3,
      Matrix4,
      MOUSE,
      Quaternion,
      Raycaster,
      Sphere,
      Spherical,
      Vector2,
      Vector3,
      Vector4,
      MathUtils: {
        DEG2RAD,
        clamp,
      },
    },
  })

  app.config.globalProperties.$initCameraControls = (
    camera: PerspectiveCamera | OrthographicCamera,
    canvas: HTMLCanvasElement
  ) => {
    const cameraControls = new CameraControls(camera, canvas)
    cameraControls.setPosition(0, 2, 5, false) // FIXME: camera controls (bug?), has to move to become interactive
    app.config.globalProperties.$cameraControls = cameraControls

    loop3D(({ deltaTime }) => {
      cameraControls.update(deltaTime)
    })
  }
}
