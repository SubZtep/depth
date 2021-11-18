import { leafPlane } from "../3D/sceneDefaults" import { leafPlane } from "../3D/sceneDefaults"

<template lang="pug">
Title Controller

InputIndicator(v-bind="{ ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft }")

PlayerInput(
  v-bind="{ ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft }"
  v-slot="{ moveForward, moveBackward, moveLeft, moveRight, rotateLeft, rotateRight }")

  SnailShell(v-slot="{ snail }")
    CharacterController(
      v-if="snail"
      v-bind="{ character: snail, moveForward, moveBackward, moveLeft, moveRight, rotateLeft, rotateRight }")
</template>

<script lang="ts" setup>
import { animate } from "popmotion"
import { leafPlane } from "~/3D/sceneDefaults"
import useSceneHelper from "~/composables/useSceneHelper"
import redSphere from "~/3D/meshes/red-sphere"
import greenFloor from "~/3D/meshes/green-floor"
import { useThreeJSEventHook } from "@depth/three.js"

const toast = useToast()
const { addForPage } = useSceneHelper()
const threeJs = useThreeJSEventHook()
threeJs.trigger({ cmd: "RenderFrames", param: "All" })

const leaf = await leafPlane()
leaf.position.setZ(-2)
const red = redSphere()
addForPage(leaf, greenFloor(), red)

let way = -0.4

animate({
  from: -13,
  to: 13,
  elapsed: 666,
  duration: 3693,
  stiffness: 1000,
  damping: 50,
  repeat: Number.POSITIVE_INFINITY,
  repeatType: "mirror",
  onUpdate: x => red.position.setX(x),
  onRepeat: () => {
    red.position.y -= 0.1
    if (red.position.y <= 0.5) {
      toast.info("Y💀☭ DIED!")
      way = 0.1
    }
  },
})

const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft } = useMagicKeys()
</script>
