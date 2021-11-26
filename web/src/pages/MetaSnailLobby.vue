<template lang="pug">
//- Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ
Title Metasnail Lobby

MetaSnail(
  v-for="metaSnail in metaSnails" :key="metaSnail.uuid"
  :meta-snail="metaSnail"
  :throttled="throttled"
  v-slot="{ name, uuid }")
  .text-yellow-500 {{name}} - {{uuid}}

SnailShell(
  :input="keyboard"
  :start-position="playerPosition"
  :throttled="throttled")

//- Debug.flex
 div {{keyboard}}
 div {{playerStore.position}}
 div {{playerStore.rotation}}

ValidateHappinessToast(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}

component(v-if="dynamicComponent" :is="dynamicComponent")
</template>

<script lang="ts" setup>
import { leafPlane } from "~/3D/goodybag/leaf-plane"
import { addGuiFolder } from "@depth/dat.gui"
import { useMetaSnails } from "~/composables/useMetaSnails"
import useSceneHelper from "~/composables/useSceneHelper"
import { usePlayerStore } from "~/stores/player"
import MetaSnail from "~/components/player/MetaSnail"
import SnailShell from "~/components/player/SnailShell"
import ValidateHappinessToast from "~/components/player/ValidateHappinessToast"
import { useKeyboard } from "~/composables/useKeyboard"

const throttled = ref(500)
const playerStore = usePlayerStore()
useSceneHelper().addForPage(await leafPlane({ x: 0, y: -0.1, z: 0 }))

const { metaSnails, playerPosition } = await useMetaSnails()
const keyboard = useKeyboard()

const dynamicComponent = shallowRef()

addGuiFolder(folder => {
  folder.name = "🐌 Your Snail"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
  const loadHandButton = folder
    .add(
      {
        btn: () =>
          import("~/components/player/PlayerHands.vue").then(component => set(dynamicComponent, component.default)),
      },
      "btn"
    )
    .name("Load Player Hand")
    .onChange(() => loadHandButton.remove())
})
</script>
