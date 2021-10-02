<template lang="pug">
transition(name="fade")
  h1(:class="$style.title" v-if="showTitle")
    slot
</template>

<script lang="ts" setup>
const showTitle = ref(true)
onMounted(() => set(showTitle, false))
</script>

<style module>
.title {
  z-index: 100;
  font-size: 1rem;
  text-shadow: -4px 0 var(--blood), 1px 0 #fffa, 1px 1px 2px #0063;
  position: fixed;
  transform-origin: top left;
  top: 4px;
  left: 8px;
  user-select: none;
  pointer-events: none;
  font-family: "Trebuchet MS";
}
</style>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 4s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: scale(4);
  opacity: 0;
}
</style>
