<template lang="pug">
div(:class="$style.progressBar")
  div(v-for="({ label, done }, index) in props.items" :key="label" :class="$style.item")
    i.fad.check.mx-1.text-green-800(v-show="done.value")
    .flex-grow(:class="[done.value ? 'line-through' : 'font-bold']") {{label}}
    i.fa-5x(:class="[done.value ? 'fas' : 'far', `circle-${index + 1}`]")
</template>

<script lang="ts" setup>
interface ProgressItem {
  label: string
  done: Ref<boolean>
}

const props = defineProps<{
  items: ProgressItem[]
}>()
</script>

<style module>
.progressBar {
  @apply flex flex-col p-2 gap-2 font-serif bg-typepad;
  .item {
    @apply flex gap-3 items-center;
  }
}

:global(.top-left) .progressBar {
  border-radius: 0 0.25rem 0.25rem 0;
  .item {
    @apply text-right justify-end text-left flex-row-reverse;
  }
}

:global(.top-right) .progressBar {
  border-radius: 0.25rem 0 0 0.25rem;
  .item {
    @apply text-left justify-end text-right;
  }
}
</style>
