<template lang="pug">
transition(name="fade")
  h1.title(v-if="showTitle")
    slot
</template>

<script lang="ts" setup>
import { set } from "@vueuse/core"

const showTitle = ref(true)
onMounted(() => set(showTitle, false))
</script>

<style>
.title {
  z-index: 100;
  font-size: 1.5rem;
  text-shadow: -4px 0 var(--blood), 1px 0 #fffa, 1px 1px 2px #0063;
  position: fixed;
  transform-origin: top left;
  top: 4px;
  left: 8px;
  user-select: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 4s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: scale(5);
  opacity: 0;
}
</style>
