<template lang="pug">
.font-lg
  .mb-3.font-sans.whitespace-pre-line {{props.message}}
  .flex.items-center.gap-2.w-full
    button.bg-green-600.border-green-600(@click="$emit('close-toast')") Ok
    button.bg-red-600.border-red-600(@click="$emit('cancel')") Cancel
</template>

<script lang="ts" setup>
const props = defineProps<{ message: string }>()
</script>

<style scoped>
button {
  @apply btn rounded text-gray-100;
  aspect-ratio: unset;
  flex-grow: 1;
}
</style>
