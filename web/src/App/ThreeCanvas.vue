<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene(v-if="wc")
</template>

<script lang="ts" setup>
import { sleep } from "@depth/misc"
import MainScene from "~/App/MainScene.vue"

await sleep(import.meta.env.VITE_DELAY_TIME)

const wc = ref()

onMounted(() => {
  getCurrentInstance()?.appContext.app.config.globalProperties.$setCanvas(wc.value)
})
</script>
