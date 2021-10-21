<template lang="pug">
Debug STATE {{state}}

.top-left
  img.gif(src="/gifs/copilot-eslint-x.gif" ref="gif")

ThreeGlobe(:position="state.position" :scale="state.scale")

//- CanvasInScene(:position="state.position" :scale="state.scale" :image="gif")
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { loopThreeJs } from "@depth/three.js"
import type { Vector3Tuple } from "three"

const state = reactive({
  position: [0, 1.6, -69] as Vector3Tuple,
  scale: 0.25,
  image: "/gifs/copilot-eslint-x.gif",
})

addGuiFolder(folder => {
  folder.name = "Globe"
  folder.addVector3(state.position)
  folder.add(state, "scale", 0.1, 0.69, 0.01)
})

// const rotate0To120 = function () {
//   const animation = popmotion.tween({
//     from: 0,
//     to: 120 * THREE.MathUtils.DEG2RAD,
//     duration: 3000,
//     ease: popmotion.easing.easeOut,
//   })
//   const animationAction = {
//     update(azimuthAngle) {
//       cameraControls.azimuthAngle = azimuthAngle
//     },
//     complete() {
//       cameraControls.enabled = true
//     },
//   }

//   cameraControls.enabled = false
//   animation.start(animationAction)
// }

loopThreeJs(
  ({ cameraControls }) => {
    // cameraControls.target.set(...state.position)
    // console.log(cameraControls)
    // cameraControls.lookAt(...state.position)
    cameraControls.setLookAt(0, 0, 0, ...state.position, true)
  },
  () => {}
)
</script>

<style>
.gif {
  width: 20vw;
  transform-style: preserve-3d;
  transform-origin: top left;
  transform: rotateZ(-5deg) rotateX(-31deg);
  background: #3004;
  /* width: 33%; */
  /* position: absolute;
  top: 5rem;
  left: 1rem;
  width: 33%; */
  /* @apply rotate-x-45 w-half mt-32 mx-auto; */
}
</style>
