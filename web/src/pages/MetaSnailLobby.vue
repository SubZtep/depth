<template lang="pug">
Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ

//- Debug.flex
  div {{metaSnails.map(snail => ({ name: snail.name, id: snail.position }))}}
  div {{player}}

MetaSnail(
  v-for="metaSnail in metaSnails" :key="metaSnail.uuid"
  :meta-snail="metaSnail"
  v-slot="{ name, uuid }")
  .text-yellow-500 {{name}} - {{uuid}}

ValidateHappinessToast(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}
</template>

<script lang="ts" setup>
import { leafPlane } from "~/3D/goodybag/leaf-plane"
import { addGuiFolder } from "@depth/dat.gui"
import { useMetaSnails } from "~/composables/useMetaSnails"
import { useMetaPlayer } from "~/composables/useMetaPlayer"
import useSceneHelper from "~/composables/useSceneHelper"
import { usePlayerStore } from "~/stores/player"
import MetaSnail from "~/components/player/MetaSnail"
import ValidateHappinessToast from "~/components/player/ValidateHappinessToast"

const playerStore = usePlayerStore()
const { addForPage } = useSceneHelper()
const leaf = await leafPlane({ x: 0, y: -0.1, z: 0 })
addForPage(leaf)

const { metaSnails } = await useMetaSnails()
const { player } = await useMetaPlayer()

addGuiFolder(folder => {
  folder.name = "🐌 Meta Snail Lobby"
  folder.add(playerStore, "name").name("Your Name")
  folder.addColor(playerStore, "color").name("Your Colour")
  // folder.add(playerSnail, "jump")
  // folder.add(playerSnail, "push")
})
</script>
