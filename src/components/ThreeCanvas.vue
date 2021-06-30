<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

br
button(@click="toggleRun") X {{isRunning}}
//- VideoPlayer2D(src="happy.webm")
</template>

<script lang="ts" setup>
import { scene, useThreeJs } from "../composables/useThreeJs";
import { useLoader } from "../composables/useLoader";
import { templateRef } from "@vueuse/core";
import { delay } from "../misc/utils";

const { loadSkybox } = useLoader()
// useThreeJs().setCanvas(templateRef("wc"))
const { setCanvas, isRunning, toggleRun } = useThreeJs()

setCanvas(templateRef("wc"))

// const toggleRunning = () => running.value = !running.value

scene.background = await loadSkybox(14)
await delay(1000)
</script>
