<template lang="pug">
Title Blast
InfinitePlane

GrassPlane(:width="6" :height="6")

BlastBoxes(:pieces="[3, 3, 3]")
//- PlayerSnail
</template>

<script lang="ts" setup>
import { useEnvironmentStore } from "~/stores/environment"
import PlayerSnail from "~/components/meta/PlayerSnail.vue"
import GrassPlane from "~/components/3d/GrassPlane.vue"
import InfinitePlane from "~/components/3d/InfinitePlane"
import BlastBoxes from "~/components/3d/BlastBoxes.vue"

useEnvironmentStore().$patch({
  skybox: 13,
  distance: 100,
  color: 0x001300,
  size: 1,
} as any)

// const scene = useScene()

// for (let i = -1; i < 2; i++) {
//   for (let j = -1; j < 2; j++) {
//     for (let k = 1; k < 4; k++) {
//       const { boxMesh } = createBox([i + (i + 1) * 0.1, k + 1.5, j + (j + 1) * 0.1])
//       scene.add(boxMesh)
//     }
//   }
// }

</script>
