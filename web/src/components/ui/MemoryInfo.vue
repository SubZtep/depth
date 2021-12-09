<template lang="pug">
.text-xs.outline.fixed.bottom-0.right-21.text-right.text-gray-300(v-if="isSupported && memory")
  div Used: {{size(memory.usedJSHeapSize)}}
  div Allocated: {{size(memory.totalJSHeapSize)}}
  div Limit: {{size(memory.jsHeapSizeLimit)}}
</template>

<script lang="ts" setup>
import { useMemory } from "@vueuse/core"

const { isSupported, memory } = useMemory()

const size = (v: number) => {
  const kb = v / 1024 / 1024
  return `${kb.toFixed(2)} MB`
}
</script>
