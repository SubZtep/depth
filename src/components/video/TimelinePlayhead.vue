<template lang="pug">
div(
  ref="playhead"
  :style="{ left: `${left}px` }"
  :class="$style.playhead")
</template>

<script lang="ts" setup>
const props = defineProps<{
  gapSecPx: number
  currentTime: Ref<number>
}>()

const left = computed(() => props.gapSecPx * get(props.currentTime))
</script>

<style module>
.playhead {
  @apply bg-orange-500 top-0 bottom-0 w-2px absolute pointer-events-none;
  border-right: 1px dotted #fff3;
}
</style>
