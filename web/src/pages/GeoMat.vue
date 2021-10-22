<template lang="pug">
Debug Physical Material

</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { loopThreeJs } from "@depth/three.js"
import type { Vector3Tuple } from "three"
import { Mesh, IcosahedronGeometry, MeshPhysicalMaterial } from "three"

const state = reactive({
  position: [0, 1.6, -69] as Vector3Tuple,
  scale: 0.25,
  image: "/gifs/copilot-eslint-x.gif",
})

const geometry = new IcosahedronGeometry(1, 0)
const material = new MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.75,
  transmission: 1,
  // thickness: 0.5,
  transparent: true,
})
const mesh = new Mesh(geometry, material)


addGuiFolder(folder => {
  folder.name = "Geo(Phy)Mat"
  folder.addVector3(state.position)
  folder.add(state, "scale", 0.1, 0.69, 0.01)
})

</script>
