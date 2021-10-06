<template lang="pug">
div(:class="[$style.progressBar, props.position]")
  div(v-for="(item, index) in props.items" :key="item.label" :class="{ [$style.item]: true, 'flex-row-reverse': props.position === 'left' }")
    fa.mx-1.text-green-800(:icon="['fad', 'check']" v-show="true || item.done")
    .flex-grow(:class="[ item.done ? 'line-through' : 'font-bold' ]") {{item.label}}
    fa(:icon="[item.done ? 'fas' : 'far', `circle-${index + 1}`]" size="lg")
</template>

<script lang="ts" setup>
interface ProgressItem {
  label: string
  done: boolean
}

const props = defineProps<{
  position: "left" | "right"
  items: ProgressItem[]
}>()
</script>

<style module>
.progressBar {
  @apply flex flex-col p-2 gap-2 font-serif bg-typepad;

  &:global(.left) {
    border-radius: 0 0.25rem 0.25rem 0;
    .item {
      @apply text-right justify-end text-left;
    }
  }

  &:global(.right) {
    border-radius: 0.25rem 0 0 0.25rem;
    .item {
      @apply text-left justify-end text-right;
    }
  }

  .item {
    @apply flex gap-3 items-center;
  }
}
</style>
