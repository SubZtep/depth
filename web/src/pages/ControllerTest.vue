<template lang="pug">
Title
  | Controller Test Page
  br
  | (mobile ready)

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
import UAParser from "ua-parser-js"
import { animate } from "popmotion"
import { leafPlane } from "~/3D/sceneDefaults"
import useSceneHelper from "~/composables/useSceneHelper"
import redSphere from "~/3D/meshes/red-sphere"
import greenFloor from "~/3D/meshes/green-floor"
import { exec3D, setupBoundaries, useThreeJSEventHook } from "@depth/three.js"
import OkayEventToast from "~/components/toasts/OkayEventToast.vue"
import type { ToastContent, ToastOptions } from "vue-toastification/dist/types/types"
import { TYPE } from "vue-toastification"
import { useSkybox } from "@depth/environment"
import router from "~/router"

const { nr, compressed } = useSkybox()
const threeJs = useThreeJSEventHook()
const { isFullscreen, enter } = useFullscreen()
const { isSupported, isActive, request, release } = useWakeLock()
const { addForPage } = useSceneHelper()

let skyCounter = 1 // SkyboxNumber
set(compressed, true)
set(nr, skyCounter)
threeJs.trigger({ cmd: "RenderFrames", param: "All" })
exec3D(({ cameraControls }) => setupBoundaries(cameraControls, "Zero"))

const toast = useToast()
const toastContent = (message: string, okay: Fn) =>
  ({ component: OkayEventToast, props: { message }, listeners: { okay } } as ToastContent)
const toastOptions: ToastOptions = { icon: false, closeButton: false, pauseOnHover: false, type: TYPE.WARNING }

if (!get(isFullscreen)) {
  useTimeoutFn(() => toast(toastContent("Should we go full-screen?", enter), toastOptions), 6969)
}

if (get(isSupported) && !get(isActive)) {
  useTimeoutFn(
    () =>
      toast(
        toastContent(
          `Can I prevent your ${new UAParser().getDevice().vendor ?? "precious"} from turning off until you die?`,
          () => request("screen")
        ),
        toastOptions
      ),
    16663
  )
}

const leaf = await leafPlane()
leaf.position.setZ(-2)
const red = redSphere()
addForPage(leaf, greenFloor(), red)

animate({
  from: -13,
  to: 13,
  elapsed: 666,
  duration: 3693,
  stiffness: 1000,
  damping: 50,
  repeat: 14,
  repeatType: "mirror",
  onUpdate: x => red.position.setX(x),
  onRepeat: () => {
    red.position.y -= 0.25
    set(nr, ++skyCounter)
  },
  onComplete: () => {
    toast.error("Y💀☭ DIED!")
    animate({
      from: 13,
      to: 0,
      duration: 666,
      onUpdate: x => red.position.setX(x),
      onComplete: () => {
        get(isSupported) && release()
        toast.info("Insert Coin Hahaha.")
        useTimeoutFn(() => router.push({ name: "environment" }), 6969)
      },
    })
  },
})

const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ControlLeft } = useMagicKeys()
</script>
