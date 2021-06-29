<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

VideoPlayer2D(src="happy.webm")
</template>

<script lang="ts" setup>
import { scene, useThreeJs } from "../composables/useThreeJs";
import { useLoader } from "../composables/useLoader";
import { templateRef } from "@vueuse/core";
const { loadSkybox } = useLoader()

const { setCanvas } = useThreeJs()
setCanvas(templateRef("wc"))

function asyncSetTimeout(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

scene.background = await loadSkybox(10)
await asyncSetTimeout(1000)

</script>
