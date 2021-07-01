<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

br
h1 ?{{isRunning ? "1" : "0"}}
//- button(@click="toggleRun") X {{isRunning}}
//- VideoPlayer2D(srcObject="happy.webm")
VideoPlayer2D(src="happy.webm")
//- VideoPlayer3(src="happy.webm")


</template>

<script lang="ts" setup>
import { scene, useThreeJs } from "../composables/useThreeJs";
import { useLoader as useAssetLoader } from "../composables/useLoader";
import { templateRef } from "@vueuse/core";
import { delay } from "../misc/utils";

const { loadSkybox } = useAssetLoader()
const { setCanvas, isRunning, toggleRun } = useThreeJs()

setCanvas(templateRef("wc"))
scene.background = await loadSkybox(14)
await delay(1000)
toggleRun()
</script>
