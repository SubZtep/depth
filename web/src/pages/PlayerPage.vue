<template lang="pug">
Title Player’s Snail Setup

Debug {{playerStore}}

SnailShell(ref="snail")

FloorPlane

</template>

<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import SnailShell from "~/components/3d/SnailShell"
import FloorPlane from "~/components/3d/FloorPlane"
const playerStore = usePlayerStore()

const snail = ref()

onMounted(() => {
  console.log("SS", snail.value)
})

addGuiFolder(folder => {
  folder.name = "Snail Settings"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
})
</script>
