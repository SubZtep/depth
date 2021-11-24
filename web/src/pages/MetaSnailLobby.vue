<template lang="pug">
Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ

p {{metaSnails}}

MetaSnail(v-for="metaSnail in metaSnails" :key="metaSnail.uuid" :meta-snail="metaSnail" v-slot="{ uuid }")
  .text-4xl.text-yello-500 {{uuid}}

Debug {{playerStore}}
</template>

<script lang="ts" setup>
// import greenFloor from "~/3D/meshes/green-floor"
import { leafPlane } from "~/3D/sceneDefaults"
import { Snail } from "~/3D/entities/Snail"
import { addGuiFolder } from "@depth/dat.gui"
import { useKeyboard } from "~/composables/useKeyboard"
import { useMetaSnails } from "~/composables/useMetaSnails"
import useSceneHelper from "~/composables/useSceneHelper"
import getSnailShell from "~/3D/goodybag/snail-shell-photo"
import useResources from "~/composables/useResources"
import { usePlayerStore } from "~/stores/player"
import MetaSnail from "~/components/player/MetaSnail"

const playerStore = usePlayerStore()
const { metaSubscription, handleRemoteMetaSnail, Me, metaSnails, metaInit } = useMetaSnails()
const { addForPage } = useSceneHelper()
const { loader } = useResources()
const toast = useToast()

const leaf = await leafPlane({ x: 0, y: -0.1, z: 0 })
addForPage(leaf)

const snailShell = await loader("SnailShell", getSnailShell)
const playerSnail = Snail.initialize(snailShell)
playerSnail.setInput(useKeyboard())

if (!playerStore.uuid) {
  validateHappiness()
}

whenever(
  () => playerStore.uuid,
  async uuid => {
    await metaInit(uuid)
    metaSubscription(handleRemoteMetaSnail)
  },
  { immediate: true }
)

addGuiFolder(folder => {
  folder.name = "🐌 Meta Snail Lobby"
  folder.add(playerStore, "name").name("Your Name")
  folder.addColor(playerStore, "color").name("Your Colour")
  // folder.add(playerSnail, "jump")
  // folder.add(playerSnail, "push")
})
</script>
