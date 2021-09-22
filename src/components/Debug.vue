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
  grid-area: debug;

  @apply h-full w-full;

  cursor: help;
  background-color: #0102;
  font-size: 0.6rem;
  line-height: 0.8rem;
  /* position: fixed;
  top: 0;
  left: 0; */

  font-family: monospace;
  white-space: pre;
  color: var(--terminal);
  overflow: auto;
  /* max-height: 100vh; */
  /* opacity: 0.4;
  transform: translateX(-69%);
  transition: all 0.1s ease-in 1.5s;
  &:hover {
    opacity: 1;
    transform: translateX(0);
    transition: all 0.2s ease-out;
  } */
}

.miniScrollbar {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #efe #000;
}

.miniScrollbar::-webkit-scrollbar {
  background-color: #1234;
  height: 12px;
  width: 12px;
  cursor: pointer;
}

.miniScrollbar::-webkit-scrollbar-thumb {
  background-image: radial-gradient(#eefeee 0%, #0000 69%);
}
</style>
