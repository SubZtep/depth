<template lang="pug">
Title Hello
Title(:delay="1000") World

Title(v-if="bored" class="!duration-13000 flex-col")
  | {{bored.activity}}
  .text-2xl.text-cyan-600.opacity-50.tracking-wider
    | {{bored.type}}
</template>

<script lang="ts" setup>
import { useThreeJSEventHook } from "@depth/three.js"
import { useGui } from "@depth/dat.gui"
import { useBoredApi } from "~/composables/useBoredApi"

const gui = useGui()
const [key] = Object.keys(gui.__folders)
const threeJs = useThreeJSEventHook()
const { bored, query } = useBoredApi()

const { resume } = useIntervalFn(
  async () => {
    await query()
  },
  6969,
  {
    immediate: false,
    immediateCallback: true,
  }
)

onMounted(() => {
  threeJs.trigger({ cmd: "RenderFrames", param: "CameraMove" })
  key && useTimeoutFn(() => gui.__folders[key].open(), 4567)

  useTimeoutFn(() => resume(), 10_000)
})

onBeforeUnmount(() => {
  threeJs.trigger({ cmd: "RenderFrames", param: "All" })
})
</script>
