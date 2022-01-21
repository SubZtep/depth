<template lang="pug">
</template>

<script lang="ts" setup>
import { exec3D, loop3D } from "@depth/canvas"
import { useSingleton } from "@depth/misc"
// import useObjectFactory from "~/composables/useObjectFactory"

import { useScene } from "@depth/canvas"
import { onScopeDispose } from "vue"

const scene = useScene()

const { singleton } = useSingleton()
const cam = new THREE.PerspectiveCamera(60) // TODO: use OrthographicCamera

const props = defineProps<{
  camera?: THREE.Camera
  //   position: PositionTuple
  //   rotation: RotationTuple
}>()

const state = reactive({
  width: 320,
  height: 240,
  elevation: 5,
  // view: "y",
})

addGuiFolder(folder => {
  folder.name = "🎥 Viewport View"
  folder.add(state, "width", 1, 1024, 1)
  folder.add(state, "height", 1, 768, 1)
  folder.add(state, "elevation", 1, 100, 1).onChange(value => {
    cam.position.y = value
  })
  // folder.add(state, "view", ["x", "y", "z"]).onChange(value => {
  //   // cam.position.set(0, 10, 0)
  //   // cam.position[value] = state.elevation * (value === "y" ? 1 : -1)
  // })
})

cam.position.set(15, state.elevation, 0)
cam.lookAt(0, 5, 0)
cam.layers.enableAll()
// cam.layers.set(1)

let camHelper: THREE.CameraHelper

if (props.camera) {
  camHelper = new THREE.CameraHelper(props.camera)
  camHelper.layers.enableAll()
  camHelper.layers.set(1)
  scene.add(camHelper)
}

// const pivot = singleton.get("pivot")
// const pivotHelper = useObjectFactory().cone()
// pivotHelper.geometry.rotateX(Math.PI / 2)
// pivotHelper.layers.enableAll()

scene.add(cam)
const viewPort = new THREE.Vector4()
exec3D(({ renderer }) => {
  renderer.setScissorTest(true)
  renderer.getViewport(viewPort)
})

loop3D(
  ({ renderer, scene }) => {
    if (viewPort.width < state.width || viewPort.height < state.height) {
      return
    }

    // camHelper.update()
    // pivotHelper.position.copy(pivot.position)
    // pivotHelper.rotation.copy(pivot.rotation)

    renderer.setScissor(viewPort.width - state.width, viewPort.height - state.height, state.width, state.height)
    renderer.setViewport(viewPort.width - state.width, viewPort.height - state.height, state.width, state.height)
    renderer.render(scene, cam)

    renderer.setViewport(viewPort)
    renderer.setScissor(viewPort)
    // useRenderLoop will render the (early) rest
  },
  { inject: "rendered" }
)

onScopeDispose(() => {
  scene.remove(cam, camHelper)
  exec3D(({ renderer }) => {
    renderer.setScissorTest(false)
  })
})
</script>
