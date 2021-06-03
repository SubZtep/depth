import * as THREE from "three"
import { onMounted, ref } from "vue"
import { MaybeElementRef, unrefElement, useRafFn } from "@vueuse/core"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

function createControl(camera: THREE.Camera, canvas?: HTMLElement) {
  const controls = new OrbitControls(camera, canvas)
  // controls.enableKeys = true
  return controls
}

export function useThree(target: MaybeElementRef) {
  let scene = new THREE.Scene()
  let camera = ref<THREE.PerspectiveCamera>()
  let renderer: THREE.WebGLRenderer
  const invokeRafSync = new Set<() => void>()

  const { resume: resumeUpdate } = useRafFn(
    () => {
      renderer.render(scene, camera.value!)

      invokeRafSync.forEach(fn => fn())
    },
    { immediate: false }
  )

  onMounted(() => {
    const el: HTMLElement = unrefElement(target)
    camera.value = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    // camera.position.z = 5

    createControl(camera.value, renderer.domElement)

    resumeUpdate()
  })

  return {
    scene,
    invokeRafSync,
    camera,
  }
}
