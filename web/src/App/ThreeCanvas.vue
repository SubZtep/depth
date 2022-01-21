<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene(v-if="wc")
</template>

<script lang="ts" setup>
// import { sleep } from "@depth/misc"
import MainScene from "~/App/MainScene.vue"

// await sleep(500)

const wc = ref()

onMounted(() => {
  getCurrentInstance()?.appContext.app.config.globalProperties.$setCanvas(wc.value)
})
</script>
