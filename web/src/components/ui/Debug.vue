<template lang="pug">
UseDraggable(
  storage-key="debug-position"
  storage-type="local"
  :exact="true"
  v-if="exists"
  @dblclick="exists = false"
  v-stop-propagation
  :class="$style.frame")
  div(:class="$style.debug" ref="el" @dblclick.stop)

    .text-xs(v-if="isSupported && memory")
      div Used: {{size(memory.usedJSHeapSize)}}
      div Allocated: {{size(memory.totalJSHeapSize)}}
      div Limit: {{size(memory.jsHeapSizeLimit)}}
      hr

    slot
</template>

<script lang="ts" setup>
import { UseDraggable } from "@vueuse/components"
import { useElementSize, useStorage, useMemory } from "@vueuse/core"

const { isSupported, memory } = useMemory()
const exists = ref(true)
const el = ref()

const size = (v: number) => {
  const kb = v / 1024 / 1024
  return `${kb.toFixed(2)} MB`
}

onMounted(() => {
  const stored = useStorage("debug-size", { width: 320, height: 240 })
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
  position: fixed;
  cursor: move;
  background-color: #0104;
  padding: 0.8rem;
  border: 2px outset #0606;
  opacity: 0.6;
  transition: opacity 0.1s ease-in 3s;
}

.frame:hover {
  opacity: 1;
  transition: opacity 0.2s ease-out;
}

.debug {
  @apply scrollbar-thin scrollbar-thumb-typepad scrollbar-track-blood
    overflow-auto resize p-2;
  border: 2px inset #3636;
  background-color: #0104;
  cursor: text;

  font-family: monospace;
  white-space: pre;
  color: #4af626;
}
</style>
