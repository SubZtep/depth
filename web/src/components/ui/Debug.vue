<template lang="pug">
UseDraggable(
  storage-key="debug-position"
  storage-type="local"
  :exact="true"
  v-if="exists"
  @dblclick="exists = false"
  :class="$style.frame")
  div(:class="$style.debug" ref="el" @dblclick.stop)
    slot
</template>

<script lang="ts" setup>
import { UseDraggable } from "@vueuse/components"
import { useElementSize, useStorage } from "@vueuse/core"

const exists = ref(true)
const el = ref()

onMounted(() => {
  const stored = useStorage("debug-size", { width: 320, height: 240})
  const initSize = { width: stored.value.width, height: stored.value.height }
  el.value.style.width = `${initSize.width}px`
  el.value.style.height = `${initSize.height}px`
  const { width, height } = useElementSize(el, initSize)
  watchEffect(() => {
    stored.value = { width: width.value, height: height.value }
  })
})
</script>

<style module>
.frame {
  @apply scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300;
  position: fixed;
  cursor: move;
  background-color: #0104;
  padding: 15px !important;
  border: 1px solid #0f03;
  opacity: 0.6;
  transition: opacity 0.1s ease-in 3s;
}

.frame:hover {
  opacity: 1;
  transition: opacity 0.2s ease-out;
}

.debug {
  @apply overflow-auto resize p-2;
  border: 1px solid #f003;
  background-color: #0104;
  cursor: default;

  font-family: monospace;
  white-space: pre;
  color: #4af626;
}
</style>
