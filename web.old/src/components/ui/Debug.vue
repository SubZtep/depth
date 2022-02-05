<template lang="pug">
UseDraggable(
  v-if="exists"
  :storage-key="`${keyPrefix}-position`"
  storage-type="local"
  :exact="true"
  @dblclick="exists = false"
  :class="$style.frame")

  div(:class="$style.debug" ref="el" @dblclick.stop)
    slot
</template>

<script lang="ts" setup>
import { UseDraggable } from "@vueuse/components"
import { useElementSize, useStorage, syncRef } from "@vueuse/core"
import { usePreferencesStore } from "~/stores/preferences"

const props = defineProps<{ storageKey?: string }>()
const keyPrefix = ref(props.storageKey ?? "debug")
const stored = useStorage(`${keyPrefix.value}-size`, { width: 320, height: 240 })
const el = ref()

const exists = ref(true)
const initSize = { width: stored.value.width, height: stored.value.height }
syncRef(toRef(usePreferencesStore(), "showDebug"), exists)

whenever(
  exists,
  () => {
    el.value.style.width = `${initSize.width}px`
    el.value.style.height = `${initSize.height}px`
  },
  { flush: "post" }
)

const { width, height } = useElementSize(el, initSize)

watchPostEffect(() => {
  stored.value = { width: width.value, height: height.value }
})
</script>

<style module>
.frame {
  position: fixed;
  padding: 8px;
  opacity: 0.6;
  cursor: move;
  background-color: #0104;
  border: 2px outset #0606;
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
