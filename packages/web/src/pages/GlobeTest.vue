<template lang="pug">
Debug STATE {{state.position}}
ThreeGlobe(:position="state.position" :scale="state.scale")
</template>

<script lang="ts" setup>
import type { Vector3Tuple } from "three"

const state = reactive({
  position: [-50, 10, 0] as Vector3Tuple,
  scale: 0.1,
})

addGuiFolder(folder => {
  folder.name = "Globe"
  folder.addVector3(state.position)
  folder.add(state, "scale", 0, 1, 0.001)
})
</script>
