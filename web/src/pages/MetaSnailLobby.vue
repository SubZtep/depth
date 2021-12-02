<template lang="pug">
Title(:delay="69696") M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ
Title Metasnail Lobby

SwitchInputMethod(v-model="joystick")

MetaSnail(
  v-for="metaSnail in metaSnails"
  :key="metaSnail.uuid"
  :meta-snail="metaSnail"
  v-slot="{ pos2d }")
  UseTimeAgo(:time="metaSnail.updated_at" v-slot="{ timeAgo }")
    FloatingText.opacity-80.text-yellow-500.text-center.outline(:pos2d="pos2d")
      .font-bold {{metaSnail.name}}
      .text-sm {{timeAgo}}

SnailShell(
  :start-position="playerPosition"
  :input="playerInput")

//- ThreeGlobe(
  :position="state.position"
  :scale="state.scale"
  :surface="state.surface"
  :terrain="state.terrain")

ValidateHappiness(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}

component(v-if="dynamicComponent" :is="dynamicComponent")

Debug Player Position: {{playerPosition}}
</template>

<script lang="ts" setup>
import { shallowRef } from "vue"
import { addGuiFolder } from "@depth/dat.gui"
import { UseTimeAgo } from "@vueuse/components"
import { usePlayerStore } from "~/stores/player"
import { leafPlane } from "~/3D/goodybag/leaf-plane"
import { exec3D, useThreeJSEventHook } from "@depth/three.js"
import { usePreferencesStore } from "~/stores/preferences"
import useSceneHelper from "~/composables/useSceneHelper"
import { useMetaSnails } from "~/composables/useMetaSnails"
import SwitchInputMethod from "~/components/player/SwitchInputMethod.vue"
import ValidateHappiness from "~/components/player/ValidateHappiness"
import SnailShell from "~/components/player/SnailShell"
import MetaSnail from "~/components/player/MetaSnail"
import type { Vector3Tuple } from "three/src/math/Vector3"
import { surfaces, terrains } from "../3D/ThreeGlobe"

const dynamicComponent = shallowRef()
const playerStore = usePlayerStore()
const preferencesStore = usePreferencesStore()
const { metaSnails, playerPosition, subscribe, unsubscribe } = await useMetaSnails()

const action = ref(false)
const joystick = ref<PositionTuple>([0, 0, 0])
const playerInput: PlayerInput = { joystick, action }

useThreeJSEventHook().trigger({ cmd: "RenderFrames", param: "All" })
useSceneHelper().addForPage(await leafPlane({ x: 0, y: -0.1, z: 0 }))
onMounted(() => subscribe())
onBeforeUnmount(async () => await unsubscribe())

exec3D(({ cameraControls }) => {
  cameraControls.minAzimuthAngle = Math.PI / -12
  cameraControls.maxAzimuthAngle = Math.PI / 12
  cameraControls.minPolarAngle = Math.PI / 2.5
})

const state = reactive({
  position: [0, 1.6, 69] as Vector3Tuple,
  scale: 0.25,
  rotateY: 2,
  surface: surfaces[0],
  terrain: terrains[0],
})

const { folder: snailFolder } = addGuiFolder(folder => {
  folder.name = "🐌 Your Snail"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
})

addGuiFolder(folder => {
  folder.name = "🍃 Level State"
  folder.add(preferencesStore, "showDebug").name("Show Debug")

  const clicked = (button: ReturnType<typeof folder.add>) => {
    button.remove()
    folder.close()
    snailFolder.close()
  }

  const btns = {
    globe: async () => {
      const component = await import("~/pages/GlobeTest.vue")
      set(dynamicComponent, component.default)
    },
    hand: async () => {
      const component = await import("~/components/player/PlayerHands.vue")
      set(dynamicComponent, component.default)
    },
  }

  folder.add(btns, "globe").name("Globe")
  const handButton = folder
    .add(btns, "hand")
    .name("Load Hand Detector")
    .onChange(() => clicked(handButton))
})
</script>
