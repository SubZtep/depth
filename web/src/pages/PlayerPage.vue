<template lang="pug">
Title Player’s Snail Setup

KeyboardInput(v-slot="{ joystick, action }")
  //- .bg-yellow-300 {{joystick}} {{action}}
  SnailBody(:player-input="{ joystick, action }" @rigid-body="setBody" v-slot="{ position, rotation }")
    //- pre.bg-white {{position}} - {{rotation}}
    SnailShell(
      :position="position"
      :rotation="rotation"
      :color="playerStore.color"
      :wireframe="playerStore.wireframe"
      :roughness="playerStore.roughness")

//- PhyBox(:position="[0, 11, 0]")
//- PhyBox(:position="[1, 11, 0]")
//- PhyBox(:position="[2, 11, 0]")

//- PhyBox(:position="[0, 12, 0]")
//- PhyBox(:position="[0, 12, 0]")
//- PhyBox(:position="[1, 12, 0]")

//- PhyBox(:position="[1, 11, 1]")
//- PhyBox(:position="[2, 11, 1]")
//- PhyBox(:position="[2, 11, 1]")


LeafPlane(:position="[0, 0.01, 0]")
FloorPlane(:size="8")

ValidateHappiness(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}
</template>

<script lang="ts" setup>
import type { RigidBody } from "@dimforge/rapier3d-compat"
import ValidateHappiness from "~/components/meta/ValidateHappiness"
import KeyboardInput from "~/components/meta/KeyboardInput"
import SnailShell from "~/components/meta/SnailShell"
import PhyBox from "~/components/3d/PhyBox"
import SnailBody from "~/components/meta/SnailBody"
import FloorPlane from "~/components/3d/FloorPlane"
import LeafPlane from "~/components/3d/LeafPlane"
import { usePlayerStore } from "~/stores/player"
import { usePreferencesStore } from "~/stores/preferences"

const playerStore = usePlayerStore()
const preferencesStore = usePreferencesStore()

let body: RigidBody | undefined
const setBody = (rigidBody: RigidBody) => {
  body = rigidBody
}

const btns = {
  bump() {
    body && body.applyForce({ x: 0, y: 1500, z: 0 }, true)
  },
  roll() {
    body && body.applyTorque({ x: 30, y: 0, z: 0 }, true)
  },
  codes() {
    void window.open("https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values")
  },
}

addGuiFolder(folder => {
  folder.name = "🎮 Input Settings"
  folder.add({ device: "keyboard" }, "device", ["keyboard"]).name("Device")
  folder.add(btns, "codes").name("⮚ Open Possible Keycodes")
  folder.add(preferencesStore, "keyboardUp").name("Up")
  folder.add(preferencesStore, "keyboardRight").name("Right")
  folder.add(preferencesStore, "keyboardDown").name("Down")
  folder.add(preferencesStore, "keyboardLeft").name("Left")
  folder.add(preferencesStore, "keyboardAction").name("Action")
  folder.close()
})

addGuiFolder(folder => {
  folder.name = "🐌 Your Snail"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour")
  folder.add(playerStore, "wireframe").name("Wire Shell")
  folder.add(playerStore, "roughness", 0, 1, 0.001).name("Roughness")
  folder.add(btns, "bump").name("Bump Up")
  folder.add(btns, "roll").name("Roll")
})
</script>
