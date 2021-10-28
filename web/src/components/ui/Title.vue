<template lang="pug">
transition(name="title")
  h1(:class="$style.title" v-if="!ready")
    slot
</template>

<script lang="ts" setup>
const props = defineProps<{
  delay?: number
}>()

const ready = useTimeout(props.delay || 0)
</script>

<style module>
.title {
  @apply fixed inset-0 flex justify-center items-center text-center
    font-mono font-extrabold text-8xl opacity-100 pointer-events-none select-none;
  text-shadow: -4px 0 var(--blood), 1px 0 #fffa, 1px 1px 2px #0063;
  transform: translateX(-100%);
}
</style>
