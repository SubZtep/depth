<template lang="pug">
transition(name="title")
  h1(:class="$style.title" v-if="ready && !go")
    slot
</template>

<script lang="ts" setup>
const properties = defineProps<{ delay?: number }>()
// eslint-disable-next-line vue/no-setup-props-destructure
const { delay = 0 } = properties
const ready = useTimeout(delay)
const go = useTimeout(delay + 1)
</script>

<style module>
.title {
  @apply fixed inset-0 flex justify-center items-center text-center
    font-mono font-extrabold text-8xl opacity-100 pointer-events-none select-none;
  text-shadow: -4px 0 #8a0303, 1px 0 #fffa, 1px 1px 2px #0063;
}
</style>
