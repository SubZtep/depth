<template lang="pug">
transition(name="fade")
  h1(v-if="showTitle")
    slot
</template>

<script lang="ts" setup>
import { set } from "@vueuse/core"

const showTitle = ref(true)
onMounted(() => set(showTitle, false))
</script>

<style>
h1 {
  font-size: 1.6rem;
  text-shadow: -4px 0 var(--blood), 1px 0 #fffa, 1px 1px 2px #0063;
  position: fixed;
  top: 4px;
  left: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
