<template lang="pug">
.item
  i.fas.fa-check.mx-1.text-green-800(v-if="done")
  .flex-grow(:class="[done ? 'line-through' : 'font-bold']")
    slot
  i(:class="[done ? 'fas' : 'far', `fa-circle-${props.nr}`]")
</template>

<script lang="ts" setup>
const props = defineProps<{
  nr: number
  done: MaybeRef<boolean>
}>()
</script>

<style>
.progressSteps {
  @apply flex flex-col p-2 gap-2 font-serif bg-typepad;
  .item {
    @apply flex gap-3 items-center;
  }
}

.top-left .progressSteps {
  border-radius: 0 0.25rem 0.25rem 0;
  .item {
    @apply text-right justify-end text-left flex-row-reverse;
  }
}

.top-right .progressSteps {
  border-radius: 0.25rem 0 0 0.25rem;
  .item {
    @apply text-left justify-end text-right;
  }
}
</style>
