<template lang="pug">
Title Player’s Snail Setup

SnailShell(ref="snail")

FloorPlane(:size="10")
</template>

<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import SnailShell from "~/components/3d/SnailShell"
import FloorPlane from "~/components/3d/FloorPlane"
const playerStore = usePlayerStore()

const snail = ref()

addGuiFolder(folder => {
  folder.name = "Snail Settings"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
})
</script>
