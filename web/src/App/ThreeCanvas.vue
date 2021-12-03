<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene(v-if="wc")
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted } from "vue"
import MainScene from "~/App/MainScene.vue"

const instance = getCurrentInstance()
if (!instance) throw new Error("Not in Vue scope")
const { $setCanvas } = instance.appContext.app.config.globalProperties

const wc = ref()

onMounted(() => $setCanvas(wc.value))
</script>
