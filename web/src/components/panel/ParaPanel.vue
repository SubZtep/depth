<template lang="pug">
mixin panel
  div(:class="$style.panel" @mouseover="hovered = true" @mouseleave="hovered = false")
    h3(@click="open = !open") {{props.title}}
    .form(v-if="open")
      slot

template(v-if="entity")
  +panel
template(v-else)
  Teleport(to="#panel")
    +panel
</template>

<script lang="ts" setup>
import { inject } from "vue"

const entity = inject("entity", null)

const props = defineProps<{
  title: string
  open?: boolean
}>()

const emit = defineEmits<{
  (e: "hover", hover: boolean): void
}>()

const open = ref(props.open ?? false)
const hovered = ref(false)

watch(hovered, hover => emit("hover", hover), { immediate: true })
</script>

<style module>
.panel {
  @apply bg-black border-green-500 text-green-300;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-width: 1px;
  /* border-width: 2px 2px 1px 2px; */
  h3 {
    @apply text-center cursor-pointer p-1 bg-true-gray-800;
    font-weight: 500;
    letter-spacing: 1px;
  }
}
</style>
