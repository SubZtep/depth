<template lang="pug">
mixin panel
  div(:class="$style.panel" @mouseover="hovered = true" @mouseleave="hovered = false")
    PanelHeader(:title="props.title" v-model="open" caret-style="regular")
    .form(v-if="open")
      slot

template(v-if="entity")
  +panel
template(v-else)
  Teleport(to="#panel")
    +panel
</template>

<script lang="ts" setup>
import { inject, provide } from "vue"

const entity = inject("entity", null)

const props = defineProps<{
  title: string
  open?: boolean
}>()

const emit = defineEmits<{
  (e: "hover", hover: boolean): void
}>()

const open = ref(props.open ?? true)
const hovered = ref(false)

provide("hover", hovered)

// watch(hovered, hover => emit("hover", hover), { immediate: true })
</script>

<style module>
.panel {
  @apply bg-black border-green-900 text-green-300;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-width: 1px 1px 0 1px;
}

.panel h3 {
  @apply cursor-pointer px-1 py-0.3;
  font-weight: 600;
  letter-spacing: 1px;
}
</style>
