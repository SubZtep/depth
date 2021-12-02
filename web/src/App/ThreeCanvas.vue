<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import MainScene from "~/App/MainScene.vue"
import { useThreeJSEventHook, useCanvas } from "@depth/three.js"
// import { onVisibility } from "../events"

const wc = ref()
const threeJs = useThreeJSEventHook()
useCanvas(wc)
threeJs.trigger({ cmd: "Resume" })

// onVisibility(({ visible }) => {
//   threeJs.trigger(visible ? resumeLoop : pauseLoop)
// })
</script>
