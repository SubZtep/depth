<template lang="pug">
ThreeGlobe(
  :position="state.position"
  :scale="state.scale"
  :surface="state.surface"
  :terrain="state.terrain")
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { addGuiFolder } from "@depth/dat.gui"
import type { Vector3Tuple } from "three/src/math/Vector3"
import { capitalize, kebabToTitle } from "@depth/misc"
import { surfaces, terrains } from "../3D/ThreeGlobe"
import { toSelectOptions } from "../misc/transformers"

const state = reactive({
  position: [0, 1.6, 69] as Vector3Tuple,
  scale: 0.25,
  rotateY: 2,
  surface: surfaces[0],
  terrain: terrains[0],
})

addGuiFolder(folder => {
  folder.name = "Globe"
  folder.addVector3(state.position) //.open()
  folder.add(state, "scale", 0.1, 1, 0.01)
  folder.add(state, "surface", toSelectOptions(surfaces, kebabToTitle))
  folder.add(state, "terrain", toSelectOptions(terrains, capitalize))
})
</script>
