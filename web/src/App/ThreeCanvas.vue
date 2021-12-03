<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene(v-if="wc")
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted } from "vue"
import MainScene from "~/App/MainScene.vue"

const instance = getCurrentInstance()
if (!instance) {
  throw new Error("Not in Vue scope")
}

const wc = ref()

onMounted(() => {
  instance.appContext.app.config.globalProperties.$setCanvas(wc.value)
})
</script>
