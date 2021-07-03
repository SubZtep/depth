<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
import { scene, useThreeJs } from "../../composables/useThreeJs"
import { useAssets } from "../../composables/useAssets"
import { templateRef, get } from "@vueuse/core"
import { delay } from "../../misc/utils"

const assets = useAssets()

const toast = useToast()
const errorHandler = (e: Error) => {
  toast.error(e.message)
}

const { setCanvas, isRunning, toggleRun } = useThreeJs({ errorHandler })

setCanvas(templateRef("wc"))
scene.background = await assets.loadSkybox(14)
await assets.loadNoVideoMaterial()
await delay(500)

if (!get(isRunning)) toggleRun()
</script>
