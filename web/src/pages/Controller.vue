<template lang="pug">
Title Controller

InputIndicator(v-bind="{ ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft }")

//- Debug {{snailState}}
</template>

<script lang="ts" setup>
import { loop3D } from "@depth/three.js/dist/useRenderLoop"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import useSceneHelper from "~/composables/useSceneHelper"
import { addGuiFolder } from "@depth/dat.gui"
import { Object3D } from "three/src/core/Object3D"
import { Vector3 } from "three/src/math/Vector3"

const { start, done } = useNProgress()
const { addForPage } = useSceneHelper()

const snailState = reactive({
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  rotateLeft: false,
  rotateRight: false,
})

const state = reactive({
  speed: 100,
})

let snail: Object3D
start()
const gltfLoader = new GLTFLoader().setPath("/models/")
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/libs/draco/")
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
  "SnailShell.glb",
  async gltf => {
    snail = gltf.scene
    snail.scale.set(0.1, 0.1, 0.1)
    await addForPage(snail)
    done()

    // root.position.set(0, 0, 0)
    // root.visible = true
    // root.scale.set(10, 10, 10)
  },

  xhr => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    // set(progress, (xhr.loaded / xhr.total))
  },
  error => {
    console.log("An error happened")
  }
)

const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft } = useMagicKeys()

watch(ArrowUp, on => {
  snailState.moveForward = on
})

watch(ArrowDown, on => {
  snailState.moveBackward = on
})

watch(and(ArrowLeft, ControlLeft), on => {
  snailState.moveLeft = on
})

watch(and(ArrowLeft, not(ControlLeft)), on => {
  snailState.rotateLeft = on
})

watch(and(ArrowRight, ControlLeft), on => {
  snailState.moveRight = on
})

watch(and(ArrowRight, not(ControlLeft)), on => {
  snailState.rotateRight = on
})

loop3D(({ clock }) => {
  const delta = clock.getDelta()
  if (snailState.moveForward) {
    snail.translateZ(-state.speed * delta)
  }
  if (snailState.moveBackward) {
    snail.translateZ(state.speed * delta)
  }
  if (snailState.moveLeft) {
    snail.translateX(-state.speed * delta)
  }
  if (snailState.moveRight) {
    snail.translateX(state.speed * delta)
  }
  if (snailState.rotateLeft) {
    snail.rotateOnWorldAxis(new Vector3(0, 1, 0), (Math.PI / 4) * -state.speed * delta)
  }
  if (snailState.rotateRight) {
    snail.rotateOnWorldAxis(new Vector3(0, 1, 0), (Math.PI / 4) * state.speed * delta)
  }
})

// loop3D(({ cameraControls, clock }) => {
//   const delta = clock.getDelta()

//   get(ArrowUp) && cameraControls.truck(-0.1 * delta, 0, false)
// })
// whenever(ArrowUp, () => {
//   // console.log("ArrowUp")
//   snail.position.z -= 0.1
// })

addGuiFolder(gui => {
  gui.name = "🐌 Character Control"
  gui.add(state, "speed", 0, 5000)
})
</script>
