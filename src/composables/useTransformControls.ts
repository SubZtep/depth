import type CameraControls from "camera-controls"
import { watchEffect } from "vue"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { useMagicKeys, get } from "@vueuse/core"

interface Props {
  domElement: HTMLElement
  scene: THREE.Scene
  cameraControls: CameraControls
}

export const transformables: string[] = []
let i = 0;

export function useTransformControls({ cameraControls, domElement, scene }: Props) {
  const control = new TransformControls(cameraControls.camera, domElement)
  scene.add(control)
  if (cameraControls !== undefined) {
    control.addEventListener("mouseDown", () => (cameraControls.enabled = false))
    control.addEventListener("mouseUp", () => (cameraControls.enabled = true))
  }

  const { q, w, e, r, space } = useMagicKeys()

  watchEffect(() => {
    if (control === undefined) return
    if (get(space)) {
      control.detach()

      if (i >= transformables.length) {
        i = 0
      } else {
        const obj = scene.getObjectByName(transformables[i++])
        if (obj) {
          control.attach(obj)
        }
      }
    }
    if (get(q)) control.setSpace(control.space === "local" ? "world" : "local")
    if (get(w)) control.setMode("translate")
    if (get(e)) control.setMode("rotate")
    if (get(r)) control.setMode("scale")
  })
}
