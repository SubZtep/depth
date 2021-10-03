<template lang="pug">
.debug.miniScrollbar(
  v-if="exists"
  @dblclick="exists = false")
  slot
</template>

<script lang="ts" setup>
const exists = ref(true)
</script>

<style lang="postcss" scoped>
.debug {
  @apply scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300;

  position: fixed;
  left: 360px;
  bottom: 0;
  max-height: 300px;

  cursor: help;
  background-color: #0104;
  padding: 4px;
  font-size: 0.6rem;
  line-height: 0.8rem;

  font-family: monospace;
  white-space: pre;
  color: var(--terminal);
  overflow: auto;

  opacity: 0.5;
  transform: rotateX(-45deg);
  transition: all 0.1s ease-in 1s;
  transform-origin: bottom left;
  &:hover {
    opacity: 1;
    transform: rotateX(0deg) scale(1.5);
    transition: all 0.2s ease-out;
  }
}
</style>
