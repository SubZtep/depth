import * as THREE from "three"
import { onMounted, ref } from "vue"
import { MaybeElementRef, unrefElement, useRafFn } from "@vueuse/core"
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js"
import { GridHelper } from "three/src/helpers/GridHelper"

function createControl(camera: THREE.Camera, canvas?: HTMLElement) {
  const controls = new FlyControls(camera, canvas)
  controls.movementSpeed = 5
  controls.rollSpeed = 1
  controls.autoForward = false
  controls.dragToLook = true
  return controls
}

function createFloor(size = 100, divisions = 10, color1 = THREE.Color.NAMES.yellow, color2 = THREE.Color.NAMES.green) {
  const gridHelper = new GridHelper(size, divisions, color1, color2)
  gridHelper.position.x = 50
  return gridHelper
}

export function useThree(target: MaybeElementRef) {
  let scene = new THREE.Scene()
  let camera = ref<THREE.PerspectiveCamera>()
  let renderer: THREE.WebGLRenderer
  const invokeRafSync = new Set<(delta: number) => void>()
  const clock = new THREE.Clock()

  const { resume: resumeUpdate } = useRafFn(
    () => {
      const delta = clock.getDelta()
      invokeRafSync.forEach(fn => fn(delta))
      renderer.render(scene, camera.value!)
    },
    { immediate: false }
  )

  onMounted(() => {
    const el: HTMLElement = unrefElement(target)
    camera.value = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    camera.value.position.set(50, 20, 50)

    scene.add(createFloor())

    const ctrl = createControl(camera.value, renderer.domElement)
    invokeRafSync.add(ctrl.update)

    resumeUpdate()
  })

  return {
    scene,
    invokeRafSync,
    camera,
  }
}
