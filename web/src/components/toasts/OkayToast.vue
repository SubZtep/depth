<template lang="pug">
.p-2.bg-blue-gray-800.text-warm-gray-200.text-center.text-lg.font-serif
  .mb-2.whitespace-pre-line {{properties.message}}
  button.btn.bg-amber-900.text-amer-100.px-4.font-mono.leading-6(@click="$emit('okay')") Okay
</template>

<script lang="ts" setup>
const properties = defineProps<{ message: string }>()
</script>
