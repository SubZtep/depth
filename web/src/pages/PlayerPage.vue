<template lang="pug">
Title Player’s Snail Setup

SnailShell(ref="snail" @rigid-body="setBody" @material="setMaterial")

FloorPlane(:size="10")

ValidateHappiness(v-slot="{ uuid }")
  p Are you happy to store Your snail data in local storage and make it public?
  p Your ID will be: {{ uuid }}
</template>

<script lang="ts" setup>
import { usePlayerStore } from "~/stores/player"
import SnailShell from "~/components/3d/SnailShell"
import FloorPlane from "~/components/3d/FloorPlane"
import ValidateHappiness from "~/components/meta/ValidateHappiness"
import type { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"

const playerStore = usePlayerStore()

let body: any | undefined
const setBody = (rigidBody: any) => {
  body = rigidBody
}

const changeColor = (color: number) => {
  if (!material) return
  material.emissive.set(color)
}

const changeWireframe = (wireframe: boolean) => {
  if (!material) return
  material.wireframe = wireframe
}

const changeRoughness = (roughness: number) => {
  if (!material) return
  material.roughness = roughness
}

let material: MeshStandardMaterial | undefined
const setMaterial = (m: MeshStandardMaterial) => {
  material = m
  changeColor(playerStore.color)
  changeWireframe(playerStore.wireframe)
  changeRoughness(playerStore.roughness)
}

const btns = {
  bump() {
    body && body.applyForce({ x: 0, y: 300, z: 0 }, true)
  },
}

addGuiFolder(folder => {
  folder.name = "Snail Settings"
  folder.add(playerStore, "name").name("Name")
  folder.addColor(playerStore, "color").name("Colour").onChange(changeColor)
  folder.add(playerStore, "wireframe").name("Wire Shell").onChange(changeWireframe)
  folder.add(playerStore, "roughness", 0, 1, 0.001).name("Roughness").onChange(changeRoughness)
  folder.add(btns, "bump").name("Bump Up")
})
</script>
