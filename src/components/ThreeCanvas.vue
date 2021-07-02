<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import { scene, useThreeJs } from "../composables/useThreeJs"
import { useAssets } from "../composables/useAssets"
import { templateRef, get } from "@vueuse/core"
import { delay } from "../misc/utils"

const { loadSkybox } = useAssets()
const { setCanvas, isRunning, toggleRun } = useThreeJs()

setCanvas(templateRef("wc"))
scene.background = await loadSkybox(14)
await delay(500)

if (!get(isRunning)) toggleRun()
</script>
