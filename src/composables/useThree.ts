import * as THREE from "three"
import type { Ref } from "vue"
import { onMounted } from "vue"
import { MaybeElementRef, unrefElement, useRafFn } from "@vueuse/core"
import { useSkybox } from "../composables/useSkybox"
import { useFloor } from "../composables/useFloor"
import CameraControls from "camera-controls"

export function useThree(target: MaybeElementRef, skyboxNumber: Ref<number>) {
  CameraControls.install({ THREE: THREE })

  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let cameraControls: CameraControls

  const updater = new Set<(delta: number) => void>()
  const clock = new THREE.Clock()

  const { resume: resumeUpdate } = useRafFn(
    () => {
      const delta = clock.getDelta()
      const hasControlsUpdated = cameraControls.update(delta)

      updater.forEach(fn => fn(delta))

      if (hasControlsUpdated) {
        renderer.render(scene, camera)
      }
    },
    { immediate: false }
  )

  onMounted(() => {
    const el: HTMLElement = unrefElement(target)

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 500)
    // camera.position.set(50, 20, 50)
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    scene.add(useFloor())
    useSkybox(scene, skyboxNumber)
    cameraControls = new CameraControls(camera, renderer.domElement)

    resumeUpdate()
  })

  return {
    updater,
  }
}
