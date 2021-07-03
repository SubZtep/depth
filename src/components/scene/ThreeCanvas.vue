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
import { delay, rand } from "../../misc/utils"

const assets = useAssets()

const toast = useToast()
const errorHandler = (e: Error) => {
  if (e instanceof Error) {
    toast.error(e.message)
  }
}

useThreeJs({ errorHandler }).setCanvas(templateRef("wc"))

scene.background = await assets.loadSkybox(rand(15))
await assets.loadNoVideoMaterial()
await delay(69)
</script>
