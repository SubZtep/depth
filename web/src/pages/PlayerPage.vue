<template lang="pug">
Title Player’s Snail Setup

SnailBody(@rigid-body="setBody" v-slot="{ position, rotation }")
  //- pre.bg-white {{position}} - {{rotation}}
  SnailShell(
    :position="position"
    :rotation="rotation"
    :color="playerStore.color"
    :wireframe="playerStore.wireframe"
    :roughness="playerStore.roughness")

FloorPlane(:size="10")

ValidateHappiness(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}
</template>

<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import SnailShell from "~/components/meta/SnailShell"
import SnailBody from "~/components/meta/SnailBody"
import FloorPlane from "~/components/3d/FloorPlane"
import ValidateHappiness from "~/components/meta/ValidateHappiness"

const playerStore = usePlayerStore()

let body: any | undefined
const setBody = (rigidBody: any) => {
  body = rigidBody
}

const btns = {
  bump() {
    body && body.applyForce({ x: 0, y: 300, z: 0 }, true)
  },
}

addGuiFolder(folder => {
  folder.name = "Snail Settings"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
  folder.add(playerStore, "wireframe").name("Wire Shell")
  folder.add(playerStore, "roughness", 0, 1, 0.001).name("Roughness")
  folder.add(btns, "bump").name("Bump Up")
})
</script>
