<template lang="pug">
transition(name="title")
  h1(:class="$style.title" v-if="showTitle")
    slot
</template>

<script lang="ts" setup>
const showTitle = ref(true)
onMounted(() => set(showTitle, false))
</script>

<style module>
.title {
  @apply fixed inset-0 flex justify-center items-center text-center
    font-mono font-extrabold text-8xl opacity-100 pointer-events-none select-none;
  text-shadow: -4px 0 var(--blood), 1px 0 #fffa, 1px 1px 2px #0063;
  transform: translateX(-100%);
}
</style>

<style>
.title-enter-active,
.title-leave-active {
  transition: all 4s ease-in;
}

.title-enter-from {
  transform: translateX(0);
}
.title-leave-to {
  @apply opacity-30;
  transform: translateX(100%) scale(0.5);
}
</style>
