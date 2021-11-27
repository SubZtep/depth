<template lang="pug">
Title(:delay="69696") M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ
Title Metasnail Lobby

button.btn.bg-green-800.p-4.text-white.m-1.h-auto.rounded(@click="() => inc()")
  .w-10.h-10.text-4xl(:key="`${activeInput}-${isMobile ? 'mobile' : 'mouse'}`")
    i.fad.fa-keyboard(v-show="activeInput === 'keyboard'")
    i.fad.fa-mobile-screen(v-show="activeInput === 'device' && isMobile")
    i.fad.fa-computer-mouse(v-show="activeInput === 'device' && !isMobile")

Debug {{metaSnails}}

MetaSnail(
  v-for="metaSnail in metaSnails"
  :key="metaSnail.uuid"
  :meta-snail="metaSnail"
  v-slot="{ pos2d }")
  UseTimeAgo(:time="metaSnail.updated_at" v-slot="{ timeAgo }")
    FloatingText.text-yellow-500.text-center.outline(:pos2d="pos2d")
      .font-bold {{metaSnail.name}}
      .text-sm {{timeAgo}}

SnailShell(
  :start-position="playerPosition"
  :input="playerInput")

ValidateHappiness(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}

component(v-if="dynamicComponent" :is="dynamicComponent")
</template>

<script lang="ts" setup>
import { shallowRef, toRef } from "vue"
import { addGuiFolder } from "@depth/dat.gui"
import { UseTimeAgo } from "@vueuse/components"
import { usePlayerStore } from "~/stores/player"
import { usePreferencesStore } from "~/stores/preferences"
import { leafPlane } from "~/3D/goodybag/leaf-plane"
import useSceneHelper from "~/composables/useSceneHelper"
import { useKeyboard } from "~/composables/useKeyboard"
import { useMetaSnails } from "~/composables/useMetaSnails"
import ValidateHappiness from "~/components/player/ValidateHappiness"
import FloatingText from "~/components/ui/FloatingText.vue"
import SnailShell from "~/components/player/SnailShell"
import MetaSnail from "~/components/player/MetaSnail"
import Debug from "~/components/ui/Debug.vue"
import Title from "~/components/ui/Title.vue"
import { useThreeJSEventHook } from "@depth/three.js"
import { useDevice } from "~/composables/useDevice"
import { syncRef, useCounter } from "@vueuse/core"

const dynamicComponent = shallowRef()
const playerStore = usePlayerStore()
const preferencesStore = usePreferencesStore()
const isMobile = toRef(preferencesStore, "isMobile")
const { metaSnails, playerPosition, subscribe, unsubscribe } = await useMetaSnails()

const joystick = ref<PositionTuple>([0, 0, 0])
const action = ref(false)

const inputs = ["keyboard", "device"]
const { count, inc } = useCounter()

const keyboardInput = useKeyboard()
const deviceInput = useDevice()
const playerInput: PlayerInput = { joystick, action }
const activeInput = ref()

let stopSyncJoystick: Fn

watch(
  count,
  index => {
    set(activeInput, inputs[index % inputs.length])

    stopSyncJoystick?.() // FIXME: stop listeners inside composables as well
    stopSyncJoystick =
      activeInput.value === "keyboard"
        ? syncRef(keyboardInput.joystick, joystick)
        : syncRef(deviceInput.joystick, joystick)
  },
  { immediate: true }
)

useThreeJSEventHook().trigger({ cmd: "RenderFrames", param: "All" })
useSceneHelper().addForPage(await leafPlane({ x: 0, y: -0.1, z: 0 }))
onMounted(() => subscribe())
onBeforeUnmount(async () => await unsubscribe())

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
    hand: () =>
      import("~/components/player/PlayerHands.vue").then(component => set(dynamicComponent, component.default)),
  }

  const handButton = folder
    .add(btns, "hand")
    .name("Load Player Hand")
    .onChange(() => clicked(handButton))
})
</script>
