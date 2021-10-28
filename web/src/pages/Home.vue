<template lang="pug">
Title Hello
Title(:delay="1000") World
</template>

<script lang="ts" setup>
import { useThreeJSEventHook } from "@depth/three.js"
import { useGui } from "@depth/dat.gui"
const gui = useGui()
const [key] = Object.keys(gui.__folders)
const threeJs = useThreeJSEventHook()

onMounted(() => {
  threeJs.trigger({ cmd: "RenderFrames", param: "CameraMove" })
  key && useTimeoutFn(() => gui.__folders[key].open(), 4567)
})

onBeforeUnmount(() => {
  threeJs.trigger({ cmd: "RenderFrames", param: "All"})
})
</script>
