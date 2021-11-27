<template lang="pug">
Title(:delay="69696") M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ
Title Metasnail Lobby

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
  :input="keyboard"
  :start-position="playerPosition")

ValidateHappiness(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}

component(v-if="dynamicHand" :is="dynamicHand")
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { UseTimeAgo } from "@vueuse/components"
import { usePlayerStore } from "~/stores/player"
import { leafPlane } from "~/3D/goodybag/leaf-plane"
import useSceneHelper from "~/composables/useSceneHelper"
import { useKeyboard } from "~/composables/useKeyboard"
import { useMetaSnails } from "~/composables/useMetaSnails"
import SnailShell from "~/components/player/SnailShell"
import MetaSnail from "~/components/player/MetaSnail"
import ValidateHappiness from "~/components/player/ValidateHappiness"

const playerStore = usePlayerStore()
useSceneHelper().addForPage(await leafPlane({ x: 0, y: -0.1, z: 0 }))

const { metaSnails, playerPosition } = await useMetaSnails()
const keyboard = useKeyboard()
const dynamicHand = shallowRef()

addGuiFolder(folder => {
  folder.name = "🐌 Your Snail"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
  const loadHandButton = folder
    .add(
      {
        btn: () =>
          import("~/components/player/PlayerHands.vue").then(component => set(dynamicHand, component.default)),
      },
      "btn"
    )
    .name("Load Player Hand")
    .onChange(() => {
      loadHandButton.remove()
      folder.close()
    })
})
</script>
