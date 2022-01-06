<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene(v-if="wc")
</template>

<script lang="ts" setup>
import MainScene from "~/App/MainScene.vue"

const wc = ref()

onMounted(() => {
  getCurrentInstance()?.appContext.app.config.globalProperties.$setCanvas(wc.value)
})
</script>
